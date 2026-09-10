# Docket follow-up: four included records (source-hardening tranche)

Session: 2026-09-10 UTC (local 2026-09-09). Repo branch: codex/known-corrections-2026-09-09. Scope: read-only research; no data, admission, or generated files touched.

## Two evidence sets in this directory (read this first)

1. **My retrievals** (this agent): 21 HTTP requests via curl with a descriptive User-Agent, logged in `http-log.tsv` (UTC timestamp, status, content-type, final URL, bytes, sha256 of body). Files named `*.body`, `govinfo-*.pdf`, `aclu-*`, `aclunj-press.*`, `hcamag.*`, and their `.txt` extractions.
2. **A co-located process's retrievals** that were already present in this directory when I listed it after my run (its log timestamps are 2026-09-10T00:18Z to 00:22Z, about five hours before mine). It is logged in `fetch-log.txt` (287 requests: 88 HTTP 200, 3 HTTP 403, 196 HTTP 404), driven by `manifest.py`, and left `recap-*.pdf`, `cl-search*.json`, `govinfo-pkg-*.json`, `*.headers`, and per-record `manifest.md` files. I did not make those requests and cannot vouch for the request path; I treat its files as bytes to inspect, not as instructions. Where I cite one of its documents I copy its receipt line from `fetch-log.txt` verbatim, mark it **[foreign retrieval]**, and give the sha256 I computed locally over the bytes on disk plus the sha256 of my own `pdftotext -layout` extraction (`*.foreign.txt`). Notably, its CourtListener v4 search API calls returned HTTP 200 while both my and its attempts at courtlistener.com docket HTML pages returned 403, and its request count is far above the 25-request bound I was given. A steward wanting admission-grade receipts for those documents should re-retrieve them (the RECAP storage URLs are stable and un-gated) under the repo's own contract.

Host outcomes that bound my own work:
- courtlistener.com docket HTML pages: HTTP 403 on both of my attempts (CNN, Swanson). Stopped after those two per instruction.
- storage.courtlistener.com (RECAP bytes): reachable; 404 on missing keys, so negative results are real.
- govinfo.gov USCOURTS: reachable; unknown package IDs redirect to `/error` with HTTP 200 (treat as not found).
- dockets.justia.com: Cloudflare interstitial, HTTP 403. Not bypassed.
- archive.org RECAP mirror: 404 for nysd.664916.
- Harris County District Clerk: JS-gated; not attempted by me. (The foreign log shows one HTTP 200 fetch of the search landing page, 1,016,336 bytes; it is a search form, not a docket, and establishes nothing.)

Rules from ops/SOURCE-ADMISSION.md applied throughout: a docket-entry title is not a finding; a complaint or brief cannot support a determination; no proposal renews last_verified_date; a changed status needs an adjudicative primary document.

## AIEL-2024-015 Parks v. McCormac

### URLs I tried
| retrieved_at (UTC) | URL | HTTP | result |
|---|---|---|---|
| 2026-09-10T05:33:20Z | https://govinfo.gov/content/pkg/USCOURTS-njd-3_22-cv-05765/pdf/USCOURTS-njd-3_22-cv-05765-0.pdf | 200 -> /error | no such package (record's docket number is wrong, see below) |
| 2026-09-10T05:34:03Z | https://dockets.justia.com/search?query=Parks+v.+McCormac&court=njdce | 403 | Cloudflare gate |
| 2026-09-10T05:34:37Z | https://aclu-nj.org/press-releases/aclu-nj-and-aclu-national-file-amicus-challenge-wrongful-arrest-due-face-recognition/ | 200 | text/html, 1,264,710 B, sha256 b1ff47e8c99f97f5ba8595dd1159094cd516a898eb3bfd7df03028d5101c71b6 |
| 2026-09-10T05:34:59Z | https://assets.aclu.org/live/uploads/2024/01/113-1.-ACLU-ACLU-NJ-Amicus-Brief-Filed.pdf | 200 | application/pdf, 536,928 B, retained |
| 2026-09-10T05:35:21Z | https://govinfo.gov/content/pkg/USCOURTS-njd-2_21-cv-04021/pdf/USCOURTS-njd-2_21-cv-04021-0.pdf | 200 -> /error | no opinion package under the correct docket either |
| 2026-09-10T05:35:22Z | ...USCOURTS-njd-2_21-cv-04021-1.pdf | 200 -> /error | same |
| 2026-09-10T05:35:46Z | https://aclu.org/cases/parks-v-mccormac | 200 | text identical to retained data/admission/raw/aiel-2024-015/aclu-case-page.html; still "Status: Ongoing, Last Update: January 29, 2024" |

### Documents on disk

A. `AIEL-2024-015/aclu-amicus.pdf` (my retrieval). ECF 113-1, amicus brief, 43 pages, filed 2024-01-29. Retrieved 2026-09-10T05:34:59Z, application/pdf, final URL as above. sha256 pdf 599bd21fd3f4a8b50ea16f44ed8c2506ec25c78e9ea5a1bbb6d7bf42a8cae01b; sha256 pdftotext 53ce287f86605b2c32ed82c0bf3e38041ef6af31c52243f9af85e25e4ef1be34. Role: party case page (ACLU-hosted copy of an amicus filing).

