/* ── Case Studies ─────────────────────────────────────────────────────────── */
/* Long-form project write-ups rendered at /projects/[slug].                   */
/* A project in data.ts becomes a case study by matching its `slug` here.      */

export interface Metric {
  value: string;
  label: string;
}

/** A headed block of prose with optional bullets. */
export interface Block {
  heading: string;
  body?: string;
  bullets?: string[];
}

/** One step in a user journey. */
export interface FlowStep {
  label: string;
  detail: string;
}

export interface Flow {
  actor: string;
  steps: FlowStep[];
}

/** An engineering decision worth defending in an interview. */
export interface Decision {
  decision: string;
  why: string;
  tradeoff: string;
}

export interface StackGroup {
  layer: string;
  items: string[];
}

/**
 * One screen of the real application.
 *
 * `src` is optional on purpose: without it the viewer renders a labelled frame
 * instead of a broken image, so a case study is publishable before any capture
 * exists. Drop a file at `public/projects/<slug>/<name>.webp`, set `src`, and
 * the same slot starts showing the real screenshot — no other change needed.
 */
export interface Shot {
  /** Route in the real app, e.g. "/event/[slug]/selfie". Shown as the caption. */
  route: string;
  label: string;
  detail: string;
  src?: string;
  aspect?: "video" | "portrait";
}

export interface ScreenGroup {
  group: string;
  access: "public" | "authenticated" | "admin";
  shots: Shot[];
}

export interface CaseStudy {
  slug: string;
  title: string;
  tagline: string;
  role: string;
  timeline: string;
  status: "live" | "shipped" | "in-development" | "archived";
  /** Rendered as a monospace block. Keep lines under ~62 chars. */
  architecture?: string;
  /** Draws a purpose-built SVG instead of the monospace block. */
  diagram?: "audio-pipeline" | "bridge-loop";
  architectureNotes?: string[];
  links?: { live?: string; api?: string; github?: string };
  /** Client-owned work: suppress screenshots, show a notice. */
  proprietary?: boolean;
  summary: string;
  metrics: Metric[];
  problem: Block;
  approach: Block[];
  flows?: Flow[];
  decisions?: Decision[];
  stack: StackGroup[];
  screens?: ScreenGroup[];
  engineering?: Block[];
  outcome: Block;
  roadmap?: string[];
}

/* ══════════════════════════════════════════════════════════════════════════ */

