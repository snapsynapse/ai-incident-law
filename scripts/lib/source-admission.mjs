import { createHash } from "node:crypto";
import { lstatSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export const hash = value => createHash("sha256").update(value).digest("hex");
export const LEGACY_SHA256 = "687290b9904a5c75d7c11f7f03a71ac524f13b529fea761b215d1c72c4aa6190";

export function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

export const digest = value => hash(JSON.stringify(canonical(value)));

function requireValue(ok, message) {
  if (!ok) throw new Error(message);
}

function nonempty(value, name) {
  requireValue(typeof value === "string" && value.trim().length > 0, name + " must be nonempty");
  return value;
}

function sha256(value, name) {
  requireValue(typeof value === "string" && /^[a-f0-9]{64}$/.test(value), name + " must be SHA-256");
}

function validTimestamp(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) return false;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.getTime() > Date.now()) return false;
  const withoutZone = value.slice(0, -1);
  const [seconds, fraction = ""] = withoutZone.split(".");
  return parsed.toISOString() === seconds + "." + fraction.padEnd(3, "0") + "Z";
}

function safePath(value) {
  nonempty(value, "path");
  requireValue(!path.isAbsolute(value) && !value.includes("\\"), "Unsafe evidence path: " + value);
  requireValue(value.split("/").every(part => part && part !== "." && part !== ".."), "Unsafe evidence path: " + value);
  return value;
}

function readRegular(root, relative) {
  safePath(relative);
  let current = root;
  for (const part of relative.split("/")) {
    current = path.join(current, part);
    requireValue(!lstatSync(current).isSymbolicLink(), "Symlink evidence is forbidden: " + relative);
  }
  requireValue(statSync(current).isFile(), "Not a regular evidence file: " + relative);
  return readFileSync(current);
}

function officialUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Evidence official_url must be HTTPS");
  }
  requireValue(url.protocol === "https:" && !url.username && !url.password, "Evidence official_url must be HTTPS without credentials");
  requireValue(!url.hostname.startsWith("www."), "Evidence official_url must use the bare domain");
  requireValue(url.hostname !== "aiincidentlaw.org", "Generated AI Incident Law surfaces cannot serve as primary admission evidence");
}

function observedUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Observed retrieval URL must be HTTPS");
  }
  requireValue(url.protocol === "https:" && !url.username && !url.password, "Observed retrieval URL must be HTTPS without credentials");
}

export function recordSnapshot(dataset, record) {
  const id = record.error_id || record.candidate_id;
  nonempty(id, dataset + " record id");
  const units = { dataset: { sha256: digest(dataset), content: dataset } };
  for (const key of Object.keys(record).sort()) {
    units["field:" + key] = { sha256: digest(record[key]), content: record[key] };
  }
  const hashes = Object.fromEntries(Object.entries(units).map(([key, unit]) => [key, unit.sha256]));
  return { id, dataset, sha256: digest(hashes), units };
}

export function datasetSnapshot(data) {
  const records = {};
  for (const [dataset, bucket] of Object.entries(data.datasets || {})) {
    for (const record of bucket?.records || []) {
      const snapshot = recordSnapshot(dataset, record);
      const key = dataset + "/" + snapshot.id;
      requireValue(!Object.hasOwn(records, key), "Duplicate native record " + key);
      records[key] = snapshot;
    }
  }
  return records;
}

export function packetDigest(receipt) {
  const packet = structuredClone(receipt);
  if (packet.review) delete packet.review.packet_sha256;
  return digest(packet);
}

const ADJUDICATIVE_DOCUMENT = /^(?:agency order|consent decree|disciplinary order|final decision|final order|judgment|opinion and order|order|regulatory action|settlement agreement|tribunal decision)$/;
const ADJUDICATIVE_STATUS = /sanction|reprimand|settled|dismiss|judgment|ordered|resolved|upheld|vacat|disciplin/i;
const SOURCE_QUALITY = new Set([
  "primary record",
  "reliable reporting",
  "official statement",
  "party case page",
  "media-hosted pleading copy"
]);

