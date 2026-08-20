# Roadmap

## Current state

The repository currently serves a static, portable research site backed by a canonical JSON dataset and a generated browser bundle.

Current dataset buckets:

- `included`: records ready for public presentation in the main site
- `review`: candidates that need verification, source hardening, or scope decisions
- `global`: non-US or cross-jurisdiction candidates that need additional translation, sourcing, or normalization

## Near-term priorities

### 0. Deepen PAICE Legal Graph semantics

- Migrate representative matters from display-field inference to curated `legal_graph` projections
- Add typed claimants, respondents, and asserting parties where primary sources identify them
- Link pre-decision Allegations to concrete allegedly violated Obligations when the source supports the nexus
- Represent common-law duties and remedial Obligations recognized or imposed by adjudicative Determinations
- Add legal identifier crosswalks after the procedural projection is source-complete

### 1. Tighten dataset inclusion discipline — done 2026-08-19

Three questions that had been resolved case by case each sweep are now settled rules in
INTENT.md, documented for contributors on the public methodology page, and enforced by
`npm run test:admission-policy`:

- Outcome valence: a matter is admitted on the established AI-attributable defect, not on
  the severity of the consequence. Rulings that decline to sanction or exclude are admissible.
- AI attribution: criterion 1 is satisfied when the primary source itself discusses AI in
  connection with the defect, bounded by requiring that discussion to be in the source and
  that no competing non-AI mechanism is established.
- Jurisdiction and language: `global` is review for non-US matters, a queue rather than a
  destination; jurisdiction is not a criterion and source language does not block admission.

Exclusion rules for adjacent controversy remain as they were in INTENT.md "Out of scope".

### 2. Improve source rigor

- Prefer primary public records where they exist
- Add archived or stable source locations where practical
- Reduce dependency on secondary reporting for records that can be upgraded to primary-source status

#### Outstanding source gaps

Tracked here rather than in maintainer tooling so they survive without it. Verified 2026-08-19.

**Aggregator-primary backlog (4 records).** These cite an aggregator in `public_record_link`,
which the sourcing rule bars. `npm run test:admission-policy` holds them as a named baseline
that can shrink but not grow, so a new one fails the build:

| Record | Aggregator | Route to an original |
|---|---|---|
| AIEL-2024-001 | canlii.org | Needs a CanLII API key |
| AIEL-2023-002 | law.justia.com | S.D.N.Y. — resolvable through RECAP |
| AIEL-2024-003 | law.justia.com | 2d Cir. — resolvable through the circuit's own site or govinfo |
| AIEL-2017-012 | law.justia.com | Arkansas Supreme Court — check the court's own opinion archive |

The larger backlog this replaced is clear: no record in any bucket now cites the discovery
tracker as a source, in any field. A regression test keeps it that way.

**Blocked by access, not by effort.** Two are outside what automated retrieval can reach:

- A free **CanLII API key** would unblock AIEL-2024-001, AIEL-GLOB-015, AIEL-GLOB-017 and
  AIEL-GLOB-019, and every future Canadian record. CanLII serves HTTP 403 behind a CAPTCHA
  to all scripted access.
- **SAFLII** serves HTTP 403 on every path, so South African matters are browser-only. This
  alone holds AIEL-GLOB-018 and the M J Molawa candidate. There is no API alternative.

**Candidates held on sourcing alone**, each admissible in principle under the current
criteria: AIEL-CAND-026 (NYSCEF returns 403; New York trial level has no automated route),
AIEL-CAND-027 (New York Official Reports lag Westlaw by weeks — re-check the slip-opinion
index rather than treating it as permanently unsourced), AIEL-CAND-028 (courts.wa.gov),
AIEL-CAND-029 (PACER), AIEL-GLOB-018, AIEL-GLOB-019, AIEL-GLOB-020.

#### Known coverage gaps

Named by a quarterly cross-category probe on 2026-08-16 and not yet worked. None had an
admissible primary source at the time; all are worth a targeted pass:

- **Character.AI is absent from the corpus entirely**, despite the January 2026
  Google/Character.AI settlements. The most conspicuous gap.
- Florida AG v. OpenAI Global (FDUTPA, filed 2026-06-01); Winters v. OpenAI (SF Superior,
  ChatGPT Health); Gavalas v. Google (N.D. Cal., Gemini wrongful death); three Grok deepfake
  matters.
- **Brazil is unrepresented.** A TJSP appeal surfaced on 2026-08-19 with a fine and a bar
  referral, but its PDF is image-only and needs the OCR path in item 5 below.
- Under-represented categories: deepfake civil suits, generative-AI defamation past the
  Walters v. OpenAI posture, AV wrongful-death actions, AI companion harm, healthcare AI
  denial, AI content-moderation suits.

#### Curation cadence

The corpus is curated, not crawled. Court and agency filings lag public indexing by 7 to 21
days, so a sweep run immediately after the previous one mostly re-reads what it already saw.

- Next incident sweep: on or after **2026-09-02**, to catch matters filed 16 to 19 August
  that had not indexed when the last sweep ran.
- Next cross-category probe (non-hallucination categories): around **November 2026**. These
  categories reliably return leads rather than admissible records; budget them as such.

### 3. Stabilize schema expectations

- Keep `included` records normalized for consistent rendering
- Preserve candidate-only fields for `review` and `global` without forcing premature normalization
- Document which fields are required for publication versus queue management

### 4. Improve publication quality

- Add clearer dataset notes on methodology and scope boundaries
- Consider a record detail view if the current card layout becomes too compressed

### 5. Benchmark OCR backends against legal-document evidence fields

Keep the portable extraction order as `pdftotext` for native text, followed by
`pdftoppm` and Tesseract for image-only pages. DeepSeek-OCR may supplement difficult
layout interpretation, but generative OCR must not independently establish a caption,
docket number, entry number, filing date, citation, quotation, or disposition.

Run an isolated bake-off before changing the default:

- Compare plain Tesseract, Tesseract with OCRmyPDF preprocessing, and PP-OCRv6
- Retain DeepSeek-OCR as a supplemental layout and text-recovery comparator
- Use representative fixtures covering clean scans, skew and rotation, low-resolution
  docket headers, tables and appendices, and mixed native-text/scanned PDFs
- Score exact-field recall for caption, docket, entry, filing date, citations, amounts,
  and disposition, plus character error rate, latency, memory, installation burden,
  offline operation, and cross-platform portability
- Keep expected case criteria out of model prompts so the test cannot leak the answer
  into OCR output
- Require a candidate to improve difficult-page fidelity without reducing header recall
  or weakening reproducibility before it can replace Tesseract
- Record the fixture manifest, ground truth, commands, model versions, raw outputs, and
  adoption decision in the repository

## Medium-term improvements

- Add archive or snapshot references for fragile sources
- Add a changelog or release cadence for major dataset updates
- Add issue templates for data corrections and source challenges
- Add a short methodology note describing inclusion and exclusion logic
- Add a machine-readable JSON schema once field usage stabilizes further
- Consider whether `data.js` should remain committed long term or become a deploy artifact

## Not a priority right now

- Framework migration
- Complex build tooling
- Database backend
- Client-side persistence
- Search infrastructure beyond the current local bundle

## Decision rules

- Favor portability over stack complexity
- Favor source quality over record count
- Favor explicit scope boundaries over broad inclusion
- Favor reproducibility over convenience
