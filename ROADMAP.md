# Roadmap

## Current state

The repository currently serves a static, portable research site backed by a canonical JSON dataset and a generated browser bundle.

Current dataset buckets:

- `included`: records ready for public presentation in the main site
- `review`: candidates that need verification, source hardening, or scope decisions
- `global`: non-US or cross-jurisdiction candidates that need additional translation, sourcing, or normalization

## Near-term priorities

### 1. Tighten dataset inclusion discipline

- Define sharper admission criteria for what counts as an AI-related incident with legal visibility
- Distinguish clearly between direct legal proceedings, regulatory actions, and reliable review-queue candidates
- Document exclusion rules for adjacent but out-of-scope algorithmic controversy

### 2. Improve source rigor

- Prefer primary public records where they exist
- Add archived or stable source locations where practical
- Reduce dependency on secondary reporting for records that can be upgraded to primary-source status

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