function validateEvidence(evidence, root) {
  requireValue(evidence && typeof evidence === "object" && !Array.isArray(evidence), "Evidence must be an object");
  for (const field of ["path", "document_id", "document_title", "issuing_body", "document_type", "version", "locator", "excerpt"]) {
    nonempty(evidence[field], "evidence." + field);
  }
  safePath(evidence.path);
  requireValue(evidence.path.startsWith("data/admission/raw/"), "Admission evidence must be a retained primary snapshot under data/admission/raw/");
  officialUrl(evidence.official_url);
  sha256(evidence.sha256, "evidence.sha256");
  requireValue(["retained_snapshot", "primary_retrieval"].includes(evidence.acquisition), "Evidence acquisition must be retained_snapshot or primary_retrieval");
  const bytes = readRegular(root, evidence.path);
  requireValue(hash(bytes) === evidence.sha256, "Source hash changed: " + evidence.path);
  const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  requireValue(text.includes(evidence.excerpt), "Supporting excerpt absent from " + evidence.path);
  requireValue(evidence.excerpt.trim().length >= 20, "Supporting excerpt is too short to review");
  requireValue(Array.isArray(evidence.identity_excerpts) && evidence.identity_excerpts.length >= 2, "At least two document identity excerpts are required");
  for (const excerpt of evidence.identity_excerpts) {
    nonempty(excerpt, "identity excerpt");
    requireValue(text.includes(excerpt), "Document identity excerpt absent from " + evidence.path);
  }
  if (evidence.ai_attribution_excerpt !== undefined) {
    nonempty(evidence.ai_attribution_excerpt, "ai_attribution_excerpt");
    requireValue(text.includes(evidence.ai_attribution_excerpt), "AI attribution excerpt absent from " + evidence.path);
  }
  if (evidence.original_language_excerpt !== undefined) {
    nonempty(evidence.original_language_excerpt, "original_language_excerpt");
    requireValue(text.includes(evidence.original_language_excerpt), "Original-language excerpt absent from " + evidence.path);
    nonempty(evidence.english_rendering, "english_rendering");
  }
  if (evidence.source_role !== undefined) {
    nonempty(evidence.source_role, "source_role");
    requireValue(SOURCE_QUALITY.has(evidence.source_role), "Unsupported evidence source_role: " + evidence.source_role);
  }
  if (evidence.original !== undefined) {
    requireValue(evidence.original && typeof evidence.original === "object", "original evidence metadata must be an object");
    safePath(evidence.original.path);
    requireValue(evidence.original.path.startsWith("data/admission/raw/"), "Original evidence bytes must be retained under data/admission/raw/");
    sha256(evidence.original.sha256, "original.sha256");
    requireValue(
      hash(readRegular(root, evidence.original.path)) === evidence.original.sha256,
      "Original evidence bytes changed"
    );
  }
  if (evidence.acquisition === "primary_retrieval") {
    requireValue(evidence.retrieval && Number.isInteger(evidence.retrieval.http_status), "Primary retrieval needs HTTP metadata");
    requireValue(evidence.retrieval.http_status >= 200 && evidence.retrieval.http_status < 300, "Primary retrieval needs a successful HTTP status");
    requireValue(validTimestamp(evidence.retrieval.retrieved_at), "Invalid retrieval timestamp");
    nonempty(evidence.retrieval.content_type, "retrieval.content_type");
    observedUrl(evidence.retrieval.final_url);
    safePath(evidence.retrieval.original_path);
    requireValue(evidence.retrieval.original_path.startsWith("data/admission/raw/"), "Original retrieval bytes must be retained under data/admission/raw/");
    sha256(evidence.retrieval.original_sha256, "retrieval.original_sha256");
    requireValue(
      hash(readRegular(root, evidence.retrieval.original_path)) === evidence.retrieval.original_sha256,
      "Original retrieval bytes changed"
    );
  } else {
    requireValue(evidence.retrieval === undefined, "retained_snapshot must not invent retrieval metadata");
  }
  return evidence.document_type;
}

function changedUnitKeys(previous, current) {
  return [...new Set([...Object.keys(previous?.units || {}), ...Object.keys(current.units)])]
    .filter(key => previous?.units[key] !== current.units[key]?.sha256);
}

