# DevFolio CMS — Dynamic Portfolio & Content Management Platform

**Version:** 1.0.0 · **Stack:** plain HTML, CSS and JavaScript — no build step, no dependencies, no server.

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

## What is in v1

- **Public portfolio** — hero, filterable projects grid with detail view and gallery, skills, experience timeline, blog with post view, documents & links, contact.
- **Admin dashboard** (`admin.html`, PIN-gated) — add, edit and delete projects (title, description, stack, repo/live links, gallery image URLs), skills, experience entries, blog posts and documents; edit the profile; live preview link.
- **Data** — everything in `localStorage`. Export all content as JSON, import JSON, reset to seed data. Loading, empty and bad-import states are handled in plain words.
- **Design** — minimal editorial style in the brief's colours (`#FAFAF9`, `#FFFFFF`, `#292524`, `#0D9488`), responsive.

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

## Roadmap (v1.1 / v2)

- v1.1: search, tags, RSS/sitemap.
- v2: Spring Boot + PostgreSQL backend, server login with roles, image uploads, analytics.

## License

MIT — see [LICENSE](LICENSE).
