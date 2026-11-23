// DevFolio CMS — admin dashboard (v1.0.0)
// PIN-gated, local only: the PIN keeps casual visitors out of the edit
// screens, but anyone with the files can read the data. v1 has no server
// and no real multi-user auth — that is the v2 backend roadmap.

function adminEscape(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function adminEl(id) {
  return document.getElementById(id);
}

function adminShowStatus(msg, isError) {
  const el = adminEl("statusMsg");
  if (!el) return;
  el.textContent = msg;
  el.className = "status " + (isError ? "status-error" : "status-ok");
  el.hidden = false;
}

function adminSplitList(text) {
  return String(text || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

let adminData = null;
let adminEditing = { projects: null, skills: null, experience: null, posts: null, documents: null };

function adminUnlocked() {
  try {
    return sessionStorage.getItem("devfolio.admin") === "1";
  } catch (_) {
    return false;
  }
}

function adminShowApp() {
  adminEl("pinGate").hidden = true;
  adminEl("adminApp").hidden = false;
  adminData = devfolioLoad();
  adminRenderAll();
}

function adminRenderAll() {
  adminRenderProjects();
  adminRenderSkills();
  adminRenderExperience();
  adminRenderPosts();
  adminRenderDocuments();
  adminRenderProfileForm();
}

// ---- generic list rendering ----

function adminListHtml(items, fields, collection) {
  if (items.length === 0) return '<p class="muted">Nothing here yet — add one below.</p>';
  return items
    .map((item) => {
      const label = fields.map((f) => adminEscape(item[f] || "")).filter(Boolean).join(" — ");
      return (
        '<div class="admin-item"><div class="admin-item-label">' +
        (label || item.id) +
        "</div>" +
        '<div class="admin-item-actions">' +
        '<button class="btn-small" data-edit="' +
        collection +
        ":" +
        adminEscape(item.id) +
        '">Edit</button>' +
        '<button class="btn-small btn-danger" data-delete="' +
        collection +
        ":" +
        adminEscape(item.id) +
        '">Delete</button>' +
        "</div></div>"
      );
    })
    .join("");
}

function adminBindList(containerId, collection, onEdit) {
  const container = adminEl(containerId);
  if (!container) return;
  container.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-edit").split(":").slice(1).join(":");
      onEdit(id);
    });
  });
  container.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-delete").split(":").slice(1).join(":");
      const item = adminData[collection].find((x) => x.id === id);
      const label = item ? item.title || item.role || item.group || item.id : id;
      if (!window.confirm('Delete "' + label + '"? This cannot be undone.')) return;
      adminData = devfolioRemove(collection, id);
      adminEditing[collection] = null;
      adminRenderAll();
      adminShowStatus("Deleted.");
    });
  });
}

// ---- projects ----

function adminRenderProjects() {
  adminEl("projectsList").innerHTML = adminListHtml(adminData.projects, ["title", "type"], "projects");
  adminBindList("projectsList", "projects", adminEditProject);
}

