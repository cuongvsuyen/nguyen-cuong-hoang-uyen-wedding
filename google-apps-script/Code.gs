const RSVP_CONFIG = {
  sheetName: 'RSVP',
  summarySheetName: 'TỔNG HỢP',
  spreadsheetIdProperty: 'SPREADSHEET_ID',
  timezone: 'Asia/Ho_Chi_Minh',
  maxGuests: 10
};

const RSVP_HEADERS = [
  'Mã RSVP',
  'Gửi lần đầu',
  'Cập nhật cuối',
  'Họ và tên',
  'Số điện thoại',
  'Khách của',
  'Trạng thái',
  'Số người',
  'Lưu ý món ăn',
  'Lời nhắn',
  'Trang gửi',
  'Client ID',
  'Phiên bản form',
  'Thiết bị / trình duyệt'
];

/**
 * Chạy hàm này MỘT LẦN trong Apps Script sau khi dán code.
 * Hàm sẽ ghi nhớ Google Sheet hiện tại, tạo tab RSVP + TỔNG HỢP
 * và định dạng sẵn để theo dõi khách mời.
 */
function setupRsvpSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Hãy tạo Apps Script từ chính Google Sheet: Extensions > Apps Script.');

  PropertiesService.getScriptProperties().setProperty(
    RSVP_CONFIG.spreadsheetIdProperty,
    ss.getId()
  );

  ss.setSpreadsheetTimeZone(RSVP_CONFIG.timezone);
  ensureRsvpSheet_(ss);
  ensureSummarySheet_(ss);

  SpreadsheetApp.flush();
  return `Đã cấu hình RSVP cho: ${ss.getName()}`;
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('RSVP')
    .addItem('Thiết lập / làm mới bảng RSVP', 'setupRsvpSheet')
    .addToUi();
}

/**
 * URL Web App có thể được mở trực tiếp để kiểm tra backend đã hoạt động.
 */
function doGet() {
  try {
    const ss = getSpreadsheet_();
    ensureRsvpSheet_(ss);
    return json_({
      ok: true,
      service: 'wedding-rsvp-google-sheets',
      spreadsheet: ss.getName(),
      sheet: RSVP_CONFIG.sheetName
    });
  } catch (error) {
    return json_({ ok: false, error: String(error && error.message ? error.message : error) });
  }
}

