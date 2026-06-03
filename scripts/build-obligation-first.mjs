import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const SOURCE_PATH = new URL("../data/data.json", import.meta.url);
const ROOT_DIR = new URL("../", import.meta.url);
const API_DIR = new URL("../api/v1/of/", import.meta.url);
const RECORDS_DIR = new URL("./records/", API_DIR);
const OF_CONTEXT = "https://obligationfirst.org/v1/";
const SITE_BASE = "https://aiincidentlaw.org";
const COMPANION_DIRS = {
  authorities: "authority",
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
  const text = `${record.public_matter_type || ""} ${record.jurisdiction || ""}`.toLowerCase();
  if (text.includes("court") || text.includes("tribunal") || text.includes("board")) return "gist:Court";
  return "gist:GovernmentOrganization";
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
      "@context": OF_CONTEXT,
      "@type": "of:Authority",
      "@id": ofUri("authority", id),
      id,
      organization: {
        "@type": authorityType(record),
        name: record.jurisdiction
      },
      authority_basis: {
        kind: authorityType(record) === "gist:Court" ? "judicial" : "statutory",
        instrument_ref: `${ofUri("authority", id)}#authority-basis`
      },
      jurisdiction: {
        "@type": "gist:Jurisdiction",
        ref: jurisdictionRef(record)
      }
    };
    const qid = AUTHORITY_WIKIDATA[id];
    if (qid) authority.sameAs = [`https://www.wikidata.org/entity/${qid}`];
    byId.set(id, authority);
  }
  return [...byId.values()];
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

    const jurisdictionTyped = {
      "@type": "gist:Jurisdiction",
      ref: jurisdictionRef(record)
    };
    const neutralCitation = record.neutral_citation || undefined;
    const caseSameAs = stringArray(record.case_sameAs);

    const proceeding = {
      "@context": OF_CONTEXT,
      "@type": "of:Proceeding",
      "@id": ofUri("proceeding", proceedingId),
      id: proceedingId,
      title: record.public_matter_name,
      filed_date: normalizeDate(record.filing_date),
      issuedBy: authorityUri,
      jurisdiction: jurisdictionTyped,
      hasAllegation: [allegationUri],
      hasDetermination: disposition ? [determinationUri] : [],
      source: record.public_record_link,
      ai_incident_law_record_id: record.error_id,
      matter_type: record.public_matter_type,
      status: record.filing_status
    };
    if (neutralCitation) proceeding.neutral_citation = neutralCitation;
    if (caseSameAs.length > 0) proceeding.sameAs = caseSameAs;
    proceedings.push(proceeding);

    allegations.push({
      "@context": OF_CONTEXT,
      "@type": "of:Allegation",
      "@id": allegationUri,
      id: allegationId,
      text: record.error_description,
      asserted_by: "public record",
      related_to: `${SITE_BASE}/incident/${stem}#ai-system`,
      ai_system_name: record.ai_system_name,
      deployer: record.deployer,
      domain: record.domain,
      error_type: record.error_type,
      canonical_source_conflicted: record.canonical_source_conflicted,
      mitigation_gap: record.mitigation_gap,
      reliance_or_harm: record.reliance_or_harm,
      ai_incident_law_record_id: record.error_id
    });

    if (disposition) {
      const determination = {
        "@context": OF_CONTEXT,
        "@type": "of:Determination",
        "@id": determinationUri,
        id: determinationId,
        issued_date: normalizeDate(record.filing_date),
        issuedBy: authorityUri,
        jurisdiction: jurisdictionTyped,
        decides: [allegationUri],
        disposition,
        remedy: {
          status: record.filing_status,
          notes: record.notes_on_resolution
        },
        notes: record.notes_on_resolution,
        source: record.public_record_link,
        ai_incident_law_record_id: record.error_id
      };

      const anchors = stringArray(record.obligation_first_anchors);
      if (anchors.length > 0) determination.anchors = anchors;
      if (neutralCitation) determination.neutral_citation = neutralCitation;
      if (caseSameAs.length > 0) determination.sameAs = caseSameAs;

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
const { proceedings, allegations, determinations } = buildMatterRecords(included);

await writeRecords({
  authorities,
  proceedings,
  allegations,
  determinations
}, source.generated_at);

console.log(`Built Obligation-First binding for ${included.length} AI Incident Law records.`);
