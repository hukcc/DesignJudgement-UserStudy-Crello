/**
 * Design A/B User Study — data collector (Google Apps Script).
 *
 * Receives each participant's results (POSTed by the study page) and appends ONE row per submission
 * to the bound Google Sheet. The full JSON is kept in the last column; a few fields are flattened
 * into their own columns for quick scanning.
 *
 * ── Setup ────────────────────────────────────────────────────────────────────────────────────────
 * 1. Create a Google Sheet (this will hold the responses).
 * 2. Extensions ▸ Apps Script → delete the sample code → paste this file → Save.
 * 3. Deploy ▸ New deployment ▸ (gear) Web app.
 *      • Execute as: Me
 *      • Who has access: Anyone            ← required so participants can POST without logging in
 *    Deploy → Authorize → copy the Web app URL (ends with /exec).
 * 4. Paste that /exec URL into config.js in the GitHub repo (window.GOOGLE_SCRIPT_URL = "…/exec";).
 *
 * The study posts as text/plain (no CORS preflight) with mode:"no-cors", so it can't read the
 * response — that's fine; the row is still written. Test with the "Send test row" run below.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);                                  // serialize concurrent submissions
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    var data = JSON.parse(e.postData.contents);
    var s = data.individualSummary || {};

    if (sheet.getLastRow() === 0) {                       // header row on first submission
      sheet.appendRow(["receivedAt", "participantId", "studyId", "nAnalyzed",
                       "humanAccuracy", "leftBias", "startedAt", "finishedAt",
                       "language", "userAgent", "fullJson"]);
    }
    sheet.appendRow([
      new Date(),
      data.participantId || "",
      data.studyId || "",
      (data.config && data.config.nAnalyzed) || "",
      s.humanAccuracy != null ? s.humanAccuracy : "",
      s.leftBias != null ? s.leftBias : "",
      data.startedAt || "",
      data.finishedAt || "",
      data.language || "",
      data.userAgent || "",
      JSON.stringify(data)
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("Design A/B study collector is running.");
}

/** Run this once from the editor to append a dummy row and confirm writing works. */
function sendTestRow() {
  doPost({ postData: { contents: JSON.stringify({
    participantId: "TEST", studyId: "crello", config: { nAnalyzed: 30 },
    individualSummary: { humanAccuracy: 0.66, leftBias: 0.5 },
    startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(),
    language: "en", userAgent: "test", responses: []
  }) } });
}
