/* ── Portfolio Data ─────────────────────────────────────────────────────── */
/* All content lives here for easy editing. */

export type Discipline = "3d" | "web" | "app" | "windows" | "arvr";

export const siteConfig = {
  name: "Subash Krishnan K",
  email: "subashkaran912@gmail.com",
  phone: "+91 9345471612",
  location: "Salem, Tamil Nadu, India",
  links: {
    linkedin: "https://linkedin.com/in/subashkrishnank",
    github: "https://github.com/subashkrishnank",
    portfolio: "https://subashkrishnan.dev",
  },
};

/* ── Rotating role titles (Hero crossfade) ─────────────────────────────── */
export const roles = [
  "3D Modeler",
  "Website Developer",
  "App Developer",
  "Windows App Developer",
  "AR/VR Developer",
];

/* ── Updated: Open to Work status ───────────────────────────────────────── */
export const currentStatus = {
  badge: "🟢 Open to Work — 3D, Web, App, Windows & AR/VR Developer",
};

export const recentWork = {
  role: "VR Developer Intern",
  company: "Sashainfinity",
  period: "Feb 2026 – Apr 2026",
  label: "Recent Work",
  description:
    "Built a VR-based interactive math-learning app in Unity during my internship at Sashainfinity. Created immersive real-time scenes, optimized 3D assets, developed Unreal Engine environments with lighting, materials, and level design, and prototyped interactive C# scripts for educational gameplay mechanics.",
  tech: ["Unity", "C#", "Unreal Engine", "Blender", "VR"],
};

/* ── What I Do — 5 disciplines ─────────────────────────────────────────── */
export interface DisciplineInfo {
  id: Discipline;
  label: string;
  icon: string; // lucide-react icon name
  description: string;
  sectionHref: string;
}

export const disciplines: DisciplineInfo[] = [
  {
    id: "3d",
    label: "3D Modeler",
    icon: "Box",
    description: "Creating game-ready 3D assets in Blender — from concept to PBR-textured, optimized models.",
    sectionHref: "#showcase",
  },
  {
    id: "web",
    label: "Website Developer",
    icon: "Globe",
    description: "Building full-stack web apps and e-commerce platforms with Next.js, React, and TypeScript.",
    sectionHref: "#projects",
  },
  {
    id: "app",
    label: "App Developer",
    icon: "Smartphone",
    description: "Shipping AI-powered Flutter and native Android apps with Firebase backends.",
    sectionHref: "#projects",
  },
  {
    id: "windows",
    label: "Windows App Developer",
    icon: "AppWindow",
    description: "Building Electron desktop apps with rich UIs — PDF editors, file sharing, and AI tools.",
    sectionHref: "#projects",
  },
  {
    id: "arvr",
    label: "AR/VR Developer",
    icon: "Glasses",
    description: "Developing immersive VR lessons and experiences for Meta Quest using Unity and OpenXR.",
    sectionHref: "#showcase",
  },
];

export const about = {
  summary:
    "Recent AI & Machine Engineering graduate from Sona College of Technology (2022–2026, CGPA 7.75) and versatile developer working across five disciplines: 3D modeling (Blender), web development (Next.js/React), mobile apps (Flutter/Android), Windows desktop apps (Electron), and AR/VR (Unity/Unreal). Actively seeking full-time opportunities where I can apply my multi-discipline skill set.",
  education: {
    degree: "B.E. — Artificial Intelligence & Machine Learning",
    college: "Sona College of Technology, Salem",
    period: "2022 – 2026",
    gpa: "7.75",
    status: "Graduated",
  },
  focusAreas: [
    "3D Modeling (Blender)",
    "Web Development",
    "Mobile App Development",
    "Windows Desktop Apps",
    "AR/VR Development",
    "AI & LLM Integration",
  ],
};

export interface Skill {
  name: string;
  category: string;
}

