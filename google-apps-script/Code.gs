const SHEET_NAME = 'Responses'

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)

    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" was not found.`)
    }

    const params = e && e.parameter ? e.parameter : {}

    const number = String(params.number || '').trim()
    const name = String(params.name || '').trim()
    const description = String(params.description || '').trim()

    if (!number) {
      return jsonResponse({ success: false, error: "HR's number is required." })
    }

    sheet.appendRow([
      new Date(),
      number,
      name,
      description,
    ])

    return jsonResponse({ success: true })
  } catch (error) {
    return jsonResponse({
      success: false,
      error: error.message || String(error),
    })
  }
}

function doGet() {
  return jsonResponse({
    success: true,
    message: 'HR Number Form Google Apps Script is running.',
  })
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}

function setupSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = spreadsheet.getSheetByName(SHEET_NAME)

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME)
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'HR Number', 'Name', 'Description'])
    sheet.setFrozenRows(1)
  }
}
