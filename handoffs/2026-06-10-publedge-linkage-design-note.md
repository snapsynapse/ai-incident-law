# Design note: PubLedge linkage for AI Incident Law records

Date: 2026-06-10
Author: Claude (Sonnet 4.6), Legal Graph integration session
Status: Design only -- do not build until PubLedge direction is set
Audience: future agent or steward, when PubLedge moves from spec to runtime

## Context

Each included AI Incident Law record rests on at least one public-record source -- a court
filing, a tribunal opinion, an agency order. Today those sources are referenced by URL
(`public_record_link`, `secondary_source_links`). The URL is what we have; it is also what
we lose when:

- A court website restructures URLs (frequent).
- An agency takes a document offline (occasional, sometimes politically motivated).
- A docket gets sealed or restricted.
- A jurisdiction migrates to a new e-filing system.

PubLedge, the third layer of the PAICE legal graph, exists to make public records
verifiable and durable: a protocol for civic recordkeeping such that the original
document, its hash, and its publication metadata can be re-asserted independently of any
single hosting party. When PubLedge is runtime-ready, AI Incident Law should be one of its
first consumers, because the link rot problem is acute here.

## Proposed linkage

Augment AI Incident Law record schema with an optional `pubLedge_attestations` array:

```json
{
  "error_id": "AIEL-2026-038",
  "public_record_link": "https://damiencharlotin.com/documents/1931/Rivera_v._Triad_USA_31_March_2026.pdf",
  "pubLedge_attestations": [
    {
      "url": "https://damiencharlotin.com/documents/1931/Rivera_v._Triad_USA_31_March_2026.pdf",
      "attestation": "https://publedge.org/attestation/{attestation-id}",
      "hash": "sha256:...",
      "captured": "2026-06-10T00:00:00Z",
      "captured_by": "https://aiincidentlaw.org/"
    }
  ]
}
```

Each attestation pins a specific URL to a content hash and a PubLedge attestation record.
Subsequent verification can confirm the document at the URL still matches the hash, or --
if the URL has gone dark -- the PubLedge attestation includes pointers to mirror copies
under the PubLedge protocol's preservation rules.

The field is optional and additive. Records without attestations still work; records with
them are stronger.

## Why two-step rather than one-step

PubLedge attestations are not a replacement for the source URL. They are a parallel
durability layer:

- The `public_record_link` keeps the legal pedigree (the source is the source).
- The `pubLedge_attestations` provide independent verification when the source URL fails.

A consumer agent can show the source URL first, fall back to PubLedge mirrors when the
URL is dead, and assert chain of custody via the hash. This matches how civic
recordkeeping has historically worked (original deposit + secondary archive), updated for
internet-scale documents.

## Generation strategy

Phase 1 (do later): manual attestation. The steward, when adding a high-value record,
posts the document to PubLedge and records the attestation ID in the AI Incident Law
record. Operationally lightweight; works for the highest-stakes 10-20% of records.

Phase 2 (after PubLedge ships its publisher SDK): automated. A build-time script reads
every `public_record_link`, posts the document to PubLedge, records the attestation. Same
record-level schema, but coverage approaches 100%.

Both phases use the same record schema. No flag day; phase 2 simply backfills.

## Open questions for the PubLedge steward

These need answers before this can be built:

1. **Attestation IRI format.** Does PubLedge issue stable URLs like
   `https://publedge.org/attestation/{id}`, or content-addressed
   IDs like `publedge://sha256/{hash}`? The schema above assumes URL.

2. **Capture provenance.** Does PubLedge record who captured an attestation? If yes,
   the `captured_by` field should resolve to the publishing agent's DID or domain.

3. **Mirror policy.** When the source URL goes dark, does PubLedge serve the cached
   document directly, or only attest that it once existed at a given hash? The answer
   shapes whether AI Incident Law's record stays useful when the source dies.

4. **Cost / rate limits.** Per-document attestation cost? If non-zero, only the
   `included` bucket gets attestations; review and global stay URL-only.

5. **Backwards compatibility.** Does the schema field name need to be reserved now even
   if we do not fill it, to avoid a flag day later? Recommendation: yes -- reserve
   `pubLedge_attestations` as an optional empty array in the data-schema doc now.

## Recommended next step (after PubLedge ships)

1. Reserve the `pubLedge_attestations` field in the AI Incident Law data schema with an
   "optional, empty array allowed" note. Schema docs only; no records change.
2. Add a PubLedge attestation to one high-value record manually (recommend
   AIEL-2023-002 *Mata v. Avianca* -- the genesis hallucinated-authority matter,
   already extensively cited).
3. Verify the attestation resolves, the hash matches, and the read path works.
4. Document the manual process in a handoff for future contributors.
5. Defer Phase 2 (automated attestation) until PubLedge ships a publisher SDK.

## Why this is design-only today

PubLedge is at spec stage. The protocol is real; the runtime is not. Building this now
would couple AI Incident Law to an interface that may change. The right move is to
reserve the schema field, write the design (this note), and wait for PubLedge to ship
its first publisher tooling.

## Related

- PubLedge: https://publedge.org/
- Legal Graph narrative: https://aiincidentlaw.org/docs/legal-graph.html
- Schema docs: https://github.com/snapsynapse/ai-incident-law/blob/main/docs/data-schema.md
