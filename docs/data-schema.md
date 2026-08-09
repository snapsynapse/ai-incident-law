# Data Schema

## Overview

The canonical dataset lives in [data/data.json](/Users/snap/Git/ai-incident-law/data/data.json).

Top-level structure:

```json
{
  "generated_at": "YYYY-MM-DD",
  "datasets": {
    "included": { "label": "...", "description": "...", "records": [] },
    "review": { "label": "...", "description": "...", "records": [] },
    "global": { "label": "...", "description": "...", "records": [] }
  }
}
```

## Dataset buckets

### `included`

Normalized records intended for the public site.

Typical characteristics:

- stable identifier
- public matter title
- sourceable public record or strong official source
- summarized incident or failure description and harm

### `review`

Candidate records that may be in scope but still need verification or primary-source strengthening.

Typical characteristics:

- candidate identifier
- review rationale
- next verification step
- best available sources rather than a settled public record

### `global`

Candidates outside the main normalized set, often because they need translation, jurisdiction-specific interpretation, or more source work.

Typical characteristics:

- region or country field present
- translation status or source language metadata
- event-grain or legal-basis notes

## Common fields

These appear primarily on `included` records and are the main fields rendered by the UI.

| Field | Meaning |
|---|---|
| `error_id` | Stable identifier for a published record |
| `error_title` | Short public title for the record |
| `ai_system_name` | Named system, model, workflow, or automation involved |
| `deployer` | Organization or actor using or filing with the system |
| `domain` | High-level subject area such as housing, employment, or legal services |
| `error_type` | Error category such as hallucinated authority or discriminatory output |
| `error_description` | Summary of what happened |
| `public_matter_type` | Lawsuit, sanctions order, regulatory enforcement, tribunal claim, and similar |
| `public_matter_name` | Public caption or matter name |
| `filing_status` | Outcome or procedural posture |
| `jurisdiction` | Court, tribunal, agency, or authority |
| `filing_date` | Public matter filing or order date when relevant |
| `error_date` | Date or period when the underlying error occurred |
| `public_record_link` | Preferred primary public source |
| `secondary_source_links` | Additional supporting sources |
| `canonical_source_conflicted` | Ground truth or authority the system conflicted with |
| `mitigation_gap` | Why safeguards failed |
| `reliance_or_harm` | Reliance, damage, or downstream consequence |
| `notes_on_resolution` | Resolution summary |
| `tags` | Short descriptors used for search and grouping |
| `source_quality` | Quality label for the current sourcing state |
| `research_status` | Internal status such as included |
| `last_verified_date` | Last date the record was verified |
| `needs_review` | `yes` or `no` flag used by filters |
| `obligation_first_anchors` | Optional array or semicolon-delimited list of EveryAILaw Obligation-First IRIs interpreted or applied by the matter's Determination |
| `legal_graph` | Curated procedural projection used when display-oriented matter fields are not precise enough to generate truthful Obligation-First records |

## Candidate-oriented fields

These appear mainly on `review` and `global` records.

| Field | Meaning |
|---|---|
| `candidate_id` | Identifier for a non-finalized candidate |
| `candidate_title` | Working title for a candidate |
| `candidate_matter` | Working public matter description |
| `reason_for_review` | Why the record remains in a queue |
| `next_verification_step` | Most useful next action for maintainers |
| `best_available_sources` | Best sources currently available when a primary record is not yet settled |
| `last_checked_date` | Last date the candidate was checked |
| `event_grain` | How specifically the event has been scoped so far |
| `legal_basis` | Legal doctrine, statute, or rights framing under consideration |
| `region` | Regional grouping for non-US/global items |
| `country` | Country value where already normalized |
| `source_language` | Source language for untranslated materials |
| `translation_status` | Translation completeness or confidence |
| `authority_type` | Court, agency, regulator, press, or similar source authority label |

## Required versus expected

There is intentionally no strict full-schema validator yet. Current practice is:

- `included` records should have stable IDs, titles, public matter context, a usable source, and enough summary fields to render clearly in the app
- `review` and `global` records should have enough metadata to justify continued inclusion in the queue and make the next verification step obvious
- URL-bearing fields must use `https://` bare domains after normalization
- `public_record_link` must contain exactly one primary source URL
- `secondary_source_links` and `best_available_sources` must contain semicolon-delimited URL lists
- URL fields must not include appended prose, empty list entries, protocol-relative URLs, non-HTTP schemes, credentials, backslashes, encoded backslashes, embedded whitespace, control characters, or unsafe raw delimiters

## Obligation-First export

Included records are exported under `/api/v1/of/` as Obligation-First v0.6 records:

- each simple jurisdiction becomes an `of:Authority` unless a curated `legal_graph` projection declares the actual bodies
- each included matter becomes an `of:Proceeding`
- each included matter becomes one `of:Allegation` describing the AI-related failure asserted in the public record
- included matters with settled, ordered, sanctioned, resolved, or dismissed postures also become `of:Determination` records
- records with `obligation_first_anchors` pass those IRIs through to `of:Determination.anchors`
- retired published graph identifiers remain queryable as `of:Tombstone` records

Filed and pending included records are exported without `of:Determination` records until a source establishes an adjudicative act. `review` and `global` records are not exported because they are editorial queues rather than admitted public matters.

### Curated legal graph projection

`legal_graph` is an asserted source projection, not an inference cache. Use it whenever one editorial matter spans multiple bodies or procedural stages, when the display status cannot establish a Determination, or when a published graph identifier must be retired.

Supported arrays:

- `authorities`: distinct organizations with stable `id`, `name`, and optional territorial, institutional, and `same_as` crosswalks
- `proceedings`: stable proceeding IDs with `heard_by`, optional stage-specific title and filing date, `determination_ids`, and `procedural_stage`
- `determinations`: stable determination IDs with `issued_by`, `disposition`, and optional `issued_date`
- `retired_identifiers`: the original path kind, stable ID, `former_type`, and reviewed retirement reason used to emit a Tombstone at the retired IRI

When `determinations` is present, including as an empty array, it is authoritative. A filed complaint uses `"determinations": []`; the generator must not derive a `partial` disposition from the display status. Authority names must identify one organization and may not use semicolons to combine courts, agencies, or procedural history.

Example:

```json
"obligation_first_anchors": [
  "https://everyailaw.com/obligation-category/bias-prevention.json"
]
```

Use an EveryAILaw `of:ObligationCategory` IRI when the evidence identifies a broad concept such as human oversight, transparency, or bias prevention. Use a concrete `of:Obligation` IRI only when the public matter can be tied to the specific statutory or regulatory Term that creates it. This keeps category-level interpretation distinct from claims that a particular legal duty was applied.

Anchor selection policy: add anchors only when the public record supports the relationship with high confidence. Select a concrete Obligation for a specific statutory nexus and an ObligationCategory for a broader duty concept. Do not anchor generic litigation-process duties or weak topical similarity. Current evals require valid EveryAILaw Obligation or ObligationCategory IRIs, reject legacy category-shaped Obligation paths, and reject anchors on filed or pending matters that do not generate Determinations.

## Editing rules

- Edit [data/data.json](/Users/snap/Git/ai-incident-law/data/data.json), not [data.js](/Users/snap/Git/ai-incident-law/data.js)
- Run `npm run build` after changes
- Run `npm run validate:of` when an Obligation-First checkout is available beside this repo or via `OBLIGATION_FIRST_DIR`
- Keep identifiers stable once published
- Prefer source improvement over field proliferation
- Add new fields sparingly and document them here when they become part of normal maintenance
