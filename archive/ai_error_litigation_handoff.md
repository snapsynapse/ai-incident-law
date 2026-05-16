# Handoff: Research Task for an AI Error Litigation Log

## Objective
Create a research-grade, continuously updateable list of **AI errors** that later became the basis of a **publicly filed legal matter**. The unit of analysis is the **error event itself**, not the lawsuit as such. The resulting dataset should answer: **What AI-generated or AI-mediated error led a person or organization to file a lawsuit, tribunal claim, arbitration claim, disciplinary matter, or comparable public legal action?**[cite:15][cite:20][cite:10]

## Core framing
This project should distinguish between:

- **Error-first cases**: a concrete AI output or AI-mediated failure occurred, the output was not adequately mitigated, and that error later became part of a publicly filed legal matter.[cite:15][cite:20]
- **Litigation-about-AI cases**: lawsuits involving AI companies, AI training, copyright, scraping, privacy, or platform conduct, where the central issue is not a specific erroneous output that someone relied on.[cite:10]

The first category is in scope. The second category should usually be excluded or tagged separately.[cite:10][cite:15]

## Research question
Identify publicly discoverable matters where:

1. An AI system produced, communicated, recommended, classified, priced, routed, summarized, generated, or otherwise emitted an **error**.
2. That error was **not effectively mitigated** before external reliance or harm.
3. The error materially contributed to a **publicly filed legal matter**.
4. The legal matter is discoverable through a court docket, tribunal record, agency filing, disciplinary order, arbitration publication, or a reliable secondary source quoting such a filing.[cite:15][cite:20][cite:10]

## Working definition of “error”
For this project, an “error” is a discrete, attributable failure in AI output or AI-mediated decisioning, such as:[cite:15][cite:20]

- A false factual statement.
- A hallucinated policy, right, duty, or entitlement.
- A fabricated citation, authority, source, or document reference.
- A wrongful eligibility determination.
- A discriminatory or misclassified decision.
- A materially wrong recommendation, ranking, price, risk score, or summary.
- An output that contradicts a canonical source of truth controlled by the deploying organization.[cite:15][cite:20]

The preferred unique identifier is the **error event**, even if multiple legal proceedings later refer to the same underlying error.[cite:15][cite:20]

## Working definition of “public legal matter”
Count a matter as in scope if it is publicly discoverable through at least one of the following:[cite:10][cite:15]

- Civil complaint filed in court.
- Small claims or tribunal filing.
- Public administrative complaint or enforcement filing.
- Public disciplinary or sanctions proceeding.
- Public arbitration matter, but only if the filing, order, or award is publicly available.

A final judgment is **not required**. The project is focused more on the **error that triggered filing** than on case resolution.[cite:10][cite:15]

## Seed example
The canonical seed example is **Moffatt v. Air Canada**, where Air Canada’s website chatbot reportedly gave incorrect bereavement fare information, the customer relied on it, and the matter proceeded before the British Columbia Civil Resolution Tribunal, which treated the chatbot statement as part of Air Canada’s website and characterized the issue as negligent misrepresentation.[cite:15][cite:17][cite:20]

This example should be used to calibrate inclusion criteria: the key record is the **chatbot misstatement about bereavement eligibility and process**, not simply the existence of a claim against Air Canada.[cite:15][cite:20]

## Existing sources and their limits
No single public source appears to maintain a complete, authoritative, error-first log of all AI errors that later entered litigation or similar public legal proceedings.[cite:10][cite:15]

Existing sources are useful but partial:

| Source type | What it helps with | Limitation for this project |
|---|---|---|
| AI Incident Database | Good for incident-first discovery and structured incident descriptions, including the Air Canada chatbot matter.[cite:15] | Not a complete litigation-first or filed-matter-first tracker.[cite:15] |
| Running AI lawsuit lists | Useful for finding filed cases involving AI companies and AI-related claims.[cite:10] | Overinclusive for this task because many entries are not about a discrete user-facing error.[cite:10] |
| Legal blogs and case notes | Helpful for identifying fact patterns, error descriptions, and citations to underlying proceedings, such as commentary on Moffatt v. Air Canada.[cite:20] | Inconsistent scope and not comprehensive.[cite:20] |

## Inclusion criteria
Include a record if all of the following are true:

- There is a **specific AI error event** that can be described in one sentence.
- The error was externalized to a user, customer, employee, court, agency, or other third party, or it drove an externally consequential decision.
- The error was allegedly **unmitigated** or insufficiently mitigated before the relevant harm or reliance.
- A **public legal matter** was filed or publicly recorded.
- The public record or a reliable secondary source allows the researcher to connect the legal matter back to the error event.[cite:15][cite:20][cite:10]

## Exclusion criteria
Exclude by default:

- Pure copyright, data-scraping, or training-data cases where no specific erroneous output is central to the harm theory.[cite:10]
- General claims about AI bias or AI risk where no discrete error event can be identified.
- Internal incidents with no public filing or public legal record.
- Media stories alleging harm from AI where no filed legal matter can be verified.
- Product liability or contract disputes involving AI features unless the error event itself can be clearly isolated and tied to the filing.[cite:10][cite:15]

## Primary research output
Create a spreadsheet or table where **each row is one error event**. Do not make the lawsuit the primary row object unless there is no way to separate the error from the filing.[cite:15][cite:20]

### Proposed fields

