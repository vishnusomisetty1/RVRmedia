/**
 * RVR Media — booking inquiry endpoint.
 *
 * One-time setup (free, no accounts or services to pay for):
 *   1. Open the Google Sheet that your bookings live in.
 *   2. Extensions -> Apps Script. Delete whatever is there and paste this file.
 *   3. Set NOTIFY_EMAIL below (or leave it blank to skip email alerts).
 *   4. Deploy -> New deployment -> type "Web app".
 *        Execute as:    Me
 *        Who has access: Anyone
 *      Authorize when prompted, then copy the /exec URL it gives you.
 *   5. In the site repo, add that URL as the env var BOOKING_WEBHOOK_URL
 *      (locally in .env.local, and in Vercel -> Settings -> Environment Variables).
 *
 * Re-deploying after an edit: Deploy -> Manage deployments -> pencil icon ->
 * Version "New version" -> Deploy. The URL stays the same.
 */

const SHEET_NAME = 'Website Inquiries';
const NOTIFY_EMAIL = 'Rvr.mediaco@gmail.com';

/**
 * Leave blank if this script was created from inside the Sheet
 * (Extensions -> Apps Script) — it will find the Sheet on its own.
 *
 * If it was created standalone from script.google.com, paste the Sheet's ID
 * here. It is the long string in the Sheet's URL between /d/ and /edit:
 *   docs.google.com/spreadsheets/d/THIS_PART_HERE/edit
 */
const SPREADSHEET_ID = '';

/**
 * Shared secret. The web app has to be readable by "Anyone" for the site's
 * server to reach it, so this is what actually distinguishes a real
 * submission from anyone who happens to learn the URL.
 */
const SHARED_SECRET = 'Hn4X66Srzeq-YeRD1wkdKmCfSdil_Mcv';

const COLUMNS = [
  'Submitted',
  'Name',
  'Phone',
  'Email',
  'Preferred Contact',
  'Instagram',
  'Occasion',
  'Guest of Honor',
  'Event Date',
  'Event Time',
  'Venue',
  'Indoor / Outdoor',
  'Guests',
  'Services',
  'Coverage Hours',
  'Budget',
  'Timeline & Key Moments',
  'Photo Permission',
  'Found Us Via',
  'Notes',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!SHARED_SECRET || data.secret !== SHARED_SECRET) {
      return json_({ ok: false, error: 'Unauthorized' });
    }

    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.contactMethod || '',
      data.instagram || '',
      data.occasion || '',
      data.guestOfHonor || '',
      data.eventDate || '',
      data.eventTime || '',
      data.venue || '',
      data.setting || '',
      data.guests || '',
      data.services || '',
      data.coverageHours || '',
      data.budget || '',
      data.timeline || '',
      data.photoPermission || '',
      data.referral || '',
      data.notes || '',
    ]);

    notify_(data);
    return json_({ ok: true });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function doGet() {
  return json_({ ok: true, message: 'RVR Media booking endpoint is live.' });
}

function getSheet_() {
  const book = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();

  if (!book) {
    throw new Error(
      'No spreadsheet found. This script is not bound to a Sheet, so set ' +
        'SPREADSHEET_ID at the top of this file.',
    );
  }

  let sheet = book.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function notify_(data) {
  if (!NOTIFY_EMAIL) {
    return;
  }

  const lines = [
    'New booking inquiry from rvrmedia.vercel.app',
    '',
    'Name: ' + (data.name || ''),
    'Phone: ' + (data.phone || ''),
    'Email: ' + (data.email || ''),
    'Preferred contact: ' + (data.contactMethod || ''),
    '',
    'Occasion: ' + (data.occasion || ''),
    'Date: ' + (data.eventDate || '') + '  ' + (data.eventTime || ''),
    'Venue: ' + (data.venue || '') + ' (' + (data.setting || '') + ')',
    'Guests: ' + (data.guests || ''),
    'Services: ' + (data.services || ''),
    'Coverage: ' + (data.coverageHours || ''),
    'Budget: ' + (data.budget || ''),
    'Found us via: ' + (data.referral || ''),
    '',
    'Timeline: ' + (data.timeline || ''),
    'Notes: ' + (data.notes || ''),
    'Photo permission: ' + (data.photoPermission || ''),
  ];

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'New inquiry: ' + (data.name || 'Website') + ' - ' + (data.eventDate || 'date TBD'),
    body: lines.join('\n'),
    replyTo: data.email || undefined,
  });
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
