---
title: "AI Incident Law INTENT"
version: "0.1.0"
last_updated: 2026-04-26
status: working-hypothesis
description: "Standards-level strategy for the AI Incident Law dataset and reference site. Subscribes to portfolio-level working hypotheses. Defines stewardship principles, record admission criteria, refresh cadence, and contribution norms."
tags: [intent, strategy, ai-incident-law, regulation, standards]
---

# AI Incident Law INTENT

Strategy for the AI Incident Law dataset and the aiincidentlaw.com canonical home. Scoped to the curated incident corpus, the static reference site, and surrounding maintainer tooling. Subscribes to portfolio-level working hypotheses (see https://github.com/snapsynapse/paice-foundation/blob/main/INTENT.md).

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
- Own the canonical URL (aiincidentlaw.com) and its infrastructure

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

- 0.1.0 (2026-04-26): Initial INTENT. Codifies Regulation-vector positioning alongside EveryAILaw and PubLedge, public-record-only stewardship principle, admission criteria, refresh cadence, and steward responsibilities.
