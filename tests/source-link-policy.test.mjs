import assert from "node:assert/strict";
import test from "node:test";
import { assessSourceResponse } from "../scripts/check-source-links.mjs";

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
