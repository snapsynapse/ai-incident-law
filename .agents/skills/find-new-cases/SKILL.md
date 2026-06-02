---
name: find-new-cases
description: |
  Discover and triage new public legal or regulatory matters involving AI-related
  incidents for the AI Incident Law corpus. Use this skill whenever the user says
  "find new cases", "any new AI incidents", "scan for new cases", "look for new
  filings", "/find-new-cases", or describes wanting a sweep of recent litigation,
  sanctions orders, or enforcement actions involving AI getting something wrong.
  Queries primary-source channels (CourtListener, Damien Charlotin's hallucination
  database) first, falls back to Perplexity for everything else, dedupes against
  the existing corpus, applies the repo's admission criteria from INTENT.md, and
  either drafts records into data/data.json or returns a ranked candidate list.
  Does not auto-commit.
metadata:
  skill_bundle: find-new-cases
  file_role: skill
  version: 2
  version_date: 2026-05-26
  author: Snap Synapse (snapsynapse.com)
  repo: https://github.com/snapsynapse/ai-incident-law
---

# find-new-cases

Structured pipeline for surfacing new candidate records for the AI Incident Law dataset. Primary-source channels first; Perplexity only as fallback for categories that lack a dedicated tracker. Models the publedge-source-ingest discovery flow, the every-ai-law add-regulation triage pattern, and the litigation-legal docket-watcher "scan-and-report" pattern, narrowed to this repo's scope.

## Position in the workflow

```
find-new-cases   ← you are here (proposes candidates, drafts review/global rows)
    ↓
human triage     ← you decide which candidates earn `included` status
    ↓
npm run build    ← regenerates data.js + /api/v1/of/ exports
    ↓
git commit + PR  ← hand off
```

This skill does NOT:
- Promote candidates from `review` → `included` (requires human judgment against admission criteria).
- Write Obligation-First exports directly (the build script handles that for `included` rows).
- Commit, push, or open PRs.
- Cross the public-record line (no press-only sourcing; no anonymous tips; no leaked material).

## Prerequisites

- `PERPLEXITY_API_KEY` readable from `~/.claude/settings.json` (Perplexity fallback only).
- `python3` available (used for all HTTP calls — see "Why python, not curl" below).
- Working tree clean or on a dedicated branch.
- Read [INTENT.md](../../../INTENT.md) "Record admission criteria" and "Stewardship principles" sections.

## Why python, not curl

macOS `curl 8.7.1` has an HTTP/2 framing bug that randomly returns exit 16 against api.perplexity.ai. The `--http1.1` flag helps but doesn't eliminate exit 52 (empty reply) on consecutive POSTs. Shell quoting of long prompt strings through `jq -n --arg` is also fragile and silently produces 0-byte request bodies when backgrounded. Python `urllib.request` sidesteps all three problems and runs the same everywhere. Use it.

## Scope reminder (from INTENT.md)

In scope: filed proceedings, regulatory actions, settlements, judgments, consent decrees, formal investigation disclosures — all involving AI-related conduct, output, or use, with at least one primary or reliable secondary public source.

Out of scope: speculative AI-risk commentary, ethics statements without legal action, internal corporate disputes not surfaced publicly, reputational controversy without filing.

## Pipeline

Eight phases. Phase 0–2 prepare. Phase 3a–3c discover. Phase 4–7 triage and hand off.

---

### Phase 0 — Intake

Run `git status -s` first. If unrelated files are staged, surface that in one line and ask whether to proceed.

Ask the user up to three questions, only if not already answered in the prompt:

1. **Time window?** Default: gap since the highest `last_checked_date` / `last_verified_date` in `data/data.json`. Override examples: "last 90 days", "since 2026-01-01".
2. **Which categories?** Multi-select. Defaults to corpus strengths:
   - AI-hallucinated legal citations / sanctions orders
   - Algorithmic-denial systems (healthcare, housing, welfare, hiring)
   - Facial-recognition false-arrest litigation
   - Chatbot misstatement / consumer-facing AI liability
   - Algorithmic pricing / collusion enforcement
   - New categories (deepfake civil suits, generative-AI defamation, AV wrongful death, AI companion harm)
3. **Output mode?**
   - `ranked-list` — markdown table only, no file writes. Default for exploratory runs.
   - `draft-review` — write JSON rows into `data/data.json` `review` (US) or `global` (non-US) buckets.
   - `draft-included` — only with explicit per-candidate user confirmation against all four admission gates.

**Window-widening rule (auto-applied, no user prompt).** Court filings, sanctions orders, and agency actions have an indexing lag of 7–21 days before they reliably appear in Perplexity, CourtListener RECAP, or third-party trackers. If the user's window is < 14 days, expand to **last 30 days** for the actual search and explicitly note in the Phase 7 summary: "User requested {original window}; widened to {actual window} due to public-index lag. Re-run after {window+14 days} to catch anything filed in the original window that hadn't indexed yet."

### Phase 1 — Build the dedupe index

Load existing identifiers, titles, matter names, and key party strings from `data/data.json`.