export const skillCategories = [
  {
    name: "Mobile (App Dev)",
    color: "accent-cyan",
    skills: [
      "Flutter",
      "Android SDK",
      "Firebase",
      "Dart",
      "Java",
      "Kotlin",
      "REST APIs",
      "SQLite",
      "MySQL",
    ],
  },
  {
    name: "Web",
    color: "accent-violet",
    skills: ["React", "Next.js", "TypeScript", "HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Prisma"],
  },
  {
    name: "Windows Desktop",
    color: "accent-violet",
    /* Kept to what a listed project actually demonstrates — PDF.js and
       Tesseract.js came from a project no longer shown. */
    skills: ["Electron", "TypeScript", "React", "SQLite", "PowerShell"],
  },
  {
    name: "3D & VR",
    color: "accent-green",
    skills: [
      "Blender",
      "UV Mapping",
      "PBR Texturing",
      "Unity",
      "Unreal Engine",
      "OpenXR",
      "Poly Optimization",
    ],
  },
  {
    name: "AI/ML",
    color: "accent-cyan",
    skills: [
      "Gemini LLM",
      "GPT-3",
      "Speech-to-Text",
      "NLP",
      "TensorFlow",
      "Scikit-learn",
      "Computer Vision",
      "Python",
      "FastAPI",
    ],
  },
  {
    name: "Design & Tools",
    color: "accent-green",
    skills: [
      "Photoshop",
      "Illustrator",
      "After Effects",
      "UI/UX",
      "Git",
      "GitHub",
      "Android Studio",
      "VS Code",
      "C#",
      "RPA",
      "Docker",
    ],
  },
];

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tech: string[];
  current?: boolean;
}

export const experiences: Experience[] = [
  {
    role: "VR Developer Intern",
    company: "Sashainfinity",
    period: "Feb 2026 – Apr 2026",
    description:
      "Developed 20 immersive VR math lessons for Meta Quest 3S at Sashainfinity. Built a complete Geometry Library covering lines, angles, triangles, circles, quadrilaterals, coordinate geometry, surface area/volume, number systems, and statistics. Each lesson follows a 5-screen state machine (Welcome → Concept → Game → Quiz → Score) with hand tracking, progressive hints, and randomized replay. Also shipped a WebGL playable build and the Math-Game project with NPC dialogue and character animation.",
    tech: ["Unity", "C#", "Meta Quest 3S", "OpenXR", "URP", "Blender"],
    current: false,
  },
  {
    role: "Freelance Android Developer",
    company: "Self-Employed",
    period: "2023 – 2026",
    description:
      "Developed 4+ AI-powered Android applications with Firebase backends. Built a voice-to-invoice billing app using Speech-to-Text, a location-based blood donation app, an AI eye-care app with image processing/ML, and a patient management system.",
    tech: ["Android", "Firebase", "Java", "Speech-to-Text", "ML", "SQLite"],
    current: false,
  },
  {
    role: "Freelance 3D Artist",
    company: "Self-Employed",
    period: "2023 – Present",
    description:
      "Modeled multiple game-ready assets from scratch — Leviathan Axe, Human Explorer character, Pirate Ship (Black Pearl), Japanese-style house interior, MacBook, and environment scenes. Delivered production-quality models with UV mapping, PBR texturing, low/high-poly variants, exported to GLB for web/Unity/Unreal integration.",
    tech: ["Blender", "UV Mapping", "PBR Texturing", "Low-Poly", "High-Poly", "Unity", "Unreal"],
    current: false,
  },
];

/* ── Projects ────────────────────────────────────────────────────────────── */

export type ProjectTier = "featured" | "secondary";

export interface ProjectBadge {
  label: string;
  variant: "cyan" | "violet" | "green" | "default";
}

export interface Project {
  title: string;
  /** Set this to link the card to a long-form write-up at /projects/<slug>. */
  slug?: string;
  tagline: string;
  problem: string;
  solution: string;
  tech: string[];
  discipline: Discipline;
  github?: string;
  live?: string;
  image?: string;
  tier: ProjectTier;
  confidential?: boolean;
  badge?: ProjectBadge;
}

