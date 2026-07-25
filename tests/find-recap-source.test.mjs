import assert from "node:assert/strict";
import test from "node:test";
import {
  ResolverError,
  assertStoragePath,
  buildDocketQuery,
  buildDocumentQuery,
  captionMatches,
  docketMatches,
  parseArgs,
  resolveRecapSource,
  selectDocument,
  verifyDocumentText,
} from "../scripts/find-recap-source.mjs";

const criteria = {
  caption: "Jakes v. Youngblood",
  court: "pawd",
  docket: "2:24-cv-01608",
  date: "2025-10-06",
  entry: 71,
};

const docket = {
  caseName: "JAKES v. YOUNGBLOOD",
  court: "District Court, W.D. Pennsylvania",
  court_id: "pawd",
  docketNumber: "2:24-cv-01608",
  docket_id: 69412014,
  pacer_case_id: "314851",
};

const document = {
  docket_id: 69412014,
  entry_number: 71,
  entry_date_filed: "2025-10-06",
  description: "MEMORANDUM ORDER",
  filepath_local: "recap/gov.uscourts.pawd.314851/gov.uscourts.pawd.314851.71.0.pdf",
  is_available: true,
};

const pdfText = `
Case 2:24-cv-01608-WSS Document 71 Filed 10/06/25 Page 1 of 6
UNITED STATES DISTRICT COURT
THOMAS DEXTER JAKES,
Plaintiff,
v.
DUANE YOUNGBLOOD,
Defendant.
`;

test("matches normalized captions and docket numbers", () => {
  assert.equal(captionMatches("Jakes v. Youngblood", "JAKES versus YOUNGBLOOD"), true);
  assert.equal(captionMatches("Jakes v. Youngblood", "Jakes v. Blackburn"), false);
  assert.equal(docketMatches("2:24-cv-01608", "2:24-CV-1608"), true);
  assert.equal(docketMatches("2:21-cv-01701-AMM", "2:21-cv-01701"), true);
  assert.equal(docketMatches("1:24-cv-00074-SA-RP", "1:24-cv-00074-SA-DAS"), true);
});

test("builds an entry-level query tied to the selected docket", () => {
  assert.equal(
    buildDocketQuery({ ...criteria, court: "msnd", docket: "1:24-cv-00074-SA-RP" }),
    'docketNumber:"1:24-cv-00074" AND court_id:msnd',
  );
  assert.equal(
    buildDocumentQuery(docket, criteria),
    "docket_id:69412014 AND entry_date_filed:2025-10-06 AND entry_number:71",
  );
});

test("rejects a storage path built from the wrong identifier", () => {
  assert.throws(
    () => assertStoragePath(
      { ...document, filepath_local: "recap/gov.uscourts.pawd.69412014/wrong.pdf" },
      docket,
    ),
    /PACER case ID/,
  );
});

test("prefers the primary filing over attachments at the same entry", () => {
  const attachment = {
    ...document,
    attachment_number: 1,
    filepath_local: "recap/gov.uscourts.pawd.314851/gov.uscourts.pawd.314851.71.1.pdf",
  };
  assert.equal(selectDocument([attachment, { ...document, attachment_number: null }], docket, criteria).attachment_number, null);
});

test("verifies caption, docket, date, and entry in extracted PDF text", () => {
  assert.deepEqual(verifyDocumentText(pdfText, criteria, document), {
    caption: true,
    docket: true,
    filed_date: true,
    entry_number: true,
  });
  assert.throws(
    () => verifyDocumentText(pdfText.replace("YOUNGBLOOD", "BLACKBURN"), criteria, document),
    /caption/,
  );
  assert.equal(
    verifyDocumentText(pdfText.replace("Document 71", "Doc #: 71"), criteria, document).entry_number,
    true,
  );
});

test("resolves a source with anonymous access and injected I/O", async () => {
  const requests = [];
  const result = await resolveRecapSource(criteria, {
    token: "",
    requestJson: async (url, headers) => {
      requests.push({ url: url.toString(), headers });
      return requests.length === 1 ? { results: [docket] } : { results: [document] };
    },
    fetchPdf: async url => {
      assert.equal(
        url,
        "https://storage.courtlistener.com/recap/gov.uscourts.pawd.314851/gov.uscourts.pawd.314851.71.0.pdf",
      );
      return Buffer.from("%PDF-test");
    },
    extractPdfText: async () => pdfText,
  });

  assert.equal(result.status, "verified");
  assert.equal(result.authentication, "anonymous");
  assert.equal(result.document.entry_number, 71);
  assert.equal("Authorization" in requests[0].headers, false);
  assert.match(requests[0].url, /type=r/);
  assert.match(requests[1].url, /type=rd/);
});

test("uses token authentication without exposing the token in output", async () => {
  const secret = "not-a-real-token";
  const headersSeen = [];
  const result = await resolveRecapSource(criteria, {
    token: secret,
    requestJson: async (_url, headers) => {
      headersSeen.push(headers);
      return headersSeen.length === 1 ? { results: [docket] } : { results: [document] };
    },
    fetchPdf: async () => Buffer.from("%PDF-test"),
    extractPdfText: async () => pdfText,
  });
  assert.equal(headersSeen[0].Authorization, `Token ${secret}`);
  assert.equal(result.authentication, "authenticated");
  assert.doesNotMatch(JSON.stringify(result), new RegExp(secret));
});

test("requires the evidence-bearing criteria", () => {
  assert.throws(
    () => parseArgs(["--caption", "Jakes v. Youngblood", "--court", "pawd"]),
    error => error instanceof ResolverError && /--docket/.test(error.message),
  );
});
