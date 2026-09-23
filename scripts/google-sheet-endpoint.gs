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

const STATUSES = ['New', 'Contacted', 'Quoted', 'Booked', 'Passed'];

const COLUMNS = [
  'Submitted',
  'Status',
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
      'New',
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

    // The row is already saved. An email failure past this point must not
    // fail the request: the caller retries on failure, which would append
    // the same inquiry a second time.
    try {
      notify_(data);
    } catch (mailError) {
      console.error('Notification email failed', mailError);
    }

    try {
      confirmToClient_(data);
    } catch (mailError) {
      console.error('Client confirmation email failed', mailError);
    }

    // `written` is what proves doPost handled this. Apps Script sometimes
    // resolves the redirect back to doGet, which also answers ok:true —
    // without this marker the caller cannot tell a real write from that.
    return json_({ ok: true, written: true, row: sheet.getLastRow() });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  }
}

function doGet() {
  return json_({
    ok: true,
    written: false,
    message: 'RVR Media booking endpoint is live.',
  });
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
  }

  ensureHeader_(sheet);
  formatSheet_(sheet);
  return sheet;
}

/**
 * Writes the header row every time rather than only when the sheet is first
 * created. Adding a column to COLUMNS otherwise leaves an existing sheet on
 * the old header while new rows arrive with the new shape, which silently
 * shifts every value one column out of place.
 */
function ensureHeader_(sheet) {
  const current = sheet
    .getRange(1, 1, 1, COLUMNS.length)
    .getValues()[0]
    .map(String);

  const matches =
    current.length === COLUMNS.length &&
    COLUMNS.every(function (name, index) {
      return current[index] === name;
    });

  if (!matches) {
    sheet.getRange(1, 1, 1, COLUMNS.length).setValues([COLUMNS]);
  }
}

/**
 * Run this by hand from the editor to re-apply formatting to a sheet that
 * already has rows in it. Select "setupFormatting" in the toolbar dropdown
 * and press Run.
 */
function setupFormatting() {
  formatSheet_(getSheet_());
}

/** Widths in the same order as COLUMNS. */
const COLUMN_WIDTHS = [
  140, 110, 150, 130, 210, 120, 120, 150, 150, 110, 150, 200, 120, 100, 200,
  130, 140, 260, 160, 140, 260,
];

/** Columns whose text should wrap rather than run off the side. */
const WRAPPED_HEADERS = [
  'Venue',
  'Services',
  'Timeline & Key Moments',
  'Notes',
];

function formatSheet_(sheet) {
  const lastColumn = COLUMNS.length;
  const header = sheet.getRange(1, 1, 1, lastColumn);

  header
    .setFontWeight('bold')
    .setBackground('#4c1875')
    .setFontColor('#ffffff')
    .setVerticalAlignment('middle')
    .setWrap(true);

  sheet.setFrozenRows(1);
  // Keep Submitted, Status and Name visible while scrolling sideways.
  sheet.setFrozenColumns(3);
  sheet.setRowHeight(1, 38);

  COLUMN_WIDTHS.forEach(function (width, index) {
    sheet.setColumnWidth(index + 1, width);
  });

  // Everything else stays on one line so rows keep a scannable height.
  sheet.getRange(1, 1, sheet.getMaxRows(), lastColumn).setWrap(false);
  WRAPPED_HEADERS.forEach(function (name) {
    const index = COLUMNS.indexOf(name);
    if (index !== -1) {
      sheet.getRange(2, index + 1, sheet.getMaxRows() - 1, 1).setWrap(true);
    }
  });

  sheet
    .getRange(2, 1, sheet.getMaxRows() - 1, 1)
    .setNumberFormat('ddd d mmm yyyy  h:mm am/pm');

  const eventDateIndex = COLUMNS.indexOf('Event Date');
  if (eventDateIndex !== -1) {
    sheet
      .getRange(2, eventDateIndex + 1, sheet.getMaxRows() - 1, 1)
      .setNumberFormat('ddd d mmm yyyy');
  }

  // Status becomes a dropdown so it stays consistent enough to filter on.
  const statusIndex = COLUMNS.indexOf('Status');
  if (statusIndex !== -1) {
    const statusRange = sheet.getRange(
      2,
      statusIndex + 1,
      sheet.getMaxRows() - 1,
      1,
    );
    statusRange.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(STATUSES, true)
        .setAllowInvalid(false)
        .build(),
    );

    // Colour by stage so the pipeline is readable at a glance.
    const colours = {
      New: '#f3e5f5',
      Contacted: '#e3f2fd',
      Quoted: '#fff8e1',
      Booked: '#e8f5e9',
      Passed: '#eeeeee',
    };
    const rules = Object.keys(colours).map(function (status) {
      return SpreadsheetApp.newConditionalFormatRule()
        .whenTextEqualTo(status)
        .setBackground(colours[status])
        .setRanges([statusRange])
        .build();
    });
    sheet.setConditionalFormatRules(rules);
  }

  if (sheet.getBandings().length === 0) {
    sheet
      .getRange(1, 1, sheet.getMaxRows(), lastColumn)
      .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY);
  }

  sheet.getRange(1, 1, sheet.getMaxRows(), lastColumn).setVerticalAlignment('top');
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

