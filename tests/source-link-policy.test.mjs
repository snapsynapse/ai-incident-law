import assert from "node:assert/strict";
import test from "node:test";
import { assessSourceResponse, fetchOnce, checkSource } from "../scripts/check-source-links.mjs";

const bytes = value => new TextEncoder().encode(value);

test("allows documented bot-filter responses only on allowlisted hosts", () => {
  assert.equal(assessSourceResponse("https://gao.gov/example", 403, "text/html", bytes("blocked")).ok, true);
  assert.equal(assessSourceResponse("https://nycourts.gov/example", 429, "text/html", bytes("blocked")).ok, true);
  assert.equal(assessSourceResponse("https://example.com/", 403, "text/html", bytes("blocked")).ok, false);
});

test("rejects soft HTML responses for PDF URLs", () => {
  const result = assessSourceResponse(
    "https://www.gasupreme.us/wp-content/uploads/opinion.pdf",
    200,
    "text/html",
    bytes("<html>Error</html>"),
  );
  assert.equal(result.ok, false);
  assert.match(result.reason, /%PDF-/);
});

test("accepts a short court metadata wrapper before a PDF payload", () => {
  const result = assessSourceResponse(
    "https://media.ca7.uscourts.gov/opinion.pdf",
    200,
    "application/pdf",
    bytes(`Cas:25-1988:Type:FinalOpinion\n${"%PDF-1.6"}`),
  );
  assert.equal(result.ok, true);
});

test("distinguishes an OSCN opinion from its generic HTTP-200 landing page", () => {
  const landing = bytes(`<html>${"landing ".repeat(900)}</html>`);
  const opinion = bytes(`<html>SUPREME COURT OF THE STATE OF OKLAHOMA ${"opinion ".repeat(1800)}</html>`);
  const url = "https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=551746";
  assert.equal(assessSourceResponse(url, 200, "text/html", landing).ok, false);
  assert.equal(assessSourceResponse(url, 200, "text/html", opinion).ok, true);
});

const dcCourtUrl = "https://dccourts.gov/sites/default/files/2026-09/order.pdf";
const response = (status, body, type = "text/html") => new Response(body, {
  status,
  headers: { "Content-Type": type },
});

test("retries a DC Courts 403 with an identified compatibility user agent and validates the PDF", async () => {
  const calls = [];
  const result = await fetchOnce(dcCourtUrl, async (url, options) => {
    calls.push({ url, options });
    return calls.length === 1 ? response(403, "Forbidden") : response(200, "%PDF-1.6", "application/pdf");
  });
  assert.equal(result.ok, true);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].url, dcCourtUrl);
  assert.match(calls[1].options.headers["User-Agent"], /AI-Incident-Law-Source-Checker/);
  assert.notEqual(calls[0].options.headers["User-Agent"], calls[1].options.headers["User-Agent"]);
  assert.match(result.warning, /compatibility retry/);
});

test("DC Courts retry still fails for blocked or soft-error payloads", async () => {
  for (const retryResponse of [response(403, "Forbidden"), response(200, "<html>Denied</html>")]) {
    let calls = 0;
    const result = await fetchOnce(dcCourtUrl, async () => {
      calls += 1;
      return calls === 1 ? response(403, "Forbidden") : retryResponse;
    });
    assert.equal(result.ok, false);
    assert.equal(calls, 2);
  }
});

test("compatibility retry is limited to the exact court host and HTTP 403", async () => {
  for (const [url, status] of [["https://example.com/order.pdf", 403], ["https://dccourts.gov.example.com/order.pdf", 403], [dcCourtUrl, 404], [dcCourtUrl, 200]]) {
    let calls = 0;
    await fetchOnce(url, async () => {
      calls += 1;
      return response(status, "%PDF-1.6", "application/pdf");
    });
    assert.equal(calls, 1, `${url} HTTP ${status}`);
  }
});


test("checkSource shares its two-request budget with the DC Courts compatibility retry", async () => {
  for (const failure of [429, 503, new Error("network failed")]) {
    let calls = 0;
    const result = await checkSource({ id: "dc", url: dcCourtUrl }, async () => {
      calls += 1;
      if (calls === 1 || calls === 3) return response(403, "Forbidden");
      if (calls >= 4) return response(200, "%PDF-1.6", "application/pdf");
      if (failure instanceof Error) throw failure;
      return response(failure, "Unavailable");
    });
    assert.equal(result.ok, false);
    assert.equal(calls, 2);
    assert.equal(result.reason, failure instanceof Error ? failure.message : `HTTP ${failure}`);
  }
});

test("checkSource preserves ordinary retries and never adds a third request after a transient failure", async () => {
  for (const failure of [429, 503, new Error("network failed")]) {
    let calls = 0;
    const result = await checkSource({ id: "other", url: "https://example.com/order.pdf" }, async () => {
      calls += 1;
      if (calls === 2) return response(200, "%PDF-1.6", "application/pdf");
      if (failure instanceof Error) throw failure;
      return response(failure, "Unavailable");
    });
    assert.equal(result.ok, true);
    assert.equal(calls, 2);
  }
  let calls = 0;
  const result = await checkSource({ id: "dc", url: dcCourtUrl }, async () => {
    calls += 1;
    return response(calls === 1 ? 503 : 403, "Unavailable");
  });
  assert.equal(result.ok, false);
  assert.equal(calls, 2);
  assert.equal(result.reason, "HTTP 403");
});