export const projects: Project[] = [
  /* ══════════════════════════════════════════════════════════════════════
     FEATURED / PRIMARY PROJECTS — larger cards, full descriptions
     ══════════════════════════════════════════════════════════════════════ */

  {
    title: "WedFind AI",
    slug: "wedfind-ai",
    tagline: "Face-recognition photo delivery for wedding studios",
    problem:
      "Wedding studios shoot thousands of photos per event, then spend days manually sorting and delivering them family by family. The usual shortcut — one bulk gallery link — hands every guest photos of every other guest, which under India's DPDP Act is a legal problem, not just a rude one.",
    solution:
      "SaaS platform where a studio uploads once and each guest retrieves only their own photos by taking a selfie. InsightFace produces 512-dim embeddings stored in Postgres pgvector with an HNSW index; matching is an event-scoped cosine KNN query. Celery moves embedding and thumbnailing off the request path. Consent is recorded before any biometric processing and selfies are never persisted. Runs on AWS via Terraform with the frontend on Vercel.",
    tech: ["FastAPI", "Next.js 16", "PostgreSQL", "pgvector", "InsightFace", "Celery", "Redis", "AWS", "Terraform", "Firebase"],
    discipline: "web",
    tier: "featured",
    live: "https://wedfind.elevencraftstudio.com",
  },
  {
    title: "GMeeting — AI Meeting Assistant",
    slug: "meeting-assistant",
    tagline: "Video calls that caption themselves and write their own minutes",
    problem:
      "Someone in every meeting types instead of thinking, and still loses the things that matter — who committed to what, what was decided, what the deadline was. Bolt-on transcription bots make it worse by opening a second microphone stream that fights the call for audio.",
    solution:
      "Flutter app that registers a read-only audio frame observer on the Agora RTC engine and forwards the call's own 16 kHz mono PCM frames to a Deepgram nova-3 WebSocket — one audio owner, no contention. Interim results drive live subtitles while only final results commit to a speaker-attributed transcript, with fragmented diarization repaired by merging same-speaker lines inside a three-second window. Llama 3.3 70B via NVIDIA NIM runs two prompt paths: a rolling live summary every 60 seconds, guarded so silence costs nothing, and full structured minutes with owned action items after the call.",
    tech: ["Flutter", "Riverpod", "Agora RTC", "Deepgram", "NVIDIA NIM", "Llama 3.3 70B", "Firebase", "Firestore"],
    github: "https://github.com/Blackcommando5/meeting-assistant",
    discipline: "app",
    tier: "featured",
    badge: { label: "🎓 Final Year Project", variant: "violet" },
  },
  {
    title: "TeamShare — Offline LAN File Sharing",
    slug: "teamshare",
    tagline: "Zero-cloud file sharing for teams on the same network",
    problem:
      "Offices with metered internet, classrooms, event venues, and air-gapped studios all have files sitting on machines metres apart, and the normal answer routes them through a data centre on another continent. The hard part is authorization: with no internet, the PC serving a file cannot ask a server whether the request is allowed.",
    solution:
      "Electron app where one PC hosts a dashboard, API, and SQLite database while every PC runs a headless agent serving only its shared folders. Access links are HS256 JWTs signed with the target device's own permanent token — a key the browser never sees and the agent already holds — so a 15-minute link is verified entirely offline. The file layer is jailed independently against both lexical traversal and symlinks escaping the share, and the installer automates the firewall rule and autostart so non-technical staff can install it themselves.",
    tech: ["Electron", "TanStack Start", "React 19", "TypeScript", "better-sqlite3", "Node 22", "HMAC-SHA256", "Inno Setup"],
    discipline: "windows",
    tier: "featured",
  },
  {
    title: "AE Prompt Bridge — After Effects AI Plugin",
    slug: "ae-prompt-bridge",
    tagline: "Describe a motion graphic in prose, watch After Effects build it",
    problem:
      "Automating After Effects means writing ExtendScript — ES3, no setTimeout, no file watching, no real debugger — in an app where every attempt costs a save, an app switch, a menu dive, and a modal dialog. The official route to a real tool is a CEP extension with a manifest and a build step, so the automation mostly never gets written.",
    solution:
      "Inverted the trigger: instead of pushing scripts in, a watcher runs inside After Effects and polls one script file every 1.5s, executing it the moment its timestamp changes. Anything that can write text becomes a valid driver, so an AI assistant is a first-class one with zero integration. Built from app.scheduleTask — the single recurring timer the host exposes, whose callback is a string evaluated in global scope, which is why watcher state lives on the app object. Comps are replaced by name so continuous re-runs stay idempotent, and the whole 671-line build collapses into one undo step.",
    tech: ["ExtendScript", "After Effects API", "PowerShell", "Claude", "VS Code"],
    discipline: "windows",
    tier: "featured",
  },
  {
    title: "Figma to After Effects — Figma Plugin",
    slug: "figma-to-after-effects",
    tagline: "Rebuild a Figma design as native After Effects layers, pen paths included",
    problem:
      "Design lives in Figma and motion lives in After Effects, with nothing between them. A flat export kills the individually animatable layers you needed; rebuilding by hand is hours of work thrown away on the next design revision. Pen-tool vectors are the worst case — Figma describes them as SVG path strings, which After Effects cannot consume.",
    solution:
      "Zero-dependency Figma plugin that walks the selected node tree and emits an ExtendScript file rebuilding the design as native shape and text layers. The real work is vector geometry: a state-machine SVG path parser covering all 18 command forms with control-point reflection and implicit linetos, quadratics promoted to cubic because After Effects only expresses cubic tangents, and an affine transform applied with the full matrix to vertices but only its linear part to tangents — since translating a direction vector would skew every curve. Convention mismatches are translated explicitly: rotation negated, cartesian shadow offsets converted to polar. No build step, no network access, MIT.",
    tech: ["JavaScript", "Figma Plugin API", "ExtendScript", "SVG path parsing", "Bézier geometry"],
    github: "https://github.com/ElevenCraftStudio-Saas/figma-to-after-effect",
    discipline: "web",
    tier: "featured",
  },
  {
    title: "Nur — Plant Nursery App",
    slug: "nur",
    tagline: "Flutter catalogue app with a Firebase-backed admin content pipeline",
    problem:
      "A plant nursery's inventory lived in photos and messages, so there was no browsable catalogue and no way for the owner to add stock without a developer.",
    solution:
      "Flutter app with Firebase Auth for accounts and an admin screen that is a real content pipeline: pick an image from the device, upload it to Cloud Storage, and write the plant record to Firestore, so the owner adds stock without touching code. Browsable catalogue with detail pages and a cart UI. Built while learning the stack — authorization is a client-side email check rather than enforced in rules, and the catalogue is split between bundled seed data and Firestore, both of which I would restructure now.",
    tech: ["Flutter", "Dart", "Firebase Auth", "Cloud Firestore", "Cloud Storage", "Image Picker"],
    discipline: "app",
    tier: "featured",
  },
  {
    title: "Whats for Dinner — AI Meal Planner",
    tagline: "AI-powered meal suggestions with grocery management",
    problem:
      "People struggle daily with deciding what to cook and end up over-buying groceries or wasting food.",
    solution:
      "Flutter app with AI meal suggestions, grocery list management, pantry tracking, weekly meal planner, nearby shop finder (Google Maps), AI image labeling for food items, text-to-speech, and Firebase backend.",
    tech: ["Flutter", "Firebase", "Google Maps", "ML Kit", "Text-to-Speech", "Geolocator"],
    discipline: "app",
    tier: "featured",
    badge: { label: "🏆 Hackathon Project — Quadrabay", variant: "green" },
    // 🔄 MISSING: App screenshot showing meal suggestion / grocery list
  },
  {
    title: "Math-Game — Interactive VR Math Game",
    tagline: "NPC-driven math adventure game built in Unity for Quest and WebGL",
    problem:
      "Traditional math games lack immersion and narrative engagement. Students disengage from repetitive drill exercises.",
    solution:
      "Personal post-internship project: a Unity VR math adventure game with NPC dialogue, character animation, a fantasy/medieval game world, grab-based interaction mechanics, task/mission progression, and market gameplay. Built for Meta Quest 3S with a WebGL playable build for browser access.",
    tech: ["Unity", "C#", "Meta Quest 3S", "Cinemachine", "ProBuilder", "WebGL", "Visual Effects"],
    discipline: "arvr",
    tier: "featured",
    // 🔄 MISSING: Quest gameplay recording or WebGL build screenshot
  },
  {
    title: "Number System 2 — VR Number Classification",
    tagline: "Immersive VR lesson for teaching number systems and arithmetic",
    problem:
      "Abstract number system concepts (natural numbers, integers, rational/irrational) are hard for students to grasp from flat diagrams.",
    solution:
      "Personal post-internship project: a Unity VR lesson that teaches number classification and arithmetic through interactive 3D objects, narration, sorting challenges, and a portal-based progression system. Features answer tokens, combine stations, and a hall of knowledge.",
    tech: ["Unity", "C#", "Meta Quest 3S", "XR Interaction Toolkit", "URP"],
    discipline: "arvr",
    tier: "featured",
    // 🔄 MISSING: Quest gameplay screenshot showing the sorting/combine UI
  },

  /* ══════════════════════════════════════════════════════════════════════
     SECONDARY PROJECTS — compact cards, brief descriptions
     ══════════════════════════════════════════════════════════════════════ */

  {
    title: "Eventora — Event Registration SaaS",
    tagline: "SaaS platform for event registration and management",
    problem: "Event organizers needed streamlined registration and attendee management.",
    solution: "Next.js 16 + Prisma + PostgreSQL SaaS with event creation, registration workflows, and attendee management.",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL"],
    discipline: "web",
    tier: "secondary",
    // 🔄 MISSING: Eventora landing page screenshot
  },

  /* ── Sashainfinity (confidential — single card, needs permission) ── */
  {
    title: "VR Geometry Library — Sashainfinity",
    tagline: "20 immersive VR math lessons for Meta Quest 3S",
    problem:
      "Students struggle with abstract geometry concepts from flat textbook diagrams. Traditional teaching lacks spatial understanding.",
    solution:
      "Developed a suite of 20 immersive VR math lessons at Sashainfinity, each following a 5-screen pattern: Welcome → Concept → Interactive Game (5 missions) → Quiz → Score. Covers lines & angles, triangles, circles, quadrilaterals, coordinate geometry, surface area & volume, number systems, and statistics.",
    tech: ["Unity", "C#", "Meta Quest 3S", "OpenXR", "XR Interaction Toolkit", "URP", "WebGL"],
    discipline: "arvr",
    tier: "secondary",
    confidential: true,
    // ⚠️ CONFIDENTIAL — Need Sashainfinity's written permission + approved screenshot
  },
];

