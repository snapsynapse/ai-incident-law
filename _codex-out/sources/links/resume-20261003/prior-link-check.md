# ai-incident-law source-link check

Generated 2026-10-03T03:07:06.926865+00:00. Status: **partial** until all HTTP and identity checks pass.

Coverage: expected **72** records, actual **72** records; **129** source-link occurrences, **129** unique URLs. Records without their own external links remain explicitly covered.

| Outcome | Link occurrences |
|---|---:|
| BLOCKED | 129 |

Every intended record and URL, including failed/blocked sources, is retained in [link-ledger.json](link-ledger.json); body, receipt, sha256, attempts, redirects and extraction paths are included there.

## Environment blocker

The current environment blocks source-host HTTPS tunnels with proxy CONNECT 403. These are environment-policy denials, not HTTP 403 responses from the source websites. All source statuses and document identities remain unknown behind that block. Robots requests are shared/cached by host, so an individual link receipt can have no new physical attempt; associated shared robots evidence is retained in the ledger. Different access requires applying the source-host allowlist additions in environment settings, then rerunning this check. No unchanged/no-new-docket inference is made.

## Findings

### AIEL-2024-001 — Moffatt v. Air Canada, 2024 BCCRT 149

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 4}
- public_record_link: [https://decisions.civilresolutionbc.ca/crt/crtd/en/525448/1/document.do](https://decisions.civilresolutionbc.ca/crt/crtd/en/525448/1/document.do) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/eba7a49cf00f8c700d365182.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html](https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/329b8a31aedd5ea532324638.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://dentons.com/insights/alerts/2024/february/29/air-canada-liable-for-negligent-misrepresentation-by-chatbot-on-website](https://dentons.com/insights/alerts/2024/february/29/air-canada-liable-for-negligent-misrepresentation-by-chatbot-on-website) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/68555147c5975fc4a7c9ddbd.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://canliiconnects.org/en/commentaries/93547](https://canliiconnects.org/en/commentaries/93547) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/840251b6f57f44bb3f38acb4.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2023-002 — Mata v. Avianca, Inc., No. 22-cv-1461

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_8.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_8.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/110460ef922206f29b5f1306.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://nytimes.com/2023/05/27/nyregion/avianca-airline-lawsuit-chatgpt.html](https://nytimes.com/2023/05/27/nyregion/avianca-airline-lawsuit-chatgpt.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/461d608a1f91be26962a978d.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2024-003 — Park v. Kim, No. 22-2057

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-ca2-22-02057/pdf/USCOURTS-ca2-22-02057-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca2-22-02057/pdf/USCOURTS-ca2-22-02057-0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/d838f0fd70034cfc3adea041.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://law.nyu.edu/sites/default/files/Park%20v.%20Kim,%20No.%2022-2057%20(2024).pdf](https://law.nyu.edu/sites/default/files/Park%20v.%20Kim,%20No.%2022-2057%20(2024).pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/309b350dff8b9ae37f0394f0.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2025-004 — Wadsworth v. Walmart Inc.

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://app.ediscoveryassistant.com/case_law/62637-wadsworth-v-walmart-inc](https://app.ediscoveryassistant.com/case_law/62637-wadsworth-v-walmart-inc) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c7942057ec2985804022e41f.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://news.bloomberglaw.com/litigation/morgan-morgan-lawyers-fined-for-hallucinated-ai-citations](https://news.bloomberglaw.com/litigation/morgan-morgan-lawyers-fined-for-hallucinated-ai-citations) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/dd637250688fe8ee470faba3.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://abajournal.com/news/article/no-42-law-firm-by-headcount-could-face-sanctions-over-fake-case-citations-generated-by-chatgpt](https://abajournal.com/news/article/no-42-law-firm-by-headcount-could-face-sanctions-over-fake-case-citations-generated-by-chatgpt) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/7a256a25aa1433af1031d843.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-005 — Fletcher v. Experian Information Solutions, Inc., No. 25-20086

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://www.ca5.uscourts.gov/opinions/pub/25/25-20086-CV0.pdf](https://www.ca5.uscourts.gov/opinions/pub/25/25-20086-CV0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/99f834c727e3fefb3cca7210.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://reuters.com/legal/government/us-appeals-court-orders-lawyer-pay-2500-over-ai-hallucinations-brief-2026-02-18/](https://reuters.com/legal/government/us-appeals-court-orders-lawyer-pay-2500-over-ai-hallucinations-brief-2026-02-18/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/d5072e8cb6d2c82d07fc151c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2025-006 — Huffman Construction, LLC, ASBCA Nos. 62591, 62783

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://www.asbca.mil/LinkClick.aspx?fileticket=eAIy2KSL_Zg%3D&portalid=143](https://www.asbca.mil/LinkClick.aspx?fileticket=eAIy2KSL_Zg%3D&portalid=143) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/b9f96c2fa9b8e51902f8ea59.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://smithlaw.com/newsroom/publications/you-cant-spell-sanction-without-a-and-i-when-unchecked-ai-hallucinations-result-in-court-sanctions](https://smithlaw.com/newsroom/publications/you-cant-spell-sanction-without-a-and-i-when-unchecked-ai-hallucinations-result-in-court-sanctions) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c334dd8b1a3527163f4e77d9.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://burr.com/government-contracting/gen-ai-misuse-in-procurement-litigation](https://burr.com/government-contracting/gen-ai-misuse-in-procurement-litigation) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/cdf251e6afc92328cf1d6c13.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2025-007 — Buchanan v. Vuori, Inc., No. 5:23-cv-01121-NC

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cand.409525/gov.uscourts.cand.409525.96.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cand.409525/gov.uscourts.cand.409525.96.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/d6a544d61322a5771b617262.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://blogs.duanemorris.com/classactiondefense/2026/02/03/ai-hallucinated-case-citations-prompt-sanctions-and-delay-class-action-settlement/](https://blogs.duanemorris.com/classactiondefense/2026/02/03/ai-hallucinated-case-citations-prompt-sanctions-and-delay-class-action-settlement/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/99792c6d20c3d6b0287f3995.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://vibegraveyard.ai/story/ndcal-dal-bon-ai-citation-class-action-sanctions/](https://vibegraveyard.ai/story/ndcal-dal-bon-ai-citation-class-action-sanctions/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/cd9e1bbcb60197d6309f2f29.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2024-008 — In re Thomas Grant Neusom / The Florida Bar v. Neusom

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://ecf.flmd.uscourts.gov/cgi-bin/show_public_doc?2024-00002-6-2-mc](https://ecf.flmd.uscourts.gov/cgi-bin/show_public_doc?2024-00002-6-2-mc) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/8fd78849bfc1bbe38efc7a04.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://lawnext.com/wp-content/uploads/2024/03/M.D.-Fla.-24-mc-00002-dckt-000003_000-filed-2024-02-01.pdf](https://lawnext.com/wp-content/uploads/2024/03/M.D.-Fla.-24-mc-00002-dckt-000003_000-filed-2024-02-01.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/f6c55fd8b577c7506d28f155.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://jcorsmeier.wordpress.com/2024/03/20/florida-middle-district-federal-judge-suspends-florida-lawyer-for-filing-false-cases-created-by-artificial-intelligence/](https://jcorsmeier.wordpress.com/2024/03/20/florida-middle-district-federal-judge-suspends-florida-lawyer-for-filing-false-cases-created-by-artificial-intelligence/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/8f3d0e6edabb5d2d67b9ae57.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2023-009 — EEOC v. iTutorGroup, Inc., et al., No. 1:22-cv-02565

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit](https://eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/256408fe75b5416c22b5e50e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://seyfarth.com/news-insights/eeocs-settlement-challenging-simple-algorithm-provides-warning-for-employers-using-artificial-intelligence.html](https://seyfarth.com/news-insights/eeocs-settlement-challenging-simple-algorithm-provides-warning-for-employers-using-artificial-intelligence.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/d22a9b06ab98fd8308fb961e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2024-010 — Louis et al. v. SafeRent Solutions, LLC et al.

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://justice.gov/crt/case/louis-et-al-v-saferent-et-al-d-mass](https://justice.gov/crt/case/louis-et-al-v-saferent-et-al-d-mass) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/7deb4bb63737184c1478a174.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://justice.gov/archives/opa/pr/justice-department-files-statement-interest-fair-housing-act-case-alleging-unlawful-algorithm](https://justice.gov/archives/opa/pr/justice-department-files-statement-interest-fair-housing-act-case-alleging-unlawful-algorithm) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/73b43e625a8bbfc01e68ad7b.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://cohenmilstein.com/rental-applicants-reach-2-28m-settlement-agreement-for-discriminatory-ai-powered-screening-tool/](https://cohenmilstein.com/rental-applicants-reach-2-28m-settlement-agreement-for-discriminatory-ai-powered-screening-tool/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a1ee124e9d87690b9fc1d0a4.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2022-011 — Bauserman v. Unemployment Insurance Agency

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://michigan.gov/ag/news/press-releases/2022/10/20/som-settlement-of-civil-rights-class-action-alleging-false-accusations-of-unemployment-fraud](https://michigan.gov/ag/news/press-releases/2022/10/20/som-settlement-of-civil-rights-class-action-alleging-false-accusations-of-unemployment-fraud) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a6e984d37ab43528b64d9de2.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://law.justia.com/cases/michigan/supreme-court/2022/160813.html](https://law.justia.com/cases/michigan/supreme-court/2022/160813.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/9e8f8991b24a5bcaadb9502a.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://btah.org/case-study/michigan-unemployment-insurance-false-fraud-determinations.html](https://btah.org/case-study/michigan-unemployment-insurance-false-fraud-determinations.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/124add3f3a20cd76ff58055d.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2017-012 — Ledgerwood v. Arkansas Department of Human Services / related federal litigation

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://arcourts.gov/sites/default/files/Appellate%20Update%20November%202017.pdf](https://arcourts.gov/sites/default/files/Appellate%20Update%20November%202017.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/198a1f1a40b4ecbd2bd5babd.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://humanservices.arkansas.gov/divisions-shared-services/aging-adult-behavioral-health-services/find-home-community-based-services-for-adults-seniors/archoices-in-homecare/court-ordered-information/](https://humanservices.arkansas.gov/divisions-shared-services/aging-adult-behavioral-health-services/find-home-community-based-services-for-adults-seniors/archoices-in-homecare/court-ordered-information/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/b674c0f8c6de63770d1ae552.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://btah.org/case-study/arkansas-medicaid-home-and-community-based-services-hours-cuts.html](https://btah.org/case-study/arkansas-medicaid-home-and-community-based-services-hours-cuts.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e567b20bb82d6da84cf110d5.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2023-013 — FTC v. Rite Aid facial-recognition enforcement

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://ftc.gov/news-events/news/press-releases/2023/12/rite-aid-banned-using-ai-facial-recognition-after-ftc-says-retailer-deployed-technology-without](https://ftc.gov/news-events/news/press-releases/2023/12/rite-aid-banned-using-ai-facial-recognition-after-ftc-says-retailer-deployed-technology-without) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/27bc725e899792aadcb7ba65.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2024-014 — Williams v. City of Detroit, No. 2:21-cv-10827

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest](https://aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/537ebe16155338a5cfd4697d.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://freep.com/story/news/local/michigan/detroit/2024/06/28/man-wrongfully-arrested-with-facial-recognition-tech-settles-lawsuit/74243839007/](https://freep.com/story/news/local/michigan/detroit/2024/06/28/man-wrongfully-arrested-with-facial-recognition-tech-settles-lawsuit/74243839007/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/de492bda0710e2ef6a400f2c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://aclumich.org/cases/facial-recognition/](https://aclumich.org/cases/facial-recognition/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/71fa4842052f3053854584b7.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2024-015 — Parks v. McCormac, No. 2:21-cv-04021 (D.N.J.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 6}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.125.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.125.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/31c08f7726fdbc0f97bb2ff6.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.126.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.126.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/6fdd93e4d6a52582ffd83bcf.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://assets.aclu.org/live/uploads/2024/01/113-1.-ACLU-ACLU-NJ-Amicus-Brief-Filed.pdf](https://assets.aclu.org/live/uploads/2024/01/113-1.-ACLU-ACLU-NJ-Amicus-Brief-Filed.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/12f86939b830e1882869457c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://aclu.org/cases/parks-v-mccormac](https://aclu.org/cases/parks-v-mccormac) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/1f55b1b8012330e47309f86b.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://aclu-nj.org/press-releases/aclu-nj-and-aclu-national-file-amicus-challenge-wrongful-arrest-due-face-recognition/](https://aclu-nj.org/press-releases/aclu-nj-and-aclu-national-file-amicus-challenge-wrongful-arrest-due-face-recognition/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/ffbefac8c7a8f9bdcd901c09.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://nytimes.com/2020/12/29/technology/facial-recognition-misidentify-jail.html](https://nytimes.com/2020/12/29/technology/facial-recognition-misidentify-jail.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/7a2c041db7c37f255b95e47b.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2025-016 — Woodruff v. Oliver, No. 2:23-cv-11597

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 3}
- public_record_link: [https://aclu.org/cases/woodruff-v-oliver](https://aclu.org/cases/woodruff-v-oliver) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/abc0c3cfb1adee20891ace6f.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://democracynow.org/2023/8/9/porcha_woodruff_false_facial_recognition_arrest](https://democracynow.org/2023/8/9/porcha_woodruff_false_facial_recognition_arrest) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/816456d1ff12756bd15357b6.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://cbsnews.com/detroit/news/woman-wrongly-accused-carjacking-loses-lawsuit-detroit-police-used-facial-tech/](https://cbsnews.com/detroit/news/woman-wrongly-accused-carjacking-loses-lawsuit-detroit-police-used-facial-tech/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/dfd0da080779829f705fe17f.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2024-017 — Murphy v. EssilorLuxottica USA Inc. et al., No. 2024-03265

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 7}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf](https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/5f08070de16bbe8114dcdc76.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/81f7e32841a15b3361211e10.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://regmedia.co.uk/2024/01/23/harvey_eugene_murphy_jr_lawsuit.pdf](https://regmedia.co.uk/2024/01/23/harvey_eugene_murphy_jr_lawsuit.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/264a7ddb22dee822d150e466.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://dockets.justia.com/docket/texas/txsdce/4:2024cv00801/1952110](https://dockets.justia.com/docket/texas/txsdce/4:2024cv00801/1952110) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c6725e5a7d9df0ee2a1c05fd.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://cbsnews.com/news/facial-recognition-mistaken-identity-sunglass-hut-robber-harvey-eugene-murphy-suing-after-sexually-assaulted-jail/](https://cbsnews.com/news/facial-recognition-mistaken-identity-sunglass-hut-robber-harvey-eugene-murphy-suing-after-sexually-assaulted-jail/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/aad035d51134f4a2dfc59272.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- docket-observation: [https://www.hcdistrictclerk.com/Edocs/Public/Search.aspx](https://www.hcdistrictclerk.com/Edocs/Public/Search.aspx) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/b595aaf22a376c7a544778ff.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- docket-observation: [https://www.courtlistener.com/?q=%224%3A24-cv-00801%22&type=d](https://www.courtlistener.com/?q=%224%3A24-cv-00801%22&type=d) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/6cceb8b69adaa2ce771ecd9e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2025-018 — Mobley v. Workday, Inc., No. 3:23-cv-00770

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 4}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-cand-3_23-cv-00770/pdf/USCOURTS-cand-3_23-cv-00770-1.pdf](https://govinfo.gov/content/pkg/USCOURTS-cand-3_23-cv-00770/pdf/USCOURTS-cand-3_23-cv-00770-1.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/b08093dd9b8bf87572d33dab.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://clearinghouse.net/case/44074/](https://clearinghouse.net/case/44074/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c9be3c88f5bf09e70ea5d19f.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://fisherphillips.com/en/insights/insights/discrimination-lawsuit-over-workdays-ai-hiring-tools-can-proceed-as-class-action-6-things](https://fisherphillips.com/en/insights/insights/discrimination-lawsuit-over-workdays-ai-hiring-tools-can-proceed-as-class-action-6-things) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/f09ea5b2dd507c36e471d005.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- docket-observation: [https://www.courtlistener.com/?q=%223%3A23-cv-00770%22&type=d](https://www.courtlistener.com/?q=%223%3A23-cv-00770%22&type=d) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/5fc67d4a5c0d73cf4ce53bd8.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2026-019 — Swanson v. International Business Machines Corporation, No. 1:26-cv-01382

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://courtlistener.com/docket/73387361/swanson-v-international-business-machines-corporation/](https://courtlistener.com/docket/73387361/swanson-v-international-business-machines-corporation/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e05eed395095344ea3aa234e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://hcamag.com/us/news/general/24-year-ibm-veteran-sues-says-algorithm-blocked-his-rehire-at-48/576441](https://hcamag.com/us/news/general/24-year-ibm-veteran-sues-says-algorithm-blocked-his-rehire-at-48/576441) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/3dae00fdb9e77667c3b993c3.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2026-020 — Cable News Network, Inc. v. Perplexity AI, Inc., No. 1:26-cv-04427

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.1.0_1.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.1.0_1.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e2d2fe047cb29c9593893702.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://courtlistener.com/docket/73402641/cable-news-network-inc-v-perplexity-ai-inc/](https://courtlistener.com/docket/73402641/cable-news-network-inc-v-perplexity-ai-inc/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a7f56642649157a08d8272e9.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2026-021 — State of Oklahoma ex rel. Oklahoma Bar Association v. Reeves, 2026 OK 37

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=551746](https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=551746) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e55ebc1148e5511896be218c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.alnd.179677/gov.uscourts.alnd.179677.204.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.alnd.179677/gov.uscourts.alnd.179677.204.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/d467acfcd8c21b6bd3b4591e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-022 — Guo v. Meade Motorcars, L.L.C., 2026-Ohio-1930 (No. S-25-035)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://supremecourt.ohio.gov/rod/docs/pdf/6/2026/2026-Ohio-1930.pdf](https://supremecourt.ohio.gov/rod/docs/pdf/6/2026/2026-Ohio-1930.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/feeebd838c8df9bcabe4af6b.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-023 — United States v. Farris, No. 25-5623 (6th Cir.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://www.opn.ca6.uscourts.gov/opinions.pdf/26a0105p-06.pdf](https://www.opn.ca6.uscourts.gov/opinions.pdf/26a0105p-06.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/2774d166d9661bb4f2feca51.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-024 — Hill v. Workday, Inc., No. 3:23-cv-06558-PHK

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cand.422617/gov.uscourts.cand.422617.230.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cand.422617/gov.uscourts.cand.422617.230.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/059c0bd969167bd7b1946315.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-025 — Chaney v. Transdev Services Inc., No. 2:24-cv-10761-ODW (AJRx)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cacd.951252/gov.uscourts.cacd.951252.46.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cacd.951252/gov.uscourts.cacd.951252.46.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/ab9b406368f681ea274d5523.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-026 — Jimenez-Fogarty v. Fogarty, No. 1:24-cv-08705-JLR-GWG (S.D.N.Y.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.631979/gov.uscourts.nysd.631979.192.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.631979/gov.uscourts.nysd.631979.192.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a2b106f42f0245bf29cdbf99.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-027 — Ibach v. Stewart, No. SC-2025-0106 (Ala.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://publicportal-api.alappeals.gov/courts/68f021c4-6a44-4735-9a76-5360b2e8af13/cms/case/47683afc-2f85-469d-8562-9dca094bb680/docketentrydocuments/d95cdd15-7428-4cc9-8389-3cc27ac88089](https://publicportal-api.alappeals.gov/courts/68f021c4-6a44-4735-9a76-5360b2e8af13/cms/case/47683afc-2f85-469d-8562-9dca094bb680/docketentrydocuments/d95cdd15-7428-4cc9-8389-3cc27ac88089) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/36816ad8a829d9d77e8d1f24.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://publicportal.alappeals.gov/portal/court/68f021c4-6a44-4735-9a76-5360b2e8af13/case/47683afc-2f85-469d-8562-9dca094bb680](https://publicportal.alappeals.gov/portal/court/68f021c4-6a44-4735-9a76-5360b2e8af13/case/47683afc-2f85-469d-8562-9dca094bb680) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/5792d77322ad2aa6836c21e2.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-028 — Bunce v. Visual Technology Innovations, Inc., No. 2:23-cv-01740-KNS

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.225.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.225.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/5a8ff933ecf1d99beee5a22a.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.226.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.226.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/94ee32969cf0a6caa3bcb716.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-029 — Obi v. Cook County, Illinois, No. 1:25-cv-03096

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.97.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.97.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/065792da73cd4c81fca06c05.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.96.0_1.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.96.0_1.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/2df0db910919417205ec0f4f.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-030 — Hulvat v. Gumina, 2026 IL App (3d) 240628-U

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://illinoiscourts.gov/resources/63539016-cb02-4575-b3da-0dd0632244c1/file](https://illinoiscourts.gov/resources/63539016-cb02-4575-b3da-0dd0632244c1/file) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/4eb69ea34abfa670682f6131.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-031 — In re Wise, No. 25-51132 (Bankr. W.D. La.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.lawb.374130/gov.uscourts.lawb.374130.84.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.lawb.374130/gov.uscourts.lawb.374130.84.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/1994eb1b1dab7cef3ea26bac.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-032 — Torres Campos v. Munoz, No. D085584 (Cal. Ct. App., 4th Dist., Div. One)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://courts.ca.gov/opinions/archive/D085584.PDF](https://courts.ca.gov/opinions/archive/D085584.PDF) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c33e2938182e57405bc1dec7.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-033 — Kattom v. Bondi, No. 25-1497 SEC P (W.D. La.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.lawd.213966/gov.uscourts.lawd.213966.28.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.lawd.213966/gov.uscourts.lawd.213966.28.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a1a1447a709b7f9207f6d78c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-034 — Gentry v. Thompson, No. 2:25-cv-01260-CJB-EJD (E.D. La.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.laed.273860/gov.uscourts.laed.273860.25.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.laed.273860/gov.uscourts.laed.273860.25.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/df38f95afcb894214eb47981.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-035 — State v. Coleman, 2026-Ohio-965, No. 2024-A-0040 (Ohio Ct. App., 11th Dist.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://supremecourt.ohio.gov/rod/docs/pdf/11/2026/2026-Ohio-965.pdf](https://supremecourt.ohio.gov/rod/docs/pdf/11/2026/2026-Ohio-965.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/eb35ed6a699fe5f7b1842fdc.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-036 — Couvrette v. Wisnovsky, No. 1:21-cv-00157-CL (D. Or.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ord.158388/gov.uscourts.ord.158388.225.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ord.158388/gov.uscourts.ord.158388.225.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/37feaca3bacbf07ebf96ad48.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://courtlistener.com/docket/55220104/226/couvrette-v-wisnovsky/](https://courtlistener.com/docket/55220104/226/couvrette-v-wisnovsky/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/336a0004bad8d3f089fb58a7.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-037 — Heimkes v. Fairhope Motorcoach Resort Condominium Owners Association et al., No. 1:22-cv-00448-TFM-N (S.D. Ala.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.alsd.70919/gov.uscourts.alsd.70919.353.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.alsd.70919/gov.uscourts.alsd.70919.353.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/37f02d67fd499f3b194502bd.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-038 — Rivera v. Triad Properties Corporation et al., No. 2:24-cv-01802-AMM (N.D. Ala.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.alnd.192599/gov.uscourts.alnd.192599.116.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.alnd.192599/gov.uscourts.alnd.192599.116.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/acd0f0fcdd66ca039c777904.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-040 — Coomer v. Lindell/MyPillow Inc., No. 1:22-cv-01129-NYW-SBP (D. Colo.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cod.215068/gov.uscourts.cod.215068.424.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cod.215068/gov.uscourts.cod.215068.424.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c4385cfe000eb05d6a9ee615.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-041 — Chakma v. Sushi Katsuei Inc., No. 1:23-cv-07804-KPF (S.D.N.Y.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.605627/gov.uscourts.nysd.605627.142.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.605627/gov.uscourts.nysd.605627.142.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/dba9473e3260a7bb454837a7.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-042 — Davis v. Marion County Superior Court Juvenile Detention Center, No. 1:24-cv-01918-JRO-MJD (S.D. Ind.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.insd.217901/gov.uscourts.insd.217901.127.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.insd.217901/gov.uscourts.insd.217901.127.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/f64896b310d941f926b6a710.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-043 — Perez-Castillo v. Blanche (Att'y Gen.), No. 25-1988 (7th Cir.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://media.ca7.uscourts.gov/cgi-bin/OpinionsWeb/processWebInputExternal.pl?Submit=Display&Path=Y2026/D06-01/C:25-1988:J:Brennan:aut:T:fnOp:N:3550588:S:0](https://media.ca7.uscourts.gov/cgi-bin/OpinionsWeb/processWebInputExternal.pl?Submit=Display&Path=Y2026/D06-01/C:25-1988:J:Brennan:aut:T:fnOp:N:3550588:S:0) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/83e20621b2777129221d48ad.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-ca7-25-01988/pdf/USCOURTS-ca7-25-01988-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca7-25-01988/pdf/USCOURTS-ca7-25-01988-0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/26ab15fbccaa642797cd3da1.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-044 — Deutsche Bank Natl. Trust Co. v. LeTennier, 2026 NY Slip Op 00040, Docket No. CV-23-0713 (N.Y. App. Div., 3d Dep’t)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://nycourts.gov/reporter/3dseries/2026/2026_00040.htm](https://nycourts.gov/reporter/3dseries/2026/2026_00040.htm) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/70118c80fb732b05af89c3ae.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-045 — Hodges v. Meridian Waste Acquisitions USA, No. 3:25-cv-62; Rieske v. AFS, No. 5:25-cv-45 (M.D. Fla.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.flmd.436812/gov.uscourts.flmd.436812.53.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.flmd.436812/gov.uscourts.flmd.436812.53.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a7c52170187cfc22a07d6636.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-046 — Lifetime Well LLC v. IBSpot.com Inc., No. 2:25-cv-05135-MAK (E.D. Pa.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-paed-2_25-cv-05135/pdf/USCOURTS-paed-2_25-cv-05135-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-paed-2_25-cv-05135/pdf/USCOURTS-paed-2_25-cv-05135-0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/bd471411adea9376ca5c1535.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.paed.643304/gov.uscourts.paed.643304.42.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.paed.643304/gov.uscourts.paed.643304.42.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/ba24fab53d932f1122e73679.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-047 — Lexos Media IP, LLC v. Overstock.com, Inc., No. 2:22-cv-02324-JAR (D. Kan.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-ksd-2_22-cv-02324/pdf/USCOURTS-ksd-2_22-cv-02324-9.pdf](https://govinfo.gov/content/pkg/USCOURTS-ksd-2_22-cv-02324/pdf/USCOURTS-ksd-2_22-cv-02324-9.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c8cd29c5a8258d4c01167202.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.ksd.142916/gov.uscourts.ksd.142916.218.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ksd.142916/gov.uscourts.ksd.142916.218.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/92cc05929edacc89ec8cf358.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-048 — Amarsingh v. Frontier Airlines, Inc., No. 24-1391 (10th Cir.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://ca10.uscourts.gov/sites/ca10/files/opinions/010111382504.pdf](https://ca10.uscourts.gov/sites/ca10/files/opinions/010111382504.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/19ce85adbec4e9bab5ad7a74.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-ca10-24-01391/pdf/USCOURTS-ca10-24-01391-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca10-24-01391/pdf/USCOURTS-ca10-24-01391-0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/67f2f3cda04c5ac2e0662753.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-049 — EFD USA, Inc. v. Band Pro Film and Digital, Inc., No. B329314 (Cal. Ct. App., 2d Dist., Div. Three) (unpublished)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://courts.ca.gov/opinions/nonpub/B329314.PDF](https://courts.ca.gov/opinions/nonpub/B329314.PDF) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c74c6efb12806c29360be1b2.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-050 — Maldonado v. Professional Animal Retirement Center (PARC), No. 1:25-cv-00454-HAB-ALT (N.D. Ind.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.innd.124045/gov.uscourts.innd.124045.26.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.innd.124045/gov.uscourts.innd.124045.26.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/23d3f6b6ae73774115566f72.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-051 — In re Rosslyn2016, LLC, Texas Esencia 2019 LLC and Timbers2020 LLC, No. 25-34507 (Bankr. S.D. Tex., Houston Div.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.txsb.485264/gov.uscourts.txsb.485264.312.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.txsb.485264/gov.uscourts.txsb.485264.312.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e7e9b5dbb07c42ebf65ef9d4.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://courtlistener.com/docket/71022557/rosslyn2016-llc-and-texas-esencia-2019-llc/](https://courtlistener.com/docket/71022557/rosslyn2016-llc-and-texas-esencia-2019-llc/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/50951995c5b45a8970069985.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-052 — Del Biaggio v. Bansen, No. A174647 (Cal. Ct. App., 1st Dist., Div. 4) (Humboldt County Super. Ct. No. CV1901078)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://courts.ca.gov/opinions/documents/A174647.PDF](https://courts.ca.gov/opinions/documents/A174647.PDF) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/b16859410011ec354977b45c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://courts.ca.gov/opinions](https://courts.ca.gov/opinions) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e83b583c4f85ff8241a87d28.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-053 — Akerlund v. Atlas Air, Inc., Flight Services International, LLC, No. 24-11033 (11th Cir.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://media.ca11.uscourts.gov/opinions/pub/files/202411033.pdf](https://media.ca11.uscourts.gov/opinions/pub/files/202411033.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/4488e90663c5994b94a8c924.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-ca11-24-11033/pdf/USCOURTS-ca11-24-11033-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca11-24-11033/pdf/USCOURTS-ca11-24-11033-0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/7c9f62927684792fe7072ad9.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-054 — Hannah Renea Payne v. The State, No. S26A0459 (Ga.), 324 Ga. 305

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://www.gasupreme.us/wp-content/uploads/2026/05/s26a0459.pdf](https://www.gasupreme.us/wp-content/uploads/2026/05/s26a0459.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a8d23fdf9359f7218f628ad4.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-055 — Withers v. City of Aberdeen, No. 1:24-CV-218-SA-RP (N.D. Miss.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.msnd.50181/gov.uscourts.msnd.50181.123.0_1.pdf](https://storage.courtlistener.com/recap/gov.uscourts.msnd.50181/gov.uscourts.msnd.50181.123.0_1.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e7110f6c16f3c90d2079a149.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-056 — Joseph Cartagena v. Terrance Dixon, Tyrone Blackburn, and T.A. Blackburn Law, PLLC, No. 1:25-cv-03552 (JLR) (S.D.N.Y.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.641455/gov.uscourts.nysd.641455.161.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.641455/gov.uscourts.nysd.641455.161.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/4e0574c7d216247ba814407a.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-057 — Matter of: CVTEK, LLC, B-423943; B-423943.2 (U.S. Government Accountability Office)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://gao.gov/assets/890/884082.pdf](https://gao.gov/assets/890/884082.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/f998ff5f1e5a8f33af3af68e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://gao.gov/products/b-423943,b-423943.2](https://gao.gov/products/b-423943,b-423943.2) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/4419f4c041ffed68198c0677.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-058 — Jakes v. Youngblood, No. 2:24-cv-01608-WSS (W.D. Pa.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.pawd.314851/gov.uscourts.pawd.314851.71.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.pawd.314851/gov.uscourts.pawd.314851.71.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/5031bd66f0926be0a687f5df.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-059 — Billups v. Louisville Municipal School District, No. 1:24-cv-00074-SA-RP (N.D. Miss.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.msnd.49169/gov.uscourts.msnd.49169.79.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.msnd.49169/gov.uscourts.msnd.49169.79.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/882e9b7bdcd95b5bf1a3e5c8.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-060 — Scott v. Illinois Human Rights Commission, 2026 IL App (1st) 251462, No. 1-25-1462

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://illinoiscourts.gov/resources/23d7df84-ed51-48df-8477-3a6872db40d5/file](https://illinoiscourts.gov/resources/23d7df84-ed51-48df-8477-3a6872db40d5/file) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/11f99c15622a686e7fc2618a.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-061 — Barteca Holdings LLC v. Tacobarn Newtown LLC, No. 3:26-cv-00250-VDO (D. Conn.), ECF No. 43

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ctd.169303/gov.uscourts.ctd.169303.43.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ctd.169303/gov.uscourts.ctd.169303.43.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/dd694e458f97ec07bd039303.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-062 — LeDoux v. Outliers, Inc., No. 3:24-cv-05808-TMC (W.D. Wash.), ECF No. 265

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.265.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.265.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/e124ab1a9843491ccac67494.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.269.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.269.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/8c89a02b11420bfb01f439f8.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-063 — TOV Realty, LLC v. Suarez (SC 21183) and Kosel Equity, LLC v. MacGregor (SC 21184), 355 Conn. 902 (2026)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://jud.ct.gov/external/supapp/Cases/AROcr/CR355/ORD355.3.pdf](https://jud.ct.gov/external/supapp/Cases/AROcr/CR355/ORD355.3.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/14ce481baa631da15f977475.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-064 — Fuselier v. Riscassi, No. 1:25-cv-268-HSO-BWR (S.D. Miss.), ECF No. 28

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.28.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.28.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/20cedafe17e5aa7c9135d8c0.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.25.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.25.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/2a25445289e84d2cc0144e12.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-065 — Beslissing in de zaak 26-379/DB/LI/D, ECLI:NL:TADRSHE:2026:93 (Raad van Discipline in het ressort 's-Hertogenbosch)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://tuchtrecht.overheid.nl/zoeken/resultaat/uitspraak/2026/ECLI_NL_TADRSHE_2026_93](https://tuchtrecht.overheid.nl/zoeken/resultaat/uitspraak/2026/ECLI_NL_TADRSHE_2026_93) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/ec9309937bb8198e33c8dc1e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-066 — Erin Booker v. The Kroger Co., No. 1:26-cv-02006-SDG (N.D. Ga.), ECF No. 66

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.gand.358237/gov.uscourts.gand.358237.66.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.gand.358237/gov.uscourts.gand.358237.66.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/9e35a2794a4fea716b45236e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-067 — Capital Standard, LLC v. U.S. Bank National Association, as trustee for Bear Stearns Asset Backed Securities I Trust 2005-AC9, No. 2D2024-1392 (Fla. 2d DCA)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://flcourts-media.flcourts.gov/content/download/2494161/opinion/Opinion_2024-1392.pdf](https://flcourts-media.flcourts.gov/content/download/2494161/opinion/Opinion_2024-1392.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/242cccef3f3754c601af21d8.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-068 — Michael L. Ruiz v. Magellan Financial & Insurance Services, No. CV-23-02090-PHX-DWL (D. Ariz.), Doc. 179

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.azd.1348340/gov.uscourts.azd.1348340.179.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.azd.1348340/gov.uscourts.azd.1348340.179.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/815968efa39913acaec601d1.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-069 — In re Brian E. Mitchell, Proceeding No. D2026-16 (USPTO Office of Enrollment and Discipline)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://foiadocuments.uspto.gov/oed/Mitchell-Order-D2026-16-Redacted.pdf](https://foiadocuments.uspto.gov/oed/Mitchell-Order-D2026-16-Redacted.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/c946b4014d00ca0c1f38071d.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-070 — Tiekert v. Village of Mamaroneck, No. 23-CV-8714 (CS) (S.D.N.Y.), ECF No. 100

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.607614/gov.uscourts.nysd.607614.100.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.607614/gov.uscourts.nysd.607614.100.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/a4e0ec7e31b0a927ec470dc6.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-071 — Douglas v. Deutsche Bank National Trust Company, No. 24-CV-1099 (D.C. Ct. App.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://dccourts.gov/sites/default/files/2026-09/Douglas%20v.%20Deutsche%20Bank%20Nat%27l%20Trt%20Co.%2024-CV-1099%20ORDER.pdf](https://dccourts.gov/sites/default/files/2026-09/Douglas%20v.%20Deutsche%20Bank%20Nat%27l%20Trt%20Co.%2024-CV-1099%20ORDER.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/875948c1ae53cd5889959af2.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://reason.com/volokh/2026/09/04/incredulity-that-competent-law-firm-representing-one-of-the-largest-financial-institutions-in-the-world-filed-brief-with-ai-hallucinations/](https://reason.com/volokh/2026/09/04/incredulity-that-competent-law-firm-representing-one-of-the-largest-financial-institutions-in-the-world-filed-brief-with-ai-hallucinations/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/7a22ddcb43a485f4b14ebc4b.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-072 — Beus Gilbert PLLC v. Brigham Young University, No. 2:12-cv-00970-TS (D. Utah), Dkt. 385

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.utd.86552/gov.uscourts.utd.86552.385.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.utd.86552/gov.uscourts.utd.86552.385.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/b21bf76b8787f026df8901e5.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-073 — Cole v. Hobby Town Unlimited, Inc., No. 4:25-cv-04217-SLD-RLH (C.D. Ill.), ECF No. 33

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ilcd.98203/gov.uscourts.ilcd.98203.33.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ilcd.98203/gov.uscourts.ilcd.98203.33.0.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/f7bbfbcd7049b793cab535e4.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

## Methods and limits

- HTTP 200 does not establish identity. PASS requires SHA256 matching retained document or normalized retained source text; title matches alone remain human review.
- All attempt receipts, redirects, MIME types, bytes and extracted text retained under _codex-out/sources/links. Transport retries and robots checks are centralized.
- Empty-body SHA256 on blocked receipts is a transport artifact, not a retrieved official-source digest. Shared robots failure receipts apply across host URLs; zero source attempts must not be confused with successful or failed origin requests.
- Historical MIME type unavailable for many sources; unknown remains unknown.
- 403/429 are failures or blocked access, never treated as passes, even though original AIL checker allows known bot-filtered hosts.
- A metadata/docket title is a lead, not a determination; latest docket and comparable baseline are needed to infer new entries.
- Inspected existing AIL `assessSourceResponse` and PubLedge `check-links.js`. The latter is an internal generated-page link checker. Direct network checkers were not run because they do not implement the sweep's shared politeness/robots policy and stricter identity/403 requirements.
- No paid providers, secret values, data updates, Verified/Checked updates or human attestations used or written.

## Logical checks and physical transport attempts

129 unique URL checks; 0 physical source retrieval attempts; 92 shared robots transport attempts on these hosts. Robots traffic overlaps portfolio/repository reports and must not be summed. A CONNECT denial is an attempted transport, not an origin HTTP response.

| Host | Source URLs | Source physical attempts | Shared robots attempts |
|---|---:|---:|---:|
| abajournal.com | 1 | 0 | 2 |
| aclu-nj.org | 1 | 0 | 2 |
| aclu.org | 3 | 0 | 2 |
| aclumich.org | 1 | 0 | 2 |
| app.ediscoveryassistant.com | 1 | 0 | 2 |
| arcourts.gov | 1 | 0 | 2 |
| assets.aclu.org | 1 | 0 | 2 |
| blogs.duanemorris.com | 1 | 0 | 2 |
| btah.org | 2 | 0 | 2 |
| burr.com | 1 | 0 | 2 |
| ca10.uscourts.gov | 1 | 0 | 2 |
| canlii.org | 1 | 0 | 2 |
| canliiconnects.org | 1 | 0 | 2 |
| cbsnews.com | 2 | 0 | 2 |
| clearinghouse.net | 1 | 0 | 2 |
| cohenmilstein.com | 1 | 0 | 2 |
| courtlistener.com | 4 | 0 | 2 |
| courts.ca.gov | 4 | 0 | 2 |
| dccourts.gov | 1 | 0 | 2 |
| decisions.civilresolutionbc.ca | 1 | 0 | 2 |
| democracynow.org | 1 | 0 | 2 |
| dentons.com | 1 | 0 | 2 |
| dockets.justia.com | 1 | 0 | 2 |
| ecf.flmd.uscourts.gov | 1 | 0 | 2 |
| eeoc.gov | 1 | 0 | 2 |
| fisherphillips.com | 1 | 0 | 2 |
| flcourts-media.flcourts.gov | 1 | 0 | 1 |
| foiadocuments.uspto.gov | 1 | 0 | 1 |
| freep.com | 1 | 0 | 1 |
| ftc.gov | 1 | 0 | 1 |
| gao.gov | 2 | 0 | 1 |
| govinfo.gov | 9 | 0 | 1 |
| hcamag.com | 1 | 0 | 1 |
| humanservices.arkansas.gov | 1 | 0 | 1 |
| illinoiscourts.gov | 2 | 0 | 1 |
| jcorsmeier.wordpress.com | 1 | 0 | 1 |
| jud.ct.gov | 1 | 0 | 1 |
| justice.gov | 2 | 0 | 1 |
| law.justia.com | 1 | 0 | 1 |
| law.nyu.edu | 1 | 0 | 1 |
| lawnext.com | 1 | 0 | 1 |
| media.ca11.uscourts.gov | 1 | 0 | 1 |
| media.ca7.uscourts.gov | 1 | 0 | 1 |
| michigan.gov | 1 | 0 | 1 |
| news.bloomberglaw.com | 1 | 0 | 1 |
| nycourts.gov | 1 | 0 | 1 |
| nytimes.com | 2 | 0 | 1 |
| publicportal-api.alappeals.gov | 1 | 0 | 1 |
| publicportal.alappeals.gov | 1 | 0 | 1 |
| reason.com | 1 | 0 | 1 |
| regmedia.co.uk | 1 | 0 | 1 |
| reuters.com | 1 | 0 | 1 |
| seyfarth.com | 1 | 0 | 1 |
| smithlaw.com | 1 | 0 | 1 |
| storage.courtlistener.com | 41 | 0 | 1 |
| supremecourt.ohio.gov | 2 | 0 | 1 |
| tuchtrecht.overheid.nl | 1 | 0 | 1 |
| vibegraveyard.ai | 1 | 0 | 1 |
| www.asbca.mil | 1 | 0 | 1 |
| www.ca5.uscourts.gov | 1 | 0 | 1 |
| www.courtlistener.com | 2 | 0 | 2 |
| www.gasupreme.us | 1 | 0 | 1 |
| www.hcdistrictclerk.com | 1 | 0 | 1 |
| www.opn.ca6.uscourts.gov | 1 | 0 | 1 |
| www.oscn.net | 1 | 0 | 1 |