```bash
node -e "
const d=JSON.parse(require('fs').readFileSync('data/data.json','utf8'));
const idx=[];
for (const b of ['included','review','global']) {
  for (const r of d.datasets[b].records) {
    idx.push({
      id: r.error_id || r.candidate_id,
      bucket: b,
      title: r.error_title || r.candidate_title,
      matter: r.public_matter_name || r.candidate_matter || '',
      system: r.ai_system_name || '',
      deployer: r.deployer || ''
    });
  }
}
require('fs').writeFileSync('/tmp/aiel-index.json', JSON.stringify(idx, null, 2));
console.log('indexed', idx.length, 'records');
"
```

Compute next-available IDs. Write this to a `.mjs` file and run it with `node` — do NOT use inline `node -e` with a double-quoted string, because the shell strips backslashes and `\d` silently becomes `d` (this minted `AIEL-CAND-NaN` and then duplicate IDs in a prior run). Use the `[0-9]` character class, not `\d`, and filter with `Number.isFinite`:

```js
// scripts/next-ids.mjs (or /tmp/next-ids.mjs) — run: node /tmp/next-ids.mjs
import fs from 'fs';
const d = JSON.parse(fs.readFileSync('data/data.json', 'utf8'));
const maxIn = (recs, field, re) =>
  Math.max(0, ...recs.map(r => { const m = (r[field] || '').match(re); return m ? +m[1] : null; })
                     .filter(Number.isFinite));
const year = 2026; // pass the real year via args/env; Date.now() is unavailable in some harness contexts
const nextIncluded = maxIn(d.datasets.included.records, 'error_id', new RegExp(`AIEL-${year}-([0-9]+)`)) + 1;
const nextCand = maxIn(d.datasets.review.records, 'candidate_id', /AIEL-CAND-([0-9]+)/) + 1;
const nextGlob = maxIn(d.datasets.global.records, 'candidate_id', /AIEL-GLOB-([0-9]+)/) + 1;
console.log(JSON.stringify({ nextIncluded, nextCand, nextGlob }));
```

After minting, before you write, assert no collisions: the new ID set must be disjoint from every existing `error_id`/`candidate_id`. If `maxIn` returns 0 unexpectedly, your regex is wrong (likely a `\d`-eaten-by-shell bug) — stop and fix, do not write.

### Phase 2 — Plan source coverage per category

This is the routing table. Not every category needs every channel. Pick the highest-signal channel first; only fall back to Perplexity when the specialized tracker doesn't exist.

| Category | Primary channel (Phase 3a) | Secondary channel (Phase 3b) | Perplexity (Phase 3c) |
|---|---|---|---|
| AI-hallucinated citations / sanctions | Damien Charlotin's tracker | CourtListener RECAP keyword search | only if 3a + 3b thin |
| Algorithmic-denial systems | CourtListener RECAP (class actions) | State AG / CFPB / HUD / EEOC pressrooms | yes — secondary commentary often surfaces named defendants |
| Facial-recognition false arrest | CourtListener RECAP (§1983 + FRT) | ACLU litigation tracker | yes |
| Chatbot misstatement / consumer liability | CourtListener RECAP | CanLII for Canadian matters | yes |
| Algorithmic pricing / collusion | DOJ ATR + FTC pressrooms | CourtListener RECAP | yes |
| New categories (deepfake / defamation / AV / AI companion) | NHTSA ODI database (AV only) | CourtListener RECAP | yes — required, no specialized tracker exists yet |

**Cadence reality (from two monthly sweeps).** The hallucination category is the only reliably high-yield monthly channel — Charlotin produces ~50–115 in-window entries per month. The other categories (algorithmic-denial, FRT, chatbot, pricing) returned **no clean new primary-source hits** in either the April or May sweeps: Perplexity surfaced only already-tracked matters or commentary, and broad CourtListener keyword queries were pure noise. So for a **monthly** run, lead with Charlotin and treat the other categories as a quick confirmation pass, not a deep dig. Sweep the non-hallucination categories **quarterly or event-driven** (a news trigger, a known docket) rather than burning Perplexity calls on them every month. Note this framing in the Phase 7 summary so the user knows what was — and wasn't — meaningfully searched.

### Phase 3a — Specialized trackers (primary sources)

Run the channel(s) chosen in Phase 2 for each selected category. Do this before Perplexity.

#### Damien Charlotin hallucinations database

The most complete index of AI-hallucination sanctions. Updated regularly. Fetch the index page and extract entries:

**The index is paginated — you MUST walk pages or you silently miss the window.** The page shows only the newest ~50 rows; anything older lives at `?page=N`. A single fetch of `/hallucinations/` only sees roughly the last ~10 days. Walk `?page=1,2,3,…`, parse each row's `DD Month YYYY` date, and stop once a row predates your window start. (In one run, April entries were on pages 4–5 and a naive single fetch would have returned zero.)