/* ── 3D / VR Showcase ──────────────────────────────────────────────────── */

export interface Asset3D {
  name: string;
  description: string;
  tech: string[];
  discipline: Discipline;
  modelPath?: string;
  thumbnail: string;
  featured: boolean;
  category: "blender" | "unreal";
  gallery?: GalleryImage[];
}

export interface GalleryImage {
  src: string;
  label?: string;
  wireframe?: boolean;
}

export const assets3d: Asset3D[] = [
  {
    name: "Leviathan Axe",
    description:
      "Game-ready battle axe modeled from scratch with intricate detail, PBR materials, and optimized for real-time rendering. Includes high-resolution renders and a web-ready GLB export.",
    tech: ["Blender", "UV Mapping", "PBR Texturing", "Low-Poly"],
    discipline: "3d",
    modelPath: "/models/axe.glb",
    thumbnail: "/3d/axe/axe-1.webp",
    featured: true,
    category: "blender",
    gallery: [
      { src: "/3d/axe/axe-1.webp", label: "Render 1" },
      { src: "/3d/axe/axe-2.webp", label: "Render 2" },
      { src: "/3d/axe/axe-3.webp", label: "Render 3" },
      { src: "/3d/axe/axe-4.webp", label: "Render 4" },
    ],
  },
  {
    name: "Black Pearl (Pirate Ship)",
    description:
      "Detailed pirate ship model inspired by the Black Pearl, with full rigging, deck details, and ocean-ready optimization. Includes 1K–8K resolution renders.",
    tech: ["Blender", "UV Mapping", "PBR Texturing", "High-Poly"],
    discipline: "3d",
    thumbnail: "/3d/black-pearl-render.webp",
    featured: true,
    category: "blender",
  },
  {
    name: "House",
    description:
      "Full Japanese-themed interior scene with hallway, bedroom, bathroom, and desktop areas. Multiple camera angles rendered. Includes exportable furniture GLB assets.",
    tech: ["Blender", "Interior Design", "PBR Materials", "Lighting"],
    discipline: "3d",
    thumbnail: "/3d/house/house-full-render.webp",
    featured: false,
    category: "blender",
    gallery: [
      { src: "/3d/house/hall-render.webp", label: "Hall" },
      { src: "/3d/house/bedroom-render.webp", label: "Bedroom" },
      { src: "/3d/house/bathroom.webp", label: "Bathroom" },
      { src: "/3d/house/bathroom-2.webp", label: "Bathroom Alt" },
      { src: "/3d/house/bathroom-3.webp", label: "Bathroom Alt 2" },
      { src: "/3d/house/bedroom-2.webp", label: "Bedroom Alt" },
      { src: "/3d/house/desktop.webp", label: "Desktop" },
      { src: "/3d/house/hall-2.webp", label: "Hall Alt" },
      { src: "/3d/house/outline.webp", label: "Wireframe", wireframe: true },
      { src: "/3d/house/outline-2.webp", label: "Wireframe Alt", wireframe: true },
    ],
  },
  {
    name: "Human Explorer Character",
    description:
      "Full character model with clothing, accessories, and game-ready topology. Designed for animation and real-time rendering.",
    tech: ["Blender", "Character Modeling", "Topology"],
    discipline: "3d",
    thumbnail: "/3d/character/character-render.webp",
    featured: false,
    category: "blender",
    gallery: [
      { src: "/3d/character/character-render.webp", label: "Front View" },
    ],
  },
  {
    name: "MacBook",
    description:
      "Realistic MacBook 3D model with screen, keyboard, and chassis details. Rendered through a progressive workflow from blockout to final composition.",
    tech: ["Blender", "Product Modeling", "PBR Texturing"],
    discipline: "3d",
    thumbnail: "/3d/mac/macbook-render.webp",
    featured: false,
    category: "blender",
    gallery: [
      { src: "/3d/mac/mac-stage-1.webp", label: "Blockout" },
      { src: "/3d/mac/mac-stage-2.webp", label: "Materials" },
      { src: "/3d/mac/mac-stage-3.webp", label: "Lighting" },
      { src: "/3d/mac/mac-stage-4.webp", label: "Final" },
    ],
  },
  {
    name: "Sword",
    description: "Fantasy sword weapon model with blade, hilt, and guard details.",
    tech: ["Blender", "Weapon Modeling", "PBR Texturing"],
    discipline: "3d",
    thumbnail: "/3d/sword/sword.webp",
    featured: false,
    category: "blender",
    gallery: [
      { src: "/3d/sword/sword.webp", label: "Render 1" },
      { src: "/3d/sword/sword-alt.webp", label: "Render 2" },
    ],
  },
  {
    name: "Environment / Landscape",
    description: "Outdoor environment scene with terrain, ground, and vegetation.",
    tech: ["Blender", "Environment Art", "Terrain"],
    discipline: "3d",
    thumbnail: "/3d/environment/environment-1.webp",
    featured: false,
    category: "blender",
    gallery: [
      { src: "/3d/environment/environment-1.webp", label: "View 1" },
      { src: "/3d/environment/environment-2.webp", label: "View 2" },
      { src: "/3d/environment/environment-3.webp", label: "View 3" },
    ],
  },
];