/**
 * Sends the enquirer an acknowledgement.
 *
 * Deliberately worded as "received", not "confirmed": at this point nothing
 * has been agreed, and a client who believes a date is locked when it is not
 * is a far worse outcome than a slightly plainer email.
 */
function confirmToClient_(data) {
  const to = String(data.email || '').trim();

  // Cheap sanity check; MailApp throws on a malformed address and that would
  // roll back the whole submission.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return;
  }

  const firstName = String(data.name || '').trim().split(' ')[0] || 'there';
  const details = [
    ['Occasion', data.occasion],
    ['Date', data.eventDate],
    ['Time', data.eventTime],
    ['Venue', data.venue],
    ['Services', data.services],
    ['Coverage', data.coverageHours],
  ].filter(function (pair) {
    return pair[1];
  });

  const rows = details
    .map(function (pair) {
      return (
        '<tr>' +
        '<td style="padding:6px 16px 6px 0;color:#7a6b78;font-size:14px;white-space:nowrap;">' +
        pair[0] +
        '</td>' +
        '<td style="padding:6px 0;color:#1f1528;font-size:14px;">' +
        escapeHtml_(String(pair[1])) +
        '</td>' +
        '</tr>'
      );
    })
    .join('');

  const html =
    '<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;">' +
    '<p style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#a83fa0;margin:0 0 8px;">RVR Media</p>' +
    '<h1 style="font-size:26px;font-weight:600;color:#1f1528;margin:0 0 16px;">Thanks, ' +
    escapeHtml_(firstName) +
    '</h1>' +
    '<p style="font-size:15px;line-height:1.6;color:#4a3f4a;margin:0 0 20px;">' +
    'We have your inquiry and we read every one personally. Expect a reply within 1&ndash;2 business days.' +
    '</p>' +
    (rows
      ? '<table style="border-collapse:collapse;margin:0 0 20px;">' + rows + '</table>'
      : '') +
    '<p style="font-size:14px;line-height:1.6;color:#4a3f4a;margin:0 0 20px;">' +
    'Nothing is booked just yet &mdash; we will confirm availability for your date when we get back to you.' +
    '</p>' +
    '<p style="font-size:14px;line-height:1.6;color:#4a3f4a;margin:0;">' +
    'Anything to add in the meantime? Just reply to this email.' +
    '</p>' +
    '<p style="font-size:13px;color:#7a6b78;margin:28px 0 0;border-top:1px solid #e8e0e6;padding-top:16px;">' +
    'RVR Media &middot; Event &amp; portrait photography across New Jersey<br>' +
    '<a href="https://rvrmedia.vercel.app" style="color:#a83fa0;">rvrmedia.vercel.app</a>' +
    '</p>' +
    '</div>';

  const plain = [
    'Thanks, ' + firstName,
    '',
    'We have your inquiry and we read every one personally. Expect a reply within 1-2 business days.',
    '',
  ]
    .concat(
      details.map(function (pair) {
        return pair[0] + ': ' + pair[1];
      }),
    )
    .concat([
      '',
      'Nothing is booked just yet - we will confirm availability for your date when we get back to you.',
      '',
      'Anything to add in the meantime? Just reply to this email.',
      '',
      'RVR Media - Event & portrait photography across New Jersey',
      'https://rvrmedia.vercel.app',
    ])
    .join('\n');

  MailApp.sendEmail({
    to: to,
    subject: 'We got your inquiry - RVR Media',
    body: plain,
    htmlBody: html,
    name: 'RVR Media',
    replyTo: NOTIFY_EMAIL || undefined,
  });
}

function escapeHtml_(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