```python
import urllib.request, re, html as H, time
MONTHS = {'January':1,'February':2,'March':3,'April':4,'May':5,'June':6,'July':7,
          'August':8,'September':9,'October':10,'November':11,'December':12}
def parse_date(s):
    m = re.match(r'(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})', s)
    return (int(m.group(3)), MONTHS.get(m.group(2),0), int(m.group(1))) if m else None
def cells(row):
    cs = re.findall(r'<t[dh][^>]*>(.*?)</t[dh]>', row, re.S)
    return [re.sub(r'\s+',' ', H.unescape(re.sub(r'<[^>]+>','',c))).strip() for c in cs]
START = (2026, 4, 1)  # window start (year, month, day)
hits, stop = [], False
for pg in range(1, 12):
    url = f'https://www.damiencharlotin.com/hallucinations/?page={pg}'  # www only; bare 400s
    html_ = urllib.request.urlopen(urllib.request.Request(
        url, headers={'User-Agent': 'Mozilla/5.0 find-new-cases/4.0'}), timeout=30
        ).read().decode('utf-8', errors='replace')
    for row in re.findall(r'<tr[^>]*>(.*?)</tr>', html_, re.S)[1:]:
        c = cells(row)
        d = parse_date(c[2]) if len(c) > 2 else None
        if not d: continue
        if d >= START: hits.append(c)        # cols: Case, Court, Date, Party-Using-AI, AI-Tool, Nature, Outcome, Penalty, ...
        elif d[:2] < START[:2]: stop = True   # passed the window start
    time.sleep(1)
    if stop: break
# document PDFs: href="/documents/<n>/<file>.pdf" inside each row
```

Fetch over **www** (bare `damiencharlotin.com` returns HTTP 400; `curl` returns a 0-byte body — the HTTP/2 bug noted above). Document PDFs live at `https://www.damiencharlotin.com/documents/<n>/<file>.pdf`. When you write a Charlotin URL into a record, write the **bare** domain (`damiencharlotin.com`) per `AGENTS.md` — the `validate:data` normalizer strips `www.` and does not check reachability, so this passes.

**Triage the haul before pulling orders.** A month is ~50–115 rows and ~90% are pro se "Warning"-only entries (gate-3 thin: no sanction, often no named actor). Rank for the first pass by: (1) a **named AI tool**, (2) a **monetary sanction** or **attorney-discipline** outcome (reprimand, referral, fee award, removal), (3) attorney (vs pro se) actor. Pull orders for the top tier first; deprioritize pro se warnings unless the run is explicitly a deep/quarterly dig.

Filter to entries within the time window. Each entry yields: case caption, court, date, AI tool note, nature of hallucination, outcome/sanction, primary source URL.

**Charlotin metadata is NOT authoritative — verify against the linked order PDF before any `included` draft.** Reliable: the **caption** and **date**. Unreliable (wrong in multiple spot-checks across runs): the **outcome/sanction**, the **sanction amount**, the **AI tool**, and whether AI was involved at all. Observed failure modes:
- A row tagged `Admonishment` with tools `Fastcase; Google AI` was actually an **order to show cause** that named **no** tool and imposed **no** sanction (the court was *asking* the attorney to disclose whether AI was used).
- A row tagged with an AI tool was a sanction where the **court expressly declined to find AI use** ("whether or not Plaintiff used AI, his conduct remains sanctionable").
- A row tagged `LexisNexis` was a sanction where the **court expressly rejected** that attribution and found only "some kind of AI program."
- A row's penalty read `$4,999` where the order imposed **$5,000**.
- The "Party Using AI" column often reads `Implied` — that is the tracker inferring AI from hallucination hallmarks, not a court finding.

**The tool tag is orthogonal to gate 1 — never skip a row because the tool is `Unidentified`/`Implied`.** Several `Unidentified`-tagged rows turned out to contain an explicit **court finding** of AI use (or a party admission) in the order itself, which satisfies gate 1. Conversely a named-tool tag may be wrong (see `LexisNexis` above). Only the order's own text decides — so the tag tells you nothing about admissibility; pull the order regardless when the row clears the triage ranking above.

So: pull the order PDF (python urllib, www), read it, and confirm the outcome, the sanction amount, the named tool (or that AI is unnamed-but-found), and the AI finding from the order's own text. Only Charlotin-derived facts you have re-confirmed go into an `included` record.

**Read orders cheaply with `pdftotext`, not by rendering every page.** Order PDFs run 5–54 pages; rendering them all through Read is token-expensive (and Read rejects large/long PDFs anyway, forcing page ranges). Instead, convert to text once and grep for the gate-1 language, the actor, and the amount — then Read only the 1–2 page ranges that matter (e.g. the sanctions conclusion):

```bash
pdftotext -layout order.pdf - | grep -niE \
  "artificial intelligence|generative|hallucinat|fabricat|admitted|declined to|\
chatgpt|copilot|gemini|claude|cocounsel|lexis|westlaw|deepseek|perplexity|centient|\
\\\$[0-9,]+|sanction|disgorge|pro se|self-represented|IT IS ORDERED"
```

This one command usually answers all four verification questions (AI established? named tool? outcome? amount?) and pinpoints the page to Read for exact quotes. `pdftotext` ships with poppler (`which pdftotext`); install via `brew install poppler` if missing. Note: `/tmp` artifacts do **not** persist across sessions — re-download PDFs with python urllib (cheap) rather than assuming a prior download is still there.

#### CourtListener RECAP keyword search

Free, primary-source, queryable by docket. The `litigation-legal:docket-watcher` agent already uses this pattern. Use the search API:

