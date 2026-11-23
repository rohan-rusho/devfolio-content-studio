// DevFolio CMS — cloud sync via Supabase (v1.2.0)
//
// Optional. Without configuration DevFolio works exactly as before: content
// lives in this browser's localStorage. With configuration, content lives in
// a real Supabase (PostgreSQL) database, so a revisit — from any browser or
// device — shows the saved content instead of the seed data.
//
// Security model (enforced by the database, not just the UI):
//   - Anyone can READ the content (that is the public portfolio).
//   - Only a SIGNED-IN admin can WRITE. Sign-in is Supabase Auth
//     (email + password, an account you create in your Supabase project).
//   - The anon key is public by design: it only ever grants what the
//     database policies allow (public read). Never use the service_role key
//     here — it bypasses every policy.
//
// Setup (your Supabase account, ~3 minutes): create a free project, run
// supabase/schema.sql in its SQL editor, create one Auth user, then paste the
// project URL + anon key in Admin → Settings → Cloud sync and sign in.

const DEV_FOLIO_CLOUD_KEY = "devfolio.cloud.v1";
const DEV_FOLIO_CLOUD_TABLES = {
  projects: "devfolio_projects",
  skills: "devfolio_skills",
  experience: "devfolio_experience",
  posts: "devfolio_posts",
  documents: "devfolio_documents"
};
const DEV_FOLIO_CLOUD_PROFILE_TABLE = "devfolio_profile";

let devfolioCloudClient = null;