/* ── Design Work ─────────────────────────────────────────────────────────── */

export interface DesignProject {
  name: string;
  client: string;
  description: string;
  tools: string[];
  thumbnail?: string;
  video?: string;
  category: "branding" | "illustration" | "other";
  permissionNeeded?: boolean;
}

export const designProjects: DesignProject[] = [
  {
    name: "AGRODHA Brand Identity",
    client: "Freelance Client — Brand",
    description: "Brand identity / logo design project for AGRODHA.",
    tools: ["Adobe Illustrator"],
    category: "branding",
    permissionNeeded: true,
  },
  {
    name: "OORVI Brand Identity",
    client: "Freelance Client — Brand",
    description: "Brand identity / logo design project for OORVI.",
    tools: ["Adobe Illustrator"],
    category: "branding",
    permissionNeeded: true,
  },
  {
    name: "Sketch Explorations",
    client: "Personal Work",
    description: "Series of iterative sketch and design explorations through 12+ iterations.",
    tools: ["Adobe Illustrator"],
    category: "illustration",
  },
  {
    name: "CGI Collaboration — Project 1",
    client: "Collaboration with Areesha",
    description: "CGI 3D render collaboration project. Output includes UHD 4K 24fps video renders.",
    tools: ["Blender", "After Effects"],
    category: "other",
    video: "/videos/cgi-collab-1.mp4",
  },
  {
    name: "CGI Collaboration — Project 2",
    client: "Collaboration with Areesha",
    description: "Second CGI collaboration with Blender scene and After Effects post-production. UHD 4K 30fps output.",
    tools: ["Blender", "After Effects"],
    category: "other",
    video: "/videos/cgi-collab-2.mp4",
  },
];

