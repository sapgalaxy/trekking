// ---------- Elevation profile SVG generator ----------
// Turns an array of relative height values (0-100) into an SVG polyline
// path string, so every trek's "signature" line is drawn from its own data.
function profilePath(values, width, height, padding = 4) {
  const usableW = width - padding * 2;
  const usableH = height - padding * 2;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = usableW / (values.length - 1);

  const points = values.map((v, i) => {
    const x = padding + i * step;
    const y = padding + usableH - ((v - min) / range) * usableH;
    return [x, y];
  });

  return points.map((p, i) => (i === 0 ? "M" : "L") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
}

function makeProfileSVG(values, { width = 200, height = 60, animate = false, id = "" } = {}) {
  const d = profilePath(values, width, height);
  const animClass = animate ? "profile-line--animate" : "";
  return `
    <svg class="profile-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
      <path id="${id}" class="profile-line ${animClass}" d="${d}" fill="none" />
    </svg>
  `;
}

// ---------- Card rendering ----------
function statLine(exp) {
  return `${exp.maxAltitudeM.toLocaleString()}m &middot; ${exp.durationDays}d &middot; ${exp.dateRange}`;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function fuzzyMatches(query, value) {
  if (!query) return true;
  const q = normalizeText(query);
  const v = normalizeText(value);
  if (!q || !v) return false;

  let cursor = 0;
  for (const char of q) {
    const pos = v.indexOf(char, cursor);
    if (pos === -1) return false;
    cursor = pos + 1;
  }
  return true;
}

function getVisibleExpeditions(query) {
  return EXPEDITIONS.filter(exp => {
    const haystack = [
      exp.title,
      exp.region,
      exp.difficulty,
      exp.dateRange,
      exp.distanceKm,
      exp.maxAltitudeM,
      exp.durationDays,
      exp.slug,
      exp.storyFile
    ].join(" ");

    return fuzzyMatches(query, haystack);
  });
}

function renderCards() {
  const grid = document.getElementById("expedition-grid");
  const searchInput = document.getElementById("expedition-search");
  const query = searchInput ? searchInput.value : "";
  const visibleExpeditions = getVisibleExpeditions(query);

  if (!visibleExpeditions.length) {
    grid.innerHTML = `
      <div class="load-error">
        <p><strong>No expeditions match that search.</strong></p>
        <p>Try a different keyword like a region, difficulty, or trek name.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = visibleExpeditions.map((exp, i) => `
    <article class="card" data-slug="${exp.slug}" tabindex="0" role="button" aria-label="Open ${exp.title} expedition">
      <div class="card__photo">
        <img src="${exp.cover}" alt="${exp.title}" loading="lazy"
             onerror="this.closest('.card__photo').classList.add('is-missing'); this.remove();">
        <div class="card__missing-note">Add cover photo:<br><code>${exp.cover}</code></div>
        <span class="card__index">${String(i + 1).padStart(2, "0")}</span>
      </div>
      <div class="card__body">
        <h3 class="card__title">${exp.title}</h3>
        <p class="card__region">${exp.region}</p>
        ${makeProfileSVG(exp.elevationProfile, { width: 240, height: 40 })}
        <p class="card__stats">${statLine(exp)}</p>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => openDetail(card.dataset.slug));
    card.addEventListener("keypress", e => {
      if (e.key === "Enter") openDetail(card.dataset.slug);
    });
  });
}

function attachSearch() {
  const input = document.getElementById("expedition-search");
  if (!input) return;
  input.addEventListener("input", renderCards);
}

// ---------- Story loading ----------
// Stories live in their own .txt files (see js/data.js). This fetches the
// file's text. Note: fetch() of local files is blocked by browsers when a
// page is opened directly via file:// — it only works once the site is
// served over http(s), e.g. via a local server or once it's hosted online.
async function loadStory(storyFile) {
  const response = await fetch(storyFile);
  if (!response.ok) {
    throw new Error(`Could not load ${storyFile} (HTTP ${response.status})`);
  }
  return (await response.text()).trim();
}