function devfolioCloudConfig() {
  try {
    const raw = localStorage.getItem(DEV_FOLIO_CLOUD_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function devfolioCloudSaveConfig(cfg) {
  localStorage.setItem(DEV_FOLIO_CLOUD_KEY, JSON.stringify(cfg));
  devfolioCloudClient = null;
}

function devfolioCloudClearConfig() {
  localStorage.removeItem(DEV_FOLIO_CLOUD_KEY);
  devfolioCloudClient = null;
}

function devfolioCloudConfigured() {
  const c = devfolioCloudConfig();
  return !!(c && c.url && c.anonKey);
}

function devfolioCloudClientGet() {
  if (devfolioCloudClient) return devfolioCloudClient;
  const c = devfolioCloudConfig();
  if (!c || !c.url || !c.anonKey) return null;
  if (typeof window === "undefined" || !window.supabase || !window.supabase.createClient) return null;
  try {
    devfolioCloudClient = window.supabase.createClient(c.url, c.anonKey);
  } catch (_) {
    return null;
  }
  return devfolioCloudClient;
}

// One row per item: { id, data, sort }. `sort` keeps the list order.
function devfolioCloudRowsFor(items) {
  return (items || []).map((item, i) => ({ id: String(item.id), data: item, sort: i }));
}

function devfolioCloudItemsFromRows(rows) {
  return (rows || []).map((row) => row.data);
}

async function devfolioCloudSignIn(email, password) {
  const client = devfolioCloudClientGet();
  if (!client) return { ok: false, error: "Cloud sync is not configured yet — paste your Supabase URL and anon key first." };
  const res = await client.auth.signInWithPassword({ email: email, password: password });
  if (res.error) return { ok: false, error: res.error.message || "Sign-in failed." };
  return { ok: true, email: res.data && res.data.user ? res.data.user.email : email };
}

async function devfolioCloudSignOut() {
  const client = devfolioCloudClientGet();
  if (client) {
    try { await client.auth.signOut(); } catch (_) {}
  }
  return { ok: true };
}

async function devfolioCloudSessionEmail() {
  const client = devfolioCloudClientGet();
  if (!client) return null;
  try {
    const res = await client.auth.getSession();
    const session = res.data && res.data.session;
    return session && session.user ? session.user.email : null;
  } catch (_) {
    return null;
  }
}

// Download everything from the cloud. Returns { ok, data } or { ok: false, error }.
// An empty cloud (fresh project, nothing pushed yet) returns the seed-shaped
// local data with empty: true, so the public site never goes blank.
async function devfolioCloudPull() {
  const client = devfolioCloudClientGet();
  if (!client) return { ok: false, error: "Cloud sync is not configured." };
  try {
    const data = JSON.parse(JSON.stringify(DEV_FOLIO_SEED));
    const fetched = {};
    let anyRows = false;
    for (const key of DEV_FOLIO_COLLECTIONS) {
      const res = await client.from(DEV_FOLIO_CLOUD_TABLES[key]).select("id,data").order("sort", { ascending: true });
      if (res.error) return { ok: false, error: res.error.message || ("Could not read " + key + " from the cloud.") };
      fetched[key] = devfolioCloudItemsFromRows(res.data);
      if (fetched[key].length > 0) anyRows = true;
    }
    const prof = await client.from(DEV_FOLIO_CLOUD_PROFILE_TABLE).select("data").eq("id", 1).maybeSingle();
    if (prof.error) return { ok: false, error: prof.error.message || "Could not read the profile from the cloud." };
    // Fresh cloud (nothing ever pushed): hand back the seed-shaped data and
    // say so — callers must not let an empty cloud wipe local content.
    if (!anyRows) return { ok: true, data: data, empty: true };
    for (const key of DEV_FOLIO_COLLECTIONS) data[key] = fetched[key];
    if (prof.data && prof.data.data) data.profile = prof.data.data;
    return { ok: true, data: data, empty: false };
  } catch (err) {
    return { ok: false, error: (err && err.message) || "Could not reach the cloud database." };
  }
}

// Upload the local content to the cloud. Requires a signed-in admin.
async function devfolioCloudPush(data) {
  const client = devfolioCloudClientGet();
  if (!client) return { ok: false, error: "Cloud sync is not configured." };
  const email = await devfolioCloudSessionEmail();
  if (!email) return { ok: false, error: "Sign in as admin first — only a signed-in admin can write to the cloud." };
  try {
    for (const key of DEV_FOLIO_COLLECTIONS) {
      const rows = devfolioCloudRowsFor(data[key]);
      const ids = rows.map((r) => r.id);
      if (rows.length > 0) {
        const up = await client.from(DEV_FOLIO_CLOUD_TABLES[key]).upsert(rows);
        if (up.error) return { ok: false, error: up.error.message || ("Could not save " + key + ".") };
      }
      // Remove cloud rows that no longer exist locally.
      let del;
      if (ids.length > 0) {
        const list = "(" + ids.map((id) => '"' + String(id).replace(/"/g, "") + '"').join(",") + ")";
        del = await client.from(DEV_FOLIO_CLOUD_TABLES[key]).delete().not("id", "in", list);
      } else {
        del = await client.from(DEV_FOLIO_CLOUD_TABLES[key]).delete().neq("id", "__none__");
      }
      if (del.error) return { ok: false, error: del.error.message || ("Could not tidy " + key + ".") };
    }
    const prof = await client.from(DEV_FOLIO_CLOUD_PROFILE_TABLE).upsert([{ id: 1, data: data.profile || {} }]);
    if (prof.error) return { ok: false, error: prof.error.message || "Could not save the profile." };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err && err.message) || "Could not reach the cloud database." };
  }
}

// Public site helper: if cloud is configured, fetch the saved content and
// replace the local copy when it differs. Never throws; the site keeps
// working from localStorage when the cloud is off or unreachable.
async function devfolioCloudRefreshIfConfigured() {
  if (!devfolioCloudConfigured()) return { changed: false, reason: "not-configured" };
  const res = await devfolioCloudPull();
  if (!res.ok) return { changed: false, reason: "error", error: res.error };
  if (res.empty) return { changed: false, reason: "empty-cloud" };
  const before = localStorage.getItem(DEV_FOLIO_STORE_KEY);
  const after = JSON.stringify(res.data);
  if (before === after) return { changed: false, reason: "up-to-date" };
  devfolioSave(res.data);
  return { changed: true, reason: "updated" };
}
