import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
const ROOT_DIR = new URL("../", import.meta.url);
const API_DIR = new URL("../api/v1/of/", import.meta.url);
const RECORDS_DIR = new URL("./records/", API_DIR);
const OF_CONTEXT = "https://obligationfirst.org/v1/context.jsonld";
const SITE_BASE = "https://aiincidentlaw.org";
const RECORD_CONTEXT = [OF_CONTEXT, {
  ail: `${SITE_BASE}/vocab/`,
  id: "ail:id",
  ai_incident_law_record_id: "ail:recordId",
  matter_type: "ail:matterType",
  filing_status: "ail:filingStatus",
  ai_system_name: "ail:aiSystemName",
  deployer: "ail:deployer",
  domain: "ail:domain",
  error_type: "ail:errorType",
  canonical_source_conflicted: "ail:canonicalSourceConflicted",
  mitigation_gap: "ail:mitigationGap",
  reliance_or_harm: "ail:relianceOrHarm"
}];
const COMPANION_DIRS = {
  authorities: "authority",
  parties: "party",
  proceedings: "proceeding",
  allegations: "allegation",
  determinations: "determination"
};

// Wikidata QIDs for single-entity authorities.
// Combined-authority slugs (multi-court) are intentionally omitted — no single QID applies.
const AUTHORITY_WIKIDATA = {
  "appellate-court-of-illinois-third-district": "Q2841219",
  "armed-services-board-of-contract-appeals": "Q4785474",
  "british-columbia-civil-resolution-tribunal": "Q22631709",
  "california-court-of-appeal-fourth-appellate-district-division-one": "Q5027136",
  "california-court-of-appeal-second-appellate-district": "Q5027142",
  "court-of-appeals-of-ohio-eleventh-appellate-district": "Q5138098",
  "new-york-supreme-court-appellate-division-third-department": "Q2276925",
  "ohio-court-of-appeals-sixth-appellate-district": "Q7011853",
  "supreme-court-of-alabama": "Q7624963",
  "supreme-court-of-oklahoma": "Q7009264",
  "u-s-court-of-appeals-for-the-fifth-circuit": "Q492151",
  "u-s-court-of-appeals-for-the-second-circuit": "Q492257",
  "u-s-court-of-appeals-for-the-sixth-circuit": "Q492107",
  "u-s-court-of-appeals-for-the-seventh-circuit": "Q492149",
  "u-s-court-of-appeals-for-the-tenth-circuit": "Q492090",
  "u-s-district-court-central-district-of-california": "Q5016311",
  "u-s-district-court-district-of-colorado": "Q5306883",
  "u-s-district-court-district-of-kansas": "Q853682",
  "u-s-district-court-district-of-new-jersey": "Q775899",
  "u-s-district-court-district-of-oregon": "Q5306891",
  "u-s-district-court-district-of-wyoming": "Q5311060",
  "u-s-district-court-eastern-district-of-louisiana": "Q1138663",
  "u-s-district-court-eastern-district-of-michigan": "Q5687969",
  "u-s-district-court-eastern-district-of-pennsylvania": "Q2350825",
  "u-s-district-court-middle-district-of-florida": "Q1384933",
  "u-s-district-court-northern-district-of-alabama": "Q7888718",
  "u-s-district-court-northern-district-of-california": "Q7025635",
  "u-s-district-court-northern-district-of-illinois": "Q7062661",
  "u-s-district-court-northern-district-of-indiana": "Q7062665",
  "u-s-district-court-southern-district-of-alabama": "Q8568339",
  "u-s-district-court-southern-district-of-indiana": "Q7062675",
  "u-s-district-court-southern-district-of-new-york": "Q673281",
  "u-s-district-court-western-district-of-louisiana": "Q7891831",
  "u-s-district-court-western-district-of-texas": "Q7891837",
  "u-s-federal-trade-commission": "Q133132",
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function recordStem(record) {
  return String(record.error_id).toLowerCase();
}

function ofUri(kind, id) {
  return `${SITE_BASE}/${kind}/${id}.json`;
}

function authorityId(record) {
  return slugify(record.jurisdiction || "unknown-authority");
}

function jurisdictionRef(record) {
  const jurisdiction = String(record.jurisdiction || "").toLowerCase();
  // State-specific checks first (cover both state courts and federal district courts in that state).
  if (jurisdiction.includes("british columbia")) return "ca-bc";
  if (jurisdiction.includes("alabama")) return "us-al";
  if (jurisdiction.includes("arkansas")) return "us-ar";
  if (jurisdiction.includes("california")) return "us-ca";
  if (jurisdiction.includes("colorado")) return "us-co";
  if (jurisdiction.includes("florida")) return "us-fl";
  if (jurisdiction.includes("illinois")) return "us-il";
  if (jurisdiction.includes("indiana")) return "us-in";
  if (jurisdiction.includes("kansas")) return "us-ks";
  if (jurisdiction.includes("louisiana")) return "us-la";
  if (jurisdiction.includes("massachusetts")) return "us-ma";
  if (jurisdiction.includes("michigan")) return "us-mi";
  if (jurisdiction.includes("new jersey")) return "us-nj";
  if (jurisdiction.includes("new york")) return "us-ny";
  if (jurisdiction.includes("ohio")) return "us-oh";
  if (jurisdiction.includes("oklahoma")) return "us-ok";
  if (jurisdiction.includes("oregon")) return "us-or";
  if (jurisdiction.includes("pennsylvania")) return "us-pa";
  if (jurisdiction.includes("texas")) return "us-tx";
  if (jurisdiction.includes("wyoming")) return "us-wy";
  // Federal/national bodies: circuits, agencies, boards with no single-state scope.
  if (
    jurisdiction.includes("u.s.") ||
    jurisdiction.includes("eeoc") ||
    jurisdiction.includes("federal") ||
    jurisdiction.includes("armed services")
  ) return "us";
  return "";
}

function authorityType(record) {
  return "gist:GovernmentOrganization";
}

function jurisdictionShape(record) {
  const territorial = jurisdictionRef(record);
  return {
    "@type": "of:Jurisdiction",
    ...(territorial ? { territorial_scope: [territorial] } : {}),
    institutional_scope: [record.jurisdiction]
  };
}

function partyId(record) {
  return `${recordStem(record)}-deployer`;
}

function partyUri(record) {
  return ofUri("party", partyId(record));
}

function partyKind(name) {
  return /\b(airlines?|airways|bank|university|department|agency|inc\.?|llc|corp\.?|company|organization|organisation)\b/i.test(name || "")
    ? "organization"
    : "unknown";
}

function provenance(record) {
  return {
    source: record.public_record_link,
    source_locator: record.public_matter_name,
    source_citation: record.neutral_citation || undefined,
    evidence_type: record.source_quality || "public-record",
    verified: normalizeDate(record.last_verified_date),
    asserted_by_adopter: `${SITE_BASE}/`
  };
}

function normalizeDate(value) {
  const text = String(value || "");
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (/^\d{4}-\d{2}$/.test(text)) return `${text}-01`;
  if (/^\d{4}$/.test(text)) return `${text}-01-01`;
  return undefined;
}

function determinationDisposition(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized === "pending") return null;
  if (normalized.includes("settled")) return "settled";
  if (normalized.includes("dismissed")) return "dismissed";
  if (normalized.includes("sanctioned") || normalized.includes("ordered") || normalized.includes("resolved")) return "confirmed";
  return "partial";
}