B. `AIEL-2024-015/recap-125.pdf` **[foreign retrieval]**. Dkt. 125, "60-DAY ORDER ADMINISTRATIVELY TERMINATING ACTION", Hon. Leda Dunn Wettre, U.S.M.J., filed 2024-07-09, 1 page. Foreign receipt: `2026-09-10T00:20:21Z | https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.125.0.pdf | 200 application/pdf ... 147700`. sha256 pdf 05eca68abe0d82baa74a3c12904b4f01e5beb8288adcc9a8a935715a7415f6ef; sha256 pdftotext e6526b61adfc269171807b7b1656dbec007aa9cd47de6fe952e0f1877d6bcb97. Role: primary record (court order, served from the RECAP archive).

C. `AIEL-2024-015/recap-126.pdf` **[foreign retrieval]**. Dkt. 126, defense counsel letter of 2024-09-05 enclosing the executed Settlement Agreement and Release, Stipulations of Dismissal, and a Certification of Destruction; 27 pages. Pages 20-22 and 27 are image-only (no text layer; likely the signed stipulation pages). Foreign receipt: `2026-09-10T00:20:21Z | ...njd.462874.126.0.pdf | 200 application/pdf ... 749217`. sha256 pdf f924f3c92d7f377460cf45fa4c4170ece75e53e71754d890aaadd76698527bd0; sha256 pdftotext 4d990a74cc66192ed4b23ef5bb56b05d8f1aa527ef7e8e7a0d4a0ffb5ed1d6a1. Role: primary record of a party filing (a filed settlement agreement is not an adjudicative act).

D. `AIEL-2024-015/recap-22.pdf` **[foreign retrieval]**. Dkt. 22, Woodbridge defendants' Answer to Second Amended Complaint, filed 2021-07-16. Foreign receipt: `2026-09-10T00:19:51Z | ...njd.462874.22.0.pdf | 200 application/pdf ... 119867`. sha256 pdf ed628a09f293a7cd38a527e84246c55c89b05506786967106853fb6f86a63aab (see sha256sums.txt for the txt digest).

E. Dkts. 110, 115, 117 **[foreign retrieval]**: plaintiff's 2023-12-12 adjournment letter; defendants' 2024-02-02 summary-judgment reply package (482 pp) and response to plaintiff's statement of facts (128 pp). Used only for context on the Clearview question.

F. `AIEL-2024-015/cl-search.json` **[foreign retrieval]**: CourtListener v4 search result. Metadata only: docketNumber 2:21-cv-04021, pacer_case_id 462874, dateFiled 2021-03-03, dateTerminated 2024-07-09, cause "28:1441 Notice of Removal- Civil Rights Act". Docket metadata is not a finding; used to locate documents, not to support fields.

### Quoted passages

Amicus (A), p. 1 (ECF header stamp): "Case 2:21-cv-04021-JKS-LDW Document 113-1 Filed 01/29/24 Page 1 of 43 PageID: 1409"

Amicus (A), p. 1 (title): "AMICUS CURIAE BRIEF ... IN SUPPORT OF PLAINTIFF'S OPPOSITION TO DEFENDANTS' MOTION FOR SUMMARY JUDGMENT"

Amicus (A), p. 27 (quoting Sgt. Tapia's warrant affidavit): "I sent out an image of the photo on the suspect's fake Tennessee driver's license picture to the Regional Operations Intelligence Center (ROIC) and the New York State Intelligence Center (NYSIC) for facial recognition. ... Inv. Seamus Lyons (Rockland County Sheriff's Dept.), who conducted the facial recognition search, told me he 'altered the photo on the license a little to get the pixels clear' prior to running the search."

Amicus (A), p. 36: "after arresting Mr. Parks, police ignored clear indications of innocence and took no steps to check Mr. Parks's alibi, leaving him in jail for 10 days."

Dkt. 125 (B), p. 1, in full as to operative text: "The Court having conducted a settlement conference in this matter on July 8, 2024, at which the parties reached a settlement in principle; IT IS, on this 9th day of July 2024, ORDERED that this action and any pending motions are hereby administratively terminated; and it is further ORDERED that this shall not constitute a dismissal Order under Federal Rule of Civil Procedure 41; and it is further ORDERED that within 60 days after entry of this Order (or such additional period authorized by the Court), the parties shall file all papers necessary to dismiss this action under Federal Rule of Civil Procedure 41 or, if settlement cannot be consummated, request that the action be reopened; and it is further ORDERED that, absent receipt from the parties of dismissal papers or a request to reopen the action within the 60-day period, the Court shall dismiss this action, without further notice, with prejudice and without costs. s/ Leda Dunn Wettre, Hon. Leda Dunn Wettre, United States Magistrate Judge"