**Broad free-text OR-queries are low-signal — don't rely on them.** A query like `"artificial intelligence" OR "algorithm" discrimination OR denial` returned ~37,000 hits dominated by unrelated criminal/immigration matters in a live run; the relevant cases were not findable that way. Use tight filters instead: a specific **party name**, a **`suitNature` code** (e.g. `820 Copyright`, `442 Civil Rights: Jobs`), or a known **docket number**. Treat broad keyword sweeps as a last resort, and when one returns a huge undifferentiated count, say so in the Phase 7 summary rather than pretending it was a meaningful search.

```python
import urllib.request, urllib.parse, json
params = urllib.parse.urlencode({
    'q': 'artificial intelligence OR ChatGPT OR "AI-generated" OR "hallucinated citations"',
    'type': 'r',  # RECAP docket entries
    'order_by': 'dateFiled desc',
    'filed_after': START_DATE,  # YYYY-MM-DD
    'filed_before': END_DATE,
})
req = urllib.request.Request(
    f'https://www.courtlistener.com/api/rest/v4/search/?{params}',
    headers={'User-Agent': 'find-new-cases/2.0'}
)
with urllib.request.urlopen(req, timeout=30) as resp:
    data = json.loads(resp.read().decode('utf-8'))
```

CourtListener has aggressive rate limits without a token. If repeated runs hit 429, ask the user to add a `COURTLISTENER_TOKEN` to `~/.claude/settings.json` and pass it as `Authorization: Token <token>`. Note: this requires URL convention attention — CourtListener uses `www.courtlistener.com` and that's the form their API requires; do not normalize the API endpoint to bare domain even though display URLs in records should be normalized per global AGENTS.md.

#### Agency pressrooms / specialized trackers

For the other channels listed in Phase 2, fetch the agency's press release feed (most have RSS) and grep for AI-related keywords. Examples:
- DOJ ATR: `justice.gov/atr/recent-press-releases`
- FTC: `ftc.gov/news-events/news/press-releases`
- CFPB: `consumerfinance.gov/about-us/newsroom/`
- HUD: `hud.gov/press`
- EEOC: `eeoc.gov/newsroom/press-releases`
- NHTSA ODI: `nhtsa.gov/recalls-investigations`
- ACLU litigation tracker: `aclu.org/cases`

### Phase 3b — Perplexity fallback (only if 3a thin)

Only call Perplexity for categories where Phase 3a returned no usable candidates, OR where the category has no specialized tracker (deepfake, defamation, AI companion).

**Rate-limit rules:**
- Max 3 Perplexity calls per find-new-cases run.
- Minimum 3-second sleep between calls.
- All calls via python urllib (see "Why python, not curl").
- Set 30-second timeout. On `URLError` or HTTP 5xx, retry once after 5s sleep; on second failure, mark category as "API failed" in Phase 7 summary — do not silently retry forever.

Query template (one per category):

```python
import urllib.request, json, time, os

API_KEY = os.popen(
    "jq -r '.env.PERPLEXITY_API_KEY // .perplexity.apiKey // .PERPLEXITY_API_KEY' ~/.claude/settings.json"
).read().strip()

def perplexity(user_msg, system_msg='Legal research assistant. Return only matters with verifiable primary sources (CourtListener, court PDFs, agency PDFs). Mark uncertain facts [unverified].'):
    payload = json.dumps({
        'model': 'sonar-pro',
        'messages': [
            {'role': 'system', 'content': system_msg},
            {'role': 'user', 'content': user_msg}
        ],
        'return_citations': True
    }).encode('utf-8')
    req = urllib.request.Request(
        'https://api.perplexity.ai/chat/completions',
        data=payload,
        headers={
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }
    )
    for attempt in (1, 2):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            if attempt == 1:
                time.sleep(5)
            else:
                return {'_error': str(e)}

# between calls:
time.sleep(3)
```

Prompt body remains as in v1 SKILL: explicit category, explicit time window, explicit admission gates, explicit anti-prompt against ethics-statement / speculation / press-only noise, structured-field request.

### Phase 3c — Routing of cross-component hits

