// DevFolio CMS — seed data (v1.0.0)
// Real work by Md. Rohan Islam (rohan-rusho). No placeholder content:
// every project here is a real repository. Edit or replace it all from
// the Admin dashboard — it is stored in localStorage, not in this file.

const DEV_FOLIO_SEED = {
  profile: {
    name: "Md. Rohan Islam",
    role: "Mobile App Developer",
    tagline: "Java · Kotlin · Flutter — Android apps, web tools and open-source software.",
    about:
      "I build software I actually use: a LAN media server for my movie collection, " +
      "a roast joke generator, an API testing client, and a CV builder with 55 templates. " +
      "Most of it is open source on GitHub. I care about how software feels on a real " +
      "machine — live, smooth and honest about what it can and cannot do.",
    github: "https://github.com/rohan-rusho"
  },

  projects: [
    {
      id: "p-speed",
      title: "Speed",
      type: "Web App",
      featured: true,
      tags: ["media", "lan", "streaming", "dual-audio"],
      description:
        "Premium LAN file & media server. Fast range streaming, dual-audio movies with language switching, thumbnails, subtitles, resume playback, fast zip downloads, file manager with trash, drag-drop upload and a glassmorphism UI with light/dark themes.",
      stack: ["Node.js", "Express", "JavaScript", "FFmpeg", "Plyr"],
      repo: "https://github.com/rohan-rusho/speed",
      live: "",
      gallery: []
    },
    {
      id: "p-cvora",
      title: "CVora — Professional Resume Studio",
      type: "Web App",
      featured: true,
      tags: ["cv", "resume", "templates", "export"],
      description:
        "Premium CV and resume builder with 55 genuinely different templates, a 9-step editor, live preview, full design customization, multi-format export (PDF, PNG, JPG, TXT, HTML, JSON), ATS checker, cover letter builder, version history and a job applications tracker.",
      stack: ["HTML", "CSS", "JavaScript"],
      repo: "https://github.com/rohan-rusho/cvora-resume-studio",
      live: "",
      gallery: []
    },
    {
      id: "p-requestlab",
      title: "RequestLab",
      type: "Web App",
      featured: true,
      tags: ["api", "rest", "websocket", "debugging"],
      description:
        "API testing and debugging client in the browser: REST request builder with auth and environments, {{variable}} substitution, collections, history, response inspector and a WebSocket tester. A Postman-style workflow with no install.",
      stack: ["HTML", "CSS", "JavaScript", "WebSocket"],
      repo: "https://github.com/rohan-rusho/requestlab-api-workbench",
      live: "",
      gallery: []
    },
    {
      id: "p-toaster",
      title: "Toaster Roaster",
      type: "Web App",
      featured: false,
      tags: ["fun", "generator", "jokes"],
      description:
        "Roast joke generator with 102 roasts and 12 self-roasts across 7 categories and 4 heat levels. Name/target generator, daily roast, 3-round roast battle, favorites and history, burn meter and a toaster shake-and-pop animation.",
      stack: ["HTML", "CSS", "JavaScript"],
      repo: "https://github.com/rohan-rusho/toaster_roaster",
      live: "",
      gallery: []
    },
    {
      id: "p-mdm",
      title: "Mister Download Manager — live-update fix",
      type: "Open Source",
      featured: false,
      tags: ["rust", "open-source", "contribution"],
      description:
        "Open-source contribution to Mister Download Manager (Rust + egui). Fixed the main list so downloaded bytes and progress update on a steady 250 ms clock instead of only racing when the mouse moves — the version the maintainer reviewed and approved.",
      stack: ["Rust", "egui", "Open Source"],
      repo: "https://github.com/rohan-rusho/misterdownloadmanager",
      live: "",
      gallery: []
    },
    {
      id: "p-password",
      title: "Password Generator",
      type: "Tool",
      featured: false,
      tags: ["security", "tool"],
      description:
        "Small web tool that generates strong passwords with length and character controls, strength meter and one-click copy. One of 20 small web apps shipped as public repos.",
      stack: ["HTML", "CSS", "JavaScript"],
      repo: "https://github.com/rohan-rusho/Password-Generator",
      live: "",
      gallery: []
    },
    {
      id: "p-snake",
      title: "Snake Game",
      type: "Tool",
      featured: false,
      tags: ["game"],
      description:
        "Classic Snake in the browser with keyboard controls, score tracking and increasing speed. One of 20 small web apps shipped as public repos.",
      stack: ["HTML", "CSS", "JavaScript"],
      repo: "https://github.com/rohan-rusho/snake-game",
      live: "",
      gallery: []
    },
    {
      id: "p-pomodoro",
      title: "Pomodoro Focus Timer",
      type: "Tool",
      featured: false,
      tags: ["productivity", "timer"],
      description:
        "Focus timer with work/break cycles, session counts and a clean, distraction-free layout. One of 20 small web apps shipped as public repos.",
      stack: ["HTML", "CSS", "JavaScript"],
      repo: "https://github.com/rohan-rusho/pomodoro-focus-timer",
      live: "",
      gallery: []
    }
  ],

  skills: [
    { id: "s-lang", group: "Languages", items: ["Java", "Kotlin", "Dart", "JavaScript", "Rust", "SQL"] },
    { id: "s-mobile", group: "Mobile", items: ["Android (XML layouts)", "SQLite", "Flutter", "Android Studio"] },
    { id: "s-web", group: "Web", items: ["HTML", "CSS", "Node.js", "Express", "GitHub Pages"] },
    { id: "s-tools", group: "Tools & practices", items: ["Git", "GitHub", "FFmpeg", "REST APIs", "WebSockets"] }
  ],

  experience: [
    {
      id: "e-dev",
      role: "Mobile App Developer",
      org: "Independent",
      period: "Present",
      description:
        "Building Android apps in Java, Kotlin and Flutter, plus web tools and open-source software — shipped to public GitHub repositories with documentation, tests and live demos."
    },
    {
      id: "e-speed",
      role: "Speed — LAN media server",
      org: "Personal project, v2.0 – v2.3",
      period: "2026",
      description:
        "Built and shipped a premium LAN file & media server: range streaming, dual-audio language switching, thumbnails, subtitles, file manager, glassmorphism UI. Fixed a real routing bug that blacked out the player on language switch."
    },
    {
      id: "e-mdm",
      role: "Open-source contributor",
      org: "Mister Download Manager",
      period: "2026",
      description:
        "Contributed a live-update fix (PR #1441) so download progress in the main list follows a steady 250 ms clock. Reviewed with the maintainer and iterated to the version he approved."
    },
    {
      id: "e-program",
      role: "Portfolio program — 20 + 20 projects",
      org: "Public GitHub repositories",
      period: "2026",
      description:
        "Shipped 20 small web apps, then moved to intermediate-to-advanced portfolio projects: RequestLab, CVora, DevFolio CMS and more — each a real, working product, not a tutorial."
    }
  ],

  posts: [
    {
      id: "b-mdm",
      title: "Fixing download progress that only moved when you moved the mouse",
      date: "2026-11-19",
      body:
        "Mister Download Manager showed download progress updating once or twice a second when idle, but ten to fifteen times a second while the cursor moved over the card. It looked broken, and on my machine it felt broken.\n\nThe cause was two deliberate throttles in an event-driven UI: egui only redraws on events, and the shown speed was cached on a half-second clock. Moving the mouse forced a frame per movement, so the numbers raced — then fell back. The fix the maintainer accepted was not to redraw faster, but to make the shown bytes and percentage follow the same steady 250 ms clock as the redraw, whatever the mouse does. Same motion with or without the pointer. That is the whole lesson: when two numbers update on different clocks, users read the difference as a bug."
    },
    {
      id: "b-speed-audio",
      title: "Speed 2.3: why picking another audio language blacked out the player",
      date: "2026-11-19",
      body:
        "In Speed 2.3, switching the audio language of a dual-audio movie blacked out the player. The bug was not in the player at all — it was server routing. Every /api/stream-custom request was being swallowed by the plain /stream route and answered 404.\n\nThe fix was middleware ordering: match the custom-stream route first, with a lookahead so the plain route cannot claim it. After the fix I verified with a test file carrying two audio tracks (440 Hz English, 880 Hz Hindi) that switching works instantly in Chrome, Edge and Safari, keeping the play position, subtitles and resume state. The player bug was a routing bug wearing a player costume — worth remembering the next time a UI symptom refuses to reproduce in the UI code."
    },
    {
      id: "b-twenty",
      title: "Why I shipped 20 small apps instead of one big one",
      date: "2026-11-22",
      body:
        "Twenty small web apps — a password generator, a pomodoro timer, a snake game, a tip calculator — look like a tutorial collection until you read the rule behind them: each one is a finished, public, working product with a README and a live demo.\n\nSmall apps teach the part of shipping that tutorials skip: naming, documenting, deploying, and leaving something behind that a stranger can run. The advanced program that followed — RequestLab, CVora, DevFolio — is the same habit at a bigger scale. Polish a few things properly instead of starting twenty things and finishing none of them."
    }
  ],

  documents: [
    {
      id: "d-github",
      title: "GitHub profile",
      description: "All public repositories, contributions and achievements.",
      url: "https://github.com/rohan-rusho"
    },
    {
      id: "d-cvora",
      title: "Build a CV with CVora",
      description: "My premium CV builder — 55 templates, live preview, PDF/PNG/TXT export.",
      url: "https://github.com/rohan-rusho/cvora-resume-studio"
    },
    {
      id: "d-speed",
      title: "Speed — LAN media server",
      description: "Source code for my premium LAN file & media server.",
      url: "https://github.com/rohan-rusho/speed"
    }
  ]
};
