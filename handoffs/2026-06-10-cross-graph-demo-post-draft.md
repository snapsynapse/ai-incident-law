# Post draft: The cross-graph query no other AI law tracker can answer

Date: 2026-06-10
Status: Draft for Sam's review and publication
Suggested venue: PAICE Substack (https://paice.substack.com/), cross-posted to SigSub
Word count: ~750

---

## The cross-graph query no other AI law tracker can answer

If you build automated decision systems, you have probably tried this question and been
disappointed by the answer:

> *Which obligations does a Colorado automated decision system actually trigger, and what
> is the public record of what happens when those obligations are breached?*

Every existing AI litigation tracker can answer half. None can answer the whole thing.

GWU's DAIL, Fisher Phillips, McKool Smith, Hogan Lovells, Damien Charlotin's hallucination
database -- each is human-browsable, each is excellent at what it does, none of them link
cases to the specific regulatory obligations a regulator would actually cite.

That gap is the reason the PAICE legal graph exists.

## The query, run live

On 2026-06-10 I ran the question above against two MCP servers running side by side:
EveryAILaw (the AI obligation registry) and AI Incident Law (the case and enforcement
evidence layer). What follows is the actual transcript -- the queries, the JSON responses,
the synthesis. Reproducible from the recipe on
[aiincidentlaw.org/docs/legal-graph.html](https://aiincidentlaw.org/docs/legal-graph.html).

### Step 1: find the live Colorado regulation

The EveryAILaw MCP returns one statute governing Colorado automated decision systems:
**SB 26-189, the Colorado ADMT Act**, enacted 2026-05-14 and effective 2027-01-01. It
replaced the repealed SB 24-205 earlier this year.

### Step 2: pull the obligations the statute imposes

`get_regulation(id="colorado-sb26-189")` returns four provisions covering three distinct
obligations:

- **transparency** -- deployer disclosures, post-adverse notice, developer documentation
- **record-keeping** -- deployer record retention
- **human-oversight** -- consumer correction and human review

Three things a Colorado deployer must do or risk enforcement.

### Step 3: cross-reference to the case record

For each obligation, query AI Incident Law for matters whose `obligation_first_anchors`
field contains the EveryAILaw obligation IRI:

- **transparency**: one anchored matter. *Moffatt v. Air Canada*, 2024 BCCRT 149. An
  airline chatbot misstated bereavement-fare refund policy. The British Columbia Civil
  Resolution Tribunal held the airline liable and awarded C$650.88. The legal theory --
  that a deployer is responsible for accurate disclosures even when delivered through an
  automated agent -- is the template a Colorado plaintiff will reach for after 2027-01-01.

- **record-keeping**: zero matters. This is itself a finding. No AI Incident Law record
  has yet turned on a record-keeping or audit-trail failure. SB 26-189 will create that
  cause of action in seven months; the public litigation record begins after that date.
  The burden of proof for compliance will fall on deployers, and the first defendant to
  reach trial will set the standard.

- **human-oversight**: forty-one matters and counting. Thirty-seven are attorney-sanction
  matters for AI-hallucinated legal citations (sanctions from US$900 to US$94,704). The
  other four are structural: MiDAS automated unemployment fraud determinations (eventually
  $20M in remediation), the RUGs Medicaid care-allocation algorithm, and facial-recognition
  false matches. The legal theory varies but the duty is the same: a human who can
  understand, override, and intervene.

### Step 4: synthesis

A Colorado deployer in 2027 will sit under three legally distinct obligations, each backed
by a different volume of precedent:

| Obligation | Cases on record | Risk shape for deployers |
|---|---|---|
| transparency | 1 (clean civil-liability template) | Plaintiff theory is established; expect mimics |
| record-keeping | 0 | First-mover defendants set the standard of care |
| human-oversight | 41 (deepest record) | Plaintiff sophistication is high; standards of care are mature |

This is a risk-shaped roadmap, generated in one agent session, from public data, with no
human writing involved between the query and the answer.

## Why this matters

The four-layer PAICE legal graph -- Obligation-First (the shared schema), EveryAILaw (the
obligations), PubLedge (the verifiable records protocol), AI Incident Law (the case
evidence) -- is the only public system where an agent can traverse from a regulation to
its consequences without losing the chain.

The differentiator is not that any one layer is bigger than its competitors. It is that the
four layers are *the same vocabulary*. An obligation in EveryAILaw and an anchor in AI
Incident Law point to the same IRI. There is no fuzzy join, no human paralegal in the
middle, no LLM guess.

We built this because the question above is the question every AI deployer, every regulator,
every plaintiff's lawyer, and every defense lawyer needs to answer continuously over the
next decade. They should not have to do it by clicking through twelve human-browsable
trackers and hoping the synthesis they produce is right.

## Try it yourself

The recipe lives at
[aiincidentlaw.org/docs/legal-graph.html](https://aiincidentlaw.org/docs/legal-graph.html).
The MCP config snippet drops into Claude Desktop, Cursor, or any MCP-aware agent client.
Both servers are free to query under their respective licenses (CC BY 4.0 for AI Incident
Law; EveryAILaw Data License v1.4.1 for the obligation registry).

Run it. Run it tomorrow. The shape of the answer will be the same; the specific cases will
keep growing.

---

*PAICE.work PBC stewards the PAICE legal graph. Code is MIT; the AI Incident Law dataset
is CC BY 4.0. This is a public-record reference, not legal advice.*