function stringArray(value) {
  if (value === undefined || value === null || value === "") return [];
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  return String(value).split(";").map(item => item.trim()).filter(Boolean);
}

function buildAuthorityRecords(records) {
  const byId = new Map();
  for (const record of records) {
    const id = authorityId(record);
    if (byId.has(id)) continue;
    const authority = {
      "@context": RECORD_CONTEXT,
      "@type": "of:Authority",
      "@id": ofUri("authority", id),
      id,
      organization: {
        "@type": authorityType(record),
        name: record.jurisdiction
      },
      jurisdiction: jurisdictionShape(record),
      territorial_scope: jurisdictionRef(record) ? [jurisdictionRef(record)] : undefined,
      institutional_scope: [record.jurisdiction],
      ...provenance(record)
    };
    const qid = AUTHORITY_WIKIDATA[id];
    if (qid) authority.sameAs = [`https://wikidata.org/entity/${qid}`];
    byId.set(id, authority);
  }
  return [...byId.values()];
}

function buildPartyRecords(records) {
  const firstByName = new Map();
  const parties = [];
  for (const record of records) {
    if (!record.deployer) continue;
    const normalized = String(record.deployer).trim().toLowerCase();
    const id = partyId(record);
    const uri = partyUri(record);
    const prior = firstByName.get(normalized);
    const party = {
      "@context": RECORD_CONTEXT,
      "@type": "of:Party",
      "@id": uri,
      id,
      name: record.deployer,
      party_kind: partyKind(record.deployer),
      roles: ["deployer"],
      describesSameEntityAs: prior ? [prior] : undefined,
      ...provenance(record)
    };
    parties.push(party);
    if (!prior) firstByName.set(normalized, uri);
  }
  return parties;
}