export function validateAdmission({ data, legacy, admissions, root, priorAdmissions = null }) {
  requireValue(legacy?.version === 1 && admissions?.version === 1, "Unknown admission contract version");
  requireValue(legacy.status === "legacy-unreviewed", "Historical corpus must remain explicitly legacy-unreviewed");
  requireValue(
    legacy.base_commit === "8d8c7913d2015c05ea133f0846c3472807b68005",
    "Legacy baseline must remain pinned to the merged pre-tranche commit"
  );
  const current = datasetSnapshot(data);
  const errors = [];
  let legacyCount = 0;
  let reviewedCount = 0;
  let changedUnits = 0;
  const attempt = (where, action) => {
    try {
      action();
    } catch (error) {
      errors.push(where + ": " + error.message);
    }
  };

  for (const key of Object.keys(legacy.records || {})) {
    if (!Object.hasOwn(current, key)) {
      errors.push(key + ": legacy record removal requires a separately reviewed retirement migration");
    }
  }
  for (const key of Object.keys(admissions.records || {})) {
    if (!Object.hasOwn(current, key)) {
      errors.push(key + ": admission receipt references a missing native record");
    }
  }
  for (const key of Object.keys(priorAdmissions?.records || {})) {
    if (!Object.hasOwn(admissions.records || {}, key)) {
      errors.push(key + ": a prior accepted receipt cannot be dropped to restore legacy status");
    }
  }

  for (const [key, snapshot] of Object.entries(current)) attempt(key, () => {
    const previous = legacy.records?.[key];
    const receipt = admissions.records?.[key];
    if (!receipt && previous?.sha256 === snapshot.sha256) {
      requireValue(!priorAdmissions?.records?.[key], "A prior accepted receipt cannot be dropped to restore legacy status");
      legacyCount++;
      return;
    }
    requireValue(receipt, "Changed or new native record requires an admission receipt");
    requireValue(receipt.baseline_sha256 === (previous?.sha256 || null), "Receipt has the wrong before-record binding");
    requireValue(receipt.record_sha256 === snapshot.sha256, "Receipt is stale for the current native record");
    requireValue(receipt.review?.packet_sha256 === packetDigest(receipt), "Review packet changed after acceptance");
    requireValue(["agent", "human"].includes(receipt.review?.actor_type), "Explicit reviewer type is required");
    nonempty(receipt.review?.actor, "review.actor");
    requireValue(validTimestamp(receipt.review?.reviewed_at), "review.reviewed_at must be a real, non-future UTC timestamp");
    requireValue(
      receipt.review?.decision === "source-consistency-reviewed-changes",
      "Pending or rejected review cannot admit a record"
    );
    nonempty(receipt.review?.scope, "review.scope");
    requireValue(Array.isArray(receipt.unresolved), "Unresolved questions must be an explicit array");
    requireValue(receipt.units && typeof receipt.units === "object" && !Array.isArray(receipt.units), "Unit reviews are required");
    requireValue(receipt.evidence && typeof receipt.evidence === "object" && !Array.isArray(receipt.evidence), "Evidence records are required");

    const changed = changedUnitKeys(previous, snapshot);
    requireValue(changed.length > 0, "Receipt cannot relabel unchanged legacy data as reviewed");
    const usedEvidence = new Set();
    const currentRecord = Object.fromEntries(
      Object.entries(snapshot.units)
        .filter(([unit]) => unit.startsWith("field:"))
        .map(([unit, value]) => [unit.slice(6), value.content])
    );
    for (const unit of changed) {
      const review = receipt.units[unit];
      requireValue(review, "Unreviewed changed unit: " + unit);
      requireValue(review.before_sha256 === (previous?.units?.[unit] || null), "Stale before-unit binding: " + unit);
      requireValue(review.after_sha256 === (snapshot.units[unit]?.sha256 || null), "Stale after-unit binding: " + unit);
      if (Object.hasOwn(review, "candidate_content")) {
        requireValue(digest(review.candidate_content) === digest(snapshot.units[unit]?.content ?? null), "Review displays stale candidate content: " + unit);
      }
      nonempty(review.reason, "unit reason");
      for (const qualifier of ["scope", "exceptions", "time"]) {
        nonempty(review.qualifications?.[qualifier], "unit qualifications." + qualifier);
      }
      requireValue(Array.isArray(review.evidence) && review.evidence.length > 0, "Missing supporting evidence: " + unit);
      for (const evidenceId of review.evidence) {
        nonempty(evidenceId, "evidence reference");
        const evidence = receipt.evidence[evidenceId];
        requireValue(evidence, "Unknown evidence reference: " + evidenceId);
        usedEvidence.add(evidenceId);
        validateEvidence(evidence, root);
      }
      if (unit === "field:last_verified_date") {
        requireValue(receipt.review.actor_type === "human", "Agent review cannot renew Verified");
      }
      changedUnits++;
    }

    for (const unit of Object.keys(receipt.units)) {
      requireValue(changed.includes(unit), "Extraneous or stale unit acceptance: " + unit);
    }
    for (const evidenceId of Object.keys(receipt.evidence)) {
      requireValue(usedEvidence.has(evidenceId), "Unreferenced evidence: " + evidenceId);
    }

    const allEvidence = [...usedEvidence].map(id => receipt.evidence[id]);
    if (changed.includes("field:public_record_link")) {
      requireValue(
        allEvidence.some(evidence => evidence.official_url === currentRecord.public_record_link),
        "Primary-source change must bind the current public_record_link"
      );
    }
    if (snapshot.dataset === "included" && changed.includes("field:source_quality")) {
      requireValue(
        SOURCE_QUALITY.has(currentRecord.source_quality),
        "Unsupported changed source_quality: " + String(currentRecord.source_quality)
      );
      requireValue(
        allEvidence.some(evidence =>
          evidence.official_url === currentRecord.public_record_link
          && evidence.source_role === currentRecord.source_quality
        ),
        "Changed source_quality must match retained source role metadata and the current public_record_link"
      );
    }
    const attributionChanged = [
      "field:ai_system_name",
      "field:error_description",
      "field:tags",
      "field:confidence_score"
    ].some(unit => changed.includes(unit));
    if (snapshot.dataset === "included" && attributionChanged) {
      requireValue(
        allEvidence.some(evidence => Boolean(evidence.ai_attribution_excerpt)),
        "Changed AI attribution requires a source-located AI attribution excerpt"
      );
    }
    const tags = String(currentRecord.tags || "");
    if (snapshot.dataset === "included" && tags.includes("source-language-")) {
      requireValue(
        allEvidence.some(evidence => evidence.original_language_excerpt && evidence.english_rendering),
        "Non-English admission requires original-language evidence and an English rendering"
      );
    }
    const adjudicativeClaimChanged = ["field:filing_status", "field:notes_on_resolution"].some(unit => changed.includes(unit))
      && ADJUDICATIVE_STATUS.test(String(currentRecord.filing_status || ""));
    const determinationChanged = changed.includes("field:legal_graph")
      && Array.isArray(currentRecord.legal_graph?.determinations)
      && currentRecord.legal_graph.determinations.length > 0;
    if (adjudicativeClaimChanged || determinationChanged) {
      requireValue(
        allEvidence.some(evidence => ADJUDICATIVE_DOCUMENT.test(evidence.document_type)),
        "Adjudicative status or Determination requires adjudicative primary evidence; a complaint is not an order"
      );
    }
    requireValue(
      !receipt.review.human_approved || receipt.review.actor_type === "human",
      "Agent cannot assert human approval"
    );
    reviewedCount++;
  });

  return {
    status: errors.length ? "failed" : "passed",
    total_records: Object.keys(current).length,
    protected_native_records: Object.keys(current).length,
    legacy_unreviewed_records: legacyCount,
    records_with_reviewed_changes: reviewedCount,
    changed_units_reviewed: changedUnits,
    review_packets_with_unresolved: Object.values(admissions.records || {})
      .filter(receipt => Array.isArray(receipt.unresolved) && receipt.unresolved.length > 0).length,
    errors,
    limits: "Traceability and declared review of changed units only; no legal entailment, exhaustive discovery, authenticated human approval, or currentness certification."
  };
}
