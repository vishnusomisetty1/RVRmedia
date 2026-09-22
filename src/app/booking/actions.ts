'use server';

export type BookingState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
};

// Google Apps Script web app that appends the inquiry to the bookings sheet.
// See scripts/google-sheet-endpoint.gs for the one-time setup.
const WEBHOOK_URL = process.env.BOOKING_WEBHOOK_URL;

const GENERIC_ERROR =
  'Something went wrong sending your inquiry. Please try again, or email Rvr.mediaco@gmail.com.';

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

  const occasion = [...readAll('occasion'), read('occasionOther')].filter(Boolean);
  const setting =
    read('setting') === 'Other' ? read('settingOther') || 'Other' : read('setting');
  const referral =
    read('referral') === 'Other' ? read('referralOther') || 'Other' : read('referral');

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
    return { status: 'error', message: GENERIC_ERROR };
  }

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      // Apps Script rejects preflighted content types, so send text/plain
      // and parse the JSON body on the script side.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`Apps Script responded ${response.status}`);
    }

    const result = (await response.json()) as { ok?: boolean; error?: string };
    if (!result.ok) {
      throw new Error(result.error ?? 'Apps Script reported a failure');
    }
  } catch (error) {
    console.error('Booking submission failed', error);
    return { status: 'error', message: GENERIC_ERROR };
  }

  return { status: 'success' };
}