// ---------- Detail / modal rendering ----------
async function openDetail(slug) {
  const exp = EXPEDITIONS.find(e => e.slug === slug);
  if (!exp) return;

  const overlay = document.getElementById("detail-overlay");
  overlay.innerHTML = `
    <div class="detail-panel">
      <button class="detail-close" aria-label="Close">&times;</button>
      <div class="detail-header">
        <p class="detail-region">${exp.region}</p>
        <h2 class="detail-title">${exp.title}</h2>
        <p class="detail-dates">${exp.dateRange}</p>
        ${makeProfileSVG(exp.elevationProfile, { width: 600, height: 90, animate: true, id: "detail-profile" })}
      </div>

      <div class="detail-stats">
        <div class="stat"><span class="stat__label">Max altitude</span><span class="stat__value">${exp.maxAltitudeM.toLocaleString()} m</span></div>
        <div class="stat"><span class="stat__label">Distance</span><span class="stat__value">${exp.distanceKm} km</span></div>
        <div class="stat"><span class="stat__label">Duration</span><span class="stat__value">${exp.durationDays} days</span></div>
        <div class="stat"><span class="stat__label">Difficulty</span><span class="stat__value">${exp.difficulty}</span></div>
      </div>

      <p class="detail-story detail-story--loading">Loading story…</p>

      <div class="detail-gallery">
        ${exp.photos.map((src, i) => `
          <div class="gallery-photo" data-index="${i}" tabindex="0" role="button" aria-label="Open photo ${i + 1} of ${exp.photos.length}">
            <img src="${src}" alt="${exp.title} photo" loading="lazy"
                 onerror="this.closest('.gallery-photo').classList.add('is-missing'); this.remove();">
            <div class="gallery-missing-note">${src}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  overlay.classList.add("is-open");
  document.body.classList.add("no-scroll");
  overlay.querySelector(".detail-close").addEventListener("click", closeDetail);

  overlay.querySelectorAll(".gallery-photo").forEach(photoEl => {
    // Skip photos that failed to load — nothing to view full-screen yet.
    const openThis = () => {
      if (photoEl.classList.contains("is-missing")) return;
      openLightbox(exp, Number(photoEl.dataset.index));
    };
    photoEl.addEventListener("click", openThis);
    photoEl.addEventListener("keypress", e => { if (e.key === "Enter") openThis(); });
  });

  overlay.onclick = (e) => {
    if (e.target === overlay) closeDetail();
  };

  // Fetch the story text after the panel is already visible, so the rest
  // of the detail view (stats, photos) shows up immediately.
  const storyEl = overlay.querySelector(".detail-story");
  if (!exp.storyFile) {
    storyEl.textContent = "No story file set for this expedition yet.";
    storyEl.classList.remove("detail-story--loading");
    return;
  }
  try {
    const text = await loadStory(exp.storyFile);
    // Guard against the panel having been closed/replaced while fetching.
    if (!document.body.contains(storyEl)) return;
    storyEl.textContent = text;
    storyEl.classList.remove("detail-story--loading");
  } catch (err) {
    if (!document.body.contains(storyEl)) return;
    storyEl.classList.remove("detail-story--loading");
    storyEl.classList.add("detail-story--error");
    storyEl.innerHTML = `
      Couldn't load the story text from <code>${exp.storyFile}</code>.
      This usually means the site is being opened directly as a file rather
      than through a local server — see the README for the one-line fix
      (running <code>python3 -m http.server</code> in this folder).
    `;
  }
}

function closeDetail() {
  const overlay = document.getElementById("detail-overlay");
  overlay.classList.remove("is-open");
  document.body.classList.remove("no-scroll");
  setTimeout(() => { overlay.innerHTML = ""; }, 300);
}

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeDetail();
});

