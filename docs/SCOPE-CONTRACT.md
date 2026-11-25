# Scope inventory and continuity

Scope: ai-incident-law adopter-owned recognition and coverage declarations. F11 scope evaluator integration, 2026-09-05. Shared evaluator: [Obligation-First scope contract v1](https://github.com/snapsynapse/obligation-first/blob/main/reference/contracts/scope-contract-v1.md).

## Owning evidence

`tests/fixtures/of-scope-inventory.json` declares the current inventory version, 1.2.0, and this adopter's owner, exact territorial/institutional identities, source pointers, extensions and any coverage statements. `tests/fixtures/of-scope-baseline.json` preserves exact projected record/path/value tuples and pins the inventory digest. The initial inventory, 1.0.0, was reviewed against the accepted P1 source projection, not newly certified legal geography or a fresh audit of each source record.

The initial inventory retains territorial scope and source forum/institution names independently. British Columbia remains `ca-bc` with parent `ca`; the parent is recognition metadata, never a rewrite rule. Coverage remains unspecified, therefore unknown. Curated versus inferred procedural meaning remains F15.

### Inventory 1.1.0, 2026-09-22

Adding the promoted record AIEL-2026-069 (In re Brian E. Mitchell, USPTO Proceeding No.
D2026-16) introduced one institutional identity the inventory did not carry, `U.S. Patent
and Trademark Office`, evidenced by the retained final order under
`data/admission/raw/aiel-2026-069/`. The reviewed baseline diff is additive: ten claims
added, none removed and none changed, all of them belonging to that record's Proceeding and
Determination and to the Authority derived from its jurisdiction. Territorial scope resolves
to `us` through the existing federal-body rule; no territorial identity was added. Coverage
remains unspecified, therefore unknown.

### Inventory 1.2.0, 2026-09-22

Adding AIEL-2026-071, AIEL-2026-072 and AIEL-2026-073 introduced three institutional
identities, `District of Columbia Court of Appeals`, `U.S. District Court, District of Utah`
and `U.S. District Court, Central District of Illinois`, and the `us-dc` territorial
identity, which `jurisdictionRef` now maps for District of Columbia matters. The reviewed
baseline diff is additive: 36 claims added, none removed and none changed. Coverage remains
unspecified, therefore unknown.

## Checks and maintenance

The existing `check:of-fingerprint` wrapper runs the scope companion before checking or rewriting fingerprint v2. Existing fingerprint baselines and generated exports remain unchanged. Federation also requires all three inventories and baselines, compares known kind/parent declarations, and retains the existing source-rebuild, graph, JSON-LD, correspondence and edge/provenance gates.

New source vocabulary needs a reviewed entry with evidence. Changes to existing inventory semantics require an inventory-version change and review of the baseline diff. The initial-capture writer refuses to overwrite an existing baseline. A normal build or checker must never regenerate expected values to accept itself. Source spelling and scope specificity are preserved exactly; unknown evidence is not agreement, zero or legal inapplicability.

## Delivery and remaining work

Canonical CI checks out the Obligation-First checker at the commit pinned in `.github/workflows/validate.yml`; that file is the authority for the current pin. The repository checks do not change the published MCP runtime or package version. Missing OF follows the existing optional local-check policy; canonical CI requires `CHECK_OF_REQUIRED=1`.

At the 2026-09-05 integration, the coordinated release state was recorded in [Obligation-First's delivery evidence](https://github.com/snapsynapse/obligation-first/blob/main/reference/release-preparation-v0.6.4.json). A compatible pin is static wiring evidence; hosted acceptance additionally requires the actual workflow and deployment results for the accepted repository revisions.

Qualified temporal meaning, broader evidence policy, nested provenance, traversal enrichment and unrelated publication work remain queued separately.