const wedfindAi: CaseStudy = {
  slug: "wedfind-ai",
  title: "WedFind AI",
  tagline:
    "Guests scan a QR code, take a selfie, and get only their own wedding photos — face recognition at event scale.",
  role: "Full-stack engineer — product, backend, frontend, AI pipeline, infrastructure",
  timeline: "2025 – 2026",
  status: "live",
  proprietary: true,
  links: {
    live: "https://wedfind.elevencraftstudio.com",
    api: "https://api.wedfind.elevencraftstudio.com",
  },

  summary:
    "Indian wedding studios shoot thousands of photos per event, then spend days manually sorting and sending them to individual families over WhatsApp. WedFind AI turns that into a self-serve flow: the studio uploads once, and each guest retrieves their own photos by taking a selfie. A face-recognition pipeline matches the selfie against event photos and returns only that person's images. Built privacy-first for India's DPDP regime — biometric consent is recorded before any processing and selfies are never written to disk.",

  metrics: [
    { value: "512-dim", label: "face embeddings (InsightFace buffalo_l)" },
    { value: "0.60", label: "cosine match threshold" },
    { value: "HNSW", label: "pgvector index for event-scoped KNN" },
    { value: "117 + 62", label: "backend / frontend tests passing" },
    { value: "4", label: "Celery queues off the request path" },
    { value: "0", label: "static AWS keys in the system" },
  ],

  problem: {
    heading: "The problem",
    body: "Photo delivery is the unglamorous bottleneck in wedding photography. The shoot ends and the real work starts: figuring out which of 3,000 frames contain which of 400 guests, then delivering them family by family.",
    bullets: [
      "Studios sort and distribute manually — days of labour per event, and it scales linearly with guest count.",
      "Bulk-dumping a full gallery link is the usual shortcut, but it hands every guest photos of every other guest.",
      "That shortcut is now a legal problem: photos are personal data and faces are biometric data under India's DPDP Act.",
      "Guests want their photos immediately, on a phone, without installing an app or creating an account.",
    ],
  },

  approach: [
    {
      heading: "Two surfaces, opposite constraints",
      body: "The studio side is a real authenticated product — dashboard, event CRUD, bulk upload, quotas, analytics. The guest side has to work for someone who has never heard of the product, on hotel wifi, in one minute, with no login. Those constraints pull in opposite directions, so they are separate route groups with separate layouts and separate auth posture: Firebase-authenticated for studios, fully public and rate-limited for guests.",
    },
    {
      heading: "Face matching as a vector search problem",
      body: "Every uploaded photo is run through InsightFace buffalo_l to extract 512-dimensional embeddings, stored in a Postgres vector(512) column. A guest selfie becomes one more embedding, and retrieval is a cosine-similarity KNN query against an HNSW index — not a linear scan. event_id is denormalised onto the embedding row so the index prunes to a single event before it ever compares vectors, which keeps queries fast as the photo table grows and makes cross-event leakage structurally impossible rather than a filter someone can forget.",
    },
    {
      heading: "Heavy work never touches the request",
      body: "Embedding extraction and thumbnailing take seconds per photo, so the API only enqueues. Celery workers consume four dedicated queues — default, face, thumbs, maintenance — backed by Redis. Upload returns immediately with a processing status the dashboard polls, and a Celery beat schedule runs the retention sweeper. FastAPI stays responsive under bulk upload of an entire event.",
    },
    {
      heading: "Ingest where the photos actually live",
      body: "Studios edit on a local machine; the backend runs in AWS and cannot see that disk. Rather than force manual browser uploads, an optional desktop agent watches an output folder and pushes new files over an API key. Both paths — browser upload and agent push — go through the same ingest service, so there is one code path to reason about and one place where validation and deduplication happen.",
    },
    {
      heading: "Consent before computation",
      body: "The guest flow is gated on explicit biometric consent, recorded with the consent text, its version, the guest's IP, and a timestamp before a single frame is processed. Selfies are matched in memory and never persisted. Retention is configurable with a daily auto-purge sweep, and guests can invoke erasure. This was designed in from the first schema rather than retrofitted, because consent that arrives after processing is not consent.",
    },
  ],

  flows: [
    {
      actor: "Studio",
      steps: [
        { label: "Sign in", detail: "Firebase email or Google; role resolved from Firestore" },
        { label: "Create event", detail: "Name, date, slug — checked against the account's event quota" },
        { label: "Get QR", detail: "Generated per event, printed for tables or shown on screen" },
        { label: "Upload", detail: "Browser bulk upload, or the desktop agent watching an output folder" },
        { label: "Monitor", detail: "Per-photo processing status, per-event stats, storage against quota" },
      ],
    },
    {
      actor: "Guest",
      steps: [
        { label: "Scan QR", detail: "Lands on /event/[slug] — no account, no install" },
        { label: "Consent", detail: "Biometric consent recorded with text, version, IP, timestamp" },
        { label: "Selfie", detail: "Live getUserMedia capture, file upload as fallback" },
        { label: "Match", detail: "Event-scoped pgvector KNN; single face enforced; selfie discarded" },
        { label: "Download", detail: "Matched gallery only — signed URLs, or bulk ZIP" },
      ],
    },
  ],

  architecture: `                  ┌──────────────────────────┐
  Browser ─HTTPS─► │ Vercel — Next.js 16      │
 (studio/guest)    └────────────┬─────────────┘
                                │ api.* (HTTPS)
                                ▼
                   ┌──────────────────────────┐      ┌────────────┐
                   │ EC2 (Docker)             │      │ Firebase   │
                   │  Caddy ─► FastAPI ───────┼─auth─► tokens +   │
                   │           Celery worker  │      │ Firestore  │
                   │           Celery beat    │      │ roles      │
                   └──┬──────────┬─────────┬──┘      └────────────┘
                      │          │         │
                ┌─────▼────┐ ┌───▼───┐ ┌───▼──────┐
                │ RDS      │ │ Redis │ │ S3       │
                │ pgvector │ │ Elasti│ │ photos   │
                └──────────┘ └───────┘ └──────────┘
                 private      private    private +
                                         presigned`,

  architectureNotes: [
    "RDS, Redis, and S3 are not internet-reachable — only the application host can talk to them.",
    "Secrets come from AWS Secrets Manager via the EC2 instance role. No static AWS keys exist anywhere in the system.",
    "Caddy terminates TLS and renews Let's Encrypt certificates automatically.",
    "Firestore and Storage rules are deny-all; the client never touches them directly, only the Admin SDK does server-side.",
    "Host access is AWS SSM only — there is no open SSH port.",
  ],

  decisions: [
    {
      decision: "pgvector in the primary database instead of a dedicated vector store",
      why: "Embeddings are always queried alongside relational data — event ownership, retention windows, consent records. Keeping them in Postgres means one transaction, one backup, one restore, and referential integrity between a face and the photo it came from.",
      tradeoff: "Gives up the scaling ceiling of a purpose-built vector database. At event scale — thousands of photos per event, not billions — an HNSW index on RDS is comfortably fast, and the operational simplicity is worth more than headroom I do not need yet.",
    },
    {
      decision: "Denormalise event_id onto the embedding row",
      why: "Turns cross-event isolation from a WHERE clause someone might omit into a property of the index itself. Queries prune to one event before comparing vectors.",
      tradeoff: "Duplicated column to keep in sync on write. Accepted because the failure mode it prevents — one guest receiving another event's photos — is the worst thing this product could do.",
    },
    {
      decision: "Never persist selfies",
      why: "The selfie is the most sensitive artefact in the system and has no use after matching. Not storing it removes an entire class of breach, retention, and erasure obligation.",
      tradeoff: "A guest who wants a second look at their gallery has to re-capture. Worth it — re-taking a selfie costs five seconds; a leaked biometric database is unrecoverable.",
    },
    {
      decision: "Firebase for authentication, Postgres for everything else",
      why: "Email and Google sign-in, token issuance, and rotation are solved problems not worth rebuilding. The backend verifies Firebase ID tokens against Google's public certs and owns all application data itself.",
      tradeoff: "Two systems to reason about, and roles live in Firestore rather than the main database. Contained by verifying role server-side on every admin route instead of trusting a token claim.",
    },
    {
      decision: "Fail-fast configuration validation",
      why: "Pydantic v2 settings validate every required variable at import. A misconfigured deploy refuses to boot instead of starting and failing later on a request path where a guest sees it.",
      tradeoff: "Deploys fail louder and earlier. That is the point.",
    },
  ],

  stack: [
    {
      layer: "Frontend",
      items: ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind v4", "Base UI", "TanStack Query", "React Hook Form", "Zod", "Axios"],
    },
    {
      layer: "Backend",
      items: ["FastAPI", "Gunicorn / Uvicorn", "SQLAlchemy", "Pydantic v2", "psycopg 3"],
    },
    {
      layer: "Async",
      items: ["Celery", "Redis", "Celery beat", "4 queues: default / face / thumbs / maintenance"],
    },
    {
      layer: "Data",
      items: ["PostgreSQL 16", "pgvector (HNSW, cosine)", "Alembic migrations"],
    },
    {
      layer: "Face AI",
      items: ["InsightFace buffalo_l", "ONNXRuntime", "OpenCV", "NumPy"],
    },
    {
      layer: "Auth / RBAC",
      items: ["Firebase ID tokens", "PyJWT + cryptography", "Firestore roles (admin / user)"],
    },
    {
      layer: "Storage",
      items: ["AWS S3", "boto3", "presigned URLs", "generated thumbnails"],
    },
    {
      layer: "Infrastructure",
      items: ["Terraform", "Docker Compose", "EC2", "RDS", "ElastiCache", "Caddy (auto-HTTPS)", "Vercel", "AWS Secrets Manager", "SSM"],
    },
    {
      layer: "Testing",
      items: ["pytest + httpx", "Vitest", "React Testing Library", "MSW", "Playwright (Chromium)"],
    },
    {
      layer: "Observability",
      items: ["Structured JSON logs + request IDs", "Prometheus /metrics", "Sentry", "CloudWatch alarms → SNS"],
    },
  ],

  /* Routes below are the real route groups in frontend/app. */
  screens: [
    {
      group: "Guest flow",
      access: "public",
      shots: [
        {
          route: "/event/[slug]",
          label: "Event landing",
          detail: "Where the QR code lands. Event details, one action, and a footer that says what a guest most wants to know: no account needed.",
          aspect: "portrait",
          src: "/projects/wedfind-ai/guest-landing.webp",
        },
        {
          route: "/event/[slug]/consent",
          label: "Biometric consent",
          detail: "The DPDP gate, in plain language: what a selfie is used for, that it becomes a numeric signature and is then discarded, that only the consent record is kept, and how retention works. Two explicit checkboxes; the flow will not advance without both. Consent text, version, IP, and timestamp are recorded on accept.",
          aspect: "portrait",
          src: "/projects/wedfind-ai/guest-consent.webp",
        },
        {
          route: "/event/[slug]/selfie",
          label: "Selfie capture",
          detail: "Live getUserMedia capture, with a file-upload fallback when the camera is blocked or unavailable — the state shown here. A guest on a locked-down browser is never dead-ended.",
          aspect: "portrait",
          src: "/projects/wedfind-ai/guest-selfie.webp",
        },
        {
          route: "/event/[slug]/processing",
          label: "Matching",
          detail: "Held state while the event-scoped pgvector query runs. The selfie is discarded here.",
          aspect: "portrait",
        },
        {
          route: "/event/[slug]/gallery",
          label: "Matched gallery",
          detail: "Only this guest's photos. Signed-URL downloads, or bulk ZIP.",
          aspect: "portrait",
        },
        {
          route: "/event/[slug]/not-found",
          label: "Bad or expired link",
          detail: "A mistyped slug or a retired QR code resolves to an explicit state rather than an empty gallery that looks like a failed match.",
          src: "/projects/wedfind-ai/event-not-found.webp",
        },
      ],
    },
    {
      group: "Studio",
      access: "authenticated",
      shots: [
        {
          route: "/login",
          label: "Sign in",
          detail: "Firebase email and Google sign-in. The only public studio-side screen.",
          src: "/projects/wedfind-ai/login.webp",
        },
        {
          route: "/dashboard",
          label: "Dashboard",
          detail: "Event totals, photos uploaded, guests matched, downloads, and storage against the account quota — plus the upload queue and folder-watch status.",
          src: "/projects/wedfind-ai/dashboard.webp",
        },
        {
          route: "/events",
          label: "Events",
          detail: "Create, list, and delete events. Deleting an event also cleans up its S3 objects.",
          src: "/projects/wedfind-ai/events.webp",
        },
        {
          route: "/events/[id]",
          label: "Event detail",
          detail: "QR and share actions, the upload dropzone, and the pipeline made visible: photos uploaded, in processing, and embeddings ready — the last one is the count of faces actually indexed into pgvector, polled while Celery works through the queue.",
          src: "/projects/wedfind-ai/event-detail.webp",
        },
        {
          route: "/profile",
          label: "Account and quotas",
          detail: "Role, event limit, and storage limit. Shown here read-only — the values are set by an admin and enforced server-side, not in the client.",
          src: "/projects/wedfind-ai/profile.webp",
        },
        {
          route: "/settings",
          label: "Settings",
          detail: "Account configuration and the desktop-agent API key used for folder-watch ingest.",
          src: "/projects/wedfind-ai/settings.webp",
        },
      ],
    },
    {
      group: "Admin",
      access: "admin",
      shots: [
        {
          route: "/admin/analytics",
          label: "Analytics",
          detail: "Global usage across all studios. Role verified server-side, not from a token claim.",
        },
        {
          route: "/admin/users",
          label: "Users and quotas",
          detail: "Per-user event and storage limits, role changes.",
        },
        {
          route: "/admin/tokens",
          label: "Agent tokens",
          detail: "Issue and revoke the API keys the desktop ingest agent authenticates with.",
        },
        {
          route: "/admin/audit",
          label: "Audit log",
          detail: "Who changed what, when — including quota and role mutations.",
        },
      ],
    },
    {
      group: "Access control",
      access: "public",
      shots: [
        {
          route: "/unauthorized",
          label: "Role denied",
          detail: "Where a signed-in studio account lands if it reaches an admin route. The API refuses it server-side; this screen is the client half of the same rule.",
          src: "/projects/wedfind-ai/unauthorized.webp",
        },
        {
          route: "/session-expired",
          label: "Session expired",
          detail: "Firebase token expiry is handled as an explicit state rather than a silent failure or a redirect loop.",
          src: "/projects/wedfind-ai/session-expired.webp",
        },
      ],
    },
  ],

  engineering: [
    {
      heading: "Testing",
      body: "The backend suite runs against SQLite with S3 and the face model mocked, so it needs no AWS and no 300 MB model download in CI — 117 passing, 2 skipped, covering auth, events, ingest, the guest flow, ZIP delivery, privacy behaviour, admin routes, and reliability. The frontend runs 62 Vitest tests against MSW-mocked APIs. Playwright drives the real deployed stack end to end and is kept out of the per-push pipeline deliberately, running on demand for release candidates.",
      bullets: [
        "CI on every push and PR: backend pytest + migration check, frontend lint + Vitest + build, Docker image build.",
        "E2E in a separate workflow so a flaky browser run can never block a merge.",
      ],
    },
    {
      heading: "Observability",
      body: "Structured JSON logs carry a request ID through the whole call, including into Celery tasks, so one guest's failed match can be traced across process boundaries. Prometheus metrics are exposed but not internet-routed. Three distinct probes serve different consumers: /livez for the container, /readyz gating deploys on real DB, Redis, and S3 connectivity, and /healthz for coarse monitoring.",
    },
    {
      heading: "Security posture",
      body: "Per-IP rate limiting via SlowAPI on the public guest endpoints, security headers, HTTPS redirect in production, IMDSv2 enforced, private subnets for data stores, S3 private and encrypted and versioned, and S3 objects cleaned up when an event is deleted. Admin routes verify role server-side rather than trusting a claim. The Firebase service-account key rotates without a code change via a documented runbook.",
    },
    {
      heading: "Operations",
      body: "Terraform provisions the whole environment and promotes staging to production by parameter, including multi-AZ for the database. Deploys run over SSM: fetch secrets, pull image, compose up, migrate, then gate on /readyz before traffic. Runbooks cover deployment, secrets, monitoring, rollback, validation, and Firebase key rotation — written so the deploy is repeatable by someone who is not me.",
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "WedFind AI runs in production on a custom domain with the frontend on Vercel and the backend on AWS. It replaces days of manual photo sorting per event with a QR code, and it does so without handing any guest another guest's photos. The parts I would defend hardest are the ones that are invisible when they work: event-scoped vector retrieval that cannot leak across events, consent recorded before computation rather than after, and a deploy that refuses to start when misconfigured instead of failing in front of a guest.",
    bullets: [
      "Full production infrastructure as Terraform — reproducible, not hand-clicked.",
      "179 automated tests across both halves of the stack, plus E2E against the real deployment.",
      "Privacy behaviour designed into the schema, not bolted on: consent-gated processing, no persisted selfies, auto-purge retention, right to erasure.",
    ],
  },

  roadmap: [
    "WhatsApp delivery for guests who would rather not open a browser",
    "Razorpay billing and per-studio branding",
    "Multi-AZ and multi-region high availability",
    "Regional language support",
    "CDN in front of thumbnails",
    "Remote Terraform state (S3 + DynamoDB locking)",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

const meetingAssistant: CaseStudy = {
  slug: "meeting-assistant",
  title: "GMeeting — AI Meeting Assistant",
  tagline:
    "A video-call app that captions itself, attributes every line to a speaker, and writes its own minutes.",
  role: "Solo — product, Flutter app, real-time audio pipeline, LLM prompting (final-year project)",
  timeline: "2026",
  status: "shipped",
  links: {
    github: "https://github.com/Blackcommando5/meeting-assistant",
  },

  summary:
    "GMeeting is a Flutter video-meeting app where the call transcribes itself. Live captions appear as people speak, each line attributed to a speaker, and a rolling AI summary updates through the meeting. When the call ends, the full transcript becomes a structured set of minutes — key points, decisions, and action items with assignees and deadlines. The part I care about most is invisible: rather than opening a second microphone stream, the app taps the audio frames the video SDK is already capturing and forwards them to a streaming speech API. One audio owner, no contention, no duplicated capture.",

  metrics: [
    { value: "nova-3", label: "Deepgram streaming model, diarization on" },
    { value: "16 kHz", label: "linear16 mono PCM, 1024 samples per frame" },
    { value: "70B", label: "Llama 3.3 via NVIDIA NIM for summarization" },
    { value: "60 s", label: "live-insight cadence, guarded against no-ops" },
    { value: "29", label: "Dart source files across 6 feature modules" },
    { value: "2", label: "prompt paths — rolling insight and final minutes" },
  ],

  problem: {
    heading: "The problem",
    body: "Someone in every meeting is typing instead of thinking. They still miss things — who committed to what, what was actually decided, what the deadline was — because note-taking competes with participating.",
    bullets: [
      "Action items get lost between the moment they are spoken and the moment anyone writes them down.",
      "Existing transcription tools bolt on as a separate bot or a second recorder, which means a second audio capture fighting the call for the microphone.",
      "A transcript with no speaker attribution is close to useless for accountability — \"someone said they'd handle it\" is not a task.",
      "Summaries that only arrive after the meeting cannot correct the meeting while it is still happening.",
    ],
  },

  approach: [
    {
      heading: "Tap the call's audio instead of opening a second microphone",
      body: "The obvious implementation is to start a recorder alongside the video call. That means two consumers of one microphone, contention over audio routing and permissions, and drift between what the call hears and what the transcriber hears. Instead the app registers an audio frame observer on the video engine in read-only mode, configured to hand back exactly the format the speech API wants — 16 kHz, mono, linear16, 1024 samples per callback. Every frame the call captures is forwarded straight to an open WebSocket. There is one audio source, the transcript is guaranteed to match what participants actually heard, and nothing is recorded that the call was not already capturing.",
    },
    {
      heading: "Interim results for the eye, final results for the record",
      body: "The speech API streams interim hypotheses that rewrite themselves as more audio arrives. Those are perfect for subtitles and poisonous for a transcript — commit them and the same sentence lands three times in slightly different forms. So interim results only ever drive the on-screen caption; the transcript accepts a line only when the API marks it final. A caption clears itself four seconds after the last final result and falls back to a visible listening state, so the overlay never freezes on stale text.",
    },
    {
      heading: "Speaker attribution, then repair",
      body: "Diarization returns a speaker index per word, not a name. The app maps index zero to the signed-in user's actual display name and labels the rest positionally. Raw diarized output also arrives fragmented, because endpointing cuts on short pauses rather than sentence boundaries — so consecutive entries from the same speaker within three seconds are merged into one. The transcript that reaches the model reads as turns in a conversation, timestamped, rather than as a stream of clauses.",
    },
    {
      heading: "Two prompt paths, not one",
      body: "Live insight and final minutes want different things. During the meeting the model gets a low temperature, a tight token budget, and an instruction to be brief — a one-to-three sentence summary of what is being discussed right now, current topics, tasks, decisions. After the call it gets a larger budget and a fuller schema: overall summary, key points, action items with assignee and priority and deadline, decisions, and a paragraph per speaker on what they contributed. Same transcript, two jobs, two prompts.",
    },
    {
      heading: "Rolling context instead of resending everything",
      body: "Each live insight receives the previous summary alongside the recent transcript. The prompt stays a bounded size no matter how long the meeting runs, and the model has continuity rather than re-reading an hour of dialogue every minute. Insights are written to Firestore rather than held in widget state, so they survive the panel being closed and are available to anyone else reading the meeting.",
    },
    {
      heading: "Never spend a token on silence",
      body: "The insight timer fires every sixty seconds, but three guards sit in front of the API call: one rejects a request while another is still in flight, one requires the transcript to be non-empty, and one compares the current transcript entry count against the count at the last insight. A quiet minute costs nothing. Without that last guard a meeting left open on a desk would bill for an identical summary every minute.",
    },
  ],

  flows: [
    {
      actor: "In a meeting",
      steps: [
        { label: "Start or join", detail: "Meeting code generated and shareable; joins an RTC channel in communication profile" },
        { label: "Turn on CC", detail: "Opens the speech WebSocket and registers the audio frame observer in one action" },
        { label: "Speak", detail: "Interim results paint subtitles with a speaker label; final results append to the transcript" },
        { label: "Watch insights", detail: "Every 60s, a fresh live summary, topics, tasks, and decisions — if anything new was said" },
        { label: "End call", detail: "Channel released, observer torn down, socket closed, transcript handed to the summarizer" },
      ],
    },
    {
      actor: "After the meeting",
      steps: [
        { label: "Minutes generated", detail: "Full transcript sent once with a larger token budget and a richer schema" },
        { label: "Read the output", detail: "Overall summary, key points, decisions, and per-speaker contribution notes" },
        { label: "Collect actions", detail: "Action items flattened into readable lines carrying assignee, priority, and deadline" },
        { label: "Find it later", detail: "History lists past meetings; ones with generated minutes are badged" },
      ],
    },
  ],

  diagram: "audio-pipeline",

  architecture: `  ┌──────────────── Flutter app ─────────────────┐
  │                                              │
  │  Agora RTC ──audio frames (16k mono PCM)──┐  │
  │   (video +  │  read-only observer          │  │
  │    audio)   │                              ▼  │
  │             │                    ┌──────────┐ │
  │  AgoraVideoView                  │ Deepgram │ │
  │   local + remote                 │  socket  │ │
  │                                  └────┬─────┘ │
  │   subtitles ◄──interim───────────────┤       │
  │                                       │final  │
  │                          ┌────────────▼────┐  │
  │                          │ TranscriptCollector │
  │                          │ merge · speakers │  │
  │                          └────────┬─────────┘  │
  │            every 60s / on end     │            │
  │                          ┌────────▼─────────┐  │
  │                          │  NVIDIA NIM      │  │
  │                          │  Llama 3.3 70B   │  │
  │                          └────────┬─────────┘  │
  └───────────────────────────────────┼───────────┘
                                      ▼
                         Firebase (Auth · Firestore)
                         insights + meetings + history`,

  architectureNotes: [
    "The audio observer is read-only — it never mutates the audio the call transmits.",
    "Speech runs over a persistent WebSocket; summarization is plain request/response over HTTPS.",
    "Insights land in Firestore, so the panel reads shared state rather than local widget state.",
    "Riverpod holds auth and meeting state; go_router owns navigation and the auth redirect.",
    "Turning captions off tears down the socket and cancels the insight timer together — captions and insights share one lifecycle.",
  ],

  decisions: [
    {
      decision: "Reuse the video SDK's audio frames rather than opening a second capture",
      why: "One microphone, one owner. No permission or audio-route contention with the call, no drift between what participants heard and what was transcribed, and no extra recording surface to reason about.",
      tradeoff: "Couples captions tightly to that SDK's frame-observer API. If the SDK changes its observer contract or frame timing, captions break and the fix is not portable. A separate recorder would have been uglier but independent.",
    },
    {
      decision: "Commit only final speech results to the transcript",
      why: "Interim hypotheses rewrite themselves. Recording them produces a transcript with the same sentence repeated in three half-finished forms, which then corrupts every summary built on it.",
      tradeoff: "The written transcript trails the visible caption by roughly an endpointing window. The screen is always slightly ahead of the record.",
    },
    {
      decision: "Merge same-speaker lines within a three-second gap",
      why: "Endpointing splits on pauses, not sentences, so one spoken thought arrives as several entries. Merging makes the transcript read as conversational turns, which measurably improves what the model extracts.",
      tradeoff: "A genuine fast exchange between two people can be flattened into one turn if diarization mislabels a speaker. Three seconds is a guess that suits deliberate meeting speech, not rapid argument.",
    },
    {
      decision: "Feed the previous summary forward instead of the whole transcript",
      why: "Keeps prompt size flat as a meeting grows, which keeps both latency and cost predictable in a loop that runs once a minute for the length of the call.",
      tradeoff: "Compounding summarization — an error introduced early is carried forward and can harden into the record. Resending the full transcript would be self-correcting but grows without bound.",
    },
    {
      decision: "Ask for JSON and parse defensively rather than trust the response shape",
      why: "The completions endpoint gives no schema guarantee, and instruction-tuned models wrap JSON in markdown fences or drift between a string and an object for the same field. The parser strips fences, falls back to the first brace-balanced span, and accepts action items as either strings or objects.",
      tradeoff: "Tolerating malformed output means silently accepting partial results instead of failing loudly on a contract violation. A provider with enforced structured output would remove this code entirely.",
    },
  ],

  stack: [
    {
      layer: "App",
      items: ["Flutter", "Dart 3", "Riverpod 3", "go_router 17", "Material 3"],
    },
    {
      layer: "Real-time media",
      items: ["Agora RTC Engine 6.5", "AudioFrameObserver", "AgoraVideoView"],
    },
    {
      layer: "Speech",
      items: ["Deepgram nova-3", "WebSocket streaming", "diarization", "interim results", "endpointing 300ms", "smart formatting"],
    },
    {
      layer: "LLM",
      items: ["NVIDIA NIM", "Llama 3.3 70B Instruct", "JSON-constrained prompting", "temperature 0.2 / 0.3"],
    },
    {
      layer: "Backend",
      items: ["Firebase Auth", "Google Sign-In", "Cloud Firestore", "Firebase Storage", "Cloud Messaging", "Firestore security rules"],
    },
    {
      layer: "Platform",
      items: ["Android", "iOS", "permission_handler", "flutter_dotenv", "intl", "uuid"],
    },
  ],

  screens: [
    {
      group: "Getting in",
      access: "public",
      shots: [
        {
          route: "features/auth/screens/login_screen.dart",
          label: "Sign in",
          detail: "Google sign-in or email and password, backed by Firebase Auth. go_router owns the redirect, so an unauthenticated deep link lands here and resumes afterwards.",
          aspect: "portrait",
          src: "/projects/meeting-assistant/login.webp",
        },
        {
          route: "features/home/screens/home_screen.dart",
          label: "Home",
          detail: "Start or join by code, rejoin an active meeting, and browse recent meetings. Meetings that have generated minutes carry an AI Summary badge, so history doubles as a record of which calls produced decisions.",
          aspect: "portrait",
          src: "/projects/meeting-assistant/home.webp",
        },
      ],
    },
    {
      group: "In the call",
      access: "authenticated",
      shots: [
        {
          route: "features/meeting/screens/meeting_screen.dart",
          label: "Call controls",
          detail: "Meeting code with copy and share, participant count, caption toggle, and elapsed timer. Mute, camera, flip, and screen share sit on the primary control row.",
          aspect: "portrait",
          src: "/projects/meeting-assistant/call-controls.webp",
        },
        {
          route: "features/meeting/screens/meeting_screen.dart",
          label: "Assistant controls",
          detail: "The second control row reaches the assistant: captions, the live insights panel, chat, and participants. Captions and insights are one switch internally — enabling CC opens the speech socket and starts the insight timer together.",
          aspect: "portrait",
          src: "/projects/meeting-assistant/call-ai-controls.webp",
        },
        {
          route: "features/meeting/widgets/live_insights_panel.dart",
          label: "Live insights",
          detail: "Rolling summary, current topics, extracted tasks with assignees, and decisions — refreshed each minute from Firestore, only when new speech has actually landed. Captured on an earlier build that summarized through Groq; the panel now runs on Llama 3.3 70B via NVIDIA NIM, which is why the header credits a different provider than the stack above.",
          aspect: "portrait",
          src: "/projects/meeting-assistant/live-insights.webp",
        },
        {
          route: "features/meeting/screens/meeting_screen.dart",
          label: "Bilingual captions",
          detail: "An earlier build carried a caption-language toggle between English and Tamil, switching the language parameter on the speech socket rather than translating after the fact. It is not in the current source — kept here because it is the feature I most want back, and the roadmap item it became.",
          aspect: "portrait",
          src: "/projects/meeting-assistant/captions-tamil.webp",
        },
      ],
    },
  ],

  engineering: [
    {
      heading: "Lifecycle discipline",
      body: "A real-time pipeline leaks if teardown is sloppy: a socket, a stream subscription, a frame observer, a caption timer, an insight timer, and a duration timer all have to stop when a call ends or the widget disposes. Captions and insights deliberately share one switch so there is a single place where both start and both stop, rather than two independent lifecycles that can disagree.",
    },
    {
      heading: "Known limitation — keys ship inside the app",
      body: "Both API keys are read from a dotenv file that is bundled as a Flutter asset, which means they are extractable from a distributed build. That is acceptable for a graded prototype and not acceptable for a release. The fix is a thin backend that holds the credentials and proxies both calls: the app would open a WebSocket to my own server for speech and post transcripts to my own endpoint for summarization. I would also move the summarizer server-side so a meeting's minutes do not depend on the phone staying awake.",
    },
    {
      heading: "What I would do differently",
      body: "There is no automated test coverage — the audio bridge and the transcript merge logic are both pure enough to test properly and both are exactly where a regression would be invisible until someone reads a bad transcript. I would also make the summarizer resumable: right now the minutes are generated once on the summary screen, so a failed request means a lost meeting rather than a retry against a transcript already saved.",
      bullets: [
        "Unit-test the transcript collector's merge window and speaker mapping.",
        "Persist the transcript continuously, so summarization can be retried or re-run later.",
        "Proxy both APIs through a backend and stop shipping credentials in the binary.",
      ],
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "A working Flutter app that joins a video call, captions it live with speaker attribution, keeps a rolling AI summary through the meeting, and produces structured minutes with owned action items when the call ends. The engineering I would defend in an interview is the audio path — reusing the call's own frames instead of racing it for the microphone — and the three guards that stop a summarization loop from spending money on a silent room.",
    bullets: [
      "Live captions driven by the video call's own audio frames, not a second recorder.",
      "Speaker-attributed transcript that repairs fragmented diarization output before the model sees it.",
      "Two-path prompting: bounded rolling context during the call, full schema after it.",
      "Honest gap identified and scoped: credentials belong behind a backend, not in the bundle.",
    ],
  },

  roadmap: [
    "Backend proxy so API keys leave the app binary",
    "Server-side summarization that survives the phone sleeping",
    "Tests for the transcript merge window and speaker mapping",
    "Retryable minutes generation against a persisted transcript",
    "Multi-language captions selectable per participant",
    "Export minutes to email or a task tracker",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

const teamshare: CaseStudy = {
  slug: "teamshare",
  title: "TeamShare — Offline LAN File Sharing",
  tagline:
    "File sharing for teams with no internet — and a link that the receiving PC can verify without ever phoning home.",
  role: "Solo — product, dashboard, per-PC agent, security model, Windows packaging",
  timeline: "2026",
  status: "shipped",
  proprietary: true,

  summary:
    "TeamShare lets a team share files across a LAN with no cloud, no internet, and no account on anyone else's servers. One PC hosts a dashboard and a SQLite database; every PC runs a small headless agent that serves only the folders it has been told to share. The interesting constraint is the one that shapes everything else: an offline network cannot call an auth server, so access links have to be verifiable locally. They are HMAC-signed with the target device's own permanent token — a key the browser never sees and the agent already holds — so a 15-minute link is checked entirely offline, and a leaked one still cannot escape the folder it was scoped to.",

  metrics: [
    { value: "0", label: "internet or cloud dependencies at runtime" },
    { value: "15 min", label: "signed access-link lifetime" },
    { value: "HMAC-SHA256", label: "link signature, verified offline by the agent" },
    { value: "90 s", label: "online window — three missed 30 s heartbeats" },
    { value: "20", label: "agent tests, aimed at the security boundary" },
    { value: "~55 MB", label: "self-contained agent exe, no Node required" },
  ],

  problem: {
    heading: "The problem",
    body: "Plenty of places cannot use a cloud drive: an office with metered or unreliable internet, a classroom, a production floor, an event venue, an air-gapped studio. The files are sitting on machines a few metres apart, and the normal answer is to route them through a data centre on another continent — or to give up and pass a USB stick around.",
    bullets: [
      "Cloud sync needs bandwidth the site may not have, and uploads what may not be allowed to leave the building.",
      "A plain Windows share is all-or-nothing, hard to audit, and nobody can tell you who opened what.",
      "Ad-hoc fixes — USB drives, chat attachments — have no access control and no record at all.",
      "The hard part is authorization: with no internet, the PC serving a file cannot ask a server whether the request is allowed.",
    ],
  },

  approach: [
    {
      heading: "Make the link self-proving instead of asking permission",
      body: "Every device registered in the dashboard has a permanent access token. The host stores it; the agent on that PC holds its own copy; it is never sent to a browser. When someone clicks Open files, the host mints a short-lived HS256 JWT signed with that device's token and hands back a URL containing it. The agent recomputes the HMAC with the copy it already has, and that is the entire authorization check — no callback, no shared session, no network beyond the two machines involved. Offline verification is not a fallback here, it is the design.",
    },
    {
      heading: "Scope the link so a leak is survivable",
      body: "A signed URL will end up pasted in chat sooner or later, so it is built to be worth little. It expires in fifteen minutes. Its claims name the device it was minted for, and the agent rejects a token issued for any other device, so one link cannot be replayed against a different PC. The user id inside is recorded for the audit trail and explicitly not trusted for authorization. And because the file layer is jailed independently, even a valid link only reaches the folders that were actually shared.",
    },
    {
      heading: "Treat the path jail as the real security boundary",
      body: "Sharing a folder is only safe if a request cannot walk out of it, and there are two separate ways out. The lexical one — a relative path climbing out with ../ — is caught by resolving the target and comparing it against the root. The sneakier one is a symlink sitting inside the share that points somewhere else; lexically it stays put, so only resolving the real path catches it. Both are blocked, and for paths that do not exist yet the resolver walks up to the nearest existing ancestor and checks that, so a symlinked parent directory cannot smuggle an upload out of the share.",
    },
    {
      heading: "Never accept a host path from a client",
      body: "Shared folders are addressed by an opaque index rather than by their absolute location, so a request can only ever name a share that was already configured. Parsing that index is deliberately strict decimal, because the obvious implementation would silently mis-resolve: passing an empty string, a space, or 0x0 through Number() all yield zero, which would quietly hand back the first share to a request that named nothing. The index is also resolved exactly once so that the folder path and the permission attached to it can never be read from two different entries.",
    },
    {
      heading: "A headless agent, configured from the machine it runs on",
      body: "The agent has no tray icon on purpose — native tray modules inflate the packaged executable and are a reliable way to get flagged by antivirus, which matters a lot for something staff install themselves. Instead it exposes a small setup page, and that page is bound to loopback only: pairing can never be reached across the network. A visitor arriving at the root from the LAN is redirected to the file browser rather than being shown that a setup page exists at all.",
    },
    {
      heading: "Make installation the part that actually works",
      body: "An agent nobody can install is worthless, so packaging is treated as a feature. The installer drops a self-contained executable that needs no Node runtime, adds the inbound firewall rule for its port on the private and domain profiles, registers autostart at login, and opens the setup page when it finishes — and reverses all three on uninstall. That firewall rule is the reason the installer is the artefact to distribute rather than the bare exe: without it the agent runs perfectly and is invisible to every other PC on the network.",
    },
  ],

  flows: [
    {
      actor: "Setting up",
      steps: [
        { label: "Host a workspace", detail: "One PC picks Host; it runs the dashboard, the API, and the SQLite database" },
        { label: "First account is admin", detail: "Created directly on the host — no external identity provider involved" },
        { label: "Other PCs connect", detail: "Each installs the app and points at the host's LAN address" },
        { label: "Pair a device", detail: "Register the PC in the dashboard, then paste its token into that PC's loopback setup page" },
        { label: "Share folders", detail: "Choose folders per device with a view or download permission" },
      ],
    },
    {
      actor: "Opening someone's files",
      steps: [
        { label: "Click Open files", detail: "Dashboard posts the device id; the request requires a signed-in user" },
        { label: "Host runs its checks", detail: "Device exists, is not revoked, has reported an IP, and has heartbeat within 90 s" },
        { label: "Host mints the link", detail: "HS256 JWT signed with the device's permanent token — which stays on the host" },
        { label: "Agent verifies alone", detail: "Recomputes the HMAC in constant time, checks expiry, and that the token names this device" },
        { label: "Agent jails the path", detail: "Opaque root index resolved once, target confirmed inside the real root, permission rank enforced" },
        { label: "Files served", detail: "Access is recorded, so the dashboard can show who opened what" },
      ],
    },
  ],

  architecture: `   ┌────────────── Host PC ───────────────┐
   │ TeamShare desktop app (Electron)     │
   │   dashboard server        :3000      │
   │     React UI · API · auth            │
   │   SQLite  %APPDATA%/TeamShare        │
   │   agent                   :5050      │
   └───────────────┬──────────────────────┘
                   │  LAN / WiFi — no internet
      ┌────────────┼─────────────┐
      ▼            ▼             ▼
 ┌─────────┐  ┌─────────┐  ┌─────────┐
 │  PC B   │  │  PC C   │  │  PC D   │
 │ agent   │  │ agent   │  │ agent   │
 │  :5050  │  │  :5050  │  │  :5050  │
 └─────────┘  └─────────┘  └─────────┘
  each serves only its shared folders,
  path-jailed, verifying links offline`,

  architectureNotes: [
    "The device's permanent token is the HMAC key. It lives on the host and on that one PC, and never reaches a browser.",
    "Agents heartbeat every 30 s and pull their shared-folder list every 60 s; the host treats 90 s of silence as offline.",
    "The agent's setup route is bound to loopback, so pairing is unreachable from the network.",
    "Data is a single SQLite file in the OS user-data directory — the whole workspace is one file to back up.",
    "Crossing networks needs no code change: install Tailscale and use its addresses instead of LAN IPs.",
  ],

  decisions: [
    {
      decision: "Sign access links with the target device's own permanent token",
      why: "It is the one secret both the host and that specific agent already share, which makes verification a local HMAC computation instead of a network call. On a site with no internet, anything requiring a round trip to an auth service simply does not work.",
      tradeoff: "There is no way to revoke a single issued link before its fifteen minutes elapse — the only lever is revoking the device, which invalidates every link for it and forces re-pairing. A central introspection endpoint would allow per-link revocation and would also reintroduce exactly the online dependency the product exists to avoid.",
    },
    {
      decision: "Address shared folders by opaque index, never by path",
      why: "A client that cannot express a host path cannot ask for one. It removes a whole class of input rather than trying to sanitise it, and it keeps absolute filesystem layout off the wire entirely.",
      tradeoff: "Indexes are positional, so reordering or removing a share changes what an already-issued link resolves to. Acceptable only because links live fifteen minutes; with long-lived links this would need stable opaque ids instead.",
    },
    {
      decision: "Ship the agent headless, with no tray icon",
      why: "Native tray integrations add significant weight to a packaged Node executable and are a common antivirus false-positive trigger. For software non-technical staff install on their own machines, a clean install matters more than a status icon.",
      tradeoff: "Nothing on screen says the agent is running, so diagnosing a quiet failure means knowing to open a local URL. Discoverability was traded for install success rate.",
    },
    {
      decision: "Any signed-in member may open any registered device",
      why: "The product targets a small co-located team that already shares physical space and trusts each other; per-user, per-device access lists would be most of the complexity for very little benefit at that scale.",
      tradeoff: "One compromised account reaches every shared folder on every paired PC. The schema anticipates the stricter model — shared folders carry an allowed-members column — but it is written empty and never consulted, so the restriction is designed for and not yet enforced. That half-built state is itself the risk: the column reads like a control when it is currently decoration, and it is the first thing I would either finish or delete.",
    },
    {
      decision: "Resolve real paths rather than only comparing strings",
      why: "A lexical check alone cannot see a symlink inside the share pointing out of it — the path looks obedient right up until the filesystem follows it. Resolving the real path is the only way to catch that class.",
      tradeoff: "Costs a filesystem call per request, and the resolver has to special-case targets that do not exist yet, which is where the walk-up-to-the-nearest-ancestor branch comes from. More moving parts than a string comparison, for a hole a string comparison cannot close.",
    },
  ],

  stack: [
    {
      layer: "Dashboard",
      items: ["TanStack Start", "TanStack Router", "TanStack Query", "React 19", "TypeScript", "Vite 8", "Tailwind v4", "Radix UI", "React Hook Form", "Zod"],
    },
    {
      layer: "Server",
      items: ["Nitro", "file-route API handlers", "better-sqlite3", "session auth", "Zod request validation"],
    },
    {
      layer: "Agent",
      items: ["Node 22", "node:http", "node:crypto HMAC-SHA256", "realpath path jail", "loopback-only setup UI"],
    },
    {
      layer: "Desktop shell",
      items: ["Electron 43", "host and client modes", "spawns server + agent", "electron-builder", "native ABI rebuild in afterPack"],
    },
    {
      layer: "Packaging",
      items: ["self-contained agent exe", "Inno Setup installer", "firewall rule automation", "autostart registration"],
    },
    {
      layer: "Testing",
      items: ["node:test", "path-traversal suite", "token forgery suite", "live HTTP end-to-end"],
    },
  ],

  /* Captured from the real app against a throwaway database, so every screen is
     an empty or demo state rather than anyone's actual files. */
  screens: [
    {
      group: "Getting in",
      access: "public",
      shots: [
        {
          route: "/auth",
          label: "Sign in",
          detail: "Sign in or create an account, served by the host PC itself — there is no external identity provider anywhere in the product. The first account created becomes admin; everyone after joins as a member.",
          src: "/projects/teamshare/auth.webp",
        },
      ],
    },
    {
      group: "Workspace",
      access: "authenticated",
      shots: [
        {
          route: "/dashboard",
          label: "Dashboard",
          detail: "Devices online against devices registered, teammates, shared folders, and recent access events — the four numbers that answer whether sharing is currently working.",
          src: "/projects/teamshare/dashboard.webp",
        },
        {
          route: "/devices",
          label: "Devices",
          detail: "Register a PC, see whether its agent has checked in, and revoke it. Each device carries the permanent token that signs its access links, which is why revoking a device invalidates every link for it at once.",
          src: "/projects/teamshare/devices.webp",
        },
        {
          route: "/folders",
          label: "Shared folders",
          detail: "Choose which folders on which PC are shared, and at what permission — view, download, or upload. The agent enforces the rank server-side, so a view-only share cannot be talked into serving a download.",
          src: "/projects/teamshare/folders.webp",
        },
        {
          route: "/activity",
          label: "Activity",
          detail: "The audit trail. Every minted link records who requested it, which is the whole reason the user id is carried inside the token — logged for accountability, explicitly not trusted for authorization.",
          src: "/projects/teamshare/activity.webp",
        },
        {
          route: "/settings",
          label: "Settings",
          detail: "Profile and workspace members. Onboarding is deliberately low-tech: teammates create their own account from the sign-in page, because an invite-email flow would need mail delivery this product cannot assume.",
          src: "/projects/teamshare/settings.webp",
        },
      ],
    },
  ],

  engineering: [
    {
      heading: "Tests aimed where a bug would be a breach",
      body: "The agent's suite is deliberately concentrated on the two controls that matter rather than spread thinly for coverage. The path jail is tested with real attacks — relative traversal in both slash styles, POSIX absolute paths, a Windows drive path, a UNC network path, a NUL byte spliced into a filename, and a symlink planted inside the share pointing at a sibling secrets folder. The token layer is tested by forging: an expired token, one signed with the wrong key, one minted for a different device, one with a tampered payload re-attached to a valid signature, and a set of malformed shapes covering the classic alg-confusion inputs.",
      bullets: [
        "Opaque root indexes are fuzzed against the exact inputs Number() would silently coerce to zero.",
        "A live HTTP end-to-end test exercises the real server rather than mocking it.",
        "The symlink test skips itself cleanly on hosts where creating one is not permitted, instead of failing spuriously.",
      ],
    },
    {
      heading: "Details that only show up under adversarial reading",
      body: "Signature comparison is constant-time with an explicit length guard, because the underlying primitive throws on mismatched lengths and a naive call turns a forgery attempt into a crash. The path resolver documents its own contract — a null result means 403 and callers must never fall back to the raw input — because the dangerous version of this function is one that returns something usable on failure. The root index is resolved exactly once so a folder's path and its permission cannot be read from two different entries, which is the kind of mismatch that produces a working download from a view-only share.",
    },
    {
      heading: "Known limitation — the binaries are unsigned",
      body: "Neither the desktop app nor the agent installer is code-signed, so Windows SmartScreen warns on first run and some antivirus engines flag packaged Node executables. For internal use that is a documented annoyance; for anything client-facing it is unacceptable, and the fix is a signing certificate rather than a code change. The larger structural weakness is that the host PC is a single point of failure: it holds the database and every device token, and there is no replication.",
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "A Windows desktop product that gives a co-located team audited, permissioned file sharing with no cloud service, no internet, and no external accounts — installable by the people who use it. What I would defend hardest is the authorization design: making the link cryptographically self-proving is what let the whole system work offline, and treating the path jail as the real boundary is what makes sharing a folder on a personal machine defensible rather than reckless.",
    bullets: [
      "Offline-verifiable access links — HMAC-signed with a key the browser never sees.",
      "Two independent escape classes closed in the file layer, both covered by real attack tests.",
      "Installation engineered as a feature: firewall rule, autostart, and setup page, all reversible.",
      "Trust model and unsigned binaries documented as explicit limitations rather than left implicit.",
    ],
  },

  roadmap: [
    "Code-sign the app and the agent installer",
    "Per-user, per-device access lists to replace the trusted-team model",
    "Resumable transfers for large files over flaky WiFi",
    "Host database replication so the workspace survives one PC dying",
    "Stable opaque share ids so links tolerate folders being reordered",
    "A download-agent button in the dashboard to replace manual distribution",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

const aePromptBridge: CaseStudy = {
  slug: "ae-prompt-bridge",
  title: "AE Prompt Bridge",
  tagline:
    "Describe a motion graphic in a chat window and watch After Effects build it — no panel, no extension, no rebuild between attempts.",
  role: "Solo — the bridge, the generated-scripting approach, and the ad it was built to produce",
  timeline: "2026",
  status: "shipped",

  summary:
    "After Effects is scriptable, but the loop around that scripting is miserable: write ExtendScript, save, switch apps, navigate a menu, run the file, read a modal error, switch back. That friction is what stops motion designers from automating anything. AE Prompt Bridge closes the loop to a single save. A small watcher runs inside After Effects, polls one script file, and executes it the instant its timestamp changes — so an AI assistant writing that file from a chat window becomes, in effect, a live scripting console. I built it to produce a real deliverable: a vertical product ad whose comps, shape layers, type scale, and effects are all generated by script rather than placed by hand.",

  metrics: [
    { value: "1.5 s", label: "poll interval — worst-case latency from save to run" },
    { value: "671", label: "lines in the generated build script" },
    { value: "1", label: "undo step for the entire build" },
    { value: "2", label: "delivery paths — in-app watcher and CLI push" },
    { value: "7", label: "scenes generated, 1080×1920 at 30 fps" },
    { value: "0", label: "panels, extensions, or CEP scaffolding" },
  ],

  problem: {
    heading: "The problem",
    body: "Automating After Effects means writing ExtendScript, and ExtendScript is a language from another era hosted in an app that makes iteration expensive. Every attempt costs a save, an app switch, a menu dive, and a modal dialog — so a ten-attempt experiment is a hundred interactions of pure overhead.",
    bullets: [
      "The official path to a real tool is a CEP or UXP extension — a manifest, a panel, a build step, and a reload for every change.",
      "Motion designers who could describe what they want precisely in words mostly cannot write ExtendScript, so the automation never gets written.",
      "ExtendScript has no modern conveniences: no setTimeout, no filesystem watching, no module system, no debugger worth the name.",
      "A long generated build is destructive to iterate on — each run leaves duplicate comps and hundreds of undo entries behind.",
    ],
  },

  approach: [
    {
      heading: "Invert the trigger — let After Effects watch the file",
      body: "The instinct is to push a script into the app from outside. That means an external process has to know whether After Effects is running, which instance to target, and how to surface errors. Turning it around is far simpler: a watcher runs once per session inside the app and polls a single script path. Anything that can write a file — a chat assistant, an editor task, a shell one-liner — becomes a valid producer, and nothing outside needs to know After Effects exists. One save is the whole interaction.",
    },
    {
      heading: "Build the timer out of the one primitive the host provides",
      body: "ExtendScript has no setTimeout and no file-watching API. After Effects exposes exactly one recurring timer, app.scheduleTask, and it takes the callback as a string that is evaluated in global scope rather than as a function — so it cannot close over anything local. The watcher therefore hangs its state and its tick function off the host application object, which is the only place both the closure and the scheduled string can reach. It looks odd until you realise it is the only shape that works.",
    },
    {
      heading: "Make re-running safe, because it will happen constantly",
      body: "A watcher that fires on every save means the generated script runs dozens of times per session, so it cannot be additive. Comp creation looks up a comp by name and removes it before creating a new one, which makes each run replace its own output instead of stacking duplicates. The entire build is also wrapped in a single undo group, so a 671-line script that creates comps, shape layers, text, and effects collapses into one undoable step rather than hundreds.",
    },
    {
      heading: "Guard the edges that make a poller annoying",
      body: "Two details separate a watcher that helps from one that fights you. On startup it records the current timestamp without executing, so attaching it does not immediately re-run whatever happened to be on disk. And it cancels any previously scheduled task before scheduling a new one, so re-running the watcher does not stack duplicate timers each independently executing the file — which is exactly the failure that makes a naive version feel haunted.",
    },
    {
      heading: "Put the design system in the script, not in the layers",
      body: "The generated build opens with its own design system: a palette as normalized colour triples, a margin and column width, and a four-step type scale. Scenes are then composed from small helpers that add rounded rectangles, stroked rectangles, and ellipses. The point is that a prompt like make the headline smaller changes one constant and rebuilds every scene consistently — which is the actual argument for generating a project rather than building it by hand.",
    },
    {
      heading: "Two ways in, for two different situations",
      body: "The watcher covers the iterative case, where After Effects is already open and a script is being refined. A small PowerShell wrapper covers the other one, invoking the application binary with its run-script flag to push a file into a running instance on demand. Same script, same output, different trigger — useful when the run should be deliberate rather than automatic.",
    },
  ],

  flows: [
    {
      actor: "Setting up, once",
      steps: [
        { label: "Allow scripting", detail: "Enable scripts writing files and network access in After Effects preferences — a machine-level setting" },
        { label: "Attach the watcher", detail: "Run the watcher script once per session; it schedules its own recurring task" },
        { label: "Confirm", detail: "It records the current file timestamp without executing, then reports that it is watching" },
      ],
    },
    {
      actor: "Each iteration",
      steps: [
        { label: "Describe the change", detail: "Plain language in a chat window — a new scene, a different type scale, an effect on a layer" },
        { label: "Assistant writes the file", detail: "The single watched script is overwritten with the full ExtendScript build" },
        { label: "Watcher notices", detail: "Timestamp differs from the last one seen, within 1.5 seconds" },
        { label: "Script executes", detail: "Evaluated in place; comps are replaced rather than duplicated, inside one undo group" },
        { label: "Failures surface", detail: "A script error raises a dialog with the message; polling noise stays in the console" },
      ],
    },
  ],

  diagram: "bridge-loop",

  architectureNotes: [
    "Nothing outside After Effects needs to know whether it is running — the app polls, rather than being pushed to.",
    "app.scheduleTask evaluates its callback as a string in global scope, which is why state lives on the application object.",
    "The watched file is a single path that gets overwritten; there is no queue and no history by default.",
    "Effect application is wrapped in try/catch, because effect identifiers vary across After Effects versions and locales.",
    "Errors are raised as dialogs deliberately — a silent failure in a generated build is indistinguishable from a bad prompt.",
  ],

  decisions: [
    {
      decision: "Poll a file from inside the host instead of pushing scripts in",
      why: "It removes every question an external pusher has to answer — is the app open, which instance, how do errors get back. Any producer that can write a file works, which is what makes an AI assistant a first-class driver with no integration at all.",
      tradeoff: "Polling sets a floor on latency and leaves a background task running for the session. It also has a real race: a save caught mid-write executes a truncated script. A filesystem event or an atomic write-then-rename would close that, and neither is available in ExtendScript.",
    },
    {
      decision: "Hang watcher state off the host application object",
      why: "The only recurring timer takes its callback as a string evaluated globally, so a normal closure is unreachable from it. The application object is the one namespace both sides can see.",
      tradeoff: "It writes into a global on someone else's application object, so two tools choosing the same key would silently clobber each other. Acceptable for a single-purpose personal tool, not for something distributed.",
    },
    {
      decision: "Delete and recreate comps by name on every run",
      why: "The script re-runs on every save, so it has to be idempotent or the project fills with duplicates within minutes. Replacing by name makes each run produce exactly one copy of its output.",
      tradeoff: "Any manual tweak made to a generated comp between runs is destroyed by the next save. That is a real cost, and it forces a discipline: the script is the source of truth and the project file is disposable output. Fine for a build I own, wrong for a project a client edits.",
    },
    {
      decision: "Wrap the whole build in a single undo group",
      why: "Hundreds of scripted operations would otherwise produce hundreds of undo entries, making a bad run tedious to back out and burying the previous state.",
      tradeoff: "If the build throws halfway, the half-finished result sits inside one undo entry with no partial rollback — you undo everything or keep a broken project. Given the script is regenerated anyway, that is the cheaper failure.",
    },
    {
      decision: "Generate the project rather than build a reusable template",
      why: "A template locks in structure and still needs hand-work per variant. A script holds the design system as constants, so one changed value re-derives every scene identically, and a new scene is a function rather than a manual duplication.",
      tradeoff: "The generated project cannot be meaningfully hand-edited afterwards without diverging from its source, and the fluency required moves from After Effects to code. That trade only pays when the same build gets iterated many times.",
    },
  ],

  stack: [
    {
      layer: "In-app",
      items: ["ExtendScript (ES3)", "After Effects scripting API", "app.scheduleTask", "$.evalFile", "File object mtime polling"],
    },
    {
      layer: "Generated output",
      items: ["Programmatic comps", "shape layers via vector property groups", "text layers", "4-colour gradient", "glow", "drop shadow", "single undo group"],
    },
    {
      layer: "Bridge",
      items: ["PowerShell wrapper", "AfterFX run-script flag", "file-overwrite as the transport"],
    },
    {
      layer: "Authoring",
      items: ["VS Code", "Claude", "plain-language prompts", "Markdown build plans checked in beside the script"],
    },
  ],

  engineering: [
    {
      heading: "Working inside a hostile runtime",
      body: "ExtendScript is ES3 with no modern standard library, one-indexed collections, and no real debugger, hosted in an app whose error reporting is a modal dialog. The code accounts for that rather than fighting it: effect application is wrapped in try/catch because effect identifiers differ between versions and localised installs, script errors are raised as dialogs so a failure is impossible to miss, and routine polling output goes to the console so it does not interrupt work. Every one of those choices exists because the alternative failed silently at least once.",
    },
    {
      heading: "Known limitation — the paths are hardcoded, and currently wrong",
      body: "The watcher has an absolute watch path baked in, and it still points at the drive the project used to live on. As it stands the watcher attaches, reports success, and then silently never fires, because it is polling a path that no longer exists. The application binary is hardcoded in the PowerShell wrapper too. Both should be resolved relative to the script's own location — the watcher can derive its folder from its own file, which would make the whole thing portable and remove the only failure mode that produces no error at all.",
      bullets: [
        "Resolve the watched path from the watcher's own location instead of a literal.",
        "Fail loudly when the watched file is missing, rather than treating absence as nothing-to-do.",
        "Write to a temporary file and rename into place, so a partial write can never be executed.",
      ],
    },
    {
      heading: "What it is and is not",
      body: "This is a personal power tool, not a product: no tests, no packaging, no versioning of generated scripts beyond overwriting one file, and a build plan kept as Markdown beside the code rather than anything executable. That is the right scope for something whose job is to collapse an iteration loop for one operator — but it is worth being explicit that the engineering rigour lives in the generated output and the watcher's edge cases, not in the tooling around them.",
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "A save-to-run loop for After Effects that needs no extension, no panel, and no build step, and a real vertical ad generated through it — comps, shape layers, type scale, gradients, and glows all produced by script from a design system defined in code. The idea I would defend is the inversion: letting the host application poll a file turns any text producer into an automation driver, which is what made describing a motion graphic in prose a working workflow rather than a demo.",
    bullets: [
      "Closed the iteration loop from save-switch-navigate-run down to a single save.",
      "Built a recurring watcher from the one timer primitive the host exposes, with duplicate-timer and first-run guards.",
      "Made a long generated build safe to re-run continuously: idempotent comps, one undo step.",
      "Design system as constants, so a one-word prompt re-derives every scene consistently.",
    ],
  },

  roadmap: [
    "Resolve all paths relative to the script instead of hardcoding drives",
    "Atomic write-then-rename so a partial file can never execute",
    "Keep a timestamped history of generated scripts instead of overwriting one file",
    "Surface a compact run log in the app rather than only dialogs on error",
    "A prompt library for the operations that get asked for repeatedly",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

const figmaToAe: CaseStudy = {
  slug: "figma-to-after-effects",
  title: "Figma to After Effects",
  tagline:
    "A Figma plugin that rebuilds a design as native After Effects layers — including pen-tool paths, with the Bézier maths done properly.",
  role: "Solo — plugin, SVG path parser, ExtendScript code generator",
  timeline: "2026",
  status: "shipped",
  links: {
    github: "https://github.com/ElevenCraftStudio-Saas/figma-to-after-effect",
  },

  summary:
    "Animating a Figma design in After Effects normally means rebuilding it by hand, shape by shape, because there is no path between the two applications. This plugin reads the selected frames, walks the node tree, and emits an ExtendScript file that reconstructs the design as native After Effects shape and text layers — not a flattened image. The part that took the real work is vector geometry: Figma hands you SVG path strings, After Effects wants vertices with in and out tangents, and getting from one to the other means a full path parser plus the correct handling of an affine transform across points and direction vectors. Zero dependencies, no build step, no network access, MIT.",

  metrics: [
    { value: "0", label: "dependencies and no build step — one file" },
    { value: "0", label: "network access, declared in the manifest" },
    { value: "18", label: "SVG path commands handled, absolute and relative" },
    { value: "cubic", label: "Bézier tangents, with quadratics converted up" },
    { value: "MIT", label: "open source, public repository" },
    { value: "1-click", label: "select frames, download, run in After Effects" },
  ],

  problem: {
    heading: "The problem",
    body: "Design happens in Figma and motion happens in After Effects, and nothing connects them. The usual options are to export a flat PNG, which cannot be animated in parts, or to rebuild the layout by hand, which is hours of work that has to be redone every time the design changes.",
    bullets: [
      "A flattened export kills the thing you needed — individually animatable layers.",
      "Manual reconstruction is slow, error-prone on exact values, and thrown away on the next design revision.",
      "Pen-tool vectors are the worst case: Figma describes them as SVG path strings, which After Effects has no way to consume.",
      "The two applications disagree on almost every convention — rotation sign, shadow representation, how a layer's transform relates to its geometry.",
    ],
  },

  approach: [
    {
      heading: "Generate a script, because there is no live channel to open",
      body: "A Figma plugin runs in a sandbox with no filesystem and no network, and After Effects has nothing listening. There is no connection to build, so the plugin emits an ExtendScript file the user downloads and runs. That constraint turns out to be a feature: the generated script is plain text you can read before executing, it can be committed or shared, and it re-runs deterministically. The manifest declares no allowed domains at all, so nothing about a design can leave the machine.",
    },
    {
      heading: "Parse SVG paths properly rather than approximating curves",
      body: "Figma exposes vectors as SVG path data. The parser tokenises the string and walks it as a state machine covering moveto, lineto, horizontal and vertical lineto, cubic and quadratic curves, both smooth variants, and close — each in absolute and relative form. It tracks the previous control point so the smooth commands can reflect it correctly, and it honours the spec detail that coordinate pairs following a moveto are implicit linetos. Quadratic segments are promoted to cubics because After Effects shape paths only express cubic tangents. Elliptical arcs are the one command left out, since Figma emits cubics in practice.",
    },
    {
      heading: "Transform points and tangents differently — because they are different things",
      body: "Every vertex has to move from Figma's node space into composition space using the node's absolute transform. The subtlety is that vertices are positions and tangents are directions: applying the full affine matrix to a tangent would add the translation component and skew every curve away from its anchor. So points get the complete matrix including translation, and tangents get only its linear part. It is two nearly identical functions differing by one term, and getting it wrong produces curves that look plausible until you inspect them.",
    },
    {
      heading: "Bake geometry into composition space",
      body: "Rather than trying to reproduce Figma's nested transform stack inside After Effects' anchor, position, rotation, and scale model, the generated script stamps already-transformed geometry directly and leaves each layer sitting at the origin with a zero anchor. The import is then exact by construction — no accumulated rounding through a translation chain, and no attempt to invert a transform hierarchy that has no clean equivalent on the other side.",
    },
    {
      heading: "Translate every convention that disagrees",
      body: "The two applications differ in small ways that each produce a visibly wrong result. Rotation runs the opposite direction, so the value is negated on the way out. Figma describes a drop shadow as a cartesian offset while After Effects wants a polar direction and distance, so the offset is converted to an angle and a magnitude. Colours move from Figma's zero-to-one channels into the forms each After Effects property expects, with opacity scaled to percentages. Corner radius is applied inside a try/catch, because that property is not reliably present across versions.",
    },
    {
      heading: "One file, no toolchain",
      body: "The whole plugin is a single script with no dependencies and no build step, which means it installs from source in three clicks and can be read end to end before anyone trusts it with their work. For a tool that runs inside a designer's Figma and then executes generated code in their After Effects, being auditable matters more than being architecturally impressive.",
    },
  ],

  flows: [
    {
      actor: "Using it",
      steps: [
        { label: "Select", detail: "One or more frames or objects on the Figma canvas" },
        { label: "Configure", detail: "Composition name, frame rate, duration, and a scale factor" },
        { label: "Generate", detail: "The node tree is walked and serialised, then an ExtendScript file is emitted" },
        { label: "Download", detail: "A plain .jsx file — inspectable before it runs" },
        { label: "Run in After Effects", detail: "Run Script File; the design appears as a new composition of native layers" },
      ],
    },
    {
      actor: "What each node becomes",
      steps: [
        { label: "Rectangle", detail: "Shape layer with a rect path, size and roundness set from the node" },
        { label: "Ellipse", detail: "Shape layer with an ellipse path at the node's dimensions" },
        { label: "Vector / pen path", detail: "SVG data parsed to vertices plus in and out tangents, stamped as a shape path" },
        { label: "Text", detail: "Text layer carrying font family, size, alignment, and letter spacing" },
        { label: "Fills and strokes", detail: "Colour, opacity, and stroke weight mapped onto vector paint properties" },
        { label: "Effects", detail: "Drop shadow converted to polar form; blur mapped from its radius" },
      ],
    },
  ],

  architecture: `  ┌──────────── Figma (sandboxed plugin) ─────────────┐
  │  ui.html          settings: name, fps, dur, scale │
  │      │ postMessage                                │
  │      ▼                                            │
  │  code.js                                          │
  │   selection ─► serializeNode (async, per node)    │
  │                  ├─ extractFills / Strokes        │
  │                  ├─ extractEffects                │
  │                  ├─ extractLetterSpacing          │
  │                  └─ extractPaths                  │
  │                       ├─ svgToSubpaths (parser)   │
  │                       ├─ applyT     → vertices    │
  │                       └─ applyTVec  → tangents    │
  │   scaleTree ─► generateJSX ─► download .jsx       │
  └───────────────────────┬───────────────────────────┘
                          │  a file, carried by hand
                          ▼
  ┌──────────── After Effects (ExtendScript) ─────────┐
  │  addComp ─► shape / text layers ─► paint ─► FX    │
  └───────────────────────────────────────────────────┘`,

  architectureNotes: [
    "The manifest declares no allowed domains, so a design cannot leave the machine even in principle.",
    "Node serialisation is async because reading a dynamic-page document in Figma requires awaiting node access.",
    "The scale factor is applied to the tree before code generation, so one setting rescales geometry, type, and effects together.",
    "The generated file is the only artefact crossing between applications — inspectable, committable, and deterministic to re-run.",
    "Vertices carry the full affine transform; tangents carry only its linear part, since a direction must not be translated.",
  ],

  decisions: [
    {
      decision: "Emit a downloadable script instead of building a live integration",
      why: "A Figma plugin has no filesystem and this one declares no network, and After Effects exposes nothing to connect to. A generated file is the only honest transport — and it makes the output readable before execution, which matters when the thing being handed over is code that will run in someone's editor.",
      tradeoff: "There is no return channel. After Effects cannot report which layer failed, so a partial or wrong import has to be diagnosed by looking at the result rather than reading an error. A round-trip would need a local helper process, which would mean giving up the no-network guarantee that makes the plugin easy to trust.",
    },
    {
      decision: "Bake absolute transforms into geometry and leave layer transforms at the origin",
      why: "Figma's nested transform stack has no clean equivalent in After Effects' anchor and position model. Stamping composition-space geometry is exact by construction and avoids inverting a hierarchy that does not map.",
      tradeoff: "Layers arrive with degenerate transforms — a zero anchor and no meaningful position — which is awkward precisely because the next thing a motion designer does is animate those properties. They have to re-establish anchor points first. That is a real cost paid for a faithful import, and it is the first thing I would revisit.",
    },
    {
      decision: "Promote quadratic curves to cubic rather than skipping them",
      why: "After Effects shape paths only express cubic tangents. Ignoring quadratics would silently drop segments from real designs; converting them is exact, since every quadratic has an equivalent cubic.",
      tradeoff: "The output has more control points than the source, so a designer inspecting the resulting path sees a slightly denser curve than they drew, even though the shape is identical.",
    },
    {
      decision: "Leave elliptical arcs unimplemented",
      why: "Figma's vector export produces cubic segments in practice, so arc support would be code covering a case the upstream tool does not emit.",
      tradeoff: "Hand-authored SVG pasted into Figma could carry arcs, and those subpaths would come through wrong rather than failing loudly. A parser that rejected unknown commands explicitly would be safer than one that quietly skips them.",
    },
    {
      decision: "Ship one dependency-free file with no build step",
      why: "It installs from source in three clicks, has no supply chain, and can be read end to end by anyone deciding whether to run its output in their own After Effects.",
      tradeoff: "No TypeScript, no tests, and a single file holding the parser, the serialiser, and the code generator together. For a parser with this many branches, tests are the thing most obviously missing — the path grammar is pure input-to-output and would be straightforward to cover.",
    },
  ],

  stack: [
    {
      layer: "Plugin",
      items: ["Figma Plugin API 1.0", "plain JavaScript", "no build step", "no dependencies", "dynamic-page document access"],
    },
    {
      layer: "Geometry",
      items: ["SVG path tokeniser", "state-machine parser", "cubic Bézier tangents", "quadratic promotion", "affine transform of points and vectors"],
    },
    {
      layer: "Generated output",
      items: ["ExtendScript", "shape layers", "text layers with TextDocument", "vector fill and stroke", "drop shadow", "fast blur"],
    },
    {
      layer: "Distribution",
      items: ["MIT licence", "public GitHub repository", "import from manifest", "contributing guide"],
    },
  ],

  engineering: [
    {
      heading: "Where the correctness actually lives",
      body: "Almost all the risk in this tool sits in two places. The path parser has to implement enough of the SVG grammar to be trustworthy — relative and absolute forms of every command, control-point reflection for the smooth variants, implicit linetos after a moveto, and correct subpath and close handling. The transform layer has to distinguish positions from directions. Neither of those failures is loud: a subtly wrong tangent produces a curve that looks almost right, which is worse than a crash because it ships.",
      bullets: [
        "Property writes that vary across After Effects versions are wrapped so one missing property cannot abort an import.",
        "Every extractor tolerates absent values — a node with no fill, no stroke, or no effects has to pass through cleanly.",
        "Generated file names are sanitised, since they come from user-controlled layer names.",
      ],
    },
    {
      heading: "Known gaps, stated in the README",
      body: "Gradients, images, auto layout, masks, blend modes, and animation keyframes are all unsupported and documented as such in a support table rather than left for a user to discover. That matters for a tool with a one-click promise: the honest version of one click is one click for the subset that works, listed plainly, instead of a partial import that quietly loses half a design.",
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "A published, MIT-licensed Figma plugin that turns a selection into a native After Effects composition — shapes, pen paths, text, paint, and effects — with no dependencies, no build step, and no network access. The work I would defend is the vector path: a real SVG parser rather than an approximation, and the affine transform applied correctly across points and tangents, which is a one-term difference that decides whether every curve in the output is right.",
    bullets: [
      "Full SVG path grammar minus arcs, with correct reflection and implicit-command handling.",
      "Quadratic-to-cubic promotion, because the target only expresses cubic tangents.",
      "Convention mismatches translated explicitly: rotation sign, cartesian shadow offset to polar, colour and opacity ranges.",
      "Unsupported features published as a table instead of discovered as bugs.",
    ],
  },

  roadmap: [
    "Gradient fills, linear and radial",
    "Image layer export",
    "Font fallback when After Effects lacks the Figma font",
    "Animation keyframe support",
    "Masks and blend modes",
    "A test suite over the path grammar, which is pure input-to-output",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

const nur: CaseStudy = {
  slug: "nur",
  title: "Nur — Plant Nursery App",
  tagline:
    "A Flutter catalogue app whose real feature is the admin pipeline — pick a photo, upload it, and the shop has new stock without a developer.",
  role: "Solo — Flutter app, Firebase integration, admin content pipeline",
  timeline: "2025",
  status: "shipped",

  summary:
    "A plant nursery's stock lived in camera-roll photos and chat messages, which meant no browsable catalogue and no way to add a plant without someone who could code. Nur is a Flutter app with accounts, a catalogue, detail pages, and a cart — but the part that actually solved the problem is the admin screen: pick an image from the device, it uploads to Cloud Storage, and the plant record lands in Firestore, so the shop owner adds stock themselves. This was also the project where I learned this stack, and it shows in specific places I can name — authorization is a client-side check rather than a rule, and the catalogue ended up with two parallel data sources. Both are written up below rather than papered over.",

  metrics: [
    { value: "18", label: "Dart source files across screens, models, components" },
    { value: "4", label: "Firebase services — Auth, Firestore, Storage, Core" },
    { value: "13 MB", label: "bundled images, one of them 7 MB on its own" },
    { value: "6", label: "named routes registered on the app" },
    { value: "2", label: "parallel catalogue sources, which is one too many" },
    { value: "0", label: "lines of checkout — the cart is a UI, not a transaction" },
  ],

  problem: {
    heading: "The problem",
    body: "The nursery had stock and customers but nothing in between. Inventory was photographs on a phone, and enquiries arrived as messages, so every question about what is available and what it costs was answered by hand.",
    bullets: [
      "No browsable catalogue — a customer could not see the range without asking.",
      "No way for the owner to add or change stock without a developer editing code and shipping a build.",
      "Prices and availability lived in someone's memory rather than in a system.",
      "Plant photos are the entire product presentation, so image handling could not be an afterthought.",
    ],
  },

  approach: [
    {
      heading: "Make the admin screen the actual product",
      body: "The browsable catalogue is the visible half, but a catalogue nobody can update is a brochure. So the admin screen is a genuine content pipeline rather than a form: it opens the device image picker, requests the permission that needs, uploads the chosen file to Cloud Storage under a nursery prefix, and writes the plant document — name, price, type, and the resulting image reference — into Firestore. That single flow is what removes the developer from the loop, and it is the piece I would keep if I rebuilt everything else.",
    },
    {
      heading: "Let Firebase carry the parts I would otherwise get wrong",
      body: "Accounts are Firebase Auth with email and password, the catalogue is Firestore, and images are Cloud Storage. For a first build on this stack that division was the right call — none of authentication, a hosted document store, or resumable image upload is something worth hand-rolling to learn, and each one arrives with an SDK that works on both platforms.",
    },
    {
      heading: "Route the admin by identity, not by a build flag",
      body: "Rather than hardcoding who the administrator is, the app reads an admin document from Firestore at sign-in and compares the signed-in user's email against it. The intent was that the owner could change hands without shipping a new build. It is the right instinct — configuration in data rather than in code — implemented at the wrong layer, which is the subject of the trade-off below.",
    },
    {
      heading: "Ship a seeded catalogue so the app is never empty",
      body: "A brand-new install pointing at an empty Firestore collection looks broken. So the app carries a small seed catalogue of plants with bundled images, which gives the home screen something to show on first run and made the UI developable before any backend content existed. That decision solved a real problem and created a different one, since it left the app reading from two places at once.",
    },
  ],

  flows: [
    {
      actor: "Customer",
      steps: [
        { label: "Sign up or sign in", detail: "Email and password through Firebase Auth" },
        { label: "Browse", detail: "Catalogue of plants by indoor and outdoor type, with price and rating" },
        { label: "Open a plant", detail: "Detail page with the image, price, and care metrics" },
        { label: "Add to cart", detail: "Cart screen totals the line items — presentation only, no checkout behind it" },
      ],
    },
    {
      actor: "Nursery owner",
      steps: [
        { label: "Sign in", detail: "Same login; the app compares the email against an admin record in Firestore" },
        { label: "Land on the admin screen", detail: "Existing plants listed from Firestore, ordered by name" },
        { label: "Pick a photo", detail: "Device image picker, behind a runtime permission request" },
        { label: "Upload", detail: "Image written to Cloud Storage, then the plant document added to Firestore" },
        { label: "Stock is live", detail: "No build, no developer, no code change" },
      ],
    },
  ],

  architecture: `  ┌──────────────── Flutter app ────────────────┐
  │  LoginScreen ─┬─ email matches admin record? │
  │               │        yes ──► AdminScreen   │
  │               └────────  no ──► MainScreen   │
  │                                              │
  │  MainScreen ─► HomeScreen ─► PlantDetails    │
  │                    │            (seed data)  │
  │                    └─► CartScreen            │
  │                                              │
  │  AdminScreen ─► PlantDetailScreen            │
  │                    (Firestore data)          │
  └───────┬───────────────────────┬──────────────┘
          │                       │
   ┌──────▼──────┐        ┌───────▼────────┐
   │ Firebase    │        │ Cloud Storage  │
   │ Auth        │        │ Nursery/*.jpg  │
   │ Firestore   │        └────────────────┘
   │  plants     │
   │  Admin      │
   └─────────────┘

  Bundled assets ──► seed catalogue (images/)`,

  architectureNotes: [
    "Two catalogue sources: bundled seed plants for the home screen, Firestore documents for admin-managed stock.",
    "That split is why there are two detail screens — one takes a seed model, the other takes a Firestore document id.",
    "The admin decision is made during navigation, so it protects the route rather than the data.",
    "Web builds carry an inline Firebase config; native builds read the platform config files.",
    "The cart is an in-memory list held in a module-level variable, so it is not per-user and does not survive a restart.",
  ],

  decisions: [
    {
      decision: "Read the administrator's identity from Firestore instead of hardcoding it",
      why: "Putting the answer in data rather than in the binary means the nursery can change who administers the shop without a new release, which is the correct shape for a detail that belongs to the business rather than to the code.",
      tradeoff: "It is enforced in the wrong place. The comparison happens in the app during navigation, so it guards which screen opens — not what the database will accept. Every admin route is registered on the app, and the writes behind that screen are ordinary client calls, so the only thing actually standing between a signed-in user and the plants collection is Firestore rules, and those live in the console rather than in this repository. The honest fix is a custom claim or a rules check keyed on the user, with the screen check demoted to a convenience.",
    },
    {
      decision: "Bundle a seed catalogue with the app",
      why: "It gives a fresh install something to render, and it let the entire browsing UI be built before any content pipeline existed — which is genuinely useful early on.",
      tradeoff: "It left the app reading from two sources that never converge, and that duplication propagated into the UI as a second detail screen taking a different model. It also put every seed image inside the binary. The right version seeds the Firestore collection once from a script and keeps exactly one read path.",
    },
    {
      decision: "Keep the cart in memory rather than in Firestore",
      why: "Nothing downstream consumed it. With no checkout, no payment, and no order record, persisting a cart would have been storage without a purpose.",
      tradeoff: "The consequence is that the cart is a demonstration rather than a feature — it is not tied to the signed-in user and it empties on restart. It should either become a real per-user document alongside an order flow, or be presented plainly as UI work rather than commerce.",
    },
  ],

  stack: [
    {
      layer: "App",
      items: ["Flutter", "Dart 3", "Material", "named routes", "google_fonts", "font_awesome_flutter"],
    },
    {
      layer: "Backend",
      items: ["Firebase Auth (email/password)", "Cloud Firestore", "Cloud Storage", "firebase_core"],
    },
    {
      layer: "Device",
      items: ["image_picker", "permission_handler", "device_info_plus"],
    },
    {
      layer: "Targets",
      items: ["Android", "iOS", "web (inline Firebase config)"],
    },
  ],

  engineering: [
    {
      heading: "What I would fix first, in order",
      body: "This was a learning project and the useful thing to do with it is be specific about what learning it produced. The authorization model is the top of the list: a navigation check is not a security boundary, and the fix is to move the decision into Firestore rules keyed on the user with the client check kept only to choose which screen to show. Second is collapsing the two catalogue sources into one, which also removes the duplicated detail screen. Third is the assets — the bundled images total around 13 MB with a single 7 MB photograph among them, all shipped inside the app for a catalogue that is meant to be served from Storage anyway.",
      bullets: [
        "Enforce the admin rule server-side; treat the client check as convenience only.",
        "Seed Firestore once from a script and delete the bundled catalogue path entirely.",
        "Resize and re-encode the images, or drop them and read every photo from Storage.",
        "Remove the unreferenced duplicate admin file left behind at the project root.",
      ],
    },
    {
      heading: "On the Firebase configuration in source",
      body: "The web build carries its Firebase configuration inline, including the API key. That one is worth stating precisely rather than dramatically: a Firebase web API key is a public project identifier, not a secret, and Google documents it as safe to ship in client code. What actually protects the data is the Firestore and Storage rules — which is the same gap as above, and the reason the authorization point matters more here than the visible key does.",
    },
    {
      heading: "Scope, stated plainly",
      body: "There is no checkout, no payment integration, no order record, and no delivery tracking anywhere in this codebase. The cart totals line items and stops. I would rather say that than let a reader infer a commerce backend that does not exist — the app is a catalogue with a working content pipeline, and that is a smaller but true claim.",
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "A Flutter app that gave the nursery a browsable catalogue and, more importantly, gave its owner a way to add stock without a developer — image picked on the device, uploaded to Cloud Storage, record written to Firestore. It is also the clearest before-and-after in my own work: everything I would now do differently here is something this project taught me, and I can point at the specific line where each lesson lives.",
    bullets: [
      "A real content pipeline — device image picker to Cloud Storage to Firestore — that removed the developer from routine updates.",
      "Admin identity kept in data rather than compiled in, which was the right instinct at the wrong layer.",
      "Cross-platform Firebase integration covering Android, iOS, and web.",
      "An honest account of the authorization gap and the split data model, rather than a feature list.",
    ],
  },

  roadmap: [
    "Move the admin rule into Firestore rules and custom claims",
    "One catalogue source, seeded by script, and one detail screen",
    "Compress the images or serve them all from Storage",
    "A real order flow — per-user cart document, order records, status",
    "Search and filtering across the catalogue",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

const whatsForDinner: CaseStudy = {
  slug: "whats-for-dinner",
  title: "What's For Dinner — AI Meal Planner",
  tagline:
    "Photograph your shelf, get a meal you can actually cook — then find restaurants whose reviewers mention that dish by name.",
  role: "Solo — Flutter app, LLM integration, on-device vision, Places ranking heuristic",
  timeline: "2025 — built for the Quadrabay hackathon",
  status: "shipped",
  links: {
    github: "https://github.com/Blackcommando5/Whats-for-Dinner",
  },

  summary:
    "The daily question is not what would I like to eat, it is what can I make with what is already in the kitchen. This app starts from the pantry: type ingredients or photograph the shelf and let on-device image labelling name them, then ask an LLM for a meal built from exactly those items. The idea I still like is what happens after the suggestion — instead of dropping a generic map of nearby shops, it queries Places for restaurants around you, reads their reviews, and ranks them by how often the suggested dish is actually mentioned in positive ones. Reviews become a proxy for whether a place genuinely does that dish.",

  metrics: [
    { value: "Claude 3", label: "Sonnet via OpenRouter for meal suggestions" },
    { value: "on-device", label: "ML Kit image labelling, no image leaves the phone" },
    { value: "≥ 0.7", label: "confidence floor for accepting a detected ingredient" },
    { value: "10 km", label: "Places search radius for nearby restaurants" },
    { value: "≥ 4★", label: "only positive reviews count toward the dish score" },
    { value: "9", label: "screens across pantry, groceries, planner and discovery" },
  ],

  problem: {
    heading: "The problem",
    body: "Deciding dinner is a search problem with the constraints back to front. Recipe apps start from a dish and hand you a shopping list; the actual question starts from a shelf of half-used ingredients and asks what comes out of it.",
    bullets: [
      "Planning from recipes rather than from stock is what produces both over-buying and food waste.",
      "Typing an entire pantry into an app is enough friction that nobody does it twice.",
      "Once you know what you want to eat, deciding whether to cook it or go out is a second, unsupported decision.",
      "A list of nearby restaurants does not tell you which of them is actually good at the specific dish you want.",
    ],
  },

  approach: [
    {
      heading: "Start from the pantry, not the recipe",
      body: "The pantry is the app's primary object. Ingredients go in with a quantity and a unit, and the meal suggestion is generated from that list rather than from a catalogue of recipes — so the answer is always something makeable right now. It inverts the usual flow, which is the entire reason the app exists.",
    },
    {
      heading: "Let the camera do the data entry",
      body: "Typing a pantry is the step that kills adoption, so the pantry screen has a camera in its header. A photograph runs through on-device image labelling and any label confident enough becomes a candidate ingredient. Running it on-device matters twice over: photographs of someone's kitchen never leave the phone, and it works with no connection. The confidence floor is deliberately high — a wrong ingredient corrupts the suggestion that follows, so silence is better than a guess.",
    },
    {
      heading: "Rank restaurants by what reviewers actually say",
      body: "This is the part I would show first. Having produced a dish, the app finds restaurants within ten kilometres, then for each one pulls its reviews and counts how many times the dish appears in reviews rated four stars or better, using that count to order the results. It is a cheap, surprisingly effective proxy: a place with six happy reviews mentioning the dish by name is a better bet for that dish than a higher-rated place nobody mentions it at. Ratings tell you whether a restaurant is good; review text tells you whether it is good at this.",
    },
    {
      heading: "Read the recipe out loud",
      body: "Cooking is the one context where a screen is genuinely the wrong interface — hands are wet, occupied, or covered in flour. The suggestion can be spoken through text to speech, which is a small feature that fits the moment of use better than anything visual would.",
    },
    {
      heading: "Hand navigation off rather than embedding a map",
      body: "Choosing a restaurant ends in walking or driving there, and no in-app map competes with the real Maps app for that. So the app deep-links out with the destination rather than embedding a map view — less surface to build, and the user lands in the tool that already has their traffic, saved places, and preferred transport mode.",
    },
  ],

  flows: [
    {
      actor: "Deciding what to cook",
      steps: [
        { label: "Stock the pantry", detail: "Type an ingredient with quantity and unit, or photograph the shelf" },
        { label: "Labels become ingredients", detail: "On-device labelling proposes items above the confidence floor" },
        { label: "Ask for a meal", detail: "The pantry list is sent to Claude 3 Sonnet through OpenRouter" },
        { label: "Listen or read", detail: "The suggestion renders on screen and can be spoken aloud" },
        { label: "Keep it", detail: "Suggestions are saved to a history screen so a good one is not lost" },
      ],
    },
    {
      actor: "Deciding to eat out instead",
      steps: [
        { label: "Locate", detail: "Full permission ladder — service enabled, permission checked, then requested" },
        { label: "Find restaurants", detail: "Places nearby search within a 10 km radius" },
        { label: "Read the reviews", detail: "Each result's reviews are fetched and scanned for the dish" },
        { label: "Score and sort", detail: "One point per mention in a review rated four stars or higher" },
        { label: "Go", detail: "Deep-link out to the Maps app for directions" },
      ],
    },
  ],

  architecture: `  ┌──────────────── Flutter app ─────────────────┐
  │  Pantry ──┬─ typed entry                     │
  │           └─ camera ─► ML Kit labeller       │
  │                        (on-device, ≥0.7)     │
  │             │                                │
  │             ▼                                │
  │  Meal suggestion ──► OpenRouter              │
  │             │         claude-3-sonnet        │
  │             ├──► flutter_tts (read aloud)    │
  │             └──► history                     │
  │             │                                │
  │             ▼                                │
  │  Nearby ─► Places nearbysearch (10 km)       │
  │             └─ per result: place details     │
  │                 └─ count dish mentions in    │
  │                    reviews rated ≥ 4★        │
  │                     └─ sort ─► launchUrl     │
  │                                 (Maps app)   │
  └──────────────────────┬───────────────────────┘
                         ▼
            Firebase Auth · Firestore · Storage`,

  architectureNotes: [
    "Image labelling runs entirely on the device — kitchen photographs are never uploaded.",
    "The dish score only counts reviews rated four stars or higher, so complaints cannot promote a restaurant.",
    "Nearby discovery costs one search call plus one details call per result, which is the main thing I would restructure.",
    "Navigation is delegated to the Maps app rather than rendered in-app.",
    "Two different configuration mechanisms are in play — a compile-time constant for the LLM key and dotenv for the Places key.",
  ],

  decisions: [
    {
      decision: "Score restaurants by dish mentions in positive reviews",
      why: "A star rating answers whether a restaurant is good in general, which is not the question. Counting how often the specific dish appears in reviews people left happy is a far closer proxy for whether that dish is worth ordering there, and it needs no dataset beyond what Places already returns.",
      tradeoff: "It is a text heuristic wearing a ranking's clothes. Matching is substring-based rather than word-boundary — despite a comment claiming otherwise — so short dish names produce false positives, and a place with many reviews outscores an equally good place with few. Popularity is not the same as suitability, and the score does not normalise for review volume.",
    },
    {
      decision: "Fetch reviews for every nearby result",
      why: "The score cannot be computed from the nearby search response, which does not include review text. Getting it required a details call per candidate, and for a hackathon build correctness of the idea mattered more than the call count.",
      tradeoff: "It is a classic N+1 against a metered API: one search plus one request per result, all sequential, all billable, on every single search. It is slow enough to feel and expensive enough to matter beyond a demo. The right shape is to score a handful of top candidates lazily, cache by place id, and parallelise what remains.",
    },
    {
      decision: "Run ingredient recognition on-device",
      why: "The input is a photograph of someone's kitchen. Keeping it local means the most personal data the app touches never leaves the phone, and recognition still works with no connection — which is exactly when someone is stood in front of their own cupboard.",
      tradeoff: "A generic on-device labeller is far weaker than a hosted vision model at telling one vegetable from another, so the confidence floor has to be high and much of a photograph is discarded. The feature is a shortcut for obvious items, not a replacement for typing.",
    },
    {
      decision: "Set the confidence floor above the labeller's own threshold",
      why: "Everything downstream is built on the ingredient list, so a hallucinated ingredient does not degrade the result, it invalidates it. Rejecting uncertain labels costs a little typing; accepting them costs the whole suggestion.",
      tradeoff: "Two thresholds now exist in one path — the labeller is configured with one and the results are filtered by a stricter one — which makes the effective behaviour non-obvious to read. One of them should own the decision.",
    },
  ],

  stack: [
    {
      layer: "App",
      items: ["Flutter", "Dart 3", "Material", "marquee", "flutter_launcher_icons"],
    },
    {
      layer: "AI",
      items: ["OpenRouter", "anthropic/claude-3-sonnet", "500-token cap", "pantry-conditioned prompt"],
    },
    {
      layer: "On-device ML",
      items: ["google_mlkit_image_labeling", "image_picker", "image", "confidence gating"],
    },
    {
      layer: "Location",
      items: ["Places nearby search", "Places details for reviews", "geolocator", "url_launcher deep links"],
    },
    {
      layer: "Backend",
      items: ["Firebase Auth", "Cloud Firestore", "Cloud Storage"],
    },
    {
      layer: "Device",
      items: ["flutter_tts", "permission_handler", "flutter_dotenv"],
    },
  ],

  screens: [
    {
      group: "Accounts",
      access: "public",
      shots: [
        {
          route: "screens/login_screen.dart",
          label: "Sign in",
          detail: "Firebase email and password, with a password reset path.",
          aspect: "portrait",
          src: "/projects/whats-for-dinner/shot-2.webp",
        },
        {
          route: "screens/register_screen.dart",
          label: "Create account",
          detail: "Registration with confirmation and a stated minimum password length.",
          aspect: "portrait",
          src: "/projects/whats-for-dinner/shot-1.webp",
        },
      ],
    },
    {
      group: "Kitchen",
      access: "authenticated",
      shots: [
        {
          route: "screens/home_screen.dart",
          label: "Home",
          detail: "The four things the app does — pantry, grocery list, meal suggestions, weekly planner — as the whole navigation model.",
          aspect: "portrait",
          src: "/projects/whats-for-dinner/shot-3.webp",
        },
        {
          route: "screens/pantry_screen.dart",
          label: "Pantry",
          detail: "Ingredient, quantity, and unit — plus the camera in the header, which is the on-device labelling entry point and the reason stocking the pantry is not pure typing.",
          aspect: "portrait",
          src: "/projects/whats-for-dinner/shot-4.webp",
        },
        {
          route: "screens/grocery_screen.dart",
          label: "Grocery list",
          detail: "What the pantry is missing, with a clear-all for after a shop.",
          aspect: "portrait",
          src: "/projects/whats-for-dinner/shot-5.webp",
        },
        {
          route: "screens/meal_suggestion_screen.dart",
          label: "Meal suggestions",
          detail: "Reads the pantry and asks for a meal. The header icons are the rest of the flow — planner, nearby restaurants, filters, and saved suggestion history.",
          aspect: "portrait",
          src: "/projects/whats-for-dinner/shot-6.webp",
        },
      ],
    },
  ],

  engineering: [
    {
      heading: "Two ways to configure one app",
      body: "The Places key is read through dotenv while the LLM key is read as a compile-time constant, and that difference has teeth: a constant pulled from the build environment resolves to an empty string when the define is absent, so a build made without the flag sends an empty bearer token and every suggestion fails with an authorization error rather than a missing-configuration error. Both keys should come through one mechanism, and a missing key should fail loudly at startup instead of surfacing as a confusing failure at the point of use.",
    },
    {
      heading: "Where the shortcuts show",
      body: "This was built to a hackathon deadline and the seams are visible in specific places rather than generally. The suggestion screen has grown to roughly eight hundred lines and holds UI, API calls, speech, and state together. The model and widget files that would have absorbed some of that were created and left empty, so screens pass raw maps around instead of typed objects. And the nearby-restaurant flow issues a details request per result on the main path, which is the difference between a demo that works and a feature that scales.",
      bullets: [
        "Split the suggestion screen; give the response a typed model rather than a map.",
        "Delete or fill the two empty placeholder files so the structure stops implying a layer that is not there.",
        "Match dish names on word boundaries, and normalise the score by review count.",
        "Cache review scores by place id — the same restaurants recur on every nearby search.",
      ],
    },
    {
      heading: "What holds up",
      body: "The pantry-first model, the decision to keep vision on-device, and the review-mention ranking are all things I would build the same way again. The ranking in particular came out of asking what signal already exists that nobody uses, which is a better instinct than reaching for a bigger model — and it is the piece of this project that would still be interesting at ten times the scale, once the call pattern behind it is fixed.",
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "A working Flutter app that answers dinner from the contents of a kitchen rather than a recipe index: photograph the shelf, get a meal you can actually make, hear it read aloud while cooking, or find the nearby restaurant whose reviewers keep mentioning that exact dish. Built to a hackathon deadline, so the interesting parts and the rough parts sit close together — and I would rather point at both than describe it as finished.",
    bullets: [
      "Inverted the usual flow — the pantry is the input and the meal is the output.",
      "On-device ingredient recognition, so kitchen photographs never leave the phone.",
      "A ranking heuristic built from review text, using a signal already present in the API response.",
      "Text to speech chosen for the one context where a screen is genuinely the wrong interface.",
    ],
  },

  roadmap: [
    "One configuration mechanism, validated at startup",
    "Score only top candidates, cached by place id and fetched in parallel",
    "Word-boundary dish matching, normalised for review volume",
    "Typed models for suggestions and pantry items",
    "Split the suggestion screen into presentation and service layers",
    "Expiry dates on pantry items, so the planner can prioritise what will spoil",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

const eventora: CaseStudy = {
  slug: "eventora",
  title: "Eventora — Event Ticketing Platform",
  tagline:
    "Selling a ticket is a money-and-concurrency problem before it is a UI problem — so the domain model and the transaction came first.",
  role: "Solo — domain model, transactional booking pipeline, layered API",
  timeline: "2026",
  status: "in-development",
  proprietary: true,

  summary:
    "Eventora is an event discovery and ticket-booking platform: browse events by category, venue, and date, pick ticket tiers, apply a coupon, and receive a separate scannable pass for every attendee. The interesting work is underneath the screens. Overselling the last seat, letting a later price change rewrite an old invoice, or producing a total a client could tamper with are all failures you cannot patch in the UI, so the schema and the write path were designed first — fourteen related models, money as integers, and a booking that either happens completely or not at all. The identity layer, by contrast, is still a stub, and I would rather say so than let the data model imply the whole thing is finished.",

  metrics: [
    { value: "14", label: "related Prisma models across the domain" },
    { value: "1", label: "transaction per booking — seats, tickets, payment" },
    { value: "integers", label: "all money stored in minor units, never floats" },
    { value: "1 : 1", label: "ticket row per attendee, each with its own status" },
    { value: "18%", label: "GST and a tiered fee, computed server-side" },
    { value: "9", label: "versioned REST endpoints under /api/v1" },
  ],

  problem: {
    heading: "The problem",
    body: "A ticketing system looks like a catalogue with a checkout attached. It is really a small financial system with a hard concurrency constraint in the middle: the last seat can only be sold once, and every rupee taken has to be reconstructable months later.",
    bullets: [
      "Two people paying for the last seat at the same moment must not both succeed.",
      "A ticket sold at last week's price has to stay sold at that price, whatever the organiser changes afterwards.",
      "A total assembled on the client is a total a client can edit — pricing and tax have to be computed server-side.",
      "Entry control is per person, not per purchase: one booking of four seats needs four independently scannable passes.",
      "Tax and platform fees have to survive an audit, which means storing them as separate figures rather than one opaque total.",
    ],
  },

  approach: [
    {
      heading: "Model the domain, not the pages",
      body: "Venue, Organizer, Category, Performer, and ScheduleItem are all separate entities that Event points at, rather than columns denormalised into one events table. It costs joins, but it is what makes browsing by city, filtering by category, and showing a lineup possible without reshaping data at read time — and it means an organiser's rating or a venue's coordinates live in exactly one place.",
    },
    {
      heading: "One ticket row per attendee",
      body: "A booking of four seats creates four ticket rows, each with its own attendee name, email, code, and status moving from valid to scanned. That is the shape gate scanning actually needs: a door can burn one person's pass without touching the other three, and a partially-used booking is a normal state rather than an edge case. Modelling tickets per booking instead would have made this impossible without a second table later.",
    },
    {
      heading: "Keep money in integers and snapshot the price",
      body: "Every amount is an integer in minor units, so no total ever passes through a float. Each booking line also stores the price it was bought at rather than pointing at the live ticket-type price, which means an organiser raising prices next week cannot silently rewrite what last week's customer owed. Historical invoices stay true by construction rather than by convention.",
    },
    {
      heading: "Compute the invoice on the server, and store it itemised",
      body: "Subtotal, coupon discount, platform fee, GST, and the final total are all derived server-side from the ticket types actually being bought — the client sends quantities, never prices. Each figure is then persisted as its own column, so a booking is a reconstructable invoice rather than a number. The fee is tiered by order size and GST is applied to the post-discount amount, which is the order tax has to be applied in.",
    },
    {
      heading: "Make the booking atomic",
      body: "Creating a booking writes the booking, its line items, a decrement against each ticket type's remaining seats, a matching decrement on the event's aggregate count, one ticket row per attendee, and a payment record — all inside a single database transaction. Any failure rolls the whole thing back, so there is no state where seats have been taken but no ticket exists, or a payment is recorded against a booking that was never created.",
    },
    {
      heading: "Cancel by compensating, not by deleting",
      body: "Cancellation runs as its own transaction that puts seats back on both counters, moves the booking, its tickets, and its payment to their cancelled states, and reverses the reward points the purchase earned. Nothing is deleted — the record stays and its status changes. Reversing the points is the part that is easy to forget, and forgetting it is how a user farms rewards by booking and cancelling.",
    },
    {
      heading: "Layer the server so the rules have somewhere to live",
      body: "Repositories own database access, services own the rules — availability, pricing, tax — and versioned route handlers do nothing but validate input with a schema and translate results into a consistent response envelope. It means the pricing logic is in one readable place rather than smeared across route files, and the API is versioned from the first commit rather than after the first breaking change.",
    },
  ],

  flows: [
    {
      actor: "Booking a ticket",
      steps: [
        { label: "Discover", detail: "Events by category, venue city, date, and a featured flag" },
        { label: "Open an event", detail: "Lineup, schedule, highlights, ticket tiers with remaining seats" },
        { label: "Choose tiers", detail: "Quantities per ticket type; the client never sends a price" },
        { label: "Apply a coupon", detail: "Validated server-side against expiry, active flag, and a maximum discount cap" },
        { label: "Confirm", detail: "One transaction: booking, items, seat decrements, a pass per attendee, payment" },
        { label: "Get passes", detail: "A shareable booking reference, and a separate scannable pass per attendee" },
      ],
    },
    {
      actor: "At the door",
      steps: [
        { label: "Present a pass", detail: "Each attendee has their own code, independent of the others" },
        { label: "Scan", detail: "The ticket moves from valid to scanned, so it cannot be reused" },
        { label: "Partial entry is fine", detail: "Three of four attendees arriving is an ordinary state, not an error" },
      ],
    },
  ],

  architecture: `  ┌─────────── Next.js app (App Router) ───────────┐
  │  /                discovery, featured, search  │
  │  /events/[id]      lineup · schedule · tiers   │
  │  /events/[id]/book quantities · coupon         │
  │  /tickets/[ref]    passes, one per attendee    │
  │  /dashboard        bookings and profile        │
  └───────────────────────┬────────────────────────┘
                          │  /api/v1/*  (zod at the edge)
                          ▼
  ┌──────────────── server layers ─────────────────┐
  │  services      availability · pricing · GST    │
  │      │         coupon rules · rewards          │
  │      ▼                                         │
  │  repositories  all DB access, transactions     │
  └───────────────────────┬────────────────────────┘
                          ▼
  ┌──────── PostgreSQL via Prisma driver adapter ──┐
  │  Event ─► Venue · Organizer · Category         │
  │        ─► Performer · ScheduleItem             │
  │        ─► TicketType ──┐                       │
  │  Booking ─► BookingItem┘─► Ticket (per person) │
  │          ─► Payment · Coupon                   │
  │  User ─► Booking · Notification                │
  └────────────────────────────────────────────────┘`,

  architectureNotes: [
    "Booking and cancellation each run as a single transaction, so seat counts and tickets can never disagree.",
    "Remaining seats are tracked on both the ticket type and the event, and both are adjusted inside that transaction.",
    "A booking carries two identifiers: an internal key and a separate human-facing reference used in URLs.",
    "Prisma 7 connects through the pg driver adapter, so the connection string lives in application code rather than the schema.",
    "The client is never trusted with a price — it sends quantities and a coupon code, and the server derives the rest.",
  ],

  decisions: [
    {
      decision: "Track remaining seats on both the ticket type and the event",
      why: "A discovery page needs to say sold out for hundreds of events at once. Reading a per-event counter is one column; deriving it means aggregating every ticket type on every card.",
      tradeoff: "Two counters for one truth. Both are adjusted inside the booking transaction so they cannot drift under normal use, but any future write path that forgets the aggregate will desynchronise it silently — and a silently wrong sold-out badge is worse than a slow one. A periodic reconciliation job, or deriving the aggregate in a view, would remove the class of bug entirely.",
    },
    {
      decision: "Create one ticket row per attendee rather than per booking",
      why: "Entry is per person. Individual rows give each attendee their own code and their own valid-to-scanned lifecycle, which makes single-ticket scanning and partial attendance ordinary rather than special-cased.",
      tradeoff: "Row count multiplies with group size, and there is still no seat-level model — every pass is general admission. Reserved seating would need a seat entity these rows would then have to reference.",
    },
    {
      decision: "Snapshot the purchase price on each booking line",
      why: "An invoice has to stay true after the catalogue changes. Referencing the live ticket-type price would let an organiser's price rise retroactively alter what a past customer appears to have paid.",
      tradeoff: "The price now exists in two places, and a genuine pricing correction cannot be propagated to historical bookings even when that is what you want. Immutability is the right default here, but it is a default, not a free win.",
    },
    {
      decision: "Soft-delete events, organisers, and users — but never bookings, tickets, or payments",
      why: "Catalogue entities need to disappear from browsing without orphaning the bookings that reference them. Financial and entry records are the opposite: they have to remain exactly as written.",
      tradeoff: "Every catalogue read now has to filter deleted rows, and one query that forgets to will surface a withdrawn event. It also means a deleted event still has live bookings pointing at it, so deletion is a visibility change rather than a real removal — which needs to be understood by anyone writing a new query.",
    },
    {
      decision: "Put pricing and tax in a service layer rather than in route handlers",
      why: "The fee tier, the discount cap, and the order in which GST applies are business rules that need one home. Routes stay thin — validate, delegate, respond — and the rules are readable in one file instead of inferred from three.",
      tradeoff: "More indirection than a small app needs, and the layering is only enforced by convention: nothing stops a future route from reaching for the database directly and bypassing the rules. A repository-only database import boundary would make that structural.",
    },
  ],

  stack: [
    {
      layer: "App",
      items: ["Next.js 16", "React 19", "TypeScript", "App Router", "Tailwind v4", "lucide-react"],
    },
    {
      layer: "API",
      items: ["Versioned route handlers", "Zod validation", "shared response envelope", "typed error codes"],
    },
    {
      layer: "Server",
      items: ["Repository layer", "service layer", "Prisma transactions", "server-side pricing and tax"],
    },
    {
      layer: "Data",
      items: ["PostgreSQL", "Prisma 7", "@prisma/adapter-pg driver adapter", "pg pool", "seed script"],
    },
    {
      layer: "Domain",
      items: ["Events", "venues", "organisers", "categories", "ticket types", "coupons", "bookings", "per-attendee tickets", "payments", "reward points", "notifications"],
    },
  ],

  engineering: [
    {
      heading: "The race the transaction does not close",
      body: "Availability is checked and then decremented inside a transaction, which is the right instinct but not sufficient on its own. Under the default isolation level two concurrent bookings can both read the same last seat as available, and because the decrement itself is atomic they will both succeed — leaving remaining seats negative. A transaction guarantees all-or-nothing, not serialisability. Closing it properly means making the write conditional on availability so the update matches zero rows when the seat is gone, backing that with a check constraint so the column can never go negative, or raising the isolation level and retrying on conflict. This is the first thing I would fix, and it is a good illustration that wrapping code in a transaction is not the same as protecting an invariant.",
    },
    {
      heading: "Known limitation — there is no authentication",
      body: "The API identifies the caller by reading an email from a request header, then a query parameter, then falling back to a hardcoded address. That is a placeholder standing in for a session, and its consequence is direct: passing an email to the bookings or profile endpoint returns that person's bookings. There is a password-hash column in the schema and no hashing library in the project, which is an honest signal of where this got to. Nothing about the booking pipeline changes when real sessions arrive — the identity has to come from a verified session instead of a header, and every read has to be scoped to it — but until that exists this is a demonstration of the domain, not something to point at the internet.",
      bullets: [
        "Replace the header and query fallbacks with a verified session on every request.",
        "Scope every booking and ticket read to the authenticated user rather than a supplied email.",
        "Add role checks so organiser and admin surfaces are enforced server-side, not by which page is rendered.",
      ],
    },
    {
      heading: "Payments and passes are placeholders",
      body: "There is no payment gateway. A booking is marked paid and a successful payment row is written as part of the same transaction, which is a deliberate stand-in so the rest of the pipeline can be exercised end to end. The payment model is already the right shape for a real provider — amount, method, transaction reference, status — so integrating one is filling that in and moving the status transition behind a webhook rather than restructuring anything. Ticket codes are similarly provisional: each is derived from the booking reference plus an index, so anyone holding one booking reference can construct every pass code belonging to it. A real pass needs a random or signed value that cannot be guessed from a neighbouring one.",
    },
    {
      heading: "A modelling gap worth naming",
      body: "The user role enum includes an organiser role while organisers are also their own entity with their own contact details — and there is no relation between the two. As it stands an organiser-role user cannot be linked to the organiser record they are supposed to manage, so any organiser-facing feature has nothing to authorise against. Whether that becomes a relation on the organiser or a rethink of roles is a decision the first organiser screen would force.",
    },
  ],

  outcome: {
    heading: "Outcome",
    body: "A ticketing platform whose foundations are the part I would defend: fourteen related models, money kept in integers, purchase prices snapshotted so old invoices stay true, an itemised tax breakdown computed server-side, and both booking and cancellation implemented as single transactions with the cancellation reversing earned rewards. It is also unfinished in a specific and stateable way — identity is a stub, payments are simulated, and the seat-availability check needs stronger isolation than a transaction alone provides. Those three things are the work, not a rewrite.",
    bullets: [
      "Booking writes seats, per-attendee passes, and payment atomically, or writes nothing.",
      "Cancellation compensates rather than deletes, including reversing reward points.",
      "Pricing, discount caps, and GST are derived server-side and stored itemised for reconstruction.",
      "Auth, real payments, and the oversell race are named as open work rather than implied complete.",
    ],
  },

  roadmap: [
    "Real sessions, with every read scoped to the authenticated user",
    "Conditional seat updates plus a non-negative check constraint to close the oversell race",
    "A payment provider, with status moving on a verified webhook",
    "Unguessable, signed ticket codes and a scanning endpoint that burns them",
    "Relate organiser users to the organiser records they manage",
    "Reconcile the event-level seat aggregate, or derive it instead of storing it",
  ],
};

/* ══════════════════════════════════════════════════════════════════════════ */

export const caseStudies: CaseStudy[] = [
  wedfindAi,
  meetingAssistant,
  teamshare,
  aePromptBridge,
  figmaToAe,
  nur,
  whatsForDinner,
  eventora,
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function hasCaseStudy(slug?: string): boolean {
  return Boolean(slug && caseStudies.some((c) => c.slug === slug));
}