// ---------- Lightbox / full-photo-gallery mode ----------
// Clicking any thumbnail in a trip's gallery opens this, showing every
// photo from that same trip, with next/prev through the whole set.
let lightboxState = { photos: [], index: 0, title: "" };

function openLightbox(exp, index) {
  lightboxState = { photos: exp.photos, index, title: exp.title };
  const lightbox = document.getElementById("lightbox");
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="Close photo gallery">&times;</button>
    <button class="lightbox-nav lightbox-nav--prev" aria-label="Previous photo">&#8249;</button>
    <div class="lightbox-stage">
      <img class="lightbox-img" alt="${exp.title} photo">
      <p class="lightbox-caption"></p>
    </div>
    <button class="lightbox-nav lightbox-nav--next" aria-label="Next photo">&#8250;</button>
  `;
  lightbox.classList.add("is-open");

  lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
  lightbox.querySelector(".lightbox-nav--prev").addEventListener("click", () => stepLightbox(-1));
  lightbox.querySelector(".lightbox-nav--next").addEventListener("click", () => stepLightbox(1));
  lightbox.onclick = (e) => {
    if (e.target === lightbox) closeLightbox();
  };

  renderLightboxPhoto();
}

function renderLightboxPhoto() {
  const { photos, index, title } = lightboxState;
  const img = document.querySelector(".lightbox-img");
  const caption = document.querySelector(".lightbox-caption");
  if (!img) return;
  img.src = photos[index];
  caption.textContent = `${title} — photo ${index + 1} of ${photos.length}`;
}

function stepLightbox(direction) {
  const { photos } = lightboxState;
  lightboxState.index = (lightboxState.index + direction + photos.length) % photos.length;
  renderLightboxPhoto();
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("is-open");
  setTimeout(() => { lightbox.innerHTML = ""; }, 200);
}

document.addEventListener("keydown", e => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

// ---------- Hero stats & signature profile ----------
function renderHero() {
  const totalDistance = EXPEDITIONS.reduce((sum, e) => sum + e.distanceKm, 0);
  const totalDays = EXPEDITIONS.reduce((sum, e) => sum + e.durationDays, 0);
  const highest = Math.max(...EXPEDITIONS.map(e => e.maxAltitudeM));

  document.getElementById("hero-count").textContent = EXPEDITIONS.length;
  document.getElementById("hero-distance").textContent = totalDistance.toLocaleString() + " km";
  document.getElementById("hero-days").textContent = totalDays;
  document.getElementById("hero-altitude").textContent = highest.toLocaleString() + " m";

  // Signature: stitch every expedition's profile into one long ridgeline
  const combined = EXPEDITIONS.flatMap(e => e.elevationProfile);
  document.getElementById("hero-profile").innerHTML = makeProfileSVG(combined, {
    width: 1000, height: 160, animate: true, id: "hero-profile-line"
  });
}

// ---------- Safety net ----------
// If data.js has a typo (missing comma, stray bracket, etc.) or didn't load
// at all, show a clear message instead of a silently blank page.
function showLoadError(err) {
  const grid = document.getElementById("expedition-grid");
  if (grid) {
    grid.innerHTML = `
      <div class="load-error">
        <p><strong>Something's not loading right.</strong></p>
        <p>This usually means either:</p>
        <ul>
          <li>The project folder wasn't fully unzipped before opening <code>index.html</code> — make sure you extracted the whole folder, not just opened the file from inside the zip.</li>
          <li>There's a small typo in <code>js/data.js</code> (a missing comma or bracket) — open your browser's console (F12 → Console tab) to see the exact error.</li>
        </ul>
        <p style="opacity:0.7; font-family: var(--font-mono); font-size: 0.8rem;">${err && err.message ? err.message : ""}</p>
      </div>
    `;
  }
}

try {
  if (typeof EXPEDITIONS === "undefined") {
    throw new Error("EXPEDITIONS is not defined — js/data.js did not load.");
  }
  renderHero();
  renderCards();
  attachSearch();
} catch (err) {
  console.error(err);
  showLoadError(err);
}
