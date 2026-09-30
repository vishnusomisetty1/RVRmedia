import { CONTACT_EMAIL } from './site';

// Option sets for the booking inquiry form. Submissions are appended to the
// bookings Google Sheet by scripts/google-sheet-endpoint.gs.
export const OCCASIONS = [
  'Birthday Party',
  'Sweet Sixteen',
  'Graduation Party',
  'Engagement Party',
  'Wedding Reception',
  'Anniversary Party',
] as const;

export const GUEST_COUNTS = [
  '0-50',
  '100-200',
  '200-300',
  '300-400',
  '400+',
] as const;

export const SETTINGS = ['Indoor', 'Outdoor'] as const;

export const SERVICES = [
  'Photographers',
  'Videographers',
  'Drone Footage',
] as const;

export const PHOTO_PERMISSION = {
  yes: 'Yes, I give permission',
  no: 'No, please keep my photos private.',
} as const;

// Questions the Google Form does not have columns for yet. They are appended to
// the free-form notes answer so the responses are never lost.
export const REFERRAL_SOURCES = [
  'Instagram',
  'Friend or family',
  'Saw us at an event',
  'Google search',
  'Returning client',
  'Other',
] as const;

export const BUDGETS = [
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,000',
  '$2,000 - $3,500',
  '$3,500+',
  'Not sure yet',
] as const;

export const COVERAGE_HOURS = [
  '1-2 hours',
  '3-4 hours',
  '5-6 hours',
  '7+ hours',
  'Not sure yet',
] as const;

export const CONTACT_METHODS = ['Text', 'Call', 'Email'] as const;

export type BookingPayload = {
  name: string;
  phone: string;
  email: string;
  contactMethod: string;
  instagram: string;
  occasion: string;
  guestOfHonor: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  setting: string;
  guests: string;
  services: string;
  coverageHours: string;
  budget: string;
  timeline: string;
  photoPermission: string;
  referral: string;
  notes: string;
};

/**
 * Reads the submitted answers. Shared by the server action and the form, so
 * the form can still offer the email fallback when the request never makes
 * it back from the server.
 */
export function readBookingPayload(formData: FormData): BookingPayload {
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

  return {
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
}

/** Mail clients start dropping the body past roughly 2000 characters. */
const MAILTO_BODY_LIMIT = 1800;

/** Composes a prefilled email carrying every answer the visitor gave. */
export function buildMailto(payload: BookingPayload): string {
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