/**
 * Nhận POST dạng application/x-www-form-urlencoded từ GitHub Pages.
 * Một clientId gửi lại sẽ cập nhật dòng cũ. Nếu clientId mới nhưng số điện thoại
 * trùng với một dòng có sẵn thì cũng cập nhật dòng đó để hạn chế trùng dữ liệu.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    const p = (e && e.parameter) || {};

    // Honeypot: bot thường điền field ẩn này.
    if (clean_(p.website, 200)) {
      return htmlResult_({ ok: true, ignored: true, requestId: clean_(p.requestId, 160) });
    }

    const name = clean_(p.name, 80);
    if (!name) return htmlResult_({ ok: false, error: 'Thiếu họ và tên.', requestId: clean_(p.requestId, 160) });

    const ss = getSpreadsheet_();
    const sheet = ensureRsvpSheet_(ss);
    ensureSummarySheet_(ss);

    const now = new Date();
    const clientId = clean_(p.clientId, 120);
    const phone = clean_(p.phone, 30);
    const normalizedPhone = normalizePhone_(phone);
    const relation = relationLabel_(p.relation);
    const attendance = statusLabel_(p.status);
    const guests = p.status === 'no' ? 0 : clampInt_(p.guests, 1, RSVP_CONFIG.maxGuests, 1);

    const data = sheet.getDataRange().getValues();
    let rowNumber = 0;
    let existingId = '';
    let createdAt = now;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const rowClientId = String(row[11] || '').trim();
      const rowPhone = normalizePhone_(row[4]);
      const clientMatch = clientId && rowClientId === clientId;
      const phoneMatch = normalizedPhone && rowPhone === normalizedPhone;

      if (clientMatch || phoneMatch) {
        rowNumber = i + 1;
        existingId = String(row[0] || '');
        if (row[1] instanceof Date) createdAt = row[1];
        break;
      }
    }

    const id = existingId || Utilities.getUuid();
    const rowValues = [[
      id,
      createdAt,
      now,
      safeCell_(name, 80),
      safeCell_(phone, 30),
      relation,
      attendance,
      guests,
      safeCell_(p.diet, 120),
      safeCell_(p.message, 500),
      safeCell_(p.source, 500),
      safeCell_(clientId, 120),
      safeCell_(p.formVersion, 100),
      safeCell_(p.userAgent, 500)
    ]];

    if (rowNumber) {
      sheet.getRange(rowNumber, 1, 1, RSVP_HEADERS.length).setValues(rowValues);
    } else {
      rowNumber = sheet.getLastRow() + 1;
      sheet.getRange(rowNumber, 1, 1, RSVP_HEADERS.length).setValues(rowValues);
    }

    sheet.getRange(rowNumber, 2, 1, 2).setNumberFormat('dd/MM/yyyy HH:mm:ss');
    sheet.getRange(rowNumber, 8).setNumberFormat('0');
    SpreadsheetApp.flush();

    return htmlResult_({ ok: true, id, updated: Boolean(existingId), row: rowNumber, requestId: clean_(p.requestId, 160) });
  } catch (error) {
    console.error(error);
    return htmlResult_({ ok: false, error: String(error && error.message ? error.message : error), requestId: clean_((e && e.parameter && e.parameter.requestId) || '', 160) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty(RSVP_CONFIG.spreadsheetIdProperty);

  if (!id) {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (!active) {
      throw new Error('Chưa cấu hình Google Sheet. Hãy chạy setupRsvpSheet() một lần.');
    }
    id = active.getId();
    props.setProperty(RSVP_CONFIG.spreadsheetIdProperty, id);
  }

  return SpreadsheetApp.openById(id);
}

function ensureRsvpSheet_(ss) {
  let sheet = ss.getSheetByName(RSVP_CONFIG.sheetName);
  if (!sheet) sheet = ss.insertSheet(RSVP_CONFIG.sheetName);

  const headerRange = sheet.getRange(1, 1, 1, RSVP_HEADERS.length);
  const current = headerRange.getValues()[0];
  const needsHeader = RSVP_HEADERS.some((header, i) => current[i] !== header);
  if (needsHeader) headerRange.setValues([RSVP_HEADERS]);

  headerRange
    .setBackground('#7A0014')
    .setFontColor('#FFBE89')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 34);

  const widths = [190, 145, 145, 180, 120, 170, 135, 85, 180, 320, 260, 190, 180, 280];
  widths.forEach((width, index) => sheet.setColumnWidth(index + 1, width));

  if (sheet.getLastRow() >= 1 && !sheet.getFilter()) {
    sheet.getRange(1, 1, sheet.getMaxRows(), RSVP_HEADERS.length).createFilter();
  }

  return sheet;
}

function ensureSummarySheet_(ss) {
  let sheet = ss.getSheetByName(RSVP_CONFIG.summarySheetName);
  if (!sheet) sheet = ss.insertSheet(RSVP_CONFIG.summarySheetName, 0);

  const values = [
    ['TỔNG HỢP RSVP', 'Giá trị'],
    ['Tổng phản hồi', `=COUNTA('${RSVP_CONFIG.sheetName}'!A2:A)`],
    ['Số phản hồi tham dự', `=COUNTIF('${RSVP_CONFIG.sheetName}'!G2:G,"Có tham dự")`],
    ['Số phản hồi không tham dự', `=COUNTIF('${RSVP_CONFIG.sheetName}'!G2:G,"Không tham dự")`],
    ['Tổng số khách dự kiến', `=SUM('${RSVP_CONFIG.sheetName}'!H2:H)`],
    ['Khách nhà trai / chú rể', `=COUNTIF('${RSVP_CONFIG.sheetName}'!F2:F,"Nhà trai / Chú rể")`],
    ['Khách nhà gái / cô dâu', `=COUNTIF('${RSVP_CONFIG.sheetName}'!F2:F,"Nhà gái / Cô dâu")`],
    ['Bạn chung của hai bạn', `=COUNTIF('${RSVP_CONFIG.sheetName}'!F2:F,"Bạn chung của hai bạn")`]
  ];

  sheet.getRange(1, 1, values.length, 2).setValues(values);
  sheet.getRange('A1:B1')
    .setBackground('#7A0014')
    .setFontColor('#FFBE89')
    .setFontWeight('bold');
  sheet.getRange('A2:A8').setFontWeight('bold');
  sheet.setColumnWidth(1, 240);
  sheet.setColumnWidth(2, 150);
  sheet.setFrozenRows(1);
  return sheet;
}

function relationLabel_(value) {
  return ({
    groom: 'Nhà trai / Chú rể',
    bride: 'Nhà gái / Cô dâu',
    both: 'Bạn chung của hai bạn',
    family: 'Người thân gia đình',
    other: 'Khác'
  })[String(value || '').toLowerCase()] || 'Khác';
}

function statusLabel_(value) {
  return String(value || '').toLowerCase() === 'no' ? 'Không tham dự' : 'Có tham dự';
}

function normalizePhone_(value) {
  return String(value || '').replace(/\D/g, '').replace(/^84(?=\d{9,10}$)/, '0');
}

function clampInt_(value, min, max, fallback) {
  const n = parseInt(value, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function clean_(value, maxLength) {
  return String(value == null ? '' : value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength || 500);
}

// Prevent user content beginning with = + - @ from becoming a spreadsheet formula.
function safeCell_(value, maxLength) {
  const text = clean_(value, maxLength);
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}


function htmlResult_(obj) {
  const payload = JSON.stringify({ type: 'wedding-rsvp-result', ...obj }).replace(/</g, '\\u003c');
  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body><script>window.parent.postMessage(${payload}, '*');<\/script></body></html>`;
  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