/* ── Certifications ──────────────────────────────────────────────────────── */

export interface Certification {
  name: string;
  issuer: string;
  category: string;
  file?: string;
}

export const certifications: Certification[] = [
  { name: "AI-First Software Engineering", issuer: "Add issuer", category: "AI & ML", file: "/certificates/ai-first-software-engineering.pdf" },
  { name: "Artificial Intelligence Foundation", issuer: "Add issuer", category: "AI & ML", file: "/certificates/artificial-intelligence-foundation.pdf" },
  { name: "Artificial Intelligence Primer", issuer: "Add issuer", category: "AI & ML", file: "/certificates/artificial-intelligence-primer.pdf" },
  { name: "Basics of Python", issuer: "Add issuer", category: "Programming", file: "/certificates/basics-of-python.pdf" },
  { name: "Blender for Beginners", issuer: "Add issuer", category: "3D & Vision", file: "/certificates/blender-for-beginners.pdf" },
  { name: "CodeVolt's 25", issuer: "Add issuer", category: "Events", file: "/certificates/codevolts-25-event.pdf" },
  { name: "Computer Vision 101", issuer: "Add issuer", category: "AI & ML", file: "/certificates/computer-vision-101.pdf" },
  { name: "Explore Machine Learning with Python", issuer: "Add issuer", category: "AI & ML", file: "/certificates/explore-machine-learning-with-python.pdf" },
  { name: "Internship Experience Certificate", issuer: "Sashainfinity", category: "Other", file: "/certificates/internship-experience-certificate.pdf" },
  { name: "VR Developer Intern Certificate", issuer: "Sashainfinity", category: "3D & Vision", file: "/certificates/vr-developer-intern-certificate.pdf" },
  { name: "Introduction to Data Science", issuer: "Add issuer", category: "AI & ML", file: "/certificates/introduction-to-data-science.pdf" },
  { name: "Introduction to Deep Learning", issuer: "Add issuer", category: "AI & ML", file: "/certificates/introduction-to-deep-learning.pdf" },
  { name: "Introduction to Robotic Process Automation", issuer: "Add issuer", category: "Other", file: "/certificates/introduction-to-rpa.pdf" },
  { name: "Java Certified Foundations Associate", issuer: "Add issuer", category: "Programming", file: "/certificates/java-certified-foundations.pdf" },
  { name: "Java Foundation Certificate", issuer: "Add issuer", category: "Programming", file: "/certificates/java-foundation-certificate.pdf" },
  { name: "OpenAI GPT-3 for Developers", issuer: "Add issuer", category: "AI & ML", file: "/certificates/openai-gpt3-for-developers.pdf" },
  { name: "Adobe Photoshop", issuer: "Add issuer", category: "Design", file: "/certificates/adobe-photoshop.pdf" },
  { name: "Prelude", issuer: "Add issuer", category: "Events", file: "/certificates/prelude-event.pdf" },
  { name: "Prompt Engineering", issuer: "Add issuer", category: "AI & ML", file: "/certificates/prompt-engineering.pdf" },
  { name: "Flutter Development", issuer: "Udemy", category: "Programming" },
  { name: "Firebase for Mobile Apps", issuer: "Google", category: "Programming" },
];

export const achievements = [
  "Poster Design Award — Intercollege Tech Fest",
  "Published 4 AI-powered mobile apps",
  "3 professional-grade 3D assets modeled from scratch",
  "Shipped 20 VR math lessons for Meta Quest 3S",
  "Built 10+ production web/app projects for clients",
];
