// DevFolio CMS — store (v1.0.0)
// All content lives in localStorage. v1 has no server and no real
// multi-user auth: the admin PIN is a local gate only. Export/import JSON
// so content can move cleanly to a real backend (v2) later.

const DEV_FOLIO_STORE_KEY = "devfolio.data.v1";
const DEV_FOLIO_PIN_KEY = "devfolio.pin.v1";
const DEV_FOLIO_DEFAULT_PIN = "1234";
const DEV_FOLIO_COLLECTIONS = ["projects", "skills", "experience", "posts", "documents"];

function devfolioLoad() {
  try {
    const raw = localStorage.getItem(DEV_FOLIO_STORE_KEY);
    if (!raw) {
      const seed = JSON.parse(JSON.stringify(DEV_FOLIO_SEED));
      localStorage.setItem(DEV_FOLIO_STORE_KEY, JSON.stringify(seed));
      return seed;
    }
    const data = JSON.parse(raw);
    // Fill any collection a hand-edited store is missing.
    for (const key of DEV_FOLIO_COLLECTIONS) {
      if (!Array.isArray(data[key])) data[key] = [];
    }
    if (!data.profile) data.profile = JSON.parse(JSON.stringify(DEV_FOLIO_SEED.profile));
    return data;
  } catch (err) {
    // Corrupt store: fall back to seed rather than a blank page.
    const seed = JSON.parse(JSON.stringify(DEV_FOLIO_SEED));
    try { localStorage.setItem(DEV_FOLIO_STORE_KEY, JSON.stringify(seed)); } catch (_) {}
    return seed;
  }
}

function devfolioSave(data) {
  localStorage.setItem(DEV_FOLIO_STORE_KEY, JSON.stringify(data));
}

function devfolioReset() {
  const seed = JSON.parse(JSON.stringify(DEV_FOLIO_SEED));
  devfolioSave(seed);
  return seed;
}

function devfolioNewId(prefix) {
  return prefix + "-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function devfolioAdd(collection, item) {
  const data = devfolioLoad();
  if (!item.id) item.id = devfolioNewId(collection.slice(0, 1));
  data[collection].unshift(item);
  devfolioSave(data);
  return data;
}

function devfolioUpdate(collection, id, patch) {
  const data = devfolioLoad();
  const item = data[collection].find((x) => x.id === id);
  if (!item) return data;
  Object.assign(item, patch);
  devfolioSave(data);
  return data;
}

function devfolioRemove(collection, id) {
  const data = devfolioLoad();
  data[collection] = data[collection].filter((x) => x.id !== id);
  devfolioSave(data);
  return data;
}

function devfolioExport() {
  return JSON.stringify(devfolioLoad(), null, 2);
}

// Returns { ok: true } or { ok: false, error: "..." } in plain words.
function devfolioImport(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch (_) {
    return { ok: false, error: "That file is not valid JSON. Export a backup from DevFolio first, then edit it and try again." };
  }
  if (!parsed || typeof parsed !== "object") {
    return { ok: false, error: "That file does not look like DevFolio data — it should be an object with projects, skills, experience, posts and documents." };
  }
  for (const key of DEV_FOLIO_COLLECTIONS) {
    if (parsed[key] !== undefined && !Array.isArray(parsed[key])) {
      return { ok: false, error: "The \"" + key + "\" section is not a list. Fix it and try again — nothing was changed." };
    }
  }
  const data = devfolioLoad();
  for (const key of DEV_FOLIO_COLLECTIONS) {
    if (Array.isArray(parsed[key])) data[key] = parsed[key];
  }
  if (parsed.profile && typeof parsed.profile === "object") data.profile = parsed.profile;
  devfolioSave(data);
  return { ok: true };
}

function devfolioGetPin() {
  return localStorage.getItem(DEV_FOLIO_PIN_KEY) || DEV_FOLIO_DEFAULT_PIN;
}

function devfolioSetPin(pin) {
  localStorage.setItem(DEV_FOLIO_PIN_KEY, pin);
}

function devfolioCheckPin(pin) {
  return String(pin) === String(devfolioGetPin());
}
