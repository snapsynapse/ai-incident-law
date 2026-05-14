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
| `obligation_first_anchors` | Optional array or semicolon-delimited list of Obligation-First `of:Obligation` IRIs interpreted or applied by the matter's Determination |

## Required versus expected

There is intentionally no strict full-schema validator yet. Current practice is:

- `included` records should have stable IDs, titles, public matter context, a usable source, and enough summary fields to render clearly in the app
- `review` and `global` records should have enough metadata to justify continued inclusion in the queue and make the next verification step obvious
- URL-bearing fields must use `https://` bare domains after normalization

## Obligation-First export

Included records are exported under `/api/v1/of/` as Obligation-First v0.1 records:

- each distinct jurisdiction string becomes an `of:Authority`
- each included matter becomes an `of:Proceeding`
- each included matter becomes one `of:Allegation` describing the AI-related failure asserted in the public record
- included matters with settled, ordered, sanctioned, resolved, or dismissed postures also become `of:Determination` records
- records with `obligation_first_anchors` pass those IRIs through to `of:Determination.anchors`

Pending included records are exported without `of:Determination` records until the source record has a resolving posture. `review` and `global` records are not exported because they are editorial queues rather than admitted public matters.

Example:

```json
"obligation_first_anchors": [
  "https://everyailaw.com/obligation/bias-prevention.json"
]
```

Anchor selection policy: add anchors only when the matter's public record applies or interprets a specific Obligation-First obligation with high confidence. Do not anchor generic litigation-process duties or weak topical similarity. Current evals require EveryAILaw `of:Obligation` IRIs and reject anchors on pending matters that do not generate Determinations.

## Editing rules

- Edit [data/data.json](/Users/snap/Git/ai-incident-law/data/data.json), not [data.js](/Users/snap/Git/ai-incident-law/data.js)
- Run `npm run build` after changes
- Run `npm run validate:of` when an Obligation-First checkout is available beside this repo or via `OBLIGATION_FIRST_DIR`
- Keep identifiers stable once published
- Prefer source improvement over field proliferation
- Add new fields sparingly and document them here when they become part of normal maintenance
