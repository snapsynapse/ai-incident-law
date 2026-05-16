(function () {
  "use strict";

  const data = window.AIEL_DATA || { datasets: {} };
  const elements = {
    statTotal: document.getElementById("statTotal"),
    statIncluded: document.getElementById("statIncluded"),
    statReview: document.getElementById("statReview"),
    statGlobal: document.getElementById("statGlobal"),
    searchInput: document.getElementById("searchInput"),
    datasetFilter: document.getElementById("datasetFilter"),
    domainFilter: document.getElementById("domainFilter"),
    typeFilter: document.getElementById("typeFilter"),
    countryFilter: document.getElementById("countryFilter"),
    reviewFilter: document.getElementById("reviewFilter"),
    sourceFilter: document.getElementById("sourceFilter"),
    resetFilters: document.getElementById("resetFilters"),
    resultCount: document.getElementById("resultCount"),
    activeFilters: document.getElementById("activeFilters"),
    cardsView: document.getElementById("cardsView"),
    tableView: document.getElementById("tableView"),
    emptyState: document.getElementById("emptyState"),
    cardViewButton: document.getElementById("cardViewButton"),
    tableViewButton: document.getElementById("tableViewButton"),
    themeToggle: document.getElementById("themeToggle"),
  };

  const state = {
    view: "cards",
    query: "",
    dataset: "all",
    domain: "all",
    type: "all",
    country: "all",
    review: "all",
    source: "all",
  };

  const datasetMeta = {
    included: { label: "Included", countLabel: "Included cases" },
    review: { label: "Review", countLabel: "Review candidates" },
    global: { label: "Global", countLabel: "Global candidates" },
  };

  const records = normalizeRecords(data.datasets);

  function normalizeRecords(datasets) {
    const out = [];
    Object.keys(datasets || {}).forEach((datasetKey) => {
      const bucket = datasets[datasetKey];
      (bucket.records || []).forEach((raw, index) => {
        const isIncluded = datasetKey === "included";
        const isGlobal = datasetKey === "global";
        const title =
          raw.error_title ||
          raw.candidate_title ||
          raw.translated_title ||
          raw.original_title ||
          "Untitled record";
        const id = raw.error_id || raw.candidate_id || `${datasetKey}-${index + 1}`;
        const matter = raw.public_matter_name || raw.candidate_matter || "";
        const country = raw.country || inferCountry(raw.jurisdiction || raw.candidate_matter || "");
        const domain = raw.domain || raw.region || raw.authority_type || "Unspecified";
        const type = raw.error_type || raw.event_grain || "Candidate";
        const status = raw.filing_status || raw.reason_for_review || "Candidate";
        const sourceQuality = raw.source_quality || raw.authority_type || "candidate";
        const needsReview = raw.needs_review || (isIncluded ? "no" : "yes");
        const primaryLink = raw.public_record_link || firstUrl(raw.best_available_sources || "");
        const secondaryLinks = raw.secondary_source_links || raw.best_available_sources || "";
        const description =
          raw.error_description ||
          raw.reason_for_review ||
          raw.next_verification_step ||
          "No description available.";
        const tags = splitList(raw.tags)
          .concat(splitList(raw.legal_basis))
          .concat(splitList(raw.event_grain))
          .filter(Boolean);
        const searchText = [
          id,
          title,
          raw.ai_system_name,
          raw.deployer,
          domain,
          type,
          description,
          raw.canonical_source_conflicted,
          raw.mitigation_gap,
          raw.reliance_or_harm,
          raw.public_matter_type,
          matter,
          status,
          raw.jurisdiction,
          raw.country,
          raw.region,
          raw.legal_basis,
          raw.authority_type,
          raw.remedy_type,
          raw.notes_on_resolution,
          raw.next_verification_step,
          raw.best_available_sources,
          tags.join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        out.push({
          raw,
          dataset: datasetKey,
          datasetLabel: datasetMeta[datasetKey]?.label || datasetKey,
          id,
          title,
          matter,
          country,
          domain,
          type,
          status,
          sourceQuality,
          needsReview,
          primaryLink,
          secondaryLinks,
          description,
          tags: unique(tags).slice(0, 10),
          searchText,
        });
      });
    });
    return out;
  }

  function inferCountry(text) {
    const value = String(text || "").toLowerCase();
    if (value.includes("canada") || value.includes("british columbia")) return "Canada";
    if (value.includes("australia")) return "Australia";
    if (value.includes("netherlands") || value.includes("dutch")) return "Netherlands";
    if (value.includes("france")) return "France";
    if (value.includes("italy") || value.includes("bologna")) return "Italy";
    if (value.includes("united kingdom") || value.includes("uk") || value.includes("metropolitan police")) return "United Kingdom";
    if (value.includes("federal") || value.includes("u.s.") || value.includes("united states") || value.includes("michigan")) return "United States";
    return "Unspecified";
  }

  function splitList(value) {
    return String(value || "")
      .split(/[;|]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function unique(values) {
    return Array.from(new Set(values.filter(Boolean)));
  }

  function firstUrl(value) {
    return (String(value || "").match(/https?:\/\/[^\s;]+/i) || [""])[0];
  }

  function sourceUrls(value) {
    return unique(String(value || "").match(/https?:\/\/[^\s;]+/gi) || []);
  }

  function labelFromUrl(url) {
    try {
      const host = new URL(url).hostname.replace(/^www\./, "");
      return host.length > 26 ? `${host.slice(0, 24)}…` : host;
    } catch (_error) {
      return "Source";
    }
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function truncate(value, limit) {
    const text = String(value || "");
    return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
  }

  function populateSelect(select, values, allLabel) {
    const current = select.value || "all";
    select.innerHTML = "";
    select.appendChild(new Option(allLabel, "all"));
    values.forEach((value) => select.appendChild(new Option(value, value)));
    select.value = values.includes(current) ? current : "all";
  }

  function init() {
    setInitialTheme();
    updateStats();
    populateFilters();
    bindEvents();
    render();
  }

  function setInitialTheme() {
    const dark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }

  function updateStats() {
    elements.statTotal.textContent = records.length;
    elements.statIncluded.textContent = records.filter((r) => r.dataset === "included").length;
    elements.statReview.textContent = records.filter((r) => r.dataset === "review").length;
    elements.statGlobal.textContent = records.filter((r) => r.dataset === "global").length;
  }

  function populateFilters() {
    populateSelect(
      elements.datasetFilter,
      ["included", "review", "global"].map((key) => datasetMeta[key].label),
      "All datasets",
    );
    populateSelect(elements.domainFilter, unique(records.map((r) => r.domain)).sort(), "All domains");
    populateSelect(elements.typeFilter, unique(records.map((r) => r.type)).sort(), "All types");
    populateSelect(elements.countryFilter, unique(records.map((r) => r.country)).sort(), "All countries");
    populateSelect(elements.reviewFilter, ["no", "yes"], "All verification states");
    populateSelect(elements.sourceFilter, unique(records.map((r) => r.sourceQuality)).sort(), "All source qualities");
  }

  function bindEvents() {
    elements.searchInput.addEventListener("input", (event) => {
      state.query = event.target.value.trim().toLowerCase();
      render();
    });

    elements.datasetFilter.addEventListener("change", (event) => {
      state.dataset = labelToDataset(event.target.value);
      render();
    });
    elements.domainFilter.addEventListener("change", (event) => {
      state.domain = event.target.value;
      render();
    });
    elements.typeFilter.addEventListener("change", (event) => {
      state.type = event.target.value;
      render();
    });
    elements.countryFilter.addEventListener("change", (event) => {
      state.country = event.target.value;
      render();
    });
    elements.reviewFilter.addEventListener("change", (event) => {
      state.review = event.target.value;
      render();
    });
    elements.sourceFilter.addEventListener("change", (event) => {
      state.source = event.target.value;
      render();
    });

    elements.resetFilters.addEventListener("click", () => {
      state.query = "";
      state.dataset = "all";
      state.domain = "all";
      state.type = "all";
      state.country = "all";
      state.review = "all";
      state.source = "all";
      elements.searchInput.value = "";
      elements.datasetFilter.value = "all";
      elements.domainFilter.value = "all";
      elements.typeFilter.value = "all";
      elements.countryFilter.value = "all";
      elements.reviewFilter.value = "all";
      elements.sourceFilter.value = "all";
      render();
    });

    elements.cardViewButton.addEventListener("click", () => setView("cards"));
    elements.tableViewButton.addEventListener("click", () => setView("table"));
    elements.themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
    });
  }

  function labelToDataset(label) {
    if (label === "Included") return "included";
    if (label === "Review") return "review";
    if (label === "Global") return "global";
    return "all";
  }

  function setView(view) {
    state.view = view;
    elements.cardViewButton.classList.toggle("active", view === "cards");
    elements.tableViewButton.classList.toggle("active", view === "table");
    elements.cardsView.classList.toggle("hidden", view !== "cards");
    elements.tableView.classList.toggle("hidden", view !== "table");
  }

  function getFilteredRecords() {
    const terms = state.query.split(/\s+/).filter(Boolean);
    return records.filter((record) => {
      if (state.dataset !== "all" && record.dataset !== state.dataset) return false;
      if (state.domain !== "all" && record.domain !== state.domain) return false;
      if (state.type !== "all" && record.type !== state.type) return false;
      if (state.country !== "all" && record.country !== state.country) return false;
      if (state.review !== "all" && record.needsReview !== state.review) return false;
      if (state.source !== "all" && record.sourceQuality !== state.source) return false;
      if (terms.length && !terms.every((term) => record.searchText.includes(term))) return false;
      return true;
    });
  }

  function render() {
    const filtered = getFilteredRecords();
    elements.resultCount.textContent = `Showing ${filtered.length} of ${records.length} records`;
    renderActiveFilters();
    renderCards(filtered);
    renderTable(filtered);
    elements.emptyState.classList.toggle("hidden", filtered.length !== 0);
    elements.cardsView.classList.toggle("hidden", state.view !== "cards" || filtered.length === 0);
    elements.tableView.classList.toggle("hidden", state.view !== "table" || filtered.length === 0);
  }

  function renderActiveFilters() {
    const active = [];
    if (state.query) active.push(["Search", state.query]);
    if (state.dataset !== "all") active.push(["Dataset", datasetMeta[state.dataset]?.label || state.dataset]);
    if (state.domain !== "all") active.push(["Domain", state.domain]);
    if (state.type !== "all") active.push(["Type", state.type]);
    if (state.country !== "all") active.push(["Country", state.country]);
    if (state.review !== "all") active.push(["Review", state.review]);
    if (state.source !== "all") active.push(["Source", state.source]);

    elements.activeFilters.innerHTML = active
      .map(([key, value]) => `<span class="pill"><strong>${escapeHtml(key)}</strong>${escapeHtml(value)}</span>`)
      .join("");
  }

  function renderCards(items) {
    elements.cardsView.innerHTML = items.map(cardTemplate).join("");
  }

  function cardTemplate(record) {
    const raw = record.raw;
    const links = sourceUrls([record.primaryLink, record.secondaryLinks].filter(Boolean).join("; "));
    return `
      <article class="case-card" data-testid="card-case-${escapeHtml(record.id)}">
        <div class="card-top">
          <div>
            <div class="record-id">${escapeHtml(record.id)}</div>
            <h3>${escapeHtml(record.title)}</h3>
          </div>
          <span class="dataset-badge">${escapeHtml(record.datasetLabel)}</span>
        </div>
        <div class="case-meta">${escapeHtml(record.matter || record.status)}</div>
        <p class="case-description">${escapeHtml(record.description)}</p>
        <div class="meta-grid">
          ${metaItem("System", raw.ai_system_name || raw.authority_type || raw.event_grain || "Candidate")}
          ${metaItem("Deployer", raw.deployer || raw.country || "Unspecified")}
          ${metaItem("Domain", record.domain)}
          ${metaItem("Status", truncate(record.status, 80))}
          ${metaItem("Country", record.country)}
          ${metaItem("Review", record.needsReview === "yes" ? "Needs review" : "Verified seed")}
        </div>
        ${raw.mitigation_gap ? `<p class="case-detail"><strong>Mitigation gap:</strong> ${escapeHtml(raw.mitigation_gap)}</p>` : ""}
        ${raw.next_verification_step ? `<p class="case-detail"><strong>Next verification:</strong> ${escapeHtml(raw.next_verification_step)}</p>` : ""}
        <div class="tags">${record.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
        <div class="links">
          ${links
            .slice(0, 5)
            .map(
              (url, index) =>
                `<a class="source-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" data-testid="link-source-${escapeHtml(record.id)}-${index}">${escapeHtml(index === 0 ? "Primary / best source" : labelFromUrl(url))}</a>`,
            )
            .join("")}
        </div>
      </article>
    `;
  }

  function metaItem(label, value) {
    return `<div class="meta-item"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "Unspecified")}</strong></div>`;
  }

  function renderTable(items) {
    elements.tableView.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Dataset</th>
            <th>Domain</th>
            <th>Country</th>
            <th>Status</th>
            <th>Source</th>
          </tr>
        </thead>
        <tbody>
          ${items
            .map(
              (record) => `
                <tr data-testid="row-case-${escapeHtml(record.id)}">
                  <td>${escapeHtml(record.id)}</td>
                  <td><strong>${escapeHtml(record.title)}</strong><br><span class="case-meta">${escapeHtml(record.matter)}</span></td>
                  <td>${escapeHtml(record.datasetLabel)}</td>
                  <td>${escapeHtml(record.domain)}</td>
                  <td>${escapeHtml(record.country)}</td>
                  <td>${escapeHtml(truncate(record.status, 110))}</td>
                  <td>${
                    record.primaryLink
                      ? `<a href="${escapeHtml(record.primaryLink)}" target="_blank" rel="noopener noreferrer">Open</a>`
                      : "—"
                  }</td>
                </tr>
              `,
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  init();
})();
