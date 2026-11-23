# DevFolio CMS — Dynamic Portfolio & Content Management Platform

**Version:** 1.2.0 · **Stack:** plain HTML, CSS and JavaScript — no build step, no dependencies, no server (optional Supabase for cloud sync).

DevFolio is a minimal editorial portfolio whose content is managed through a private admin dashboard. The public pages render from the same data the admin edits, so changes show immediately. It ships seeded with real work by Md. Rohan Islam (Speed, CVora, RequestLab, Toaster Roaster, open-source contributions and more) — not lorem ipsum.

## Live demo

Enable GitHub Pages (Settings → Pages → Deploy from a branch, `main`, `/ (root)`), then visit:

**https://rohan-rusho.github.io/devfolio-content-studio/**

## Run locally

```bash
# any static server works, e.g. Python:
python -m http.server 8000
# then open http://localhost:8000
```

Or just open `index.html` in a browser — everything works from `file://` too (localStorage is per-origin, so edits made on `file://` stay on `file://`).

## What is in v1.2

Everything from v1.1, plus **cloud sync (Supabase)** — the thing that makes saved progress survive a revisit:

- **Without cloud sync** (default): content lives in the browser's localStorage, exactly as before. Clear the browser data and it is gone.
- **With cloud sync**: content lives in your Supabase (PostgreSQL) database. The public site loads the saved content from the cloud on every visit, so a revisit — from any browser or device — shows what you saved. Admin edits are pushed to the cloud; the cloud copy is pulled back into any browser.
- **Security is in the database, not just the UI**: anyone can read (public portfolio), only a signed-in admin can write (Supabase Auth, email + password). The anon key is public by design — it only grants what the database policies allow. Never use the `service_role` key here.

### Setting up cloud sync (about 3 minutes, your Supabase account)

1. Create a free project at [supabase.com](https://supabase.com) (free tier is enough).
2. In the project: SQL Editor → New query → paste `supabase/schema.sql` from this repo → Run. (Creates 6 tables + policies: public read, signed-in write.)
3. Authentication → Users → Add user → create your admin account (email + password).
4. Settings → API → copy the **Project URL** and the **anon key** (not the service_role key).
5. Open the live site's Admin → Settings → Cloud sync → paste the URL + anon key → Save → sign in with the admin account → **Push local content to cloud** (once).
6. Done. Every revisit now loads the saved content from the cloud. If the cloud is ever unreachable, the site falls back to the browser copy.

## What is in v1.1

- **Public portfolio** — hero, filterable projects grid with detail view and gallery, skills, experience timeline, blog with post view, documents & links, contact.
- **Search, sort & featured** — live search across project names, descriptions, stacks and tags; sort by Featured first, A–Z or type; featured projects carry a badge and sort first.
- **Tags** — projects carry topic tags (`#media`, `#api` …) alongside their stack; add or edit them in Admin.
- **Reading time** — blog cards and posts show an honest "X min read".
- **Dark mode** — toggle in the header, remembered in the browser.
- **SEO** — structured data (JSON-LD Person + projects) is generated from the live content, and Admin → Settings exports a `sitemap.xml` and an RSS `feed.xml` built from the current content (upload the downloaded files to the site root to publish them).
- **Admin dashboard** (`admin.html`, PIN-gated) — add, edit and delete projects (title, description, stack, tags, featured, repo/live links, gallery image URLs), skills, experience entries, blog posts and documents; edit the profile; live preview link.
- **Data** — everything in `localStorage` by default, or in Supabase with cloud sync (see above). Export all content as JSON, import JSON, reset to seed data. Loading, empty and bad-import states are handled in plain words.
- **Design** — minimal editorial style in the brief's colours (`#FAFAF9`, `#FFFFFF`, `#292524`, `#0D9488`), responsive, light + dark.

## v1.0

First release: public portfolio + PIN-gated admin + localStorage CMS with seed content.

## Admin PIN

The default PIN is **1234**. Change it in Admin → Settings once you are in. The PIN is stored in your browser only.

## Honest limitation (please read)

**v1 has no real backend and no real multi-user auth.** The admin is local-only: a browser PIN gate that keeps casual visitors out of the edit screens, but anyone with the files can read the data. It is not a Spring Boot + PostgreSQL CMS with server-side login — that is the full-stack **v2**, which needs a hosting decision (e.g. Railway) and real accounts. v1 says this plainly, and ships JSON export/import so your content moves cleanly to v2 later.

## Files

```
index.html          public portfolio
admin.html          admin dashboard (PIN-gated)
css/style.css       all styling
js/data.js          seed content (real projects)
js/store.js         localStorage CRUD + export/import
js/app.js           public rendering
js/admin.js         admin dashboard + PIN gate
```

## Roadmap (v1.3 / v2)

- v1.3: per-project pages (real URLs instead of `#project-…` anchors), tag filter pills, contact form.
- v2: full backend service (Spring Boot + PostgreSQL on Railway) if a hosted server is ever wanted instead of Supabase.

## License

MIT — see [LICENSE](LICENSE).