function buildMatterRecords(records) {
  const proceedings = [];
  const allegations = [];
  const determinations = [];

  for (const record of records) {
    const stem = recordStem(record);
    const proceedingId = `${stem}-proceeding`;
    const allegationId = `${stem}-allegation`;
    const determinationId = `${stem}-determination`;
    const disposition = determinationDisposition(record.filing_status);
    const authorityUri = ofUri("authority", authorityId(record));
    const allegationUri = ofUri("allegation", allegationId);
    const determinationUri = ofUri("determination", determinationId);

    const jurisdictionTyped = jurisdictionShape(record);
    const neutralCitation = record.neutral_citation || undefined;
    const caseSameAs = stringArray(record.case_sameAs);

    const proceeding = {
      "@context": RECORD_CONTEXT,
      "@type": "of:Proceeding",
      "@id": ofUri("proceeding", proceedingId),
      id: proceedingId,
      title: record.public_matter_name,
      filed_date: normalizeDate(record.filing_date),
      heardBy: [authorityUri],
      jurisdiction: jurisdictionTyped,
      territorial_scope: jurisdictionRef(record) ? [jurisdictionRef(record)] : undefined,
      institutional_scope: [record.jurisdiction],
      parties: record.deployer ? [partyUri(record)] : undefined,
      hasAllegation: [allegationUri],
      hasDetermination: disposition ? [determinationUri] : [],
      ...provenance(record),
      ai_incident_law_record_id: record.error_id,
      matter_type: record.public_matter_type,
      filing_status: record.filing_status
    };
    if (neutralCitation) proceeding.neutral_citation = neutralCitation;
    if (caseSameAs.length > 0) proceeding.describesSameEntityAs = caseSameAs;
    proceedings.push(proceeding);

    allegations.push({
      "@context": RECORD_CONTEXT,
      "@type": "of:Allegation",
      "@id": allegationUri,
      id: allegationId,
      text: record.error_description,
      asserted_by: "asserting party not identified in the indexed source fields",
      related_to: `${SITE_BASE}/incident/${stem}#ai-system`,
      related_to_party: record.deployer ? [partyUri(record)] : undefined,
      ai_system_name: record.ai_system_name,
      deployer: record.deployer,
      domain: record.domain,
      error_type: record.error_type,
      canonical_source_conflicted: record.canonical_source_conflicted,
      mitigation_gap: record.mitigation_gap,
      reliance_or_harm: record.reliance_or_harm,
      ai_incident_law_record_id: record.error_id,
      ...provenance(record)
    });

    if (disposition) {
      const determination = {
        "@context": RECORD_CONTEXT,
        "@type": "of:Determination",
        "@id": determinationUri,
        id: determinationId,
        issuedBy: [authorityUri],
        jurisdiction: jurisdictionTyped,
        decides: [allegationUri],
        disposition,
        remedy: {
          status: record.filing_status,
          notes: record.notes_on_resolution
        },
        notes: record.notes_on_resolution,
        ...provenance(record),
        ai_incident_law_record_id: record.error_id
      };

      const anchors = stringArray(record.obligation_first_anchors);
      if (anchors.length > 0) determination.anchors = anchors;
      if (neutralCitation) determination.neutral_citation = neutralCitation;
      if (caseSameAs.length > 0) determination.describesSameEntityAs = caseSameAs;

      determinations.push(determination);
    }
  }

  return { proceedings, allegations, determinations };
}

async function writeJson(url, value) {
  await mkdir(new URL(".", url), { recursive: true });
  await writeFile(url, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeRecords(recordsByKind, generated) {
  await rm(API_DIR, { recursive: true, force: true });
  await mkdir(RECORDS_DIR, { recursive: true });
  for (const dir of Object.values(COMPANION_DIRS)) {
    const companionDir = new URL(`${dir}/`, ROOT_DIR);
    await rm(companionDir, { recursive: true, force: true });
    await mkdir(companionDir, { recursive: true });
  }

  const files = {};
  const counts = {};
  for (const [kind, records] of Object.entries(recordsByKind)) {
    files[kind] = `${kind}.json`;
    counts[kind] = records.length;
    await writeJson(new URL(files[kind], API_DIR), {
      "@context": OF_CONTEXT,
      generated,
      [kind]: records
    });
    for (const record of records) {
      await writeJson(new URL(`${record.id}.json`, RECORDS_DIR), record);
      await writeJson(new URL(`${COMPANION_DIRS[kind]}/${record.id}.json`, ROOT_DIR), record);
    }
  }

  await writeJson(new URL("index.json", API_DIR), {
    "@context": OF_CONTEXT,
    generated,
    files,
    counts
  });
}

const source = JSON.parse(await readFile(SOURCE_PATH, "utf8"));
const included = source.datasets?.included?.records || [];
const authorities = buildAuthorityRecords(included);
const parties = buildPartyRecords(included);
const { proceedings, allegations, determinations } = buildMatterRecords(included);

await writeRecords({
  authorities,
  parties,
  proceedings,
  allegations,
  determinations
}, source.generated_at);

console.log(`Built Obligation-First binding for ${included.length} AI Incident Law records.`);