function adminEditProject(id) {
  const p = adminData.projects.find((x) => x.id === id);
  if (!p) return;
  adminEditing.projects = id;
  adminEl("pf-id").value = p.id;
  adminEl("pf-title").value = p.title || "";
  adminEl("pf-type").value = p.type || "";
  adminEl("pf-desc").value = p.description || "";
  adminEl("pf-stack").value = (p.stack || []).join(", ");
  adminEl("pf-repo").value = p.repo || "";
  adminEl("pf-live").value = p.live || "";
  adminEl("pf-gallery").value = (p.gallery || []).join(", ");
  adminEl("pf-submit").textContent = "Save changes";
  adminEl("pf-cancel").hidden = false;
  adminEl("projectForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function adminResetProjectForm() {
  adminEditing.projects = null;
  adminEl("projectForm").reset();
  adminEl("pf-id").value = "";
  adminEl("pf-submit").textContent = "Add project";
  adminEl("pf-cancel").hidden = true;
}

// ---- skills ----

function adminRenderSkills() {
  adminEl("skillsList").innerHTML = adminListHtml(adminData.skills, ["group"], "skills");
  adminBindList("skillsList", "skills", adminEditSkill);
}

function adminEditSkill(id) {
  const g = adminData.skills.find((x) => x.id === id);
  if (!g) return;
  adminEditing.skills = id;
  adminEl("sf-id").value = g.id;
  adminEl("sf-group").value = g.group || "";
  adminEl("sf-items").value = (g.items || []).join(", ");
  adminEl("sf-submit").textContent = "Save changes";
  adminEl("sf-cancel").hidden = false;
}

function adminResetSkillForm() {
  adminEditing.skills = null;
  adminEl("skillForm").reset();
  adminEl("sf-id").value = "";
  adminEl("sf-submit").textContent = "Add skill group";
  adminEl("sf-cancel").hidden = true;
}

// ---- experience ----

function adminRenderExperience() {
  adminEl("experienceList").innerHTML = adminListHtml(adminData.experience, ["role", "org"], "experience");
  adminBindList("experienceList", "experience", adminEditExperience);
}

function adminEditExperience(id) {
  const e = adminData.experience.find((x) => x.id === id);
  if (!e) return;
  adminEditing.experience = id;
  adminEl("ef-id").value = e.id;
  adminEl("ef-role").value = e.role || "";
  adminEl("ef-org").value = e.org || "";
  adminEl("ef-period").value = e.period || "";
  adminEl("ef-desc").value = e.description || "";
  adminEl("ef-submit").textContent = "Save changes";
  adminEl("ef-cancel").hidden = false;
}

function adminResetExperienceForm() {
  adminEditing.experience = null;
  adminEl("experienceForm").reset();
  adminEl("ef-id").value = "";
  adminEl("ef-submit").textContent = "Add experience";
  adminEl("ef-cancel").hidden = true;
}

// ---- blog ----

function adminRenderPosts() {
  adminEl("blogList").innerHTML = adminListHtml(adminData.posts, ["title", "date"], "posts");
  adminBindList("blogList", "posts", adminEditPost);
}

function adminEditPost(id) {
  const post = adminData.posts.find((x) => x.id === id);
  if (!post) return;
  adminEditing.posts = id;
  adminEl("bf-id").value = post.id;
  adminEl("bf-title").value = post.title || "";
  adminEl("bf-date").value = post.date || "";
  adminEl("bf-body").value = post.body || "";
  adminEl("bf-submit").textContent = "Save changes";
  adminEl("bf-cancel").hidden = false;
  adminEl("blogForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function adminResetPostForm() {
  adminEditing.posts = null;
  adminEl("blogForm").reset();
  adminEl("bf-id").value = "";
  adminEl("bf-submit").textContent = "Add post";
  adminEl("bf-cancel").hidden = true;
}

// ---- documents ----

function adminRenderDocuments() {
  adminEl("documentsList").innerHTML = adminListHtml(adminData.documents, ["title"], "documents");
  adminBindList("documentsList", "documents", adminEditDocument);
}

function adminEditDocument(id) {
  const d = adminData.documents.find((x) => x.id === id);
  if (!d) return;
  adminEditing.documents = id;
  adminEl("df-id").value = d.id;
  adminEl("df-title").value = d.title || "";
  adminEl("df-desc").value = d.description || "";
  adminEl("df-url").value = d.url || "";
  adminEl("df-submit").textContent = "Save changes";
  adminEl("df-cancel").hidden = false;
}

function adminResetDocumentForm() {
  adminEditing.documents = null;
  adminEl("documentForm").reset();
  adminEl("df-id").value = "";
  adminEl("df-submit").textContent = "Add document";
  adminEl("df-cancel").hidden = true;
}

// ---- profile + settings ----

function adminRenderProfileForm() {
  const p = adminData.profile || {};
  adminEl("prof-name").value = p.name || "";
  adminEl("prof-role").value = p.role || "";
  adminEl("prof-tagline").value = p.tagline || "";
  adminEl("prof-about").value = p.about || "";
  adminEl("prof-github").value = p.github || "";
}

function adminDownload(filename, text) {
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---- wiring ----

document.addEventListener("DOMContentLoaded", () => {
  if (adminUnlocked()) adminShowApp();

  adminEl("pinForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const pin = adminEl("pinInput").value.trim();
    if (devfolioCheckPin(pin)) {
      try {
        sessionStorage.setItem("devfolio.admin", "1");
      } catch (_) {}
      adminEl("pinError").hidden = true;
      adminShowApp();
    } else {
      const err = adminEl("pinError");
      err.textContent = "Wrong PIN. The default PIN is 1234 — change it in Settings once you are in.";
      err.hidden = false;
    }
  });

  adminEl("logoutBtn").addEventListener("click", () => {
    try {
      sessionStorage.removeItem("devfolio.admin");
    } catch (_) {}
    window.location.reload();
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => {
        p.hidden = true;
      });
      btn.classList.add("active");
      adminEl("panel-" + btn.getAttribute("data-tab")).hidden = false;
    });
  });

  adminEl("projectForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const item = {
      title: adminEl("pf-title").value.trim(),
      type: adminEl("pf-type").value.trim() || "Project",
      description: adminEl("pf-desc").value.trim(),
      stack: adminSplitList(adminEl("pf-stack").value),
      repo: adminEl("pf-repo").value.trim(),
      live: adminEl("pf-live").value.trim(),
      gallery: adminSplitList(adminEl("pf-gallery").value)
    };
    if (!item.title) {
      adminShowStatus("A project needs a title.", true);
      return;
    }
    const id = adminEl("pf-id").value;
    adminData = id
      ? devfolioUpdate("projects", id, item)
      : devfolioAdd("projects", item);
    adminResetProjectForm();
    adminRenderAll();
    adminShowStatus(id ? "Project updated." : "Project added.");
  });
  adminEl("pf-cancel").addEventListener("click", adminResetProjectForm);

  adminEl("skillForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const item = {
      group: adminEl("sf-group").value.trim(),
      items: adminSplitList(adminEl("sf-items").value)
    };
    if (!item.group) {
      adminShowStatus("A skill group needs a name.", true);
      return;
    }
    const id = adminEl("sf-id").value;
    adminData = id ? devfolioUpdate("skills", id, item) : devfolioAdd("skills", item);
    adminResetSkillForm();
    adminRenderAll();
    adminShowStatus(id ? "Skill group updated." : "Skill group added.");
  });
  adminEl("sf-cancel").addEventListener("click", adminResetSkillForm);

  adminEl("experienceForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const item = {
      role: adminEl("ef-role").value.trim(),
      org: adminEl("ef-org").value.trim(),
      period: adminEl("ef-period").value.trim(),
      description: adminEl("ef-desc").value.trim()
    };
    if (!item.role) {
      adminShowStatus("An experience entry needs a role.", true);
      return;
    }
    const id = adminEl("ef-id").value;
    adminData = id
      ? devfolioUpdate("experience", id, item)
      : devfolioAdd("experience", item);
    adminResetExperienceForm();
    adminRenderAll();
    adminShowStatus(id ? "Experience updated." : "Experience added.");
  });
  adminEl("ef-cancel").addEventListener("click", adminResetExperienceForm);

  adminEl("blogForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const item = {
      title: adminEl("bf-title").value.trim(),
      date: adminEl("bf-date").value.trim(),
      body: adminEl("bf-body").value.trim()
    };
    if (!item.title) {
      adminShowStatus("A post needs a title.", true);
      return;
    }
    const id = adminEl("bf-id").value;
    adminData = id ? devfolioUpdate("posts", id, item) : devfolioAdd("posts", item);
    adminResetPostForm();
    adminRenderAll();
    adminShowStatus(id ? "Post updated." : "Post added.");
  });
  adminEl("bf-cancel").addEventListener("click", adminResetPostForm);

  adminEl("documentForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const item = {
      title: adminEl("df-title").value.trim(),
      description: adminEl("df-desc").value.trim(),
      url: adminEl("df-url").value.trim()
    };
    if (!item.title || !item.url) {
      adminShowStatus("A document needs a title and a link.", true);
      return;
    }
    const id = adminEl("df-id").value;
    adminData = id ? devfolioUpdate("documents", id, item) : devfolioAdd("documents", item);
    adminResetDocumentForm();
    adminRenderAll();
    adminShowStatus(id ? "Document updated." : "Document added.");
  });
  adminEl("df-cancel").addEventListener("click", adminResetDocumentForm);

  adminEl("profileForm").addEventListener("submit", (e) => {
    e.preventDefault();
    adminData.profile = {
      name: adminEl("prof-name").value.trim(),
      role: adminEl("prof-role").value.trim(),
      tagline: adminEl("prof-tagline").value.trim(),
      about: adminEl("prof-about").value.trim(),
      github: adminEl("prof-github").value.trim()
    };
    devfolioSave(adminData);
    adminShowStatus("Profile saved. It shows on the public portfolio right away.");
  });

  adminEl("pinFormChange").addEventListener("submit", (e) => {
    e.preventDefault();
    const current = adminEl("pin-current").value.trim();
    const next = adminEl("pin-new").value.trim();
    const confirm = adminEl("pin-confirm").value.trim();
    if (!devfolioCheckPin(current)) {
      adminShowStatus("Current PIN is wrong.", true);
      return;
    }
    if (next.length < 4) {
      adminShowStatus("New PIN must be at least 4 characters.", true);
      return;
    }
    if (next !== confirm) {
      adminShowStatus("New PIN and confirmation do not match.", true);
      return;
    }
    devfolioSetPin(next);
    adminEl("pinFormChange").reset();
    adminShowStatus("PIN changed.");
  });

  adminEl("exportBtn").addEventListener("click", () => {
    const json = devfolioExport();
    adminEl("exportOutput").value = json;
    adminDownload("devfolio-backup.json", json);
    adminShowStatus("Backup downloaded and shown below — keep it safe.");
  });

  adminEl("importBtn").addEventListener("click", () => {
    const text = adminEl("importText").value.trim();
    if (!text) {
      adminShowStatus("Paste JSON or choose a backup file first.", true);
      return;
    }
    const result = devfolioImport(text);
    if (!result.ok) {
      adminShowStatus(result.error, true);
      return;
    }
    adminData = devfolioLoad();
    adminRenderAll();
    adminEl("importText").value = "";
    adminShowStatus("Content imported.");
  });

  adminEl("importFile").addEventListener("change", (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      adminEl("importText").value = String(reader.result || "");
    };
    reader.readAsText(file);
  });

  adminEl("resetBtn").addEventListener("click", () => {
    if (!window.confirm("Reset everything back to the seed content? Your edits will be lost. Export a backup first if you want to keep them.")) return;
    adminData = devfolioReset();
    adminRenderAll();
    adminShowStatus("Reset to seed content.");
  });
});