If a hit during Phase 3 looks like a better fit for **EveryAILaw** (a new statute or regulation) or **PubLedge** (a new authority's interpretive-letter pipeline), capture the lead in the Phase 7 summary under "Cross-component routing" — do not draft into `data/data.json` and do not write to the sibling repos from this skill.

### Phase 4 — Auto-dedupe and admission gates

For every candidate from Phase 3, run two checks: **dedupe first** (fast, deterministic), then **admission gates** (slower, requires URL verification).

#### Model routing — orchestrate cheap, verify expensive (delegation pattern)

The gate-1 judgment (reading an order and deciding AI is *established* vs *inferred*) is the only step that genuinely rewards a frontier model — it is where tracker metadata gets rubber-stamped if the reasoning is weak. Everything else in this skill (pagination, dedupe, ID minting, drafting, build, git) is mechanical. So **do not run the whole sweep on a frontier model**: run the orchestration at the session model (Sonnet-tier is the right default) and **delegate each candidate's verification to an Opus subagent**.

A skill cannot change its own main-loop model — but it can spawn subagents with a pinned model via the Agent tool's `model` parameter. So:

1. Orchestrator (session model) does Phase 0–3 discovery, Phase 4 dedupe, and builds the triaged candidate list (per the Phase 3a ranking).
2. For **each candidate that clears triage**, spawn one verification subagent with `model: opus` (run them concurrently — verification is embarrassingly parallel). Give the subagent only what it needs: the candidate row, the order/document URL, and a pointer to apply this skill's gate-1 test and `pdftotext` workflow. Each subagent pulls the order, reads it, and returns a **structured verdict** — it does not draft or write files.
3. Orchestrator collects verdicts, assigns buckets (Phase 5), and drafts records (Phase 6) on the session model.

Structured verdict schema each verifier returns (also enforces the Phase 6 `ai_system_name` vocabulary):

```json
{
  "candidate_id_or_caption": "<string>",
  "ai_established": "named-admitted | named-court-found | unnamed-court-found | unnamed-admitted | attribution-rejected | not-established",
  "ai_system_name": "<product name, or the unnamed/unspecified qualifier per Phase 6 vocab>",
  "gate1": "pass | fail",
  "outcome": "<sanction / order type, verbatim from the order>",
  "sanction_amount": "<exact amount or 'none'>",
  "actor": "<attorney name | 'pro se' | organization>",
  "court_and_caption": "<verified caption + court>",
  "decision_date": "YYYY-MM-DD",
  "recommended_bucket": "included | review | global | drop",
  "evidence_quote": "<short verbatim quote establishing (or refuting) AI use>",
  "notes": "<discrepancies vs the tracker: wrong amount, rejected tool tag, etc.>"
}
```

A `gate1: fail` or `ai_established: not-established` verdict means `review` at most — never `included`, regardless of the tracker's tags. Spot-escalation degrades gracefully: if no Opus is available, the orchestrator runs the same verification inline, but flag in the Phase 7 summary that verification ran at the session model so a later audit pass can re-check borderline calls. **Watch for the failure signal:** if session-model verification starts admitting rows with `Implied`/hedged AI language *without* an `evidence_quote` from the order, the model gap has reopened — bump verification back to Opus or tighten the gate-1 rule.

(At high monthly volume this exact structure graduates to a Workflow: one `agent()` per order with `opts.model: 'opus'` and a barrier before drafting. Same split, parallel by construction — worth it only when order count justifies the fan-out.)

#### Dedupe (automated, not human-mediated)

```python
import json, re

idx = json.load(open('/tmp/aiel-index.json'))

def norm(s):
    return re.sub(r'[^a-z0-9]+', ' ', (s or '').lower()).strip()

def find_dupe(candidate):
    """Returns ('exact'|'update'|'similar'|None, existing_id_or_None)."""
    cap = norm(candidate.get('caption',''))
    sys_name = norm(candidate.get('ai_system',''))
    deployer = norm(candidate.get('defendant',''))

    for r in idx:
        existing_matter = norm(r['matter'])
        existing_title = norm(r['title'])
        existing_system = norm(r['system'])
        existing_deployer = norm(r['deployer'])

        # Exact: matter caption substring match either direction
        if cap and existing_matter and (cap in existing_matter or existing_matter in cap):
            return ('exact', r['id'])

        # Update: same parties (system + deployer) but different procedural phase
        # (e.g. trial → appeal, or sanctions order → final dismissal)
        if (sys_name and existing_system and sys_name == existing_system
            and deployer and existing_deployer and deployer == existing_deployer):
            return ('update', r['id'])

        # Similar: same defendant + same AI system but different plaintiff
        # (worth flagging for human review — usually a distinct matter)
        if deployer and existing_deployer and deployer == existing_deployer:
            if sys_name and existing_system and sys_name == existing_system:
                return ('similar', r['id'])
    return (None, None)
```

Apply to every Phase 3 candidate. Dispositions:

| Dedupe result | Action |
|---|---|
| `exact` | Drop. Note in summary as "already tracked: {id}". |
| `update` | Flag for update-existing flow (Phase 5). Do NOT mint new ID. |
| `similar` | Keep as new candidate but flag in summary: "similar to {id} — confirm distinct matter". |
| None | Proceed to admission gates. |

#### Admission gates (from INTENT.md)

| Gate | Question | Pass if |
|---|---|---|
| 1 | Public legal/regulatory matter directly involving AI conduct? | AI is **established in the primary source** + named legal/regulatory venue |
| 2 | Primary or reliable secondary public source? | URL resolves to court, agency, tribunal, or established legal-news outlet that reproduces the filing |
| 3 | Resolved to filing, order, settlement, judgment, consent decree, or formal disclosure? | Yes — press-only fails |
| 4 | Required fields present and consistent? | Jurisdiction, parties, AI relevance, source, date all extractable |

**Gate 1 — AI must be established, not inferred (critical for the hallucination category).** A third-party tracker labelling a matter "AI" (Charlotin's `Implied`, "hallmarks of AI", etc.) does NOT satisfy gate 1. The order/filing itself must either (a) **name the AI system** (e.g. "ChatGPT", "DeepSeek" — including where a party admits it), or (b) contain an **explicit court finding** that the conduct involved AI (e.g. "the citations appear to be the result of AI-generated hallucinations"). If the court expressly declines to find AI use, or merely asks a party to disclose whether AI was used, gate 1 **fails** → `review` at most, never `included`. Worked examples from a prior run:
- PASS: attorney admitted citations were "hallucinated by ChatGPT" (named + admitted); pro se litigant admitted using "Deepseek" and the court found AI-generated hallucinations (named + court finding).
- FAIL: court said "whether or not Plaintiff used AI, his conduct remains sanctionable" (declined to find AI); show-cause order *asking* the attorney to disclose AI use (not yet established); appellate reversal over a fictitious citation where the opinion never mentions AI (no AI in the source).

URL verification: single `urllib.request.urlopen(HEAD)` with 10s timeout.
- 200 → good
- 403 → acceptable for sec.gov, courtlistener.com, ca5/courts.gov, similar bot-blocked domains where the API/source already confirmed the record. Note in commit-handoff message.
- 404 → drop candidate, do not draft
- timeout / SSL error → drop, note in summary

Document-availability nuance (gate 2/3): for **freshly-filed** civil cases the docket may exist on CourtListener while the complaint PDF is **not yet in RECAP** (only summons/jury-demand metadata). Docket-confirmed but document-not-pulled → still admissible, but keep `needs_review: yes` and note "complaint not pulled (PACER)" until the document is read.

### Phase 5 — Bucket assignment

| Conditions | Bucket | ID pattern |
|---|---|---|
| All four gates pass, US, primary source on court/agency domain, resolved posture | `included` (only with explicit per-candidate user confirmation) | `AIEL-{year}-{NNN}` |
| Gates 1–3 pass, US, field consistency or source strength needs work | `review` | `AIEL-CAND-{NNN}` |
| Non-US matter, needs translation or jurisdiction-specific framing | `global` | `AIEL-GLOB-{NNN}` |
| Dedupe returned `update` | No new ID — update existing record (see Phase 6 "Update mode") |

When in doubt between `included` and `review`, pick `review`.

### Phase 6 — Draft records into `data/data.json`

Output mode controls write behavior:
- `ranked-list`: emit markdown table only, no file writes.
- `draft-review` / `draft-included`: append to appropriate `datasets.{bucket}.records` array.

URL convention: `https://` bare domains, no `www.`, no `http://`. Per global `AGENTS.md`. Build step normalizes but write right the first time.

**`jurisdiction` becomes an authority slug — keep it a clean canonical court name.** `npm run build` slugifies the `jurisdiction` string into filenames under `authority/` and `api/v1/of/records/`. A verbose value (e.g. `"Ohio Court of Appeals, Sixth Appellate District; sanction imposed by Sandusky County Court of Common Pleas"`) generates a garbage filename. Put only the canonical court name in `jurisdiction`; procedural detail (which lower court imposed the sanction, etc.) goes in `notes_on_resolution`. If you **edit** a record's `jurisdiction` after a build, the old slug leaves an **orphan** file behind — delete the stale `authority/<old-slug>.json` and `api/v1/of/records/<old-slug>.json`, then rebuild, so the generated set matches current data.

#### Record shape — included (US, resolved)

```json
{
  "error_id": "AIEL-2026-019",
  "error_title": "<short, neutral, ≤90 chars>",
  "ai_system_name": "<named system, model, or workflow>",
  "deployer": "<organization or actor>",
  "domain": "<housing | employment | legal services | criminal justice | healthcare | consumer travel | retail | government services | ...>",
  "error_type": "<hallucinated authority | discriminatory output | policy misstatement | false match | wrongful denial | ...>",
  "error_description": "<2-4 sentences, fact-only>",
  "canonical_source_conflicted": "<ground truth or authority the system contradicted>",
  "mitigation_gap": "<why safeguards failed>",
  "reliance_or_harm": "<concrete downstream consequence>",
  "public_matter_type": "<lawsuit | sanctions order | regulatory enforcement | tribunal claim | consent decree | ...>",
  "public_matter_name": "<formal caption>",
  "filing_status": "<filed | pending | settled | ordered | sanctioned | dismissed | ...>",
  "jurisdiction": "<court, tribunal, or agency full name>",
  "filing_date": "YYYY-MM-DD",
  "error_date": "<YYYY-MM-DD or YYYY-MM or YYYY>",
  "public_record_link": "<primary URL>",
  "secondary_source_links": "<semicolon-delimited, optional>",
  "confidence_score": "<high | medium | low>",
  "notes_on_resolution": "<one sentence, optional>",
  "tags": "<semicolon-delimited descriptors>",
  "source_quality": "<primary record | strong secondary | mixed>",
  "research_status": "included",
  "last_verified_date": "YYYY-MM-DD (today)",
  "needs_review": "no"
}
```

**`ai_system_name` convention — record the AI-establishment basis, consistently.** When a tool is genuinely named, use the product name (`ChatGPT`, `DeepSeek`, `Westlaw CoCounsel`, `LexisNexis+ (Protégé)`). When it is not cleanly named, do NOT invent ad-hoc phrasings — append one of these parenthetical qualifiers so the corpus stays filterable by how firmly AI was established:
- `<Product> (named; admitted)` — tool named and the actor/party admitted using it. Strongest.
- `<Product> (named; court-found)` — tool named and the court found AI use.
- `Unnamed generative AI (court finding)` — no product named, but the court found the conduct involved AI.
- `Unnamed generative AI (admitted by counsel)` — no product named, but the actor admitted AI use.
- `Unspecified generative-AI program (court finding; <X> attribution not credited)` — court found AI but expressly rejected a claimed tool (e.g. the `LexisNexis`-rejected matter).

If none of these fit (tool only inferred by a tracker, no court finding, no admission), the record fails gate 1 and does not belong in `included` — it goes to `review`.

#### Record shape — review (US, needs more work)

```json
{
  "candidate_id": "AIEL-CAND-013",
  "candidate_title": "<short working title>",
  "candidate_matter": "<best available caption>",
  "reason_for_review": "<which admission gate is weak and why>",
  "next_verification_step": "<single most useful next action>",
  "best_available_sources": "<semicolon-delimited URLs, primary first>",
  "last_checked_date": "YYYY-MM-DD (today)"
}
```

#### Record shape — global (non-US)

```json
{
  "candidate_id": "AIEL-GLOB-009",
  "candidate_title": "<short working title>",
  "country": "<country name>",
  "region": "<EU/EEA | UK | APAC / Commonwealth | LATAM | MENA | Africa>",
  "event_grain": "<single_event | systemic_error_program | policy_challenge>",
  "candidate_matter": "<best available caption>",
  "authority_type": "<court | agency | regulator | tribunal | royal commission>",
  "legal_basis": "<doctrine or statute>",
  "reason_for_review": "<sourcing or framing gap>",
  "next_verification_step": "<single most useful next action>",
  "best_available_sources": "<semicolon-delimited URLs>",
  "source_language": "<English | French | Dutch | ...>",
  "translation_status": "<not needed | partial | needed>",
  "last_checked_date": "YYYY-MM-DD (today)"
}
```

#### Update mode (existing record gets a new phase)

If Phase 4 returned `update` for an existing record:
- Update existing `filing_status`, `notes_on_resolution`, `last_verified_date`.
- Append new source URL to `secondary_source_links` if not already present.
- Note the update in Phase 7 summary with a diff snippet.

### Phase 7 — Build, validate, hand off

Run in order:

1. **Rebuild generated artifacts.**
   ```bash
   npm run build
   ```

2. **Validate.**
   ```bash
   npm run validate:data
   ```
   Fix any duplicate-ID, `http://`, or `www.` host errors before handing off. If Obligation-First validation is wired locally:
   ```bash
   npm run validate:of
   ```

3. **Summarize for the user.** Single message, structured as:

   **Run header**
   - Categories searched + time window (note auto-widening if applied)
   - Source coverage per category (which Phase 3a/3b/3c channels actually ran)

   **Result taxonomy (counts in each)**
   - `new candidates drafted` — passed dedupe + all gates → written to bucket
   - `update-existing` — dedupe returned `update` → existing record amended
   - `similar to existing` — flagged for human disambiguation
   - `already tracked` — dedupe `exact` match, dropped
   - `gate failures` — passed dedupe but failed admission gates 1–4
   - `cross-component routing` — better fit for EveryAILaw or PubLedge
   - `no new hits` — category ran cleanly, returned nothing in window
   - `indexing too recent` — window auto-widened; re-run after lag clears
   - `API failed` — channel call errored after retry; needs manual re-run

   The taxonomy must distinguish these failure modes explicitly. Do not collapse "no hits" and "API failed" into a single line.

   **Drafted candidates table**: ID | bucket | title | matter | primary URL

   **Flags** (separate section): 403s, PDF-source candidates, `[unverified]` markers, `similar` matches needing human disambiguation.

   **Suggested promotions**: which `review` candidates the user should consider promoting to `included` after their own verification pass.

4. **Do NOT commit.** Leave staging to the user.

## What this skill intentionally does not handle

- **Obligation-First anchor selection.** Hand-added only.
- **Hash-chain / provenance.** Out of scope here.
- **Press monitoring tier.** If user wants press-tier early warning, build a separate skill — do not lower these gates.
- **Writing to sibling repos.** Cross-component leads get flagged in summary only.

## Recoverable failure modes (mapped to Phase 7 taxonomy)

| Failure | Taxonomy bucket | What to do |
|---|---|---|
| Perplexity returns thin or contradictory results | `no new hits` (if category has primary tracker that also ran) or `indexing too recent` (if window < 30 days and only Perplexity ran) | Report category honestly; do not pad with weak candidates |
| Perplexity HTTP error after retry | `API failed` | Note in summary; suggest user re-run that category |
| Primary URL is paywalled (Bloomberg Law, Law360) | `gate failures` (gate 2) | Demote to `secondary_source_links`; keep candidate in `review` |
| CourtListener has docket but no document | `gate failures` (gate 2/3) for `included`; acceptable for `review` | Note docket number; check next sweep |
| Same matter under multiple captions | `update-existing` or `similar to existing` | One matter unless procedural posture meaningfully different |
| Candidate involves sealed filing or minor's name | `review` with de-identification note | Use initials in candidate_title even if source uses full name |
| CourtListener rate limit (HTTP 429) | `API failed` for that category | Ask user to add `COURTLISTENER_TOKEN` to settings |
| User window < 14 days | (Auto-widened in Phase 0) | Note widening in summary header |

## Reference patterns

- [publedge-source-ingest](../../../../publedge/.agents/skills/publedge-source-ingest/SKILL.md) — phase structure, Perplexity discovery, URL convention enforcement.
- [add-regulation](../../../../every-ai-law/.agents/skills/add-regulation/SKILL.md) — parse-then-research-then-validate flow.
- `litigation-legal:docket-watcher` (system agent) — CourtListener primary-source pattern, scan-and-report cadence.

## Existing corpus snapshot (as of 2026-06-02)

For dedupe orientation only. Refresh by reading `data/data.json` directly.

- `included`: 31 records (2017–2026)
- `review`: 16 candidates
- `global`: 8 candidates

Coverage swept so far: April 2026 and May 2026 fully swept (hallucination category, order-verified); Swanson v. IBM and CNN v. Perplexity added by targeted research. Heavily represented: attorney/litigant hallucinated-citation sanctions, including legal-AI-vendor tools (Westlaw CoCounsel, LexisNexis Protégé). Open threads for a future run: March 2026 not yet swept; April non-US named-tool hits (Boonstra/ChatGPT, AGC/Gemini, Québec) not yet triaged to `global`; review items 013–015 await a steward policy call on whether tracker-inferred AI (no court finding) is admissible.

Under-represented categories worth explicit Phase 2 probes:
- Deepfake civil suits (NCII, voice-cloning fraud)
- Generative-AI defamation past Walters v. OpenAI posture
- Tesla FSD / Autopilot wrongful-death actions
- AI companion / chatbot harm suits (Character.AI, Replika)
- Healthcare AI denial beyond UnitedHealthcare / Cigna candidates
- AI-content-moderation suits against platforms

## Changelog

- v5 (2026-06-02): Model routing. Added a Phase 4 delegation pattern — orchestrate the sweep at the session model (Sonnet-tier default) and delegate each triaged candidate's gate-1 verification to a concurrent Opus subagent (Agent tool `model: opus`) returning a structured verdict; orchestrator buckets + drafts. A skill can't re-flash its own main loop, so model routing happens via subagent delegation, not by splitting into model-flavored sub-skills. Includes the verdict schema (which enforces the v4 `ai_system_name` vocab), graceful degradation when no Opus is available, a reopened-gap failure signal, and a note that the same structure graduates to a Workflow at high volume.
- v4 (2026-06-02): Efficiency + coverage, from the April sweep and a deep-dig round. (1) Phase 3a: documented Charlotin **pagination** (index shows only ~50 newest rows; walk `?page=N` and stop at the window start — a single fetch silently misses older months) with a ready extractor. (2) Phase 4 verification: added a `pdftotext -layout | grep` triage to read long orders cheaply (Read rejects large PDFs anyway), plus a note that `/tmp` doesn't persist across sessions. (3) Charlotin-verify list extended to the **sanction amount** ($4,999-vs-$5,000 miss) and a `LexisNexis`-rejected example; added "tool tag is orthogonal to gate 1 — never skip an `Unidentified`/`Implied` row, pull the order regardless." (4) Phase 3a: triage-ranking heuristic (named tool / monetary or discipline outcome / attorney actor; deprioritize pro se warnings). (5) Phase 2: cadence reality — hallucination is the only high-yield monthly channel; sweep other categories quarterly/event-driven; broad CourtListener OR-queries are low-signal (use party / `suitNature` / docket). (6) Phase 6: `ai_system_name` controlled vocabulary keyed to AI-establishment basis (named-admitted / named-court-found / unnamed-court-found / unnamed-admitted / attribution-rejected).
- v3 (2026-06-02): Hardened from a live sweep. (1) Phase 1: shipped a robust `.mjs` next-ID snippet using `[0-9]`/`Number.isFinite` + collision assert (the old "see history" pointer let a `\d`-eaten-by-shell bug mint `AIEL-CAND-NaN` and duplicate IDs). (2) Phase 3a: Charlotin metadata (outcome/tool/AI-involvement) declared non-authoritative — must be verified against the linked order PDF before any `included` draft; added www-only fetch + bare-write URL note. (3) Gate 1: AI must be established in the primary source (named tool OR explicit court finding), not inferred by a tracker; added pass/fail worked examples + RECAP document-availability nuance. (4) Phase 6: `jurisdiction` becomes an authority slug — keep it a clean court name and clean orphan generated files after edits.
- v2 (2026-05-26): Replaced curl with python urllib (HTTP/2 framing bug). Added Phase 3a primary-source channels (Damien Charlotin, CourtListener, agency pressrooms) ahead of Perplexity. Added Phase 0 auto-widening of windows < 14 days. Added Phase 4 automated dedupe script. Added Phase 3b rate-limiting (3-sec sleep, 2-attempt retry, 3-call max). Added Phase 7 failure-mode taxonomy distinguishing "no hits" / "indexing too recent" / "API failed".
- v1 (2026-05-26): Initial skill modeled on publedge-source-ingest + add-regulation + docket-watcher.
