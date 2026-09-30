'use server';

import { buildMailto, readBookingPayload } from '@/lib/booking-form';

export type BookingState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  /**
   * Set only when delivery itself failed. Opens the visitor's mail app with
   * everything they just typed already filled in, so an outage costs an
   * inquiry a click rather than losing it.
   */
  mailto?: string;
};

// Google Apps Script web app that appends the inquiry to the bookings sheet.
// See scripts/google-sheet-endpoint.gs for the one-time setup.
const WEBHOOK_URL = process.env.BOOKING_WEBHOOK_URL;

const DELIVERY_ERROR =
  'We could not send that automatically. Your answers are safe — send them as an email instead and nothing is lost.';

/**
 * Measured responses ranged from 3 to 26 seconds, largely because the script
 * sends two emails before replying. The ceiling has to clear the slow end:
 * aborting does not stop Apps Script finishing the write, so a timeout that
 * fires on a request which would have succeeded risks a duplicate row.
 */
const ATTEMPT_TIMEOUT_MS = 40_000;

const MAX_ATTEMPTS = 2;

/**
 * Everything has to finish inside the booking page's maxDuration (60s), or
 * the platform kills the request and the visitor gets no answer at all.
 */
const DELIVERY_BUDGET_MS = 50_000;

/** A retry with less time than a slow response needs would only abort mid-write. */
const MIN_RETRY_BUDGET_MS = 30_000;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const answers = readBookingPayload(formData);
  const payload = {
    // Proves the request came from this site, not from anyone who found
    // the endpoint URL.
    secret: process.env.BOOKING_WEBHOOK_SECRET ?? '',
    ...answers,
  };

  if (!payload.name) {
    return { status: 'error', message: 'Please add your name before sending.' };
  }
  if (!isEmail(payload.email)) {
    return { status: 'error', message: 'Please add a valid email address.' };
  }
  if (!payload.phone) {
    return { status: 'error', message: 'Please add a phone number.' };
  }
  if (!payload.eventDate) {
    return { status: 'error', message: 'Please pick an event date.' };
  }

  if (!WEBHOOK_URL) {
    console.error('BOOKING_WEBHOOK_URL is not set; inquiry was not delivered.');
    return {
      status: 'error',
      message: DELIVERY_ERROR,
      mailto: buildMailto(answers),
    };
  }

  try {
    await deliver(payload);
  } catch (error) {
    // Logged in full so an inquiry that failed to land is still recoverable
    // from the runtime logs.
    console.error('Booking submission failed', error, JSON.stringify(answers));
    return {
      status: 'error',
      message: DELIVERY_ERROR,
      mailto: buildMailto(answers),
    };
  }

  return { status: 'success' };
}

/**
 * Posts the inquiry to the Apps Script endpoint.
 *
 * Retried once because Apps Script intermittently resolves the redirect to
 * its GET handler, which answers ok:true without writing anything. Only a
 * `written` marker in the response proves the row actually landed, so
 * anything else is treated as a failure rather than reported as success.
 */
async function deliver(payload: unknown): Promise<void> {
  const deadline = Date.now() + DELIVERY_BUDGET_MS;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const remaining = deadline - Date.now();
    if (attempt > 1 && remaining < MIN_RETRY_BUDGET_MS) break;

    let response: Response;

    try {
      response = await fetch(WEBHOOK_URL!, {
        method: 'POST',
        // Apps Script rejects preflighted content types, so send text/plain
        // and parse the JSON body on the script side.
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        cache: 'no-store',
        redirect: 'follow',
        signal: AbortSignal.timeout(Math.min(ATTEMPT_TIMEOUT_MS, remaining)),
      });
    } catch (error) {
      // A timeout or dropped connection leaves the outcome unknown: Apps
      // Script may well have written the row before we gave up. Retrying
      // would append it twice, so surface the failure and let the visitor
      // use the email fallback instead.
      throw error;
    }

    // Nothing was written on an error status, so this is safe to repeat.
    if (!response.ok) {
      lastError = new Error(`Apps Script responded ${response.status}`);
      continue;
    }

    const result = (await response.json()) as {
      ok?: boolean;
      written?: boolean;
      error?: string;
    };

    // Only `written` proves doPost handled this. Apps Script sometimes
    // resolves the redirect to doGet, which also answers ok:true — and which
    // writes nothing, so retrying that is safe too.
    if (result.ok && result.written) {
      return;
    }

    lastError = new Error(
      result.error ?? 'Apps Script did not confirm the row was written',
    );
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Delivery failed for an unknown reason');
}
