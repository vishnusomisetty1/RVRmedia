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
