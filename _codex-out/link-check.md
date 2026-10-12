# ai-incident-law source-link check

Generated 2026-10-03T18:55:41.341550+00:00. Status: **partial** until all HTTP and identity checks pass.

Coverage: expected **72** records, actual **72** records; **129** source-link occurrences, **129** unique URLs. Records without their own external links remain explicitly covered.

| Outcome | Link occurrences |
|---|---:|
| BLOCKED | 32 |
| NEEDS-HUMAN | 85 |
| PASS | 12 |

Every intended record and URL, including failed/blocked sources, is retained in [link-ledger.json](link-ledger.json); body, receipt, sha256, attempts, redirects and extraction paths are included there.

## Environment blocker

The initial environment blocked source-host tunnels with proxy CONNECT403. After the hostallowlist was applied, the corpus was resumed once under the same TLS, robots and request-budget controls. Current failures may instead be origin/proxy HTTP errors, upstream certificate-verification errors, robots exclusions or source-specific challenges; each result is distinguished in its receipt. Prior committed bytes/receipts are retained and each ledger row links its previous result. No failed fetch establishes unchanged text or no-new-docket status.

## Findings

### AIEL-2024-001 — Moffatt v. Air Canada, 2024 BCCRT 149

Source: `data/data.json#datasets.included.records`. {"PASS": 1, "BLOCKED": 3}
- public_record_link: [https://decisions.civilresolutionbc.ca/crt/crtd/en/525448/1/document.do](https://decisions.civilresolutionbc.ca/crt/crtd/en/525448/1/document.do) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/eba7a49cf00f8c700d365182.json`; sha256 `4dd97ce46d0d3f858488dd5ddfac85ec6fb993fcf7ba85567bd2875548f7e394`.
- secondary_source_links: [https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html](https://canlii.org/en/bc/bccrt/doc/2024/2024bccrt149/2024bccrt149.html) — **BLOCKED**, HTTP None, BLOCKED: robots.txt disallows this URL for PAICELegalFreshness/1.0. Receipt: `_codex-out/sources/links/resume-20261003/329b8a31aedd5ea532324638.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://dentons.com/insights/alerts/2024/february/29/air-canada-liable-for-negligent-misrepresentation-by-chatbot-on-website](https://dentons.com/insights/alerts/2024/february/29/air-canada-liable-for-negligent-misrepresentation-by-chatbot-on-website) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/68555147c5975fc4a7c9ddbd.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://canliiconnects.org/en/commentaries/93547](https://canliiconnects.org/en/commentaries/93547) — **BLOCKED**, HTTP None, BLOCKED: robots.txt disallows this URL for PAICELegalFreshness/1.0. Receipt: `_codex-out/sources/links/resume-20261003/840251b6f57f44bb3f38acb4.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2023-002 — Mata v. Avianca, Inc., No. 22-cv-1461

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1, "BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_8.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.575368/gov.uscourts.nysd.575368.54.0_8.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/110460ef922206f29b5f1306.json`; sha256 `68c7e61823d8dd1540e1b8ce61ce3da99d601f032e4ea22825eba224a78c4d32`.
- secondary_source_links: [https://nytimes.com/2023/05/27/nyregion/avianca-airline-lawsuit-chatgpt.html](https://nytimes.com/2023/05/27/nyregion/avianca-airline-lawsuit-chatgpt.html) — **BLOCKED**, HTTP None, BLOCKED: robots transport failed; policy unknown. Receipt: `_codex-out/sources/links/resume-20261003/461d608a1f91be26962a978d.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2024-003 — Park v. Kim, No. 22-2057

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1, "BLOCKED": 1}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-ca2-22-02057/pdf/USCOURTS-ca2-22-02057-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca2-22-02057/pdf/USCOURTS-ca2-22-02057-0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/d838f0fd70034cfc3adea041.json`; sha256 `c7dacbeb0233640e2a2ad750d8ce44828bf1124f8c0eec5084a072fc0587cf37`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-ca2-22-02057/pdf/USCOURTS-ca2-22-02057-0.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-ca2-22-02057/pdf/USCOURTS-ca2-22-02057-0.pdf", "status": 301}]
- secondary_source_links: [https://law.nyu.edu/sites/default/files/Park%20v.%20Kim,%20No.%2022-2057%20(2024).pdf](https://law.nyu.edu/sites/default/files/Park%20v.%20Kim,%20No.%2022-2057%20(2024).pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/309b350dff8b9ae37f0394f0.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2025-004 — Wadsworth v. Walmart Inc.

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1, "NEEDS-HUMAN": 2}
- public_record_link: [https://app.ediscoveryassistant.com/case_law/62637-wadsworth-v-walmart-inc](https://app.ediscoveryassistant.com/case_law/62637-wadsworth-v-walmart-inc) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/c7942057ec2985804022e41f.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://news.bloomberglaw.com/litigation/morgan-morgan-lawyers-fined-for-hallucinated-ai-citations](https://news.bloomberglaw.com/litigation/morgan-morgan-lawyers-fined-for-hallucinated-ai-citations) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/dd637250688fe8ee470faba3.json`; sha256 `5365b9692b14afe1ae9f04eec3b7ddc06ef9e3539b51a0d9cae9825065329315`.
- secondary_source_links: [https://abajournal.com/news/article/no-42-law-firm-by-headcount-could-face-sanctions-over-fake-case-citations-generated-by-chatgpt](https://abajournal.com/news/article/no-42-law-firm-by-headcount-could-face-sanctions-over-fake-case-citations-generated-by-chatgpt) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/7a256a25aa1433af1031d843.json`; sha256 `59991b9adaf8f479e479128bef7903badd58f6b8bf0a446c63fef64ec2cd60ac`. Redirects: [{"from": "https://abajournal.com/news/article/no-42-law-firm-by-headcount-could-face-sanctions-over-fake-case-citations-generated-by-chatgpt", "to": "https://www.abajournal.com/news/article/no-42-law-firm-by-headcount-could-face-sanctions-over-fake-case-citations-generated-by-chatgpt", "status": 301}]

### AIEL-2026-005 — Fletcher v. Experian Information Solutions, Inc., No. 25-20086

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1, "BLOCKED": 1}
- public_record_link: [https://www.ca5.uscourts.gov/opinions/pub/25/25-20086-CV0.pdf](https://www.ca5.uscourts.gov/opinions/pub/25/25-20086-CV0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/99f834c727e3fefb3cca7210.json`; sha256 `5e5c200bfc40b0b7b09ea785b6dfb3b892013a92ffb466818067b8ccecd30ed9`.
- secondary_source_links: [https://reuters.com/legal/government/us-appeals-court-orders-lawyer-pay-2500-over-ai-hallucinations-brief-2026-02-18/](https://reuters.com/legal/government/us-appeals-court-orders-lawyer-pay-2500-over-ai-hallucinations-brief-2026-02-18/) — **BLOCKED**, HTTP None, BLOCKED: robots.txt disallows this URL for PAICELegalFreshness/1.0. Receipt: `_codex-out/sources/links/resume-20261003/d5072e8cb6d2c82d07fc151c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2025-006 — Huffman Construction, LLC, ASBCA Nos. 62591, 62783

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1, "NEEDS-HUMAN": 2}
- public_record_link: [https://www.asbca.mil/LinkClick.aspx?fileticket=eAIy2KSL_Zg%3D&portalid=143](https://www.asbca.mil/LinkClick.aspx?fileticket=eAIy2KSL_Zg%3D&portalid=143) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/b9f96c2fa9b8e51902f8ea59.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://smithlaw.com/newsroom/publications/you-cant-spell-sanction-without-a-and-i-when-unchecked-ai-hallucinations-result-in-court-sanctions](https://smithlaw.com/newsroom/publications/you-cant-spell-sanction-without-a-and-i-when-unchecked-ai-hallucinations-result-in-court-sanctions) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/c334dd8b1a3527163f4e77d9.json`; sha256 `74d2734422709967f188aa0218e181172b4bcaba9c58c29697875a9593aa8ed3`. Redirects: [{"from": "https://smithlaw.com/newsroom/publications/you-cant-spell-sanction-without-a-and-i-when-unchecked-ai-hallucinations-result-in-court-sanctions", "to": "https://www.smithlaw.com/newsroom/publications/you-cant-spell-sanction-without-a-and-i-when-unchecked-ai-hallucinations-result-in-court-sanctions", "status": 301}]
- secondary_source_links: [https://burr.com/government-contracting/gen-ai-misuse-in-procurement-litigation](https://burr.com/government-contracting/gen-ai-misuse-in-procurement-litigation) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/cdf251e6afc92328cf1d6c13.json`; sha256 `cba5e971b130a7330836885e8aa628770c7af98ce215f8c6af4985b3581777b6`. Redirects: [{"from": "https://burr.com/government-contracting/gen-ai-misuse-in-procurement-litigation", "to": "https://www.burr.com/government-contracting/gen-ai-misuse-in-procurement-litigation", "status": 302}]

### AIEL-2025-007 — Buchanan v. Vuori, Inc., No. 5:23-cv-01121-NC

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 3}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cand.409525/gov.uscourts.cand.409525.96.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cand.409525/gov.uscourts.cand.409525.96.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/d6a544d61322a5771b617262.json`; sha256 `ad486efd71bb21f3c8ca523b650a20006ab07a3ededb329000fbd08caf7fce0f`.
- secondary_source_links: [https://blogs.duanemorris.com/classactiondefense/2026/02/03/ai-hallucinated-case-citations-prompt-sanctions-and-delay-class-action-settlement/](https://blogs.duanemorris.com/classactiondefense/2026/02/03/ai-hallucinated-case-citations-prompt-sanctions-and-delay-class-action-settlement/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/99792c6d20c3d6b0287f3995.json`; sha256 `46aa2f9c683ad7f552dc3bd1552b411571b107ec2278bd82ccdf86c6f5e5ee76`.
- secondary_source_links: [https://vibegraveyard.ai/story/ndcal-dal-bon-ai-citation-class-action-sanctions/](https://vibegraveyard.ai/story/ndcal-dal-bon-ai-citation-class-action-sanctions/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/cd9e1bbcb60197d6309f2f29.json`; sha256 `1ea43e11b5a16e02c76aec44ace9a2e27004ded0471192507ec087273a32d342`.

### AIEL-2024-008 — In re Thomas Grant Neusom / The Florida Bar v. Neusom

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 3}
- public_record_link: [https://ecf.flmd.uscourts.gov/cgi-bin/show_public_doc?2024-00002-6-2-mc](https://ecf.flmd.uscourts.gov/cgi-bin/show_public_doc?2024-00002-6-2-mc) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/8fd78849bfc1bbe38efc7a04.json`; sha256 `7c5deaa49bab0fc1b4bfe8f70781a44a5470bd805da35a13de910e429d6a2ecd`.
- secondary_source_links: [https://lawnext.com/wp-content/uploads/2024/03/M.D.-Fla.-24-mc-00002-dckt-000003_000-filed-2024-02-01.pdf](https://lawnext.com/wp-content/uploads/2024/03/M.D.-Fla.-24-mc-00002-dckt-000003_000-filed-2024-02-01.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/f6c55fd8b577c7506d28f155.json`; sha256 `8c1dbd7bdd2b140f2b037917e3bcc834d188b14fe958d7d960ad6ca099763e06`. Redirects: [{"from": "https://lawnext.com/wp-content/uploads/2024/03/M.D.-Fla.-24-mc-00002-dckt-000003_000-filed-2024-02-01.pdf", "to": "https://www.lawnext.com/wp-content/uploads/2024/03/M.D.-Fla.-24-mc-00002-dckt-000003_000-filed-2024-02-01.pdf", "status": 301}]
- secondary_source_links: [https://jcorsmeier.wordpress.com/2024/03/20/florida-middle-district-federal-judge-suspends-florida-lawyer-for-filing-false-cases-created-by-artificial-intelligence/](https://jcorsmeier.wordpress.com/2024/03/20/florida-middle-district-federal-judge-suspends-florida-lawyer-for-filing-false-cases-created-by-artificial-intelligence/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/8f3d0e6edabb5d2d67b9ae57.json`; sha256 `374fd0bc9c3a48cb3450b1b80965097f7bf874b4be0ad646c0610878a40714d8`.

### AIEL-2023-009 — EEOC v. iTutorGroup, Inc., et al., No. 1:22-cv-02565

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit](https://eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/256408fe75b5416c22b5e50e.json`; sha256 `6747e3def3f6b1e0992222a4e6f8ff55f5b8819a445342a7d05db854e709efb1`. Redirects: [{"from": "https://eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit", "to": "https://www.eeoc.gov/newsroom/itutorgroup-pay-365000-settle-eeoc-discriminatory-hiring-suit", "status": 302}]
- secondary_source_links: [https://seyfarth.com/news-insights/eeocs-settlement-challenging-simple-algorithm-provides-warning-for-employers-using-artificial-intelligence.html](https://seyfarth.com/news-insights/eeocs-settlement-challenging-simple-algorithm-provides-warning-for-employers-using-artificial-intelligence.html) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/d22a9b06ab98fd8308fb961e.json`; sha256 `8c4fe26dbcabdba5db32b4b489430644fe203c7b141c4613ff41c5d9861a8828`. Redirects: [{"from": "https://seyfarth.com/news-insights/eeocs-settlement-challenging-simple-algorithm-provides-warning-for-employers-using-artificial-intelligence.html", "to": "https://www.seyfarth.com/news-insights/eeocs-settlement-challenging-simple-algorithm-provides-warning-for-employers-using-artificial-intelligence.html", "status": 301}]

### AIEL-2024-010 — Louis et al. v. SafeRent Solutions, LLC et al.

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 3}
- public_record_link: [https://justice.gov/crt/case/louis-et-al-v-saferent-et-al-d-mass](https://justice.gov/crt/case/louis-et-al-v-saferent-et-al-d-mass) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/7deb4bb63737184c1478a174.json`; sha256 `97ce30b24dc440bf9f46ab0f32e10bae155ce0c5d0b6fac675efda7b0ba3abe2`. Redirects: [{"from": "https://justice.gov/crt/case/louis-et-al-v-saferent-et-al-d-mass", "to": "https://www.justice.gov/crt/case/louis-et-al-v-saferent-et-al-d-mass", "status": 301}]
- secondary_source_links: [https://justice.gov/archives/opa/pr/justice-department-files-statement-interest-fair-housing-act-case-alleging-unlawful-algorithm](https://justice.gov/archives/opa/pr/justice-department-files-statement-interest-fair-housing-act-case-alleging-unlawful-algorithm) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/73b43e625a8bbfc01e68ad7b.json`; sha256 `9e6827ce16b97951caa50fc8c21819f769e3818bc6e1241d9558aaa7fd3c7488`. Redirects: [{"from": "https://justice.gov/archives/opa/pr/justice-department-files-statement-interest-fair-housing-act-case-alleging-unlawful-algorithm", "to": "https://www.justice.gov/archives/opa/pr/justice-department-files-statement-interest-fair-housing-act-case-alleging-unlawful-algorithm", "status": 301}]
- secondary_source_links: [https://cohenmilstein.com/rental-applicants-reach-2-28m-settlement-agreement-for-discriminatory-ai-powered-screening-tool/](https://cohenmilstein.com/rental-applicants-reach-2-28m-settlement-agreement-for-discriminatory-ai-powered-screening-tool/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/a1ee124e9d87690b9fc1d0a4.json`; sha256 `1a3813568e868bac6a4e795b1928c5fb5c24b8e9bc2f92e692f5288e1bdd38ac`. Redirects: [{"from": "https://cohenmilstein.com/rental-applicants-reach-2-28m-settlement-agreement-for-discriminatory-ai-powered-screening-tool/", "to": "https://www.cohenmilstein.com/rental-applicants-reach-2-28m-settlement-agreement-for-discriminatory-ai-powered-screening-tool/", "status": 301}]

### AIEL-2022-011 — Bauserman v. Unemployment Insurance Agency

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 3}
- public_record_link: [https://michigan.gov/ag/news/press-releases/2022/10/20/som-settlement-of-civil-rights-class-action-alleging-false-accusations-of-unemployment-fraud](https://michigan.gov/ag/news/press-releases/2022/10/20/som-settlement-of-civil-rights-class-action-alleging-false-accusations-of-unemployment-fraud) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/a6e984d37ab43528b64d9de2.json`; sha256 `5fae5af297fc5942a0d031686d60398046893ee5ad9dbea0571ceb74b78a178c`. Redirects: [{"from": "https://michigan.gov/ag/news/press-releases/2022/10/20/som-settlement-of-civil-rights-class-action-alleging-false-accusations-of-unemployment-fraud", "to": "https://www.michigan.gov/ag/news/press-releases/2022/10/20/som-settlement-of-civil-rights-class-action-alleging-false-accusations-of-unemployment-fraud", "status": 301}]
- secondary_source_links: [https://law.justia.com/cases/michigan/supreme-court/2022/160813.html](https://law.justia.com/cases/michigan/supreme-court/2022/160813.html) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/9e8f8991b24a5bcaadb9502a.json`; sha256 `7a99dabbd3b5791f4f7daf00df89c080084492486801461d9060e5d3ebd04095`.
- secondary_source_links: [https://btah.org/case-study/michigan-unemployment-insurance-false-fraud-determinations.html](https://btah.org/case-study/michigan-unemployment-insurance-false-fraud-determinations.html) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/124add3f3a20cd76ff58055d.json`; sha256 `f7b15d414d097d6991832407741d3f4441796177c6499a1077455aeb4cc1641a`. Redirects: [{"from": "https://btah.org/case-study/michigan-unemployment-insurance-false-fraud-determinations.html", "to": "https://www.btah.org/case-study/michigan-unemployment-insurance-false-fraud-determinations.html", "status": 301}]

### AIEL-2017-012 — Ledgerwood v. Arkansas Department of Human Services / related federal litigation

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 3}
- public_record_link: [https://arcourts.gov/sites/default/files/Appellate%20Update%20November%202017.pdf](https://arcourts.gov/sites/default/files/Appellate%20Update%20November%202017.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/198a1f1a40b4ecbd2bd5babd.json`; sha256 `2624781cfd72a246bc9cb6751559eeafff076bd552ce66e2b9f6d8511b0c3440`.
- secondary_source_links: [https://humanservices.arkansas.gov/divisions-shared-services/aging-adult-behavioral-health-services/find-home-community-based-services-for-adults-seniors/archoices-in-homecare/court-ordered-information/](https://humanservices.arkansas.gov/divisions-shared-services/aging-adult-behavioral-health-services/find-home-community-based-services-for-adults-seniors/archoices-in-homecare/court-ordered-information/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/b674c0f8c6de63770d1ae552.json`; sha256 `98ea6bfb680cc041af115b9d238bb9a202b47719af346670c8746ea8bd61676d`.
- secondary_source_links: [https://btah.org/case-study/arkansas-medicaid-home-and-community-based-services-hours-cuts.html](https://btah.org/case-study/arkansas-medicaid-home-and-community-based-services-hours-cuts.html) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/e567b20bb82d6da84cf110d5.json`; sha256 `a0f3b045b9b48ebb1b591485711236e88eddd72aea91182546892786cf117d94`. Redirects: [{"from": "https://btah.org/case-study/arkansas-medicaid-home-and-community-based-services-hours-cuts.html", "to": "https://www.btah.org/case-study/arkansas-medicaid-home-and-community-based-services-hours-cuts.html", "status": 301}]

### AIEL-2023-013 — FTC v. Rite Aid facial-recognition enforcement

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://ftc.gov/news-events/news/press-releases/2023/12/rite-aid-banned-using-ai-facial-recognition-after-ftc-says-retailer-deployed-technology-without](https://ftc.gov/news-events/news/press-releases/2023/12/rite-aid-banned-using-ai-facial-recognition-after-ftc-says-retailer-deployed-technology-without) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/27bc725e899792aadcb7ba65.json`; sha256 `9af865dd2a7df11f71b3576eab8b62b651f4b2697144da248d89ca4ad431b68c`. Redirects: [{"from": "https://ftc.gov/news-events/news/press-releases/2023/12/rite-aid-banned-using-ai-facial-recognition-after-ftc-says-retailer-deployed-technology-without", "to": "https://www.ftc.gov/news-events/news/press-releases/2023/12/rite-aid-banned-using-ai-facial-recognition-after-ftc-says-retailer-deployed-technology-without", "status": 301}]

### AIEL-2024-014 — Williams v. City of Detroit, No. 2:21-cv-10827

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2, "BLOCKED": 1}
- public_record_link: [https://aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest](https://aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/537ebe16155338a5cfd4697d.json`; sha256 `6937cb49bc5e4365559130647d94ac8b7910ac39356be88dfb0cafd47fddbaa3`. Redirects: [{"from": "https://aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest", "to": "https://www.aclu.org/cases/williams-v-city-of-detroit-face-recognition-false-arrest", "status": 301}]
- secondary_source_links: [https://freep.com/story/news/local/michigan/detroit/2024/06/28/man-wrongfully-arrested-with-facial-recognition-tech-settles-lawsuit/74243839007/](https://freep.com/story/news/local/michigan/detroit/2024/06/28/man-wrongfully-arrested-with-facial-recognition-tech-settles-lawsuit/74243839007/) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/de492bda0710e2ef6a400f2c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://aclumich.org/cases/facial-recognition/](https://aclumich.org/cases/facial-recognition/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/71fa4842052f3053854584b7.json`; sha256 `cea405d3187c0cf9c0823d267f7f26af040413976eb8bb152494744a7116c637`. Redirects: [{"from": "https://aclumich.org/cases/facial-recognition/", "to": "https://www.aclumich.org/cases/facial-recognition/", "status": 301}]

### AIEL-2024-015 — Parks v. McCormac, No. 2:21-cv-04021 (D.N.J.)

Source: `data/data.json#datasets.included.records`. {"PASS": 3, "NEEDS-HUMAN": 2, "BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.125.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.125.0.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/31c08f7726fdbc0f97bb2ff6.json`; sha256 `05eca68abe0d82baa74a3c12904b4f01e5beb8288adcc9a8a935715a7415f6ef`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.126.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.njd.462874/gov.uscourts.njd.462874.126.0.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/6fdd93e4d6a52582ffd83bcf.json`; sha256 `f924f3c92d7f377460cf45fa4c4170ece75e53e71754d890aaadd76698527bd0`.
- secondary_source_links: [https://assets.aclu.org/live/uploads/2024/01/113-1.-ACLU-ACLU-NJ-Amicus-Brief-Filed.pdf](https://assets.aclu.org/live/uploads/2024/01/113-1.-ACLU-ACLU-NJ-Amicus-Brief-Filed.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/12f86939b830e1882869457c.json`; sha256 `599bd21fd3f4a8b50ea16f44ed8c2506ec25c78e9ea5a1bbb6d7bf42a8cae01b`.
- secondary_source_links: [https://aclu.org/cases/parks-v-mccormac](https://aclu.org/cases/parks-v-mccormac) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/1f55b1b8012330e47309f86b.json`; sha256 `469256b1266bb6387ca853f30857297511a1d190c107f68da83b19b98283731c`. Redirects: [{"from": "https://aclu.org/cases/parks-v-mccormac", "to": "https://www.aclu.org/cases/parks-v-mccormac", "status": 301}]
- secondary_source_links: [https://aclu-nj.org/press-releases/aclu-nj-and-aclu-national-file-amicus-challenge-wrongful-arrest-due-face-recognition/](https://aclu-nj.org/press-releases/aclu-nj-and-aclu-national-file-amicus-challenge-wrongful-arrest-due-face-recognition/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/ffbefac8c7a8f9bdcd901c09.json`; sha256 `6f269acdcda5a316b679bc75166a4b487150c17561965ac8605426a0ff5d15af`. Redirects: [{"from": "https://aclu-nj.org/press-releases/aclu-nj-and-aclu-national-file-amicus-challenge-wrongful-arrest-due-face-recognition/", "to": "https://www.aclu-nj.org/press-releases/aclu-nj-and-aclu-national-file-amicus-challenge-wrongful-arrest-due-face-recognition/", "status": 301}]
- secondary_source_links: [https://nytimes.com/2020/12/29/technology/facial-recognition-misidentify-jail.html](https://nytimes.com/2020/12/29/technology/facial-recognition-misidentify-jail.html) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/7a2c041db7c37f255b95e47b.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2025-016 — Woodruff v. Oliver, No. 2:23-cv-11597

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 3}
- public_record_link: [https://aclu.org/cases/woodruff-v-oliver](https://aclu.org/cases/woodruff-v-oliver) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/abc0c3cfb1adee20891ace6f.json`; sha256 `52aca414b9a6362f0d367c0089e77ab456f719c083eddcef31ee2674bc1f5dff`. Redirects: [{"from": "https://aclu.org/cases/woodruff-v-oliver", "to": "https://www.aclu.org/cases/woodruff-v-oliver", "status": 301}]
- secondary_source_links: [https://democracynow.org/2023/8/9/porcha_woodruff_false_facial_recognition_arrest](https://democracynow.org/2023/8/9/porcha_woodruff_false_facial_recognition_arrest) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/816456d1ff12756bd15357b6.json`; sha256 `9801ca7a5f2ade7e94db14850d37c41113933ac93f121be699d42b9b3ba19ffd`. Redirects: [{"from": "https://democracynow.org/2023/8/9/porcha_woodruff_false_facial_recognition_arrest", "to": "https://www.democracynow.org/2023/8/9/porcha_woodruff_false_facial_recognition_arrest", "status": 301}]
- secondary_source_links: [https://cbsnews.com/detroit/news/woman-wrongly-accused-carjacking-loses-lawsuit-detroit-police-used-facial-tech/](https://cbsnews.com/detroit/news/woman-wrongly-accused-carjacking-loses-lawsuit-detroit-police-used-facial-tech/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/dfd0da080779829f705fe17f.json`; sha256 `ef471c7d08d82a1de767de73760dd444b633f5f3111dee84d8ced2f07fa77958`. Redirects: [{"from": "https://cbsnews.com/detroit/news/woman-wrongly-accused-carjacking-loses-lawsuit-detroit-police-used-facial-tech/", "to": "https://www.cbsnews.com/detroit/news/woman-wrongly-accused-carjacking-loses-lawsuit-detroit-police-used-facial-tech/", "status": 301}]

### AIEL-2024-017 — Murphy v. EssilorLuxottica USA Inc. et al., No. 2024-03265

Source: `data/data.json#datasets.included.records`. {"PASS": 3, "NEEDS-HUMAN": 3, "BLOCKED": 1}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf](https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/5f08070de16bbe8114dcdc76.json`; sha256 `5a2f86df0427226d91ea93ec612779461d4986618c74a68a251f8fd717325dea`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-1.pdf", "status": 301}]
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/81f7e32841a15b3361211e10.json`; sha256 `c3dad389a192a66897eafc51f99786888528374656e0aa903240e4f0b19e8b6f`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-txsd-4_24-cv-00801/pdf/USCOURTS-txsd-4_24-cv-00801-0.pdf", "status": 301}]
- secondary_source_links: [https://regmedia.co.uk/2024/01/23/harvey_eugene_murphy_jr_lawsuit.pdf](https://regmedia.co.uk/2024/01/23/harvey_eugene_murphy_jr_lawsuit.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/264a7ddb22dee822d150e466.json`; sha256 `61d048acfad05c951c67c2a8f84e1e6bfde087661d4f077d064eb81882836f9f`.
- secondary_source_links: [https://dockets.justia.com/docket/texas/txsdce/4:2024cv00801/1952110](https://dockets.justia.com/docket/texas/txsdce/4:2024cv00801/1952110) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/c6725e5a7d9df0ee2a1c05fd.json`; sha256 `918121b07920a5ba77c90b9ea304434b48a564588becdab44753e8d9654527d3`.
- secondary_source_links: [https://cbsnews.com/news/facial-recognition-mistaken-identity-sunglass-hut-robber-harvey-eugene-murphy-suing-after-sexually-assaulted-jail/](https://cbsnews.com/news/facial-recognition-mistaken-identity-sunglass-hut-robber-harvey-eugene-murphy-suing-after-sexually-assaulted-jail/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/aad035d51134f4a2dfc59272.json`; sha256 `ed640b7da0deef940761262a1c9cba4fbe46d714819c8f89f322eb3f14565fe7`. Redirects: [{"from": "https://cbsnews.com/news/facial-recognition-mistaken-identity-sunglass-hut-robber-harvey-eugene-murphy-suing-after-sexually-assaulted-jail/", "to": "https://www.cbsnews.com/news/facial-recognition-mistaken-identity-sunglass-hut-robber-harvey-eugene-murphy-suing-after-sexually-assaulted-jail/", "status": 301}]
- docket-observation: [https://www.hcdistrictclerk.com/Edocs/Public/Search.aspx](https://www.hcdistrictclerk.com/Edocs/Public/Search.aspx) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/b595aaf22a376c7a544778ff.json`; sha256 `dc940f333807d02a107c93f6757a2a3f35244d926558b711e34d968877cdfcb3`.
- docket-observation: [https://www.courtlistener.com/?q=%224%3A24-cv-00801%22&type=d](https://www.courtlistener.com/?q=%224%3A24-cv-00801%22&type=d) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/6cceb8b69adaa2ce771ecd9e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2025-018 — Mobley v. Workday, Inc., No. 3:23-cv-00770

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 3, "BLOCKED": 1}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-cand-3_23-cv-00770/pdf/USCOURTS-cand-3_23-cv-00770-1.pdf](https://govinfo.gov/content/pkg/USCOURTS-cand-3_23-cv-00770/pdf/USCOURTS-cand-3_23-cv-00770-1.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/b08093dd9b8bf87572d33dab.json`; sha256 `a939fda09949cdd6cc7ea6086f9c32c7a2b2186d0344036b595748aea46e03e6`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-cand-3_23-cv-00770/pdf/USCOURTS-cand-3_23-cv-00770-1.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-cand-3_23-cv-00770/pdf/USCOURTS-cand-3_23-cv-00770-1.pdf", "status": 301}]
- secondary_source_links: [https://clearinghouse.net/case/44074/](https://clearinghouse.net/case/44074/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/c9be3c88f5bf09e70ea5d19f.json`; sha256 `2744f6540cfcc5625a5e03fc6027e03c65bbebe1346391c7e8d9b601fac514fa`.
- secondary_source_links: [https://fisherphillips.com/en/insights/insights/discrimination-lawsuit-over-workdays-ai-hiring-tools-can-proceed-as-class-action-6-things](https://fisherphillips.com/en/insights/insights/discrimination-lawsuit-over-workdays-ai-hiring-tools-can-proceed-as-class-action-6-things) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/f09ea5b2dd507c36e471d005.json`; sha256 `6a8114ed422fc09fbf5f31b7eb6831efff25859e560c89ef8c3dd2d0e9f5c8ed`. Redirects: [{"from": "https://fisherphillips.com/en/insights/insights/discrimination-lawsuit-over-workdays-ai-hiring-tools-can-proceed-as-class-action-6-things", "to": "https://www.fisherphillips.com/en/insights/insights/discrimination-lawsuit-over-workdays-ai-hiring-tools-can-proceed-as-class-action-6-things", "status": 301}]
- docket-observation: [https://www.courtlistener.com/?q=%223%3A23-cv-00770%22&type=d](https://www.courtlistener.com/?q=%223%3A23-cv-00770%22&type=d) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/5fc67d4a5c0d73cf4ce53bd8.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2026-019 — Swanson v. International Business Machines Corporation, No. 1:26-cv-01382

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1, "NEEDS-HUMAN": 1}
- public_record_link: [https://courtlistener.com/docket/73387361/swanson-v-international-business-machines-corporation/](https://courtlistener.com/docket/73387361/swanson-v-international-business-machines-corporation/) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/e05eed395095344ea3aa234e.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://hcamag.com/us/news/general/24-year-ibm-veteran-sues-says-algorithm-blocked-his-rehire-at-48/576441](https://hcamag.com/us/news/general/24-year-ibm-veteran-sues-says-algorithm-blocked-his-rehire-at-48/576441) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/3dae00fdb9e77667c3b993c3.json`; sha256 `2cac9b7dc44148aac03a90fe92a04c2a8da0d1b9e259e620e000d655b17f4056`. Redirects: [{"from": "https://hcamag.com/us/news/general/24-year-ibm-veteran-sues-says-algorithm-blocked-his-rehire-at-48/576441", "to": "https://www.hcamag.com/us/news/general/24-year-ibm-veteran-sues-says-algorithm-blocked-his-rehire-at-48/576441", "status": 308}]

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2026-020 — Cable News Network, Inc. v. Perplexity AI, Inc., No. 1:26-cv-04427

Source: `data/data.json#datasets.included.records`. {"PASS": 1, "BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.1.0_1.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.664916/gov.uscourts.nysd.664916.1.0_1.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/cnn-size-retry/e2d2fe047cb29c9593893702.json`; sha256 `24084289b1deaf52ca6637c6a8ee26c96dffcc3fbf682483ccfb7f4ff3d5eef3`.
- secondary_source_links: [https://courtlistener.com/docket/73402641/cable-news-network-inc-v-perplexity-ai-inc/](https://courtlistener.com/docket/73402641/cable-news-network-inc-v-perplexity-ai-inc/) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/a7f56642649157a08d8272e9.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

Docket lead check: Public docket page/search attempted where discoverable. No reliable fresh docket listing and comparable baseline established; cannot infer no new entries. Historical September09 follow-up remains a lead, not current evidence.

### AIEL-2026-021 — State of Oklahoma ex rel. Oklahoma Bar Association v. Reeves, 2026 OK 37

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1, "NEEDS-HUMAN": 1}
- public_record_link: [https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=551746](https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=551746) — **BLOCKED**, HTTP None, BLOCKED: robots.txt disallows this URL for PAICELegalFreshness/1.0. Receipt: `_codex-out/sources/links/resume-20261003/e55ebc1148e5511896be218c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.alnd.179677/gov.uscourts.alnd.179677.204.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.alnd.179677/gov.uscourts.alnd.179677.204.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/d467acfcd8c21b6bd3b4591e.json`; sha256 `ab08aa572489f0efb313d64efbfb799715392e086bf8747cbe305e6286b023f2`.

### AIEL-2026-022 — Guo v. Meade Motorcars, L.L.C., 2026-Ohio-1930 (No. S-25-035)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://supremecourt.ohio.gov/rod/docs/pdf/6/2026/2026-Ohio-1930.pdf](https://supremecourt.ohio.gov/rod/docs/pdf/6/2026/2026-Ohio-1930.pdf) — **BLOCKED**, HTTP None, BLOCKED: robots transport failed; policy unknown. Receipt: `_codex-out/sources/links/resume-20261003/feeebd838c8df9bcabe4af6b.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-023 — United States v. Farris, No. 25-5623 (6th Cir.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://www.opn.ca6.uscourts.gov/opinions.pdf/26a0105p-06.pdf](https://www.opn.ca6.uscourts.gov/opinions.pdf/26a0105p-06.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/2774d166d9661bb4f2feca51.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-024 — Hill v. Workday, Inc., No. 3:23-cv-06558-PHK

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cand.422617/gov.uscourts.cand.422617.230.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cand.422617/gov.uscourts.cand.422617.230.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/059c0bd969167bd7b1946315.json`; sha256 `6c54c6093e768296591840664a2625cb752ecc08f7c53cb5f40a612c6ab6295b`.

### AIEL-2026-025 — Chaney v. Transdev Services Inc., No. 2:24-cv-10761-ODW (AJRx)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cacd.951252/gov.uscourts.cacd.951252.46.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cacd.951252/gov.uscourts.cacd.951252.46.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/ab9b406368f681ea274d5523.json`; sha256 `9678cabb0520ae74734f87a1c8ee3ffc4f4c20ad48f47259d82eb8bf94c53119`.

### AIEL-2026-026 — Jimenez-Fogarty v. Fogarty, No. 1:24-cv-08705-JLR-GWG (S.D.N.Y.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.631979/gov.uscourts.nysd.631979.192.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.631979/gov.uscourts.nysd.631979.192.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/a2b106f42f0245bf29cdbf99.json`; sha256 `5a0ce14b154659a03dc7c57f61a16a38a880b338667c27ebb2d80260d7a9737b`.

### AIEL-2026-027 — Ibach v. Stewart, No. SC-2025-0106 (Ala.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 2}
- public_record_link: [https://publicportal-api.alappeals.gov/courts/68f021c4-6a44-4735-9a76-5360b2e8af13/cms/case/47683afc-2f85-469d-8562-9dca094bb680/docketentrydocuments/d95cdd15-7428-4cc9-8389-3cc27ac88089](https://publicportal-api.alappeals.gov/courts/68f021c4-6a44-4735-9a76-5360b2e8af13/cms/case/47683afc-2f85-469d-8562-9dca094bb680/docketentrydocuments/d95cdd15-7428-4cc9-8389-3cc27ac88089) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/36816ad8a829d9d77e8d1f24.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://publicportal.alappeals.gov/portal/court/68f021c4-6a44-4735-9a76-5360b2e8af13/case/47683afc-2f85-469d-8562-9dca094bb680](https://publicportal.alappeals.gov/portal/court/68f021c4-6a44-4735-9a76-5360b2e8af13/case/47683afc-2f85-469d-8562-9dca094bb680) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/5792d77322ad2aa6836c21e2.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-028 — Bunce v. Visual Technology Innovations, Inc., No. 2:23-cv-01740-KNS

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.225.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.225.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/5a8ff933ecf1d99beee5a22a.json`; sha256 `ff124616157b205d0ebbefe9d2885f2131424587517feba406554dae0607cae7`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.226.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.paed.609239/gov.uscourts.paed.609239.226.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/94ee32969cf0a6caa3bcb716.json`; sha256 `e6f1da035d3543b6c2f5ad3a58196047e6ce2f7ac11af0d2d6c9334451e563af`.

### AIEL-2026-029 — Obi v. Cook County, Illinois, No. 1:25-cv-03096

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.97.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.97.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/065792da73cd4c81fca06c05.json`; sha256 `3055cd68b8e389806de41572a2b4b90bd0b9f5a434fa63f13386b7fa3d282898`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.96.0_1.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ilnd.475370/gov.uscourts.ilnd.475370.96.0_1.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/2df0db910919417205ec0f4f.json`; sha256 `0ffec836ee6c19a4163d75a82b8c9f444efcbec70f269d9f1671d87a98a3f4c7`.

### AIEL-2026-030 — Hulvat v. Gumina, 2026 IL App (3d) 240628-U

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://illinoiscourts.gov/resources/63539016-cb02-4575-b3da-0dd0632244c1/file](https://illinoiscourts.gov/resources/63539016-cb02-4575-b3da-0dd0632244c1/file) — **BLOCKED**, HTTP 302, BLOCKED: robots transport failed; policy unknown. Receipt: `_codex-out/sources/links/resume-20261003/4eb69ea34abfa670682f6131.json`; sha256 `718115496ff93fa77db6753ef22c9fcd72f2f3a2b562f7d31d5f83d7fb03eda8`. Redirects: [{"from": "https://illinoiscourts.gov/resources/63539016-cb02-4575-b3da-0dd0632244c1/file", "to": "https://www.illinoiscourts.gov/resources/63539016-cb02-4575-b3da-0dd0632244c1/file", "status": 301}, {"from": "https://www.illinoiscourts.gov/resources/63539016-cb02-4575-b3da-0dd0632244c1/file", "to": "https://ilcourtsaudio.blob.core.windows.net/antilles-resources/resources/63539016-cb02-4575-b3da-0dd0632244c1/Hulvat%20v.%20Gumina%202026%20IL%20App%20(3d)%20240628-U.pdf", "status": 302}]

### AIEL-2026-031 — In re Wise, No. 25-51132 (Bankr. W.D. La.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.lawb.374130/gov.uscourts.lawb.374130.84.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.lawb.374130/gov.uscourts.lawb.374130.84.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/1994eb1b1dab7cef3ea26bac.json`; sha256 `2efa62f592bb3ede202a54aa0e095484336660f975f1be97c5bc0b7ea5e67916`.

### AIEL-2026-032 — Torres Campos v. Munoz, No. D085584 (Cal. Ct. App., 4th Dist., Div. One)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://courts.ca.gov/opinions/archive/D085584.PDF](https://courts.ca.gov/opinions/archive/D085584.PDF) — **BLOCKED**, HTTP 301, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/c33e2938182e57405bc1dec7.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Redirects: [{"from": "https://courts.ca.gov/opinions/archive/D085584.PDF", "to": "https://www4.courts.ca.gov/opinions/archive/D085584.PDF", "status": 301}]

### AIEL-2026-033 — Kattom v. Bondi, No. 25-1497 SEC P (W.D. La.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.lawd.213966/gov.uscourts.lawd.213966.28.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.lawd.213966/gov.uscourts.lawd.213966.28.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/a1a1447a709b7f9207f6d78c.json`; sha256 `bce0f4daa338a474403f52440942dcfe759d5a504a30fab83b076a74cf86eb1f`.

### AIEL-2026-034 — Gentry v. Thompson, No. 2:25-cv-01260-CJB-EJD (E.D. La.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.laed.273860/gov.uscourts.laed.273860.25.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.laed.273860/gov.uscourts.laed.273860.25.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/df38f95afcb894214eb47981.json`; sha256 `4c90e4dae7bfa07c14dffe627a3ad585cd6d8f4c3c361fc9e360931aa3826c1f`.

### AIEL-2026-035 — State v. Coleman, 2026-Ohio-965, No. 2024-A-0040 (Ohio Ct. App., 11th Dist.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://supremecourt.ohio.gov/rod/docs/pdf/11/2026/2026-Ohio-965.pdf](https://supremecourt.ohio.gov/rod/docs/pdf/11/2026/2026-Ohio-965.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/eb35ed6a699fe5f7b1842fdc.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-036 — Couvrette v. Wisnovsky, No. 1:21-cv-00157-CL (D. Or.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1, "BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ord.158388/gov.uscourts.ord.158388.225.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ord.158388/gov.uscourts.ord.158388.225.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/37feaca3bacbf07ebf96ad48.json`; sha256 `98db400a0f6bd0a0e6ce1a50996b9d73ad5883b2ec36d07db3d80039a64799a4`.
- secondary_source_links: [https://courtlistener.com/docket/55220104/226/couvrette-v-wisnovsky/](https://courtlistener.com/docket/55220104/226/couvrette-v-wisnovsky/) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/336a0004bad8d3f089fb58a7.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-037 — Heimkes v. Fairhope Motorcoach Resort Condominium Owners Association et al., No. 1:22-cv-00448-TFM-N (S.D. Ala.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.alsd.70919/gov.uscourts.alsd.70919.353.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.alsd.70919/gov.uscourts.alsd.70919.353.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/37f02d67fd499f3b194502bd.json`; sha256 `1ffd9c8dc4976f57f3422725e5d9bb5eea21cf89ccd6bbbd8ce327344126a4bf`.

### AIEL-2026-038 — Rivera v. Triad Properties Corporation et al., No. 2:24-cv-01802-AMM (N.D. Ala.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.alnd.192599/gov.uscourts.alnd.192599.116.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.alnd.192599/gov.uscourts.alnd.192599.116.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/acd0f0fcdd66ca039c777904.json`; sha256 `2f20b9e05d08fb790b80fe96bbb996a1037f7f8bdfad5f872f3dcf60810689b6`.

### AIEL-2026-040 — Coomer v. Lindell/MyPillow Inc., No. 1:22-cv-01129-NYW-SBP (D. Colo.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.cod.215068/gov.uscourts.cod.215068.424.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.cod.215068/gov.uscourts.cod.215068.424.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/c4385cfe000eb05d6a9ee615.json`; sha256 `b1215695f245157df26040f980a419ad5b2d104e126fba742eb3c203d310d405`.

### AIEL-2026-041 — Chakma v. Sushi Katsuei Inc., No. 1:23-cv-07804-KPF (S.D.N.Y.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.605627/gov.uscourts.nysd.605627.142.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.605627/gov.uscourts.nysd.605627.142.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/dba9473e3260a7bb454837a7.json`; sha256 `da38baf109fd931b3ed554b3564b59643064dbca38664384bb2517d4d7d340af`.

### AIEL-2026-042 — Davis v. Marion County Superior Court Juvenile Detention Center, No. 1:24-cv-01918-JRO-MJD (S.D. Ind.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.insd.217901/gov.uscourts.insd.217901.127.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.insd.217901/gov.uscourts.insd.217901.127.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/f64896b310d941f926b6a710.json`; sha256 `b5786891cbf60bdc8c2fe7a0ed03b063ab121c64ab092bb9af0431538fb644f9`.

### AIEL-2026-043 — Perez-Castillo v. Blanche (Att'y Gen.), No. 25-1988 (7th Cir.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://media.ca7.uscourts.gov/cgi-bin/OpinionsWeb/processWebInputExternal.pl?Submit=Display&Path=Y2026/D06-01/C:25-1988:J:Brennan:aut:T:fnOp:N:3550588:S:0](https://media.ca7.uscourts.gov/cgi-bin/OpinionsWeb/processWebInputExternal.pl?Submit=Display&Path=Y2026/D06-01/C:25-1988:J:Brennan:aut:T:fnOp:N:3550588:S:0) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/83e20621b2777129221d48ad.json`; sha256 `fd506528f787b6f426c87ad628dce279414b9e86c2d3cba3fabfd6037dd78651`.
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-ca7-25-01988/pdf/USCOURTS-ca7-25-01988-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca7-25-01988/pdf/USCOURTS-ca7-25-01988-0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/26ab15fbccaa642797cd3da1.json`; sha256 `532c89580f79ad80e93a2a28231a9603197548c96ed1bbbacc3222e123c95322`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-ca7-25-01988/pdf/USCOURTS-ca7-25-01988-0.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-ca7-25-01988/pdf/USCOURTS-ca7-25-01988-0.pdf", "status": 301}]

### AIEL-2026-044 — Deutsche Bank Natl. Trust Co. v. LeTennier, 2026 NY Slip Op 00040, Docket No. CV-23-0713 (N.Y. App. Div., 3d Dep’t)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://nycourts.gov/reporter/3dseries/2026/2026_00040.htm](https://nycourts.gov/reporter/3dseries/2026/2026_00040.htm) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/70118c80fb732b05af89c3ae.json`; sha256 `39c956c466d335ddb64184ba14dbd4f5e17b1653ce1ecb07de0bb9f62f11fd57`. Redirects: [{"from": "https://nycourts.gov/reporter/3dseries/2026/2026_00040.htm", "to": "https://www.nycourts.gov/reporter/3dseries/2026/2026_00040.htm", "status": 302}]

### AIEL-2026-045 — Hodges v. Meridian Waste Acquisitions USA, No. 3:25-cv-62; Rieske v. AFS, No. 5:25-cv-45 (M.D. Fla.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.flmd.436812/gov.uscourts.flmd.436812.53.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.flmd.436812/gov.uscourts.flmd.436812.53.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/a7c52170187cfc22a07d6636.json`; sha256 `a357c77a7a0a9293aa043e40beb0688f059abffe3c19000be41f3bdf456e3a57`.

### AIEL-2026-046 — Lifetime Well LLC v. IBSpot.com Inc., No. 2:25-cv-05135-MAK (E.D. Pa.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-paed-2_25-cv-05135/pdf/USCOURTS-paed-2_25-cv-05135-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-paed-2_25-cv-05135/pdf/USCOURTS-paed-2_25-cv-05135-0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/bd471411adea9376ca5c1535.json`; sha256 `a726f83ad1227cffd8ea607924d1e037c185c629c432f34094d0ca4b3bc58016`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-paed-2_25-cv-05135/pdf/USCOURTS-paed-2_25-cv-05135-0.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-paed-2_25-cv-05135/pdf/USCOURTS-paed-2_25-cv-05135-0.pdf", "status": 301}]
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.paed.643304/gov.uscourts.paed.643304.42.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.paed.643304/gov.uscourts.paed.643304.42.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/ba24fab53d932f1122e73679.json`; sha256 `1bf96e1480d83f7fed614fb4dddd70754c3393f764db9c4905fb5e6fc2bb9303`.

### AIEL-2026-047 — Lexos Media IP, LLC v. Overstock.com, Inc., No. 2:22-cv-02324-JAR (D. Kan.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://govinfo.gov/content/pkg/USCOURTS-ksd-2_22-cv-02324/pdf/USCOURTS-ksd-2_22-cv-02324-9.pdf](https://govinfo.gov/content/pkg/USCOURTS-ksd-2_22-cv-02324/pdf/USCOURTS-ksd-2_22-cv-02324-9.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/c8cd29c5a8258d4c01167202.json`; sha256 `0bcaafd6ce165d9b5849428ee2b9ed5ebd7534af97966adce9a9c591a24d17ea`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-ksd-2_22-cv-02324/pdf/USCOURTS-ksd-2_22-cv-02324-9.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-ksd-2_22-cv-02324/pdf/USCOURTS-ksd-2_22-cv-02324-9.pdf", "status": 301}]
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.ksd.142916/gov.uscourts.ksd.142916.218.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ksd.142916/gov.uscourts.ksd.142916.218.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/92cc05929edacc89ec8cf358.json`; sha256 `2d28a5040b97a7031ddf5917006d563571790c04e9bb13184dbcb4da084ce732`.

### AIEL-2026-048 — Amarsingh v. Frontier Airlines, Inc., No. 24-1391 (10th Cir.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1, "NEEDS-HUMAN": 1}
- public_record_link: [https://ca10.uscourts.gov/sites/ca10/files/opinions/010111382504.pdf](https://ca10.uscourts.gov/sites/ca10/files/opinions/010111382504.pdf) — **BLOCKED**, HTTP 301, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/19ce85adbec4e9bab5ad7a74.json`; sha256 `8b8a5446ca673b71487c24a5119b4da9234a54705a948104c1c385f102566bd3`. Redirects: [{"from": "https://ca10.uscourts.gov/sites/ca10/files/opinions/010111382504.pdf", "to": "https://www.ca10.uscourts.gov/sites/ca10/files/opinions/010111382504.pdf", "status": 301}]
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-ca10-24-01391/pdf/USCOURTS-ca10-24-01391-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca10-24-01391/pdf/USCOURTS-ca10-24-01391-0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/67f2f3cda04c5ac2e0662753.json`; sha256 `e13f55c8e0b88a752255b85eb7f056a2b1e163074981c3ff9e0525b06d588a46`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-ca10-24-01391/pdf/USCOURTS-ca10-24-01391-0.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-ca10-24-01391/pdf/USCOURTS-ca10-24-01391-0.pdf", "status": 301}]

### AIEL-2026-049 — EFD USA, Inc. v. Band Pro Film and Digital, Inc., No. B329314 (Cal. Ct. App., 2d Dist., Div. Three) (unpublished)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://courts.ca.gov/opinions/nonpub/B329314.PDF](https://courts.ca.gov/opinions/nonpub/B329314.PDF) — **BLOCKED**, HTTP 301, BLOCKED: robots transport failed; policy unknown. Receipt: `_codex-out/sources/links/resume-20261003/c74c6efb12806c29360be1b2.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Redirects: [{"from": "https://courts.ca.gov/opinions/nonpub/B329314.PDF", "to": "https://www4.courts.ca.gov/opinions/nonpub/B329314.PDF", "status": 301}]

### AIEL-2026-050 — Maldonado v. Professional Animal Retirement Center (PARC), No. 1:25-cv-00454-HAB-ALT (N.D. Ind.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.innd.124045/gov.uscourts.innd.124045.26.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.innd.124045/gov.uscourts.innd.124045.26.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/23d3f6b6ae73774115566f72.json`; sha256 `5d03b757db64fb29321a507ae1b2c26d667d2b508393bba311507060b88874ec`.

### AIEL-2026-051 — In re Rosslyn2016, LLC, Texas Esencia 2019 LLC and Timbers2020 LLC, No. 25-34507 (Bankr. S.D. Tex., Houston Div.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1, "BLOCKED": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.txsb.485264/gov.uscourts.txsb.485264.312.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.txsb.485264/gov.uscourts.txsb.485264.312.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/e7e9b5dbb07c42ebf65ef9d4.json`; sha256 `2daf26d7be925e782ce2f9b76bd3dcc5f877543aa1bf751a36e6b20063efcde6`.
- secondary_source_links: [https://courtlistener.com/docket/71022557/rosslyn2016-llc-and-texas-esencia-2019-llc/](https://courtlistener.com/docket/71022557/rosslyn2016-llc-and-texas-esencia-2019-llc/) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/50951995c5b45a8970069985.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-052 — Del Biaggio v. Bansen, No. A174647 (Cal. Ct. App., 1st Dist., Div. 4) (Humboldt County Super. Ct. No. CV1901078)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1, "NEEDS-HUMAN": 1}
- public_record_link: [https://courts.ca.gov/opinions/documents/A174647.PDF](https://courts.ca.gov/opinions/documents/A174647.PDF) — **BLOCKED**, HTTP 301, BLOCKED: robots transport failed; policy unknown. Receipt: `_codex-out/sources/links/resume-20261003/b16859410011ec354977b45c.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Redirects: [{"from": "https://courts.ca.gov/opinions/documents/A174647.PDF", "to": "https://www4.courts.ca.gov/opinions/documents/A174647.PDF", "status": 301}]
- secondary_source_links: [https://courts.ca.gov/opinions](https://courts.ca.gov/opinions) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/e83b583c4f85ff8241a87d28.json`; sha256 `23b94c79fe9abfa8e04322908191f2f3228e17c12dfa4fbdb4205582b296fe67`.

### AIEL-2026-053 — Akerlund v. Atlas Air, Inc., Flight Services International, LLC, No. 24-11033 (11th Cir.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://media.ca11.uscourts.gov/opinions/pub/files/202411033.pdf](https://media.ca11.uscourts.gov/opinions/pub/files/202411033.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/4488e90663c5994b94a8c924.json`; sha256 `16d82e33609f29f1614da106f31294b6411c01d95737d773c20341eecdef3d57`.
- secondary_source_links: [https://govinfo.gov/content/pkg/USCOURTS-ca11-24-11033/pdf/USCOURTS-ca11-24-11033-0.pdf](https://govinfo.gov/content/pkg/USCOURTS-ca11-24-11033/pdf/USCOURTS-ca11-24-11033-0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/7c9f62927684792fe7072ad9.json`; sha256 `6b84aba108c5983dbe7982ce544d8f1cddf680a5cfb03c1d93981f25bba63fb7`. Redirects: [{"from": "https://govinfo.gov/content/pkg/USCOURTS-ca11-24-11033/pdf/USCOURTS-ca11-24-11033-0.pdf", "to": "https://www.govinfo.gov/content/pkg/USCOURTS-ca11-24-11033/pdf/USCOURTS-ca11-24-11033-0.pdf", "status": 301}]

### AIEL-2026-054 — Hannah Renea Payne v. The State, No. S26A0459 (Ga.), 324 Ga. 305

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://www.gasupreme.us/wp-content/uploads/2026/05/s26a0459.pdf](https://www.gasupreme.us/wp-content/uploads/2026/05/s26a0459.pdf) — **BLOCKED**, HTTP None, BLOCKED: robots.txt disallows this URL for PAICELegalFreshness/1.0. Receipt: `_codex-out/sources/links/resume-20261003/a8d23fdf9359f7218f628ad4.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-055 — Withers v. City of Aberdeen, No. 1:24-CV-218-SA-RP (N.D. Miss.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.msnd.50181/gov.uscourts.msnd.50181.123.0_1.pdf](https://storage.courtlistener.com/recap/gov.uscourts.msnd.50181/gov.uscourts.msnd.50181.123.0_1.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/e7110f6c16f3c90d2079a149.json`; sha256 `ce52b4c4dce50e9304d116479da98c61f37443dab6b3ba3f957af3a2ea7fe6c7`.

### AIEL-2026-056 — Joseph Cartagena v. Terrance Dixon, Tyrone Blackburn, and T.A. Blackburn Law, PLLC, No. 1:25-cv-03552 (JLR) (S.D.N.Y.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.641455/gov.uscourts.nysd.641455.161.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.641455/gov.uscourts.nysd.641455.161.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/4e0574c7d216247ba814407a.json`; sha256 `2859a48d96020d4c58f9d4e9beb9a5e0427aea050e01dba9bde9269826fb6468`.

### AIEL-2026-057 — Matter of: CVTEK, LLC, B-423943; B-423943.2 (U.S. Government Accountability Office)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://gao.gov/assets/890/884082.pdf](https://gao.gov/assets/890/884082.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/f998ff5f1e5a8f33af3af68e.json`; sha256 `ee69e4d95e088d07f19fc4c0041321646cedf9f6605de77778f4812f42730a8e`. Redirects: [{"from": "https://gao.gov/assets/890/884082.pdf", "to": "https://www.gao.gov/assets/890/884082.pdf", "status": 302}]
- secondary_source_links: [https://gao.gov/products/b-423943,b-423943.2](https://gao.gov/products/b-423943,b-423943.2) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/4419f4c041ffed68198c0677.json`; sha256 `47be65fa160e14146a8d045ec3b7e7a3e8554daf597882e5ece6fe34da5d6f12`. Redirects: [{"from": "https://gao.gov/products/b-423943,b-423943.2", "to": "https://www.gao.gov/products/b-423943,b-423943.2", "status": 302}]

### AIEL-2026-058 — Jakes v. Youngblood, No. 2:24-cv-01608-WSS (W.D. Pa.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.pawd.314851/gov.uscourts.pawd.314851.71.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.pawd.314851/gov.uscourts.pawd.314851.71.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/5031bd66f0926be0a687f5df.json`; sha256 `a3c4b8d9d7bb1f0297d40fe351d858b7aaef22d3e2b1dbba9958520352ce60d4`.

### AIEL-2026-059 — Billups v. Louisville Municipal School District, No. 1:24-cv-00074-SA-RP (N.D. Miss.)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.msnd.49169/gov.uscourts.msnd.49169.79.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.msnd.49169/gov.uscourts.msnd.49169.79.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/882e9b7bdcd95b5bf1a3e5c8.json`; sha256 `5aa4aec407f9393408e739b56506d47e29ca30a36c9c4cf8a52d928e2bac1b6e`.

### AIEL-2026-060 — Scott v. Illinois Human Rights Commission, 2026 IL App (1st) 251462, No. 1-25-1462

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://illinoiscourts.gov/resources/23d7df84-ed51-48df-8477-3a6872db40d5/file](https://illinoiscourts.gov/resources/23d7df84-ed51-48df-8477-3a6872db40d5/file) — **BLOCKED**, HTTP 302, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/11f99c15622a686e7fc2618a.json`; sha256 `276b34b4353b537eb89b3d6713c227697541f949922700dc93297e39cee61d18`. Redirects: [{"from": "https://illinoiscourts.gov/resources/23d7df84-ed51-48df-8477-3a6872db40d5/file", "to": "https://www.illinoiscourts.gov/resources/23d7df84-ed51-48df-8477-3a6872db40d5/file", "status": 301}, {"from": "https://www.illinoiscourts.gov/resources/23d7df84-ed51-48df-8477-3a6872db40d5/file", "to": "https://ilcourtsaudio.blob.core.windows.net/antilles-resources/resources/23d7df84-ed51-48df-8477-3a6872db40d5/Scott%20v.%20IL%20Human%20Rights%20Commn%202026%20IL%20App%20(1st)%20251462.pdf", "status": 302}]

### AIEL-2026-061 — Barteca Holdings LLC v. Tacobarn Newtown LLC, No. 3:26-cv-00250-VDO (D. Conn.), ECF No. 43

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ctd.169303/gov.uscourts.ctd.169303.43.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ctd.169303/gov.uscourts.ctd.169303.43.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/dd694e458f97ec07bd039303.json`; sha256 `f8a2fc4239dccf8fdd27913d6d756ad6a9ce91df9a5fa05c06f1eb1671ba0235`.

### AIEL-2026-062 — LeDoux v. Outliers, Inc., No. 3:24-cv-05808-TMC (W.D. Wash.), ECF No. 265

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.265.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.265.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/e124ab1a9843491ccac67494.json`; sha256 `734eb1fc4bdd05d0844f13e2a7e48c98b8d4108c5f4ae332df4294dfc2c2c5ee`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.269.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.wawd.339711/gov.uscourts.wawd.339711.269.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/8c89a02b11420bfb01f439f8.json`; sha256 `e5098ff93fc925099a3bfa7b654fc9ae0c899ff9279b6cfc19e3bc45a15c845d`.

### AIEL-2026-063 — TOV Realty, LLC v. Suarez (SC 21183) and Kosel Equity, LLC v. MacGregor (SC 21184), 355 Conn. 902 (2026)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://jud.ct.gov/external/supapp/Cases/AROcr/CR355/ORD355.3.pdf](https://jud.ct.gov/external/supapp/Cases/AROcr/CR355/ORD355.3.pdf) — **BLOCKED**, HTTP None, Environment anonymous proxy CONNECT denied HTTP 403 while fetching robots.txt; origin HTTP status unknown. Source retrieval not authorized because robots policy unknown. Earlier direct DNS route failures, where present, are preserved.. Receipt: `_codex-out/sources/links/resume-20261003/14ce481baa631da15f977475.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-064 — Fuselier v. Riscassi, No. 1:25-cv-268-HSO-BWR (S.D. Miss.), ECF No. 28

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 2}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.28.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.28.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/20cedafe17e5aa7c9135d8c0.json`; sha256 `2b72eb0fd5dd76ccec94961e6d9d937a8a20c7f5681ab37904ec3552f24a79cb`.
- secondary_source_links: [https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.25.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.mssd.130336/gov.uscourts.mssd.130336.25.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/2a25445289e84d2cc0144e12.json`; sha256 `cc20d04779c84a67ceec4eed43423bbb1889e316d40c570da99824d958bdc8e5`.

### AIEL-2026-065 — Beslissing in de zaak 26-379/DB/LI/D, ECLI:NL:TADRSHE:2026:93 (Raad van Discipline in het ressort 's-Hertogenbosch)

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://tuchtrecht.overheid.nl/zoeken/resultaat/uitspraak/2026/ECLI_NL_TADRSHE_2026_93](https://tuchtrecht.overheid.nl/zoeken/resultaat/uitspraak/2026/ECLI_NL_TADRSHE_2026_93) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/ec9309937bb8198e33c8dc1e.json`; sha256 `63647570ae2bd54562bbcdd42e51c449270761a2f3bf9d31522972d72e05d457`. Redirects: [{"from": "https://tuchtrecht.overheid.nl/zoeken/resultaat/uitspraak/2026/ECLI_NL_TADRSHE_2026_93", "to": "https://tuchtrecht.overheid.nl/ECLI:NL:TADRSHE:2026:93", "status": 301}]

### AIEL-2026-066 — Erin Booker v. The Kroger Co., No. 1:26-cv-02006-SDG (N.D. Ga.), ECF No. 66

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.gand.358237/gov.uscourts.gand.358237.66.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.gand.358237/gov.uscourts.gand.358237.66.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/9e35a2794a4fea716b45236e.json`; sha256 `ea403780c57123eac0dfa4f031df36280cd950922273c0674dadacbace1cc4c6`.

### AIEL-2026-067 — Capital Standard, LLC v. U.S. Bank National Association, as trustee for Bear Stearns Asset Backed Securities I Trust 2005-AC9, No. 2D2024-1392 (Fla. 2d DCA)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1}
- public_record_link: [https://flcourts-media.flcourts.gov/content/download/2494161/opinion/Opinion_2024-1392.pdf](https://flcourts-media.flcourts.gov/content/download/2494161/opinion/Opinion_2024-1392.pdf) — **BLOCKED**, HTTP None, BLOCKED: robots.txt disallows this URL for PAICELegalFreshness/1.0. Receipt: `_codex-out/sources/links/resume-20261003/242cccef3f3754c601af21d8.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

### AIEL-2026-068 — Michael L. Ruiz v. Magellan Financial & Insurance Services, No. CV-23-02090-PHX-DWL (D. Ariz.), Doc. 179

Source: `data/data.json#datasets.included.records`. {"NEEDS-HUMAN": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.azd.1348340/gov.uscourts.azd.1348340.179.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.azd.1348340/gov.uscourts.azd.1348340.179.0.pdf) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/815968efa39913acaec601d1.json`; sha256 `c65f2c3bfbca35bfec9dc6c276031409068ab7a26914fcf194a39e5dbbf584ab`.

### AIEL-2026-069 — In re Brian E. Mitchell, Proceeding No. D2026-16 (USPTO Office of Enrollment and Discipline)

Source: `data/data.json#datasets.included.records`. {"PASS": 1}
- public_record_link: [https://foiadocuments.uspto.gov/oed/Mitchell-Order-D2026-16-Redacted.pdf](https://foiadocuments.uspto.gov/oed/Mitchell-Order-D2026-16-Redacted.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/c946b4014d00ca0c1f38071d.json`; sha256 `a7f252b12617328d2158c63f4ec0c29a22004c9356d5504daddf92928850f724`.

### AIEL-2026-070 — Tiekert v. Village of Mamaroneck, No. 23-CV-8714 (CS) (S.D.N.Y.), ECF No. 100

Source: `data/data.json#datasets.included.records`. {"PASS": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.nysd.607614/gov.uscourts.nysd.607614.100.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.nysd.607614/gov.uscourts.nysd.607614.100.0.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/a4e0ec7e31b0a927ec470dc6.json`; sha256 `3b1f644ab0ff949e5e15b323772cdaf0afeb00ed4ec79ca4fed41fde17433e83`.

### AIEL-2026-071 — Douglas v. Deutsche Bank National Trust Company, No. 24-CV-1099 (D.C. Ct. App.)

Source: `data/data.json#datasets.included.records`. {"BLOCKED": 1, "NEEDS-HUMAN": 1}
- public_record_link: [https://dccourts.gov/sites/default/files/2026-09/Douglas%20v.%20Deutsche%20Bank%20Nat%27l%20Trt%20Co.%2024-CV-1099%20ORDER.pdf](https://dccourts.gov/sites/default/files/2026-09/Douglas%20v.%20Deutsche%20Bank%20Nat%27l%20Trt%20Co.%2024-CV-1099%20ORDER.pdf) — **BLOCKED**, HTTP None, BLOCKED: robots HTTP 403 blocks access. Receipt: `_codex-out/sources/links/resume-20261003/875948c1ae53cd5889959af2.json`; sha256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- secondary_source_links: [https://reason.com/volokh/2026/09/04/incredulity-that-competent-law-firm-representing-one-of-the-largest-financial-institutions-in-the-world-filed-brief-with-ai-hallucinations/](https://reason.com/volokh/2026/09/04/incredulity-that-competent-law-firm-representing-one-of-the-largest-financial-institutions-in-the-world-filed-brief-with-ai-hallucinations/) — **NEEDS-HUMAN**, HTTP 200, HTTP 200; same-document identity not established. Receipt: `_codex-out/sources/links/resume-20261003/7a22ddcb43a485f4b14ebc4b.json`; sha256 `dce7e3234cf960e1a68598cfb3876f5d6deda772dbf48a231debe144b3afac26`.

### AIEL-2026-072 — Beus Gilbert PLLC v. Brigham Young University, No. 2:12-cv-00970-TS (D. Utah), Dkt. 385

Source: `data/data.json#datasets.included.records`. {"PASS": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.utd.86552/gov.uscourts.utd.86552.385.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.utd.86552/gov.uscourts.utd.86552.385.0.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/b21bf76b8787f026df8901e5.json`; sha256 `09beb4373ae66c2c973b4a88a120e9ba7b76b6f7f249cdb62f7e33348371db05`.

### AIEL-2026-073 — Cole v. Hobby Town Unlimited, Inc., No. 4:25-cv-04217-SLD-RLH (C.D. Ill.), ECF No. 33

Source: `data/data.json#datasets.included.records`. {"PASS": 1}
- public_record_link: [https://storage.courtlistener.com/recap/gov.uscourts.ilcd.98203/gov.uscourts.ilcd.98203.33.0.pdf](https://storage.courtlistener.com/recap/gov.uscourts.ilcd.98203/gov.uscourts.ilcd.98203.33.0.pdf) — **PASS**, HTTP 200, HTTP 200; SHA256 equals retained source bytes. Receipt: `_codex-out/sources/links/resume-20261003/f7bbfbcd7049b793cab535e4.json`; sha256 `bce43903ff11ea8033742f4a7d19bcacd0b11c42287f44bb1f9b4756e190ccd0`.

## Methods and limits

- HTTP 200 does not establish identity. PASS requires SHA256 matching retained document or normalized retained source text; title matches alone remain human review.
- All attempt receipts, redirects, MIME types, bytes and extracted text retained under _codex-out/sources/links. Transport retries and robots checks are centralized.
- Empty-body SHA256 on blocked receipts is a transport artifact, not a retrieved official-source digest. Shared robots failure receipts apply across host URLs; zero source attempts must not be confused with successful or failed origin requests.
- Historical MIME type unavailable for many sources; unknown remains unknown.
- 403/429 are failures or blocked access, never treated as passes, even though original AIL checker allows known bot-filtered hosts.
- A metadata/docket title is a lead, not a determination; latest docket and comparable baseline are needed to infer new entries.
- Inspected existing AIL `assessSourceResponse` and PubLedge `check-links.js`. The latter is an internal generated-page link checker. Direct network checkers were not run because they do not implement the sweep's shared politeness/robots policy and stricter identity/403 requirements.
- No paid providers, secret values, data updates, Verified/Checked updates or human attestations used or written.

## Cumulative evidence and transport counts

Initial blocked receipts remain in the prior ledger and original source files. Each current row includes prior_result and cumulative_attempts. New body/receipt artifacts use sources/links/resume-20261003/. Full physical attempt evidence is copied under sources/transport-resume/.

129 unique URL checks; 142 cumulative physical source retrieval attempts; 192 shared robots transport attempts on these hosts. Robots traffic overlaps portfolio/repository reports and must not be summed.

| Host | Source URLs | Source physical attempts | Shared robots attempts |
|---|---:|---:|---:|
| abajournal.com | 1 | 1 | 3 |
| aclu-nj.org | 1 | 1 | 3 |
| aclu.org | 3 | 3 | 3 |
| aclumich.org | 1 | 1 | 3 |
| app.ediscoveryassistant.com | 1 | 0 | 3 |
| app.minerva26.com | 0 | 0 | 1 |
| arcourts.gov | 1 | 1 | 3 |
| assets.aclu.org | 1 | 1 | 3 |
| blogs.duanemorris.com | 1 | 1 | 3 |
| btah.org | 2 | 2 | 3 |
| burr.com | 1 | 1 | 3 |
| ca10.uscourts.gov | 1 | 1 | 3 |
| canlii.org | 1 | 0 | 3 |
| canliiconnects.org | 1 | 0 | 3 |
| cbsnews.com | 2 | 2 | 3 |
| clearinghouse.net | 1 | 1 | 3 |
| cohenmilstein.com | 1 | 1 | 3 |
| courtlistener.com | 4 | 0 | 3 |
| courts.ca.gov | 4 | 4 | 3 |
| dccourts.gov | 1 | 0 | 3 |
| decisions.civilresolutionbc.ca | 1 | 1 | 3 |
| democracynow.org | 1 | 1 | 3 |
| dentons.com | 1 | 0 | 3 |
| dockets.justia.com | 1 | 1 | 3 |
| ecf.flmd.uscourts.gov | 1 | 1 | 3 |
| eeoc.gov | 1 | 1 | 3 |
| fisherphillips.com | 1 | 1 | 3 |
| flcourts-media.flcourts.gov | 1 | 0 | 2 |
| foiadocuments.uspto.gov | 1 | 1 | 2 |
| freep.com | 1 | 0 | 2 |
| ftc.gov | 1 | 1 | 2 |
| gao.gov | 2 | 2 | 2 |
| govinfo.gov | 9 | 9 | 2 |
| hcamag.com | 1 | 1 | 2 |
| humanservices.arkansas.gov | 1 | 1 | 2 |
| ilcourtsaudio.blob.core.windows.net | 0 | 0 | 1 |
| illinoiscourts.gov | 2 | 2 | 2 |
| jcorsmeier.wordpress.com | 1 | 1 | 2 |
| jud.ct.gov | 1 | 0 | 2 |
| justice.gov | 2 | 2 | 2 |
| law.justia.com | 1 | 1 | 2 |
| law.nyu.edu | 1 | 0 | 2 |
| lawnext.com | 1 | 1 | 2 |
| media.ca11.uscourts.gov | 1 | 1 | 2 |
| media.ca7.uscourts.gov | 1 | 1 | 2 |
| michigan.gov | 1 | 1 | 2 |
| news.bloomberglaw.com | 1 | 1 | 2 |
| nycourts.gov | 1 | 1 | 2 |
| nytimes.com | 2 | 0 | 2 |
| publicportal-api.alappeals.gov | 1 | 0 | 2 |
| publicportal.alappeals.gov | 1 | 0 | 2 |
| reason.com | 1 | 1 | 2 |
| regmedia.co.uk | 1 | 1 | 2 |
| reuters.com | 1 | 0 | 2 |
| seyfarth.com | 1 | 1 | 2 |
| smithlaw.com | 1 | 1 | 2 |
| storage.courtlistener.com | 41 | 42 | 3 |
| supremecourt.ohio.gov | 2 | 0 | 2 |
| tuchtrecht.overheid.nl | 1 | 2 | 2 |
| vibegraveyard.ai | 1 | 1 | 2 |
| www.abajournal.com | 0 | 1 | 1 |
| www.aclu-nj.org | 0 | 1 | 1 |
| www.aclu.org | 0 | 3 | 1 |
| www.aclumich.org | 0 | 1 | 1 |
| www.asbca.mil | 1 | 0 | 2 |
| www.btah.org | 0 | 2 | 1 |
| www.burr.com | 0 | 1 | 1 |
| www.ca10.uscourts.gov | 0 | 0 | 1 |
| www.ca5.uscourts.gov | 1 | 1 | 2 |
| www.ca6.uscourts.gov | 0 | 0 | 1 |
| www.canlii.org | 0 | 0 | 1 |
| www.cbsnews.com | 0 | 2 | 1 |
| www.cohenmilstein.com | 0 | 1 | 1 |
| www.courtlistener.com | 2 | 0 | 3 |
| www.dccourts.gov | 0 | 0 | 1 |
| www.democracynow.org | 0 | 1 | 1 |
| www.dentons.com | 0 | 0 | 1 |
| www.eeoc.gov | 0 | 1 | 1 |
| www.fisherphillips.com | 0 | 1 | 1 |
| www.ftc.gov | 0 | 1 | 1 |
| www.gao.gov | 0 | 2 | 1 |
| www.gasupreme.us | 1 | 0 | 2 |
| www.govinfo.gov | 0 | 9 | 1 |
| www.hcamag.com | 0 | 1 | 1 |
| www.hcdistrictclerk.com | 1 | 1 | 2 |
| www.illinoiscourts.gov | 0 | 2 | 1 |
| www.jud.ct.gov | 0 | 0 | 1 |
| www.justice.gov | 0 | 2 | 1 |
| www.law.nyu.edu | 0 | 0 | 1 |
| www.lawnext.com | 0 | 1 | 1 |
| www.michigan.gov | 0 | 1 | 1 |
| www.nycourts.gov | 0 | 1 | 1 |
| www.opn.ca6.uscourts.gov | 1 | 0 | 2 |
| www.oscn.net | 1 | 0 | 2 |
| www.reuters.com | 0 | 0 | 1 |
| www.seyfarth.com | 0 | 1 | 1 |
| www.smithlaw.com | 0 | 1 | 1 |
| www.supremecourt.ohio.gov | 0 | 0 | 1 |
| www4.courts.ca.gov | 0 | 0 | 1 |

## Diagnosed size-limit correction

CNN complaint source originally returned HTTP200 with15,791,825 bytes declared, exceeding the initial15MiB transport cap. One diagnosis-driven retry after raising the shared verified-TLS cap to64MiB retrieved the complete15,791,825-byte PDF. SHA256 `24084289b1deaf52ca6637c6a8ee26c96dffcc3fbf682483ccfb7f4ff3d5eef3` exactly matches the record's retained complaint PDF. The first truncated body/receipt remains under sources/links/resume-20261003/; the complete retry is under sources/links/cnn-size-retry/. Both attempts are retained in the ledger.

Independent coverage/integrity validation passed; see [link-validation.json](link-validation.json). This validates corpus completeness, durable evidence and each claimed identity comparison; it does not turn blocked or ambiguous links into passing sources.
