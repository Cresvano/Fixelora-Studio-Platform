# PROJECT DECISIONS: FIXELORA STUDIO PLATFORM

## 1. Architectural & Technical Decisions

### Decision 001: Next.js 15 (App Router) as the Core Framework
- **Context:** We need high-performance server-side rendering (SSR) and static generation (SSG) for SEO on public portfolio and blog pages, while maintaining rich client-side interactivity for the video player and admin management portal.
- **Decision:** Adopt Next.js 15 with React 19, TypeScript, and the App Router (`/app`).
- **Rationale:** Native support for route groups (e.g., `(public)` and `(admin)`), server actions for future database calls, nested layouts, and seamless Vercel integration.

### Decision 002: Tailwind CSS with Semantic CSS Tokens & Dual-Theme Engine
- **Context:** The site must look like a high-end cinematic studio, not a generic template. It requires a deep charcoal/black background default (`#0B0B0C`, `#121214`), subtle gold borders (`#2A261E`), gold accent typography (`#D4AF37`, `#E5C365`), and a clean, high-contrast light theme.
- **Decision:** Use Tailwind CSS extended with custom CSS variable tokens (`hsl(...)`) for background, foreground, card, accent, muted, border, and brand-gold. Persist theme choice via `next-themes` and a custom switcher.
- **Rationale:** Enforces visual consistency, instant theme transitions without flash of unstyled content (FOUC), and clean code separation.

### Decision 003: Centralized Mock Data Abstraction Layer
- **Context:** Phase 1 mandates a fully functional frontend before introducing Neon PostgreSQL and Cloudflare R2 in Phase 3. The UI must demonstrate real workflows (filtering, editing, form submissions, previews) without pretending to persist data or locking the UI to mock structures.
- **Decision:** Create a centralized data layer in `@/lib/data/` with dedicated repositories (`projects.ts`, `pitches.ts`, `blog.ts`, `leads.ts`, `settings.ts`) returning type-safe data interfaces defined in `@/types/`. In Phase 3, these repository methods will be replaced with Drizzle ORM / SQL queries matching the identical TypeScript signatures.
- **Rationale:** Zero UI refactoring required when switching from mock data to Neon database queries in Phase 3.

### Decision 004: Direct Browser-to-Storage Upload Architecture (No 50MB Cap)
- **Context:** Standard Vercel Serverless Functions enforce a 4.5MB request payload limit on the hobby tier and 50MB on enterprise, which is completely inadequate for 4K commercial videos and high-fidelity video reels.
- **Decision:** Direct client-to-storage upload utilizing high-capacity edge storage. Serverless functions authenticate the request, validate MIME types and file sizes against configurable limits (`MAX_UPLOAD_SIZE_GB`), and issue upload tokens / stream directly into edge storage.
- **Rationale:** Completely eliminates serverless proxy bottlenecks, supports files of multiple gigabytes, enables client-side upload progress bars, pause/resume, and zero bandwidth costs on Vercel.

### Decision 005: Dual-Track Lead Acquisition Flow
- **Context:** Commercial clients possess varying booking intents: some have clear project briefs and immediate budgets, while others demand a rapid introductory discovery call.
- **Decision:** Implement a dual-track inquiry experience on `/contact` and modal triggers across the site:
  1. *Track A: Detailed Project Brief Form* (Deliverables, budget range, timeline, company info).
  2. *Track B: Direct Discovery Call Scheduling* (Interactive calendar booking embed/integration).
- **Rationale:** Maximizes visitor-to-lead conversion by accommodating both enterprise procurement workflows and founder-driven quick bookings.

### Decision 006: Unlisted, No-Index Private Pitch Architecture
- **Context:** The platform requires an outbound pitch engine for speculative commercials sent to specific brands (`/pitch/[slug]`). These pages must remain completely unindexed by search engines to protect client confidentiality.
- **Decision:** Dynamic route `/pitch/[slug]` with `robots: { index: false, follow: false }` metadata, custom branded headers displaying the recipient brand's logo, personalized intro video embed, personalized pitch deck note, and private CTA.
- **Rationale:** Fulfills PRD Section 4.2 outbound sales engine while safeguarding intellectual property and SEO hygiene.

### Decision 007: Drizzle ORM + @neondatabase/serverless Driver
- **Context:** We need a type-safe database layer to connect Next.js 15 App Router on Vercel with Neon Serverless PostgreSQL.
- **Decision:** Use Drizzle ORM paired with `@neondatabase/serverless` (HTTP driver).
- **Rationale:** Zero cold-start latency, native HTTP query protocol eliminating connection pooling limits, zero binary engine overhead, and 100% type safety mapping directly to our existing TypeScript domain models.

### Decision 008: Pivot from Cloudflare R2 to Vercel Blob Storage
- **Context:** International payment restrictions with AWS/Cloudflare necessitated an alternative high-capacity edge object storage solution for commercial video masters and stills.
- **Decision:** Adopt Vercel Blob Storage via `@vercel/blob` and `@vercel/blob/client`, integrated directly into the Vercel ecosystem with `BLOB_READ_WRITE_TOKEN`.
- **Rationale:** Seamless zero-config deployment on Vercel, global multi-region CDN distribution, support for high-capacity files up to 500MB+ per object, native client direct upload capabilities, and unified billing on the user's active Vercel account.

---

## 2. Unresolved / Pending Decisions for Review
1. **Video Optimization Pipeline:** Whether to integrate external transcoding workers (e.g. Mux / AWS Elemental) for automated multi-bitrate HLS adaptive streaming, or continue with the Triple-Asset Architecture (user uploads 4K ProRes master, web-optimized MP4/WebM, and poster frame) which incurs zero recurring transcoding infrastructure cost.
   - *Current Recommendation:* Triple-Asset Architecture satisfies MVP requirements and gives total creative control over the final compression grade.
