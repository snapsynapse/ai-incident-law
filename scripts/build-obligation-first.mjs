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
  if (jurisdiction.includes("british columbia")) return "ca-bc";
  if (jurisdiction.includes("arkansas")) return "us-ar";
  if (jurisdiction.includes("california")) return "us-ca";
  if (jurisdiction.includes("florida")) return "us-fl";
  if (jurisdiction.includes("massachusetts")) return "us-ma";
  if (jurisdiction.includes("michigan")) return "us-mi";
  if (jurisdiction.includes("new jersey")) return "us-nj";
  if (jurisdiction.includes("new york")) return "us-ny";
  if (jurisdiction.includes("texas")) return "us-tx";
  if (jurisdiction.includes("wyoming")) return "us-wy";
  if (jurisdiction.includes("u.s.") || jurisdiction.includes("eeoc") || jurisdiction.includes("federal")) return "us";
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

function firstUrl(value) {
  return String(value || "").split(";").map(item => item.trim()).filter(Boolean)[0];
}

function buildAuthorityRecords(records) {
  const byId = new Map();
  for (const record of records) {
    const id = authorityId(record);
    if (byId.has(id)) continue;
    byId.set(id, {
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
    });
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

    proceedings.push({
      "@context": OF_CONTEXT,
      "@type": "of:Proceeding",
      "@id": ofUri("proceeding", proceedingId),
      id: proceedingId,
      title: record.public_matter_name,
      filed_date: normalizeDate(record.filing_date),
      issuedBy: authorityUri,
      hasAllegation: [allegationUri],
      hasDetermination: disposition ? [determinationUri] : [],
      source: firstUrl(record.public_record_link),
      ai_incident_law_record_id: record.error_id,
      matter_type: record.public_matter_type,
      status: record.filing_status
    });

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
      determinations.push({
        "@context": OF_CONTEXT,
        "@type": "of:Determination",
        "@id": determinationUri,
        id: determinationId,
        issued_date: normalizeDate(record.filing_date),
        issuedBy: authorityUri,
        decides: [allegationUri],
        disposition,
        remedy: {
          status: record.filing_status,
          notes: record.notes_on_resolution
        },
        notes: record.notes_on_resolution,
        source: firstUrl(record.public_record_link),
        ai_incident_law_record_id: record.error_id
      });
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
