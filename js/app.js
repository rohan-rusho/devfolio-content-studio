// DevFolio CMS — public portfolio rendering (v1.0.0)

function devfolioEscape(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function devfolioParagraphs(text) {
  return String(text || "")
    .split(/\n+/)
    .map((p) => "<p>" + devfolioEscape(p) + "</p>")
    .join("");
}

let devfolioData = null;
let devfolioFilter = "All";
let devfolioQuery = "";
let devfolioSort = "featured";

function devfolioReadingTime(text) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function devfolioApplyTheme() {
  let theme = "light";
  try {
    theme = localStorage.getItem("devfolio.theme") || "light";
  } catch (_) {}
  document.body.classList.toggle("dark", theme === "dark");
  const btn = document.getElementById("themeToggle");
  if (btn) btn.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function devfolioToggleTheme() {
  const dark = !document.body.classList.contains("dark");
  try {
    localStorage.setItem("devfolio.theme", dark ? "dark" : "light");
  } catch (_) {}
  devfolioApplyTheme();
}

function devfolioRenderAll() {
  devfolioData = devfolioLoad();
  devfolioRenderProfile();
  devfolioRenderFilters();
  devfolioRenderProjects();
  devfolioRenderSkills();
  devfolioRenderExperience();
  devfolioRenderPosts();
  devfolioRenderDocuments();
}

function devfolioRenderProfile() {
  const p = devfolioData.profile || {};
  const set = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "";
  };
  set("heroName", p.name);
  set("heroRole", p.role);
  set("heroTagline", p.tagline);
  set("heroAbout", p.about);
  const gh = document.getElementById("heroGithub");
  if (gh && p.github) gh.href = p.github;
  const cg = document.getElementById("contactGithub");
  if (cg && p.github) cg.href = p.github;
  // Structured data for search engines, built from the live content so
  // admin edits are reflected (not a frozen copy of the seed).
  const old = document.getElementById("jsonld");
  if (old) old.remove();
  const ld = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name || "",
    jobTitle: p.role || "",
    url: p.github || "",
    description: p.tagline || "",
    hasPart: (devfolioData.projects || []).map((proj) => ({
      "@type": "CreativeWork",
      name: proj.title,
      description: proj.description,
      url: proj.repo || undefined
    }))
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "jsonld";
  script.textContent = JSON.stringify(ld);
  document.head.appendChild(script);
}

function devfolioProjectTypes() {
  const types = ["All"];
  for (const p of devfolioData.projects) {
    if (p.type && !types.includes(p.type)) types.push(p.type);
  }
  return types;
}

function devfolioRenderFilters() {
  const wrap = document.getElementById("projectFilters");
  if (!wrap) return;
  wrap.innerHTML = devfolioProjectTypes()
    .map(
      (t) =>
        '<button class="filter-pill' +
        (t === devfolioFilter ? " active" : "") +
        '" data-filter="' +
        devfolioEscape(t) +
        '">' +
        devfolioEscape(t) +
        "</button>"
    )
    .join("");
  wrap.querySelectorAll(".filter-pill").forEach((btn) => {
    btn.addEventListener("click", () => {
      devfolioFilter = btn.getAttribute("data-filter");
      devfolioRenderFilters();
      devfolioRenderProjects();
    });
  });
}

function devfolioRenderProjects() {
  const grid = document.getElementById("projectGrid");
  const count = document.getElementById("projectCount");
  const empty = document.getElementById("projectsEmpty");
  if (!grid) return;
  const list = devfolioData.projects
    .filter((p) => devfolioFilter === "All" || p.type === devfolioFilter)
    .filter((p) => {
      if (!devfolioQuery) return true;
      const hay = [p.title, p.description, p.type, (p.stack || []).join(" "), (p.tags || []).join(" ")]
        .join(" ")
        .toLowerCase();
      return devfolioQuery.split(/\s+/).every((word) => hay.includes(word));
    });
  if (devfolioSort === "az") {
    list.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  } else if (devfolioSort === "type") {
    list.sort(
      (a, b) =>
        String(a.type).localeCompare(String(b.type)) ||
        String(a.title).localeCompare(String(b.title))
    );
  } else {
    list.sort(
      (a, b) =>
        (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
        String(a.title).localeCompare(String(b.title))
    );
  }
  if (count) count.textContent = list.length + (list.length === 1 ? " project" : " projects");
  if (empty) empty.hidden = list.length !== 0;
  grid.innerHTML = list
    .map(
      (p) =>
        '<article class="card project-card" data-id="' +
        devfolioEscape(p.id) +
        '">' +
        '<div class="card-type">' +
        devfolioEscape(p.type || "Project") +
        (p.featured ? ' <span class="featured-badge">Featured</span>' : "") +
        "</div>" +
        "<h3>" +
        devfolioEscape(p.title) +
        "</h3>" +
        "<p>" +
        devfolioEscape(p.description) +
        "</p>" +
        '<div class="tags">' +
        (p.stack || [])
          .map((s) => '<span class="tag">' + devfolioEscape(s) + "</span>")
          .join("") +
        (p.tags || [])
          .map((t) => '<span class="tag tag-topic">#' + devfolioEscape(t) + "</span>")
          .join("") +
        "</div>" +
        '<div class="card-links">' +
        (p.repo
          ? '<a href="' + devfolioEscape(p.repo) + '" target="_blank" rel="noopener">Repository</a>'
          : "") +
        (p.live
          ? '<a href="' + devfolioEscape(p.live) + '" target="_blank" rel="noopener">Live site</a>'
          : "") +
        '<button class="link-btn" data-view="' +
        devfolioEscape(p.id) +
        '">Details</button>' +
        "</div>" +
        "</article>"
    )
    .join("");
  grid.querySelectorAll("[data-view]").forEach((btn) => {
    btn.addEventListener("click", () => devfolioOpenProject(btn.getAttribute("data-view")));
  });
}

function devfolioOpenProject(id) {
  const p = devfolioData.projects.find((x) => x.id === id);
  if (!p) return;
  document.getElementById("projectModalTitle").textContent = p.title;
  document.getElementById("projectModalType").textContent = p.type || "Project";
  document.getElementById("projectModalBody").innerHTML = devfolioParagraphs(p.description);
  document.getElementById("projectModalTags").innerHTML = (p.stack || [])
    .map((s) => '<span class="tag">' + devfolioEscape(s) + "</span>")
    .join("");
  const gallery = document.getElementById("projectModalGallery");
  const images = p.gallery || [];
  gallery.innerHTML =
    images.length === 0
      ? '<p class="muted">No gallery images yet — add some from the Admin dashboard.</p>'
      : images
          .map(
            (src) =>
              '<img src="' + devfolioEscape(src) + '" alt="" loading="lazy" onerror="this.remove()">'
          )
          .join("");
  const links = document.getElementById("projectModalLinks");
  links.innerHTML =
    (p.repo
      ? '<a class="btn" href="' + devfolioEscape(p.repo) + '" target="_blank" rel="noopener">Repository</a>'
      : "") +
    (p.live
      ? '<a class="btn" href="' + devfolioEscape(p.live) + '" target="_blank" rel="noopener">Live site</a>'
      : "");
  devfolioShowModal("projectModal");
}

function devfolioRenderSkills() {
  const wrap = document.getElementById("skillsList");
  if (!wrap) return;
  wrap.innerHTML = devfolioData.skills
    .map(
      (g) =>
        '<div class="skill-group"><h3>' +
        devfolioEscape(g.group) +
        "</h3>" +
        '<div class="tags">' +
        (g.items || [])
          .map((s) => '<span class="tag">' + devfolioEscape(s) + "</span>")
          .join("") +
        "</div></div>"
    )
    .join("");
  const empty = document.getElementById("skillsEmpty");
  if (empty) empty.hidden = devfolioData.skills.length !== 0;
}

function devfolioRenderExperience() {
  const wrap = document.getElementById("experienceList");
  if (!wrap) return;
  wrap.innerHTML = devfolioData.experience
    .map(
      (e) =>
        '<div class="timeline-item"><div class="timeline-period">' +
        devfolioEscape(e.period || "") +
        "</div>" +
        "<h3>" +
        devfolioEscape(e.role) +
        "</h3>" +
        '<div class="muted">' +
        devfolioEscape(e.org || "") +
        "</div>" +
        "<p>" +
        devfolioEscape(e.description || "") +
        "</p></div>"
    )
    .join("");
  const empty = document.getElementById("experienceEmpty");
  if (empty) empty.hidden = devfolioData.experience.length !== 0;
}

function devfolioRenderPosts() {
  const wrap = document.getElementById("blogList");
  if (!wrap) return;
  wrap.innerHTML = devfolioData.posts
    .map(
      (post) =>
        '<article class="card post-card"><div class="card-type">' +
        devfolioEscape(post.date || "") +
        " · " +
        devfolioReadingTime(post.body) +
        " min read" +
        "</div>" +
        "<h3>" +
        devfolioEscape(post.title) +
        "</h3>" +
        '<button class="link-btn" data-post="' +
        devfolioEscape(post.id) +
        '">Read post</button></article>'
    )
    .join("");
  wrap.querySelectorAll("[data-post]").forEach((btn) => {
    btn.addEventListener("click", () => devfolioOpenPost(btn.getAttribute("data-post")));
  });
  const empty = document.getElementById("blogEmpty");
  if (empty) empty.hidden = devfolioData.posts.length !== 0;
}

function devfolioOpenPost(id) {
  const post = devfolioData.posts.find((x) => x.id === id);
  if (!post) return;
  document.getElementById("postModalTitle").textContent = post.title;
  document.getElementById("postModalDate").textContent =
    (post.date || "") + " · " + devfolioReadingTime(post.body) + " min read";
  document.getElementById("postModalBody").innerHTML = devfolioParagraphs(post.body);
  devfolioShowModal("postModal");
}

function devfolioRenderDocuments() {
  const wrap = document.getElementById("documentsList");
  if (!wrap) return;
  wrap.innerHTML = devfolioData.documents
    .map(
      (d) =>
        '<article class="card doc-card"><h3>' +
        devfolioEscape(d.title) +
        "</h3>" +
        "<p>" +
        devfolioEscape(d.description || "") +
        "</p>" +
        '<a href="' +
        devfolioEscape(d.url) +
        '" target="_blank" rel="noopener">Open</a></article>'
    )
    .join("");
  const empty = document.getElementById("documentsEmpty");
  if (empty) empty.hidden = devfolioData.documents.length !== 0;
}

function devfolioShowModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.hidden = false;
}

function devfolioHideModals() {
  document.querySelectorAll(".modal").forEach((m) => {
    m.hidden = true;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  devfolioApplyTheme();
  devfolioRenderAll();
  const themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", devfolioToggleTheme);
  const search = document.getElementById("projectSearch");
  if (search) {
    search.addEventListener("input", () => {
      devfolioQuery = search.value.trim().toLowerCase();
      devfolioRenderProjects();
    });
  }
  const sort = document.getElementById("projectSort");
  if (sort) {
    sort.addEventListener("change", () => {
      devfolioSort = sort.value;
      devfolioRenderProjects();
    });
  }
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", devfolioHideModals);
  });
  document.querySelectorAll(".modal").forEach((m) => {
    m.addEventListener("click", (e) => {
      if (e.target === m) devfolioHideModals();
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") devfolioHideModals();
  });
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
});
