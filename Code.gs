// Done-for-You Shopify Setup intake: serves the form, saves each submission
// as a row in the responses sheet, and emails a copy to NOTIFY_EMAIL.

const SHEET_ID = '1NCJc31-mu5mzSNRkXRTDROT3SUa9TnLkGX5SfBo-2To';
const NOTIFY_EMAIL = 'heyolish@gmail.com';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Shopify Shop Setup Intake')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// answers: [[label, value], ...] in form order. text: plain-text summary.
function submitIntake(answers, text) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const lastCol = Math.max(sheet.getLastColumn(), 1);
    let headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String);
    if (!headers[0]) headers = ['Submitted at'];

    // Add a column for any question that isn't in the sheet yet.
    answers.forEach(([label]) => { if (headers.indexOf(label) === -1) headers.push(label); });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);

    const byLabel = Object.fromEntries(answers);
    const row = headers.map(h => h === 'Submitted at' ? new Date() : (byLabel[h] ?? ''));
    sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }

  const get = l => (answers.find(a => a[0] === l) || [, ''])[1];
  const options = {};
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get('Email'))) options.replyTo = get('Email');
  MailApp.sendEmail(
    NOTIFY_EMAIL,
    'Shop setup intake: ' + (get('Business name') || get('Name')),
    text + '\n\nSaved to: https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/edit',
    options
  );
  return true;
}
