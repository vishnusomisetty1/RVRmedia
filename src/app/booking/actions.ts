'use server';

import { CONTACT_EMAIL } from '@/lib/site';

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

/** Mail clients start dropping the body past roughly 2000 characters. */
const MAILTO_BODY_LIMIT = 1800;

/**
 * Measured responses ranged from 3 to 26 seconds, largely because the script
 * sends two emails before replying. The ceiling has to clear the slow end:
 * aborting does not stop Apps Script finishing the write, so a timeout that
 * fires on a request which would have succeeded risks a duplicate row.
 */
const ATTEMPT_TIMEOUT_MS = 40_000;

const MAX_ATTEMPTS = 2;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function submitBooking(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  const read = (key: string) => String(formData.get(key) ?? '').trim();
  const readAll = (key: string) =>
    formData
      .getAll(key)
      .map((value) => String(value).trim())
      .filter(Boolean);

  const occasion = [...readAll('occasion'), read('occasionOther')].filter(
    Boolean,
  );
  const setting =
    read('setting') === 'Other'
      ? read('settingOther') || 'Other'
      : read('setting');
  const referral =
    read('referral') === 'Other'
      ? read('referralOther') || 'Other'
      : read('referral');

  const payload = {
    // Proves the request came from this site, not from anyone who found
    // the endpoint URL.
    secret: process.env.BOOKING_WEBHOOK_SECRET ?? '',
    name: read('name'),
    phone: read('phone'),
    email: read('email'),
    contactMethod: read('contactMethod'),
    instagram: read('instagram'),
    occasion: occasion.join(', '),
    guestOfHonor: read('guestOfHonor'),
    eventDate: read('eventDate'),
    eventTime: read('eventTime'),
    venue: read('venue'),
    setting,
    guests: read('guests'),
    services: readAll('services').join(', '),
    coverageHours: read('coverageHours'),
    budget: read('budget'),
    timeline: read('timeline'),
    photoPermission: read('photoPermission'),
    referral,
    notes: read('notes'),
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
      mailto: buildMailto(payload),
    };
  }

  try {
    await deliver(payload);
  } catch (error) {
    // Logged in full so an inquiry that failed to land is still recoverable
    // from the runtime logs.
    console.error('Booking submission failed', error, JSON.stringify(payload));
    return {
      status: 'error',
      message: DELIVERY_ERROR,
      mailto: buildMailto(payload),
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
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
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
        signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
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

/** Composes a prefilled email carrying every answer the visitor gave. */
function buildMailto(payload: Record<string, string>): string {
  const labels: Array<[string, string]> = [
    ['Name', payload.name],
    ['Phone', payload.phone],
    ['Email', payload.email],
    ['Best way to reach me', payload.contactMethod],
    ['Instagram', payload.instagram],
    ['Occasion', payload.occasion],
    ['Guest of honor', payload.guestOfHonor],
    ['Event date', payload.eventDate],
    ['Event time', payload.eventTime],
    ['Venue', payload.venue],
    ['Indoor / outdoor', payload.setting],
    ['Guests expected', payload.guests],
    ['Services', payload.services],
    ['Coverage needed', payload.coverageHours],
    ['Budget', payload.budget],
    ['Key moments', payload.timeline],
    ['Photo permission', payload.photoPermission],
    ['Found you via', payload.referral],
    ['Notes', payload.notes],
  ];

  const body = labels
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')
    .slice(0, MAILTO_BODY_LIMIT);

  const subject = `Booking inquiry - ${payload.name || 'RVR Media'}`;

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
}
