---
title: "AI Incident Law INTENT"
version: "0.1.0"
last_updated: 2026-04-26
status: working-hypothesis
description: "Standards-level strategy for the AI Incident Law dataset and reference site. Subscribes to portfolio-level working hypotheses. Defines stewardship principles, record admission criteria, refresh cadence, and contribution norms."
tags: [intent, strategy, ai-incident-law, regulation, standards]
---

# AI Incident Law INTENT

Strategy for the AI Incident Law dataset and the aiincidentlaw.org canonical home. Scoped to the curated incident corpus, the static reference site, and surrounding maintainer tooling. Subscribes to portfolio-level working hypotheses (see https://github.com/snapsynapse/paice-foundation/blob/main/INTENT.md).

## Purpose

AI Incident Law is the curated public-record corpus of legal and regulatory matters involving AI-related incidents. It complements EveryAILaw (which tracks AI-specific laws and the obligations they create) and PubLedge (which provides civic recordkeeping protocols and template libraries) within the Regulation vector of the PAICE Portfolio.

The three components serve distinct audiences in the same vector:

- EveryAILaw: compliance teams, GRC, CISOs, CAIOs, in-house legal — what laws apply and what obligations they create.
- AI Incident Law: litigators, regulators, journalists, researchers — what has actually gone wrong, where, and what enforcement or litigation followed.
- PubLedge: state and local jurisdictions, civic technologists — protocol and templates for transparent civic recordkeeping.

Position within portfolio: AI Incident Law is the case-and-enforcement evidence layer that makes EveryAILaw's obligations concrete and PubLedge's recordkeeping templates useful. It is the portfolio's answer to "show me what has actually happened."

## Stewardship principles

1. Public record only. Every included record resolves to a primary or stable secondary public source. No private filings, no leaked material, no anonymous tips.
2. Source quality over record count. A small corpus of well-sourced records beats a large corpus of weak ones. Volume is not the goal.
3. Portable by default. The site has no runtime dependencies, no analytics, no persistent browser storage. Anyone can host a copy, fork the dataset, or reuse records under CC BY 4.0.
4. Time-stamped freshness. The dataset's `generated_at` field is displayed publicly. Records carry their own dates. Decay is visible.
5. Inclusion is reviewable. Every included record can be challenged, corrected, or moved to review or removed via PR.

## Record admission criteria

A candidate record is admitted to `included` when all of the following hold:

1. There is a public legal or regulatory matter directly involving AI-related conduct, output, or use.
2. The matter has at least one primary or reliable secondary public source.
3. The matter has resolved to one of: filed proceeding, regulatory action, settlement, judgment, consent decree, or formal investigation disclosure. Press coverage alone is not sufficient.
4. The record fields required for publication (jurisdiction, parties, AI-relevance, source URLs, date) are present and consistent.

Candidates failing any of the above stay in `review` until upgraded or in `global` if the jurisdiction is non-US and additional sourcing or translation is needed.

### Outcome valence is not an admission criterion

Decided 2026-08-19.

A matter is admitted on the strength of the established AI-attributable defect, not on the severity of what the tribunal did about it. A ruling that declines to sanction, declines to exclude, or excuses the conduct is admitted on the same terms as one imposing a penalty, and records what happened in `filing_status` and `reliance_or_harm` like any other record.

Two reasons this is the right line:

- The corpus is the portfolio's evidence layer for what has actually happened when AI systems fail. A corpus that admits only adverse outcomes systematically overstates the legal risk of AI use, because the cases where a tribunal looked at the same conduct and declined to penalize it are missing from the denominator. That makes the obligations EveryAILaw tracks look more settled than they are, which is a defect in the evidence layer itself, not merely a coverage gap.
- The corpus already works this way at the low end of the severity scale. `warned` and `admonished` are existing `filing_status` values, and AIEL-2026-057 is a GAO warning carrying no penalty at all. Admitting non-adverse outcomes continues an existing gradient rather than opening a new category.

The bound that keeps this from becoming unbounded: **an AI-attributable defect must be established in the primary source to the same standard criterion 1 requires for AI use itself.** A hallucinated citation, fabricated exhibit, or false output must actually have occurred and be attributable to AI in the record's own voice. Where the only established fact is that AI was used and no defect was found, there is no incident and the matter is not admitted. An allegation that failed is not a harm event, and admitting such matters would make the corpus unbounded as AI use normalizes.

Worked application of the rule:

- **Admitted**: In re Bard Implanted Port Catheter Products Liability Litigation (D. Ariz.). Hallucinated citations were present in the expert report; the court found the expert's explanation adequate and denied the motion to exclude. The defect is established, so the non-exclusion is the record's outcome, not a reason to withhold the record.
- **Not admitted**: Mullins v. Duquesne (W.D. Pa.). The court found the brief contained neither inaccurate, false, nor non-existent citations. Disclosed use of Claude plus an allegation that did not survive scrutiny is not an incident. The matter is retained in `review` as a citable limiting precedent and documented in `docs/methodology.html`; it is not expected to be promoted.

This decision is distinct from the question of matters where **AI use itself** is not established, which is settled separately below.

### Undetermined AI attribution

Decided 2026-08-19. This refines criterion 1.

Courts increasingly notice that a fabrication bears the hallmarks of AI while expressly declining to determine whether AI produced it, because attribution is unnecessary to the holding — fabricated authority is sanctionable either way. If the corpus required an affirmative AI finding, it would progressively blind itself to the most common judicial posture toward AI attribution precisely as that posture becomes dominant.

Criterion 1 is therefore satisfied when **the primary source itself discusses AI in connection with the defect**, whether as a finding, an observation of hallmarks, a hedged surmise, or a party explanation the tribunal recounts without rejecting. Two conditions bound this:

1. **The AI discussion must be in the primary source.** A third party's inference — a tracker tag, a news report, the corpus's own reading — is never a substitute. Where the source is silent on AI, there is no record to admit, however strong the fabricated-citation salience.
2. **AI must remain a live, undisplaced explanation.** Where the primary source establishes a **non-AI mechanism** for the defect, the matter is not an AI incident even if the tribunal also noted AI hallmarks. Deliberate human fabrication that merely resembles AI output is ordinary litigation misconduct and belongs elsewhere.

Records admitted on undetermined attribution carry the qualifier `(raised in the record; attribution not determined)` in `ai_system_name`, the tag `attribution-not-determined`, a `confidence_score` no higher than `medium`, and the tribunal's exact words quoted in `notes_on_resolution`. Their `error_description` and `reliance_or_harm` state the fabrication as the defect and must **not** assert that AI caused it.

Worked application of the rule:

- **Admitted**: Fuselier v. Riscassi (S.D. Miss.). Ordered to disclose his AI use, counsel explained that he had turned to Google web search and could not confirm the fictitious citation's source, saying he was "not certain it came from the AI preview" but that "it may have appeared there." The court recounted that account, admonished and warned him, and imposed no sanction. AI is raised in the record and remains undisplaced.
- **Not admitted, competing mechanism**: Maxwell v. Michael (S.D. Ind.). The court agreed the fabricated authority "contains the hallmarks of generative AI hallucinations," but held that "[w]hether or not Plaintiff used AI, his conduct remains sanctionable, as it represents a deliberate intent to fabricate," and recorded the litigant's own account that he composed the fake citations himself. Deliberate human fabrication is the operative finding; the AI hallmarks are displaced by it.
- **Not admitted, source silent**: H. C. v. Contreras (Cal. Ct. App.). A trial court copied a fictitious citation from counsel's brief into its ruling and was reversed. The opinion never mentions AI. The only AI link is a third party's inference, which criterion 1 does not accept.

Matters awaiting sourcing rather than a policy call under this rule include AIEL-CAND-028 and AIEL-GLOB-018, where the tribunal's own AI language is established but no citable original has been reachable.

Out of scope: speculative AI-risk commentary, AI ethics statements without legal or regulatory action attached, internal corporate disputes that have not surfaced publicly, and reputational controversy that has not produced a filing or formal action.

## Refresh cadence and gates

The corpus is curated, not crawled. Refresh is editorial, not automated.

- Continuous: any contributor may submit a record via PR at any time.
- Scheduled review: dataset is reviewed for source decay and coverage gaps quarterly.
- Recalibration: admission criteria are reviewed annually against accumulated edge cases.
- Major version bump: when admission criteria change in a backward-incompatible way (e.g., narrowing what counts as AI-related), the dataset version bumps a minor version and the change is documented in CHANGELOG.

## Contribution norms

External contributions are welcome under the MIT (code) / CC BY 4.0 (data) split.

Record submissions require:

- The candidate record in canonical JSON shape (see docs/data-schema.md)
- Public source URLs that pass the validator
- A short rationale for inclusion, including which admission criterion the record satisfies

Steward reviews submissions against this INTENT, the schema docs, and the admission criteria. Submissions that miss criteria stay in `review` with a note rather than being rejected outright.

Contributions from outside the current steward's product line are explicitly welcome. The dataset does not favor any particular legal or compliance product.

## Relationship to other components

- EveryAILaw (https://everyailaw.com/): tracks the laws and obligations. AI Incident Law tracks the cases and enforcement that interpret them. Cross-references where a record turns on a specific law.
- PubLedge (https://publedge.org/): provides the civic recordkeeping protocol. AI Incident Law records may be referenced by PubLedge implementations (e.g., a Utah JIA template that cites a relevant enforcement action).
- AI Posture (https://aiposture.org/): the unified governance framework. AI Incident Law records serve as evidence in Regulation-vector posture assertions where a specific incident applies to an organization's exposure.

## Governance

Stewarded by PAICE.work PBC. Transition to an independent steward (PAICE Foundation) is planned but not timed. See portfolio INTENT for transition logic.

Steward responsibilities:

- Maintain the canonical dataset and schema docs
- Triage record submissions against admission and refresh criteria
- Publish material changes transparently (CHANGELOG, ROADMAP)
- Own the canonical URL (aiincidentlaw.org) and its infrastructure

Non-responsibilities:

- Not legal advice
- Not a complete or exhaustive corpus
- Not a verdict or judgment about parties named in records
- Not a compliance product. Compliance frameworks live in EveryAILaw and downstream PAICE products.

## Status

Subscribes to: Measurement Authority, Calibration Compounding (both from the portfolio INTENT).

Current tier: working hypothesis.

Last review: 2026-04-26.

Next scheduled review: 2026-07-31 (Q3 start) or after first major scope challenge requiring criterion revision, whichever comes first.

## Related docs

- README.md: site mechanics and maintainer workflow
- ROADMAP.md: near-term curation and maintenance priorities
- docs/data-schema.md: dataset structure and field intent
- CONTRIBUTING.md: edit and review flow

## Changelog

- 0.3.0 (2026-08-19): Adds the undetermined-attribution rule refining criterion 1. AI need not be affirmatively found; it is enough that the primary source itself discusses AI in connection with the defect, bounded by requiring the discussion to be in the source rather than inferred by a third party, and by excluding matters where the source establishes a competing non-AI mechanism. Admitted records carry an explicit attribution qualifier, tag, and confidence cap. Widening, so no dataset version bump is required.
- 0.2.0 (2026-08-19): Adds the outcome-valence rule to record admission criteria. A matter is admitted on the established AI-attributable defect, not on the severity of the consequence, so rulings that decline to sanction or exclude are admissible; matters where AI was used but no defect was found are not. Bounded by requiring the defect to be established in the primary source to the same standard as AI use itself. Widening rather than narrowing, so no dataset version bump is required under the recalibration gate below.
- 0.1.0 (2026-04-26): Initial INTENT. Codifies Regulation-vector positioning alongside EveryAILaw and PubLedge, public-record-only stewardship principle, admission criteria, refresh cadence, and steward responsibilities.