| Field | Description |
|---|---|
| `error_id` | Stable unique identifier for the error event. |
| `error_title` | Short plain-language label, e.g. “Air Canada chatbot misstated bereavement refund eligibility.” |
| `ai_system_name` | Named system, chatbot, model, tool, or “unknown.” |
| `deployer` | Organization or actor that deployed or used the system. |
| `domain` | Consumer travel, legal services, employment, health, finance, education, government, etc. |
| `error_type` | Misstatement, hallucinated authority, misclassification, discriminatory output, wrong pricing, false summary, etc. |
| `error_description` | 2–4 sentence summary of the actual error event. |
| `canonical_source_conflicted` | What source of truth the output contradicted, if known. |
| `mitigation_gap` | What review, guardrail, or governance control appears absent or ineffective. |
| `reliance_or_harm` | What the claimant or affected party did or suffered because of the error. |
| `public_matter_type` | Court complaint, tribunal claim, sanctions order, disciplinary matter, regulatory filing, arbitration award, etc. |
| `public_matter_name` | Name of the case, matter, or proceeding. |
| `filing_status` | Filed, pending, dismissed, sanctioned, ordered, settled if public, unknown. |
| `jurisdiction` | Country, state/province, court, tribunal, or agency. |
| `filing_date` | Earliest public filing date available. |
| `error_date` | Date of the underlying error event, if known. |
| `public_record_link` | Best public link to docket, opinion, tribunal record, agency page, or order. |
| `secondary_source_links` | Reliable reporting or commentary that describes the error and cites the public matter. |
| `confidence_score` | High, medium, low based on source quality and traceability. |
| `notes_on_resolution` | Minimal note only if useful; resolution is not the main focus. |

## Recommended tags
Apply multiple tags per record where useful:

- `consumer-facing`
- `internal-use-but-public-consequence`
- `chatbot`
- `decision-support`
- `document-generation`
- `legal-hallucination`
- `policy-misstatement`
- `pricing-error`
- `eligibility-error`
- `ranking-or-recommendation-error`
- `misclassification`
- `discrimination-claim`
- `negligent-misrepresentation`
- `fraud-or-deception-alleged`
- `professional-discipline`
- `sanctions-order`
- `tribunal`
- `small-claims`
- `agency-action`
- `public-record-confirmed`
- `secondary-source-only`

## Research workflow

### Phase 1: Seed known examples
Start with error-first examples that are already widely discussed and clearly connected to a public matter.[cite:15][cite:20]

The Air Canada chatbot matter should be the benchmark example for inclusion logic.[cite:15][cite:17][cite:20]

### Phase 2: Search by error pattern, not only by company
Search using combinations like:

- “AI chatbot lawsuit misrepresentation”
- “AI hallucination sanctions filing”
- “AI wrong pricing lawsuit”
- “AI eligibility decision complaint”
- “AI discrimination complaint filed”
- “generative AI fake citations sanctions order”

Search should prioritize the **error artifact** and the **filing artifact** together.

### Phase 3: Verify public record
For every candidate record, try to locate one of:

- The complaint or claim.
- A docket entry.
- A tribunal decision.
- A sanctions order.
- An agency or board order.
- A reliable article that names the proceeding and quotes or links to the public record.[cite:15][cite:20][cite:10]

### Phase 4: Normalize to error-first rows
If multiple articles discuss the same underlying error, consolidate to one `error_id` and attach multiple matter links only if necessary.

### Phase 5: Flag edge cases
Maintain a review queue for borderline entries such as:

- AI was involved but the public filing does not clearly identify the exact error.
- The matter is public but only secondary reporting is available.
- Multiple errors are alleged in one complaint and may require splitting into multiple `error_id` rows.

## Evidence hierarchy
Use the strongest available source in this order:[cite:15][cite:20][cite:10]

1. Public filing, order, docket, tribunal record, or agency page.
2. Official statement by court, tribunal, regulator, or organization.
3. Reliable legal reporting or established news coverage quoting the filing.
4. Commentary or blog analysis that clearly cites the underlying record.

Never rely on commentary alone if a public record can be found.

## Quality control rules

- Every included row must be traceable to a public legal matter or a reliable source identifying one.[cite:10][cite:15]
- Every row must describe the error in a way that can stand alone without reading the case.[cite:15][cite:20]
- If the only thing discoverable is “AI was involved,” the record is not ready for inclusion.
- Resolution fields should be minimal; effort should be spent on reconstructing the **error, reliance, mitigation gap, and filing path**.[cite:15][cite:20]
- If one lawsuit alleges several distinct AI errors, split into multiple rows if the errors are independently describable.

## Known source families to search first

- AI Incident Database for incident-first discovery and cross-references.[cite:15]
- Running AI lawsuit trackers for filed-matter discovery, while filtering aggressively for error-first cases.[cite:10]
- Court and tribunal websites for direct public records.
- Law firm blogs and legal commentary that summarize cases and often cite docket details, such as commentary on Moffatt v. Air Canada.[cite:20]

## Deliverable expectation
Produce two outputs:

1. A **research memo** summarizing the methodology, scope rules, and any major ambiguities.
2. A **structured error log** where the primary key is the **error event**, not the legal matter.[cite:15][cite:20]

## Open questions requiring user clarification
Before scaling the dataset, confirm the following:

1. Should public **sanctions orders and attorney-discipline matters** based on AI hallucinations in court filings be included, even when there is no separate civil plaintiff and the legal matter arises inside an existing case?[cite:10]
2. Should **regulatory complaints and agency enforcement actions** count on the same footing as lawsuits and tribunal filings, or should they be tagged separately?
3. Should the scope include only **externally facing AI errors** affecting customers or third parties, or also internal-use AI errors that later surfaced in public proceedings?
4. Is the preferred output ultimately a **GitHub-maintained markdown/CSV dataset**, an **Excel workbook**, or both?

## Immediate next action for the executing system
Do not begin broad harvesting until the user answers the scope questions above. Once clarified, build an initial seed set of 10–20 records using the inclusion criteria, with Air Canada as the reference case.[cite:15][cite:17][cite:20]