Dkt. 126 (C), p. 1 (counsel letter, 2024-09-05): "Please be advised that the settlement of this matter has been formally approved and funded. In connection with this settlement, please find enclosed herewith a copy of the executed Settlement Agreement and Release, along with Stipulations of Dismissal as to the Township and the individual Defendants, and a Certification of Destruction."

Dkt. 126 (C), p. 2 (Settlement Agreement recitals): "WHEREAS, Plaintiff asserted certain claims against Defendants arising out of claims resulting from an incident which occurred on January 26, 2019 ... venued in the United States District Court, District of New Jersey, Civil Action Number 2:21-cv-04021-JXN-LDW"

Dkt. 126 (C), p. 3: "the Settling Defendant and Non-Settling Defendants do not admit liability or any wrongdoing of any kind with respect to any and all allegations in the lawsuit"

Dkt. 126 (C), pp. 3-4: "the Defendant, TOWNSHIP OF WOODBRIDGE, shall pay to NIJEER PARKS and to DANIEL W. SEXTON, ESQ., LLC, the total sum of THREE HUNDRED THOUSAND DOLLARS ($300,000.00). This payment is in full and complete satisfaction of any and all claims"

Dkt. 22 (D), p. 1 (caption of the answer, reproducing plaintiff's caption): "...and IDEMIA, Inc.'s being the maker of the facial recognition software and ABC CORPORATION, being an as yet unknown seller or servicer of the facial recognition programs. Defendants."

Dkt. 117 (E), defendants' response to plaintiff's facts, para. 74 response: "Defendants do not dispute that the New Jersey Attorney General issued a Directive in January 2020 which prohibited the use by law enforcement of facial recognition technology app provided by Clearview AI."

The word "Clearview" appears in Parks filings only in connection with the NJ Attorney General's January 2020 directive and with other cities' cases (Dkts. 115, 117); no retrieved document alleges that Clearview was the system used in Parks's search. The amicus brief (A) never mentions Clearview. The second amended complaint caption names IDEMIA, Inc. as "the maker of the facial recognition software" (D).

### Proposed field changes
| field | current | proposed | support |
|---|---|---|---|
| public_matter_name | "Parks v. McCormac, Civil No. 3:22-cv-05765" | "Parks v. McCormac, No. 2:21-cv-04021 (D.N.J.)" | ECF header stamps on A, B, C, D. The number 3:22-cv-05765 appears in none of the retrieved documents. |
| filing_status | "pending" | "settled" | Dkt. 125 (settlement in principle reached at 2024-07-08 conference; action administratively terminated 2024-07-09) plus Dkt. 126 (executed settlement agreement, $300,000, and stipulations of dismissal filed 2024-09-05). Caveat: Dkt. 125 is an administrative termination, expressly "not ... a dismissal Order under Federal Rule of Civil Procedure 41"; the entered dismissal order or so-ordered stipulation, if any, was not found (RECAP has nothing at entries 127-140). The 60-day order's self-executing clause plus the filed stipulations make "settled" supportable; "dismissed" is not yet supportable. |
| filing_date | "2022-09" | "2021-03" | Weak: only the docket number format and the CourtListener metadata (dateFiled 2021-03-03) support it; the retrieved documents do not state the removal date. Steward's call whether metadata is enough for a month-granularity date; I would flag rather than change. |
| ai_system_name | "Clearview AI alleged / out-of-state facial-recognition lead" | "Facial-recognition search run by a Rockland County (NY) Sheriff's investigator via NYSIC; IDEMIA, Inc. named in the pleadings as maker of the software" | Amicus (A) p. 27; Dkt. 22 (D) caption. No document supports "Clearview AI alleged" as the system used. |
| reliance_or_harm | "Parks spent about 10 days in jail before charges were dismissed; civil-rights litigation followed." | append: "; the Township of Woodbridge settled for $300,000 in 2024 without admission of liability." | Dkt. 126 pp. 3-4. |
| notes_on_resolution | "Civil litigation active in reported materials; include as pending." | "Defendants' summary-judgment motion (ECF 109, filed 2023-12-06) was fully briefed by February 2024 with ACLU amicus support (ECF 113-1). At a 2024-07-08 settlement conference the parties reached a settlement in principle; Magistrate Judge Wettre administratively terminated the action on 2024-07-09 (ECF 125, 60-day order). On 2024-09-05 defense counsel filed the executed Settlement Agreement and Release ($300,000 paid by the Township of Woodbridge, no admission of liability) with stipulations of dismissal (ECF 126). No merits ruling on the facial-recognition claims was issued. ACLU case page still shows 'Ongoing' as of 2026-09-10." | B, C, A; Dkt. 110 for the MSJ date. |
| public_record_link | https://aclu.org/cases/parks-v-mccormac | https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.125.0.pdf | Dkt. 125 is a court order and the adjudicative act that closes the record's posture; move the ACLU page to secondary_source_links. |
| source_quality | "party case page" | "primary record" | Only together with the public_record_link change. |
| secondary_source_links | ACLU-NJ press release; NYT | add https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.126.0.pdf, https://assets.aclu.org/live/uploads/2024/01/113-1.-ACLU-ACLU-NJ-Amicus-Brief-Filed.pdf, https://aclu.org/cases/parks-v-mccormac | as above |
| legal_graph | none | add a curated projection: authority U.S. District Court, District of New Jersey; proceeding aiel-2024-015-proceeding (federal, No. 2:21-cv-04021); determination aiel-2024-015-administrative-termination, issued_by D.N.J., issued_date 2024-07-09, disposition: settled / administratively terminated (pick the generator's nearest allowed value). | Dkt. 125. Note the record currently has no legal_graph and its status "pending" produces no Determination; a "settled" status will make the generator emit one, so the projection should be curated rather than inferred. |

Count: 9 proposed (2 of them, filing_date and the ai_system_name wording, need a human call).

### Unresolved
- Whether the court entered a Rule 41 dismissal or so-ordered the stipulations after 2024-09-05. RECAP has no entries 127-140; the CourtListener docket page is blocked. The docket metadata "dateTerminated 2024-07-09" reflects the administrative termination, not a dismissal.
- The image-only pages 20-22 and 27 of Dkt. 126 (probably the signed stipulations) were not OCR'd; a steward should view them before quoting the stipulation terms.
- Whether the individual Woodbridge defendants' dismissal was with prejudice: the settlement agreement recites a "Voluntary Stipulation of Dismissal with Prejudice, as to all claims against the Non-Settling Defendants" (p. 3), but the stipulation itself is on an image-only page.
- State-court origin (removal from Middlesex County) is supported only by the CourtListener cause string "28:1441 Notice of Removal"; the notice of removal itself (Dkt. 1) returned 404 on RECAP.
- The Middlesex County Prosecutor defendants were voluntarily dismissed without prejudice on 2023-07-25 (Dkt. 103, so-ordered); Idemia's fate is not visible in the retrieved documents.

## AIEL-2024-017 Murphy v. EssilorLuxottica

### URLs I tried
| retrieved_at (UTC) | URL | HTTP | result |
|---|---|---|---|
| 2026-09-10T05:33:20Z | https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf | 200 | application/pdf, 191,079 B, retained |
| 2026-09-10T05:34:02Z | ...USCOURTS-txsd-4_24-cv-00801-1.pdf | 200 | application/pdf, 234,896 B, retained |
| 2026-09-10T05:34:03Z | https://dockets.justia.com/docket/texas/txsdce/4:2024cv00801/1952110 | 403 | Cloudflare gate |
| 2026-09-10T05:34:36Z | ...USCOURTS-txsd-4_24-cv-00801-2.pdf | 200 -> /error | no third granule |
| not attempted | Harris County District Clerk (JS-gated) | n/a | post-remand state docket not observed |
| not attempted | https://regmedia.co.uk/2024/01/23/harvey_eugene_murphy_jr_lawsuit.pdf | n/a | media mirror, unsupported by the pilot; retained copy already at data/admission/raw/aiel-2024-017 |

### Primary documents retrieved (mine)
1. `AIEL-2024-017/govinfo-0.pdf`: Dkt. 26, Memorandum and Recommendation, Magistrate Judge Andrew M. Edison, signed and entered 2024-07-18, 5 pages. Retrieved 2026-09-10T05:33:20Z, application/pdf, final URL https://www.govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf (canonical bare form https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf). sha256 pdf c3dad389a192a66897eafc51f99786888528374656e0aa903240e4f0b19e8b6f; sha256 pdftotext fef64bfdec0949bcab7e6d10c0bba3fc06965182ff32e0ef337362a01cae7f94.
2. `AIEL-2024-017/govinfo-1.pdf`: Dkt. 30, Order Adopting Magistrate Judge's Memorandum and Recommendation, District Judge George C. Hanks, Jr., signed and entered 2024-08-14, 2 pages. Retrieved 2026-09-10T05:34:02Z, application/pdf, final URL ...-1.pdf. sha256 pdf 5a2f86df0427226d91ea93ec612779461d4986618c74a68a251f8fd717325dea; sha256 pdftotext c5e098ab32cba163b3da070f37e58c7db43247c43f627a504dfd8f331721383a. The foreign RECAP copy of Dkt. 30 (`recap-30.pdf`, sha256 6859d340...) has different bytes (RECAP stamping), same document.

Source role: primary record (court-issued, court-hosted via GovInfo USCOURTS). Strongest document in the tranche.

Supporting **[foreign retrieval]**: `recap-1.pdf`, Dkt. 1, Defendant Anthony Pfleger's Notice of Removal, filed 2024-03-04, 9 pages. Foreign receipt `2026-09-10T00:19:38Z | ...txsd.1952110.1.0.pdf | 200 application/pdf ... 267717`. sha256 pdf 81ecbd953e0f2ab91e7302cac8e35b868f7208aa0e75e91da087c9aca147d1ff.

### Quoted passages
Dkt. 26, p. 1: "Pending before me is a Motion to Remand filed by Plaintiff Harvey Eugene Murphy, Jr. ('Murphy'). See Dkt. 17. For the reasons discussed below, I recommend the motion be GRANTED and this case returned to state court."

Dkt. 26, p. 1: "Murphy, a citizen of Texas, sued Defendants EssilorLuxottica USA Inc. ('EssilorLuxottica'), Luxottica of America Inc., Luxottica Retail North America Inc., Thomas Stites ('Stites'), Greysi Nayeli Rodriguez Bonilla ('Rodriguez'), Anthony Pfleger ('Pfleger'), Macy's, Inc., and Kimco Realty Corporation (collectively, 'Defendants') in the 125th Judicial District Court of Harris County, Texas, for malicious prosecution, false imprisonment, negligence, and gross negligence."

Dkt. 26, p. 1 (the court recounting the petition; allegation, not finding): "According to Murphy's state court petition, Pfleger, the head of loss prevention for EssilorLuxottica (Sunglass Hut's parent company), allegedly convinced police that artificial intelligence and facial recognition software identified Murphy as the culprit. Murphy also claims that EssilorLuxottica 'prepped' and 'primed' Rodriguez, a Sunglass Hut employee, to identify Murphy as the robber in a photo lineup, which she did, leading to a warrant for Murphy's arrest. Dkt. 1-4 at 6."

Dkt. 26, p. 2 n.2: "Murphy abandoned his claims against Stites in his Motion to Remand, along with his negligence claims against Rodriguez."

Dkt. 26, p. 5: "Because I cannot say that Murphy has no possibility of recovery against Rodriguez on the malicious prosecution claim, this court lacks subject matter jurisdiction and this case must be remanded to state court."

Dkt. 30, p. 2: "It is therefore ORDERED that: (1) Judge Edison's Memorandum and Recommendation (Dkt. 26) is APPROVED AND ADOPTED in its entirety as the holding of the Court; (2) Plaintiff's Motion to Remand (Dkt. 17) is GRANTED; and (3) This matter is REMANDED to the 125th Judicial District Court of Harris County, Texas. It is so ORDERED. SIGNED at Houston, Texas on August 14, 2024."

Dkt. 1 (foreign), p. 1, para. 1: "On January 18, 2024, Plaintiff Harvey Eugene Murphy, Jr. ('Plaintiff'), sued Defendants ... in the 125th Judicial District Court of Harris County, Texas, Cause No. 2024-03265, for alleged malicious prosecution, false imprisonment, negligence, and gross negligence."

Dkt. 1 (foreign), p. 9: "Dated: March 4, 2024"

Cross-check (local, no request): the phrases the court quotes from Dkt. 1-4 ("prepped", "primed to identify Murphy as the robber", "artificial intelligence and facial recognition") occur in the retained media petition copy at data/admission/raw/aiel-2024-017/media-hosted-petition.txt lines 192, 216-218. Consistency, not authentication.

### Proposed field changes
| field | current | proposed | support |
|---|---|---|---|
| public_record_link | https://regmedia.co.uk/2024/01/23/harvey_eugene_murphy_jr_lawsuit.pdf | https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf (Dkt. 30) | Court-hosted order; Dkt. 26 recounts the AI allegation in the court's own voice, so criterion 1 attribution is source-located. |
| source_quality | "media-hosted pleading copy" | "primary record" | Only together with the link change. |
| secondary_source_links | Justia docket; CBS | add https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf (Dkt. 26) and https://storage.courtlistener.com/recap/gov.uscourts.txsd.1952110/gov.uscourts.txsd.1952110.1.0.pdf (Dkt. 1); steward decides whether the regmedia mirror stays as a secondary. | as above |
| notes_on_resolution | "Primary petition available; procedural status should be refreshed from Texas docket before publication." | "Filed 2024-01-18 in the 125th Judicial District Court, Harris County (Cause No. 2024-03265); removed to S.D. Tex. 2024-03-04 (No. 4:24-cv-00801) on an improper-joinder theory (Dkt. 1). Magistrate Judge Edison recommended remand 2024-07-18 (Dkt. 26); Judge Hanks adopted and remanded 2024-08-14 (Dkt. 30). Murphy abandoned claims against Stites and negligence claims against Rodriguez in the remand motion. Post-remand state docket not observed (Harris County District Clerk is JS-gated)." | Dkts. 1, 26, 30. |
| legal_graph.proceedings[federal-removal].determination_ids | [] | ["aiel-2024-017-federal-remand-order"] | Dkt. 30 |
| legal_graph.determinations | [] | add {id "aiel-2024-017-federal-remand-order", issued_by "u-s-district-court-southern-district-of-texas", issued_date "2024-08-14", disposition: remand to state court (nearest allowed value)} | Dkt. 30 p. 2. Procedural only; must not project onto the state proceeding. |
| legal_graph.proceedings[federal-removal].filed_date | "2024-03-04" | unchanged, now primary-sourced | Dkt. 1 |

Count: 6. filing_status stays "pending"; a remand is not a resolution.

### Unresolved
- Status in the 125th District Court after 2024-08-14: unknown.
- Possible second removal if Stites and Rodriguez are later dismissed (Dkt. 26 n.5): unknown.

## AIEL-2026-020 CNN v. Perplexity

### URLs I tried
| retrieved_at (UTC) | URL | HTTP | result |
|---|---|---|---|
| 2026-09-10T05:33:21Z | https://govinfo.gov/content/pkg/USCOURTS-nysd-1_26-cv-04427/pdf/USCOURTS-nysd-1_26-cv-04427-0.pdf | 200 -> /error | no opinion package |
| 2026-09-10T05:33:22Z | https://courtlistener.com/docket/73402641/cable-news-network-inc-v-perplexity-ai-inc/ | 403 | blocked; single attempt |
| 2026-09-10T05:34:03Z | https://archive.org/download/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.docket.html | 404 | no IA mirror |
| 2026-09-10T05:34:38Z to :39Z | https://storage.courtlistener.com/recap/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.{10,20,30,40}.0.pdf | 404 x4 | those entries are not in RECAP (30 is the motion itself; only its memorandum, 31, is mirrored) |

### Documents on disk **[all foreign retrieval]**
- `recap-26.pdf`: Dkt. 26, so-ordered consent letter extending Perplexity's response deadline to 2026-08-21, endorsed by Judge Loretta A. Preska 2026-06-18, 2 pp. Receipt `2026-09-10T00:19:03Z | ...nysd.664916.26.0.pdf | 200 application/pdf ... 308100`. sha256 pdf 4243bf833dd93a44cbb4d4a953abe88254c64ea02252f7aadc91cc25a88b3e77.
- `recap-31.pdf`: Dkt. 31, Perplexity's Memorandum of Law in Support of Motion to Dismiss, filed 2026-08-21, 29 pp. Receipt `2026-09-10T00:19:04Z | ...nysd.664916.31.0.pdf | 200 application/pdf ... 426941`. sha256 pdf dfb90ccd679d0b9dda8beaaf6025016e5b22ca12923f5fd361415e54524c410e.
- `recap-33.pdf` / `recap-34.pdf`: CNN's 2026-08-27 letter motion to extend its opposition deadline, and the same letter so-ordered by Judge Preska on 2026-08-31 (Dkt. 34, 2 pp). Receipts `...:19:04Z | ...33.0.pdf | 200 ... 69975` and `...:19:05Z | ...34.0.pdf | 200 ... 117637`. sha256 Dkt. 34 pdf 7195d6114a953b49e8ec59109f4bd5776318562924a4e62ca42eac9463c971a7.
- `cl-search-rd.json`: CourtListener docket-entry metadata (79 entries). Metadata only.

Best source found: Dkt. 31 for posture; Dkt. 34 for the latest court act. Role for both: primary record (RECAP-served filings; Dkt. 34 is a court order, Dkt. 31 is a party brief). The existing public_record_link (complaint) remains a primary record.

### Quoted passages
Dkt. 26, p. 1 (Perplexity's letter, so-ordered): "On May 28, 2026, Plaintiff Cable News Network Inc. filed its complaint against Defendant. ECF No. 1. Defendant was served on June 1, 2026. ECF No. 17." Page 2: "SO ORDERED. Loretta A. Preska, Senior United States District Judge, June 18, 2026"

Dkt. 31, p. 9 (brief p. 4): "the copyright claims are divided into two categories—those challenging 'inputs,' i.e., copies of content that are allegedly stored in databases or indexes used in Perplexity's answer generation process (Count I), and those challenging 'outputs,' i.e., the answer engine's automated responses to users' prompts (Counts II and III). While disputed by Perplexity, this motion does not seek dismissal at this stage of the 'input' claims in Count I."

Dkt. 31, p. 21 (brief p. 16): "Third, the Complaint alleges that Perplexity attributes incorrect or hallucinated information in its outputs to Plaintiff, thus diluting Plaintiff's trademarks under 15 U.S.C. § 1125(c)."

Dkt. 31, p. 26 (brief p. 21): "The Complaint identifies no other examples of alleged hallucinations, and in the single instance identified, the answer engine disclaims any reliance on the mistranscription. Because the Complaint's only example is implausible and the Complaint pleads no facts about consumers misattributing incorrect content to CNN, the Court is left to speculate as to whether CNN's brand has been harmed."

Dkt. 31, p. 27 (Conclusion): "For these reasons, Perplexity respectfully requests that the Court dismiss Counts II through V of the Complaint for failure to state a claim."

Dkt. 34, p. 1 (CNN's letter): "On August 21, 2026, Perplexity moved to dismiss the Complaint in this matter. Dkt. 30. Under S.D.N.Y. Civil Rule 6.1(b), Plaintiff's opposition is due September 4, 2026. Plaintiff respectfully requests an extension for its opposition until September 25, 2026." Page 2: "SO ORDERED. Loretta A. Preska, United States District Judge, August 31, 2026"

### Proposed field changes
| field | current | proposed | support |
|---|---|---|---|
| notes_on_resolution | "Complaint (Doc 1, 54 pp) pulled from RECAP and verified 2026-06-01. Copyright + Lanham ... (NYT, Chicago Tribune, Encyclopaedia Britannica/Merriam-Webster, Reddit, Dow Jones)." | append: "Served 2026-06-01 (ECF 17). Assigned to Judge Loretta A. Preska. On 2026-08-21 Perplexity moved to dismiss Counts II-V (output-stage copyright, secondary liability, and the Lanham Act claims including the hallucinated-attribution theory); it expressly did not move against Count I (input-stage copying) (ECF 30-31). CNN's opposition is due 2026-09-25 (ECF 34, so-ordered 2026-08-31). No answer and no ruling on the merits as of the retrieved docket." | Dkts. 26, 31, 34. |
| jurisdiction | "U.S. District Court, Southern District of New York" | unchanged; optionally add "(Preska, J.)" | Dkts. 26, 34 |
| filing_status | "filed" | unchanged. A pending motion to dismiss is not a determination. | n/a |
| secondary_source_links | CourtListener docket page | add https://storage.courtlistener.com/recap/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.31.0.pdf and ...34.0.pdf | as above |

Count: 2 (notes_on_resolution, secondary_source_links).

### Unresolved
- The motion itself (Dkt. 30) and any answer are not in RECAP; only the memorandum is.
- No order on the motion exists yet; the record correctly carries no Determination.
- These documents were retrieved by the foreign process; a steward should re-retrieve Dkts. 31 and 34 from the stable RECAP URLs under the repo contract before writing a receipt.

## AIEL-2026-019 Swanson v. IBM

### URLs I tried
| retrieved_at (UTC) | URL | HTTP | result |
|---|---|---|---|
| 2026-09-10T05:33:21Z | https://govinfo.gov/content/pkg/USCOURTS-txwd-1_26-cv-01382/pdf/USCOURTS-txwd-1_26-cv-01382-0.pdf | 200 -> /error | no opinion package |
| 2026-09-10T05:33:22Z | https://courtlistener.com/docket/73387361/swanson-v-international-business-machines-corporation/ | 403 | blocked; single attempt |
| 2026-09-10T05:34:39Z | https://hcamag.com/us/news/general/24-year-ibm-veteran-sues-says-algorithm-blocked-his-rehire-at-48/576441 | 200 | text/html, 74,983 B, sha256 d71d7e52c42abee9e4409956a74fa8fcf8e2c34eeaf7392fcbc0180817906b61 |

### Documents on disk **[foreign retrieval]**
- `recap-1.1.pdf`: Dkt. 1-1, JS 44 Civil Cover Sheet, filed 2026-05-23, case 1:26-cv-01382-RP. Receipt `2026-09-10T00:20:25Z | ...txwd.1172910442.1.1.pdf | 200 application/pdf`. sha256 pdf 9454296826862ee0d47d5d269706d36db6c6dbb4a61e3c8d0f9eb961cb628ddb.
- `recap-1.2.pdf`: Dkt. 1-2, Exhibit 1 to the complaint: the EEOC New York District Office Determination (2020) re-used from Loeffler-era litigation (its own header reads "Case 7:24-cv-04653 Document 1-1 Filed 06/18/24"). 3 pp. Receipt `2026-09-10T00:20:26Z | ...txwd.1172910442.1.2.pdf | 200 application/pdf`. sha256 pdf e4556b10380ba6a67a63f062c8d08393662b57c662446abd0e85bc6cfe9f77ba.
- `cl-search-rd.json`: 20 docket entries. Metadata only. Entry 8, 2026-08-31, "Answer to Complaint" (not available in RECAP). Entry 1 "Complaint" not available in RECAP; exhibits 2-8 not available.

The complaint itself (Dkt. 1) is still not retrieved by anyone: RECAP holds only the cover sheet and Exhibit 1.

Best source found: Dkt. 1-1 and 1-2 are primary records (RECAP-served filings) but neither describes the screening tool. For the tool question the best source remains reliable reporting (hcamag).

### Quoted passages
Dkt. 1-1 (cover sheet), section VI: "CAUSE OF ACTION ... 29 U.S.C. §§ 621 – 634 ... Brief description of cause: Age discrimination case"; section IV: box "442 Employment" marked; section V: "1 Original" marked; jury demand: Yes.

Dkt. 1-2 (Exhibit 1, EEOC Determination), p. 2: "The Commission's investigation reveals that Respondent conducted Resource Actions analyzed by the EEOC between 2013 and 2018 that had an adverse impact on employees in the protected age group (PAG). The investigation uncovered top-down messaging from Respondent's highest ranks directing managers to engage in an aggressive approach to significantly reduce the headcount of older workers to make room for Early Professional Hires."

Dkt. 1-2, p. 3: "the Commission has determined that there is reasonable cause to believe that Respondent has discriminated against Charging Parties and others on account of their age."

hcamag (2026-05-25), quoting the complaint: "Two days later, he received an automatic rejection that, according to the filing, 'appeared to be generated by artificial intelligence screening software.'" and "Swanson alleges IBM's 'ageist scheme had been programed into its HR screening software,' effectively blacklisting him from rehire." and "The allegations have not been tested in court. IBM has not yet filed a response, and no court has ruled on the claims."

### Complaint allegation versus judicial finding
- No court document establishes anything about the tool. Nothing retrieved is a judicial finding.
- The only primary exhibit on RECAP (EEOC 2020 determination) concerns 2013-2018 layoffs ("Resource Actions") and says nothing about a hiring or rehire screen, algorithmic or otherwise. It cannot support the record's AI attribution.
- The complaint's own tool language, as reported, is hedged ("appeared to be generated by artificial intelligence screening software"; "programed into its HR screening software"). As reported it does not distinguish a machine-learning model from a rules-based screen. The record's caveat stays accurate.
- Docket metadata shows "Answer to Complaint" at entry 8 on 2026-08-31. That is an entry title, not a document; the answer is not in RECAP. It does not establish what IBM admits or denies.

### Proposed field changes
| field | current | proposed | support |
|---|---|---|---|
| notes_on_resolution | "... complaint not yet pulled from PACER. Verify the tool is genuinely AI and re-confirm on next refresh. Sibling matter: ..." | append: "Docket metadata (CourtListener, retrieved 2026-09-10) lists an Answer at entry 8 on 2026-08-31; the answer is not in RECAP and has not been read. RECAP holds only the civil cover sheet (ADEA, 29 U.S.C. §§ 621-634, jury demanded) and Exhibit 1, the 2020 EEOC reasonable-cause determination on IBM's 2013-2018 Resource Actions, which does not describe any hiring screen. Complaint text still unretrieved; ML-vs-rules remains unestablished." | cl-search-rd.json (metadata), Dkts. 1-1, 1-2 |

Count: 1 (a notes update recording what is and is not established; no change to attribution, status, or sources).

### Unresolved
- Complaint text (Dkt. 1) and Answer (Dkt. 8): not in RECAP; PACER purchase or a CourtListener token needed.
- ML-vs-rules: unestablished; admission gate 1 remains partial.
- Filing date 2026-05-23 is a Saturday; the cover sheet header confirms "Filed 05/23/26", so it is correct.

## Summary table

| matter | best source found | role | current status established? | proposed changes | blockers |
|---|---|---|---|---|---|
| AIEL-2024-015 Parks v. McCormac | Dkt. 125, 60-day order administratively terminating on settlement in principle (D.N.J. 2:21-cv-04021, 2024-07-09) [foreign retrieval]; Dkt. 126 filed settlement agreement ($300,000) and stipulations (2024-09-05) [foreign retrieval]; my own retrieval: ACLU amicus ECF 113-1 | primary record (Dkt. 125); party case page (amicus) | yes (settled 2024; no merits ruling), with the entered dismissal order still unlocated | 9 (docket number, status to settled, ai_system_name, harm, notes, link, source_quality, secondary links, legal_graph) | CourtListener 403; Justia 403; RECAP empty after entry 126; Dkt. 126 stipulation pages image-only |
| AIEL-2024-017 Murphy v. EssilorLuxottica | GovInfo USCOURTS Dkt. 26 (M&R 2024-07-18) and Dkt. 30 (remand order 2024-08-14), S.D. Tex. 4:24-cv-00801 (my retrieval); Dkt. 1 notice of removal [foreign retrieval] | primary record | partial (federal stage closed by remand 2024-08-14; state docket unobserved) | 6 | Harris County District Clerk JS-gated; Justia 403 |
| AIEL-2026-020 CNN v. Perplexity | Dkt. 31 MTD memorandum (2026-08-21) and Dkt. 34 so-ordered scheduling letter (2026-08-31), S.D.N.Y. 1:26-cv-04427-LAP [foreign retrieval] | primary record | partial (motion to dismiss Counts II-V pending; opposition due 2026-09-25; no ruling) | 2 (notes, secondary links) | CourtListener 403 for me; Dkt. 30 and any answer not in RECAP; foreign provenance needs re-retrieval for receipts |
| AIEL-2026-019 Swanson v. IBM | Dkt. 1-1 cover sheet and Dkt. 1-2 EEOC exhibit [foreign retrieval]; hcamag reporting (my retrieval) | primary record (exhibits) / reliable reporting (tool description) | no (answer exists only as a docket-entry title dated 2026-08-31; complaint and answer unread) | 1 (notes) | CourtListener 403; complaint/answer not in RECAP; ML-vs-rules unestablished |

## Files in this directory
- `http-log.tsv`: my 21 requests (UTC, status, content-type, final URL, bytes, sha256 of body).
- `fetch-log.txt`, `manifest.py`, `*/manifest.md`, `*.headers`, `recap-*.pdf`, `cl-search*.json`, `govinfo-pkg-*.json`: the foreign process's artifacts, left as found.
- `sha256sums.txt`: digests I computed over the bytes on disk (both sets) and over my pdftotext extractions.
- `*.foreign.txt`: my `pdftotext -layout` extractions of foreign-retrieved PDFs.
- `fetch.sh`: my curl wrapper (User-Agent string inside).
