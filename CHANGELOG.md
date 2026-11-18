# CHANGELOG: FIXELORA STUDIO PLATFORM

All notable changes and architectural milestones for this project will be documented in this file.

## [Phase 6] - Mobile Responsive Polish, Global Page & Team CMS, SEO & Open Graph (November 2026)

### Added
- **Global Content & Team Roster CMS (`/admin/pages`):**
  - Added Neon PostgreSQL tables `page_content` and `team_members` via Drizzle ORM and seeded default studio copy and directors.
  - Built `/api/page-content` (`GET`, `PUT`) and `/api/team` (`GET`, `POST`, `PUT`, `DELETE`) with instant Next.js cache invalidation (`revalidatePath`).
  - Wired team headshot direct uploads (`assetType="headshot"`) through `/api/upload` to Vercel Blob Storage (`fixelora/team/...`).
  - Added `"Pages & Team"` tab to Admin Dashboard with global static page copy editor (Homepage, About, Services) and interactive Team Roster CRUD modal.
  - Synced public `/`, `/about`, and `/services` pages to fetch live copy and team members dynamically from Neon.
- **SEO, Open Graph, Sitemap & Robots:**
  - Configured `metadataBase`, default OG image, Twitter cards, and robots directives in `src/app/layout.tsx`.
  - Added static `metadata` across public routes (`/`, `/work`, `/services`, `/about`, `/blog`, `/contact`, `/privacy`, `/terms`) and dynamic `generateMetadata` with OG & Twitter cards for `/work/[slug]`, `/blog/[slug]`, and `/services/[slug]`.
  - Created dynamic `src/app/sitemap.ts` (`/sitemap.xml`) and `src/app/robots.ts` (`/robots.txt`).

### Changed
- **Mobile UX & Clutter Reduction:**
  - Removed `"Access Admin Dashboard"` link from public mobile menu and improved light-mode contrast in `src/app/(public)/layout.tsx`.
  - Hid the technical metadata bar (`FORMAT`, `LOCATIONS`, `AUDIO`) on mobile viewports (`hidden md:flex`) in `HeroSlider.tsx`.
  - Increased footer bottom padding (`pb-28 md:pb-14`) so the final email link and bottom bar are never cut off by mobile browser chrome.

## [Phase 5 / 5.1] - Production CMS Workflows, Lead Ingestion & UI Cleanup (November 2026)

### Added
- Full CRUD APIs and Admin interfaces for Portfolio (`/api/projects`), Inbound Leads (`/api/leads`), Blog Articles (`/api/blog`), and Private Pitches (`/api/pitches`) backed by Neon PostgreSQL.
- Integrated Vercel Blob media selector inside Portfolio CRUD and direct `mailto:` / `tel:` outreach links in Leads CRM.
- Standardized the 6 production categories and updated contact budget tiers.

## [Phase 3 & 4] - Neon Serverless PostgreSQL & Vercel Blob Storage (November 2026)

### Added
- Configured Drizzle ORM with Neon Serverless PostgreSQL (`projects`, `media_assets`, `pitches`, `leads`, `blog_posts`, `admin_users`, `studio_settings`).
- Implemented Vercel Blob direct upload pipeline (`/api/upload` and `/admin/media`) for high-capacity commercial video files and thumbnails.

## [Phase 1.5] - Frontend Refinements, Admin Security & Services Overhaul (November 2026)

### Added
- **Dynamic Hero Slider:** Created `HeroSlider.tsx` on Homepage with auto cross-fading 4K videos, smooth pillar transitions, slide indicators, and manual controls.
- **Interim Admin Security Hotfix:**
  - `src/middleware.ts`: Next.js middleware protecting `/admin/*` routes from unauthorized access.
  - `src/app/admin/login/page.tsx`: Elite cinematic login portal verifying against `ADMIN_PASSWORD` (default: `fixelora2026`).
  - `src/app/api/admin/login/route.ts` & `logout/route.ts`: Cookie-based session management (`fixelora_admin_session`).
  - Added session Lock/Logout action to admin sidebar.
- **Complete Services Overhaul (`src/lib/data/services.ts`, `/services`, `/services/[slug]`):**
  - **6 Primary Categories:** Product Commercials, Brand Films & Commercials, Social Media & Performance Advertising, E-commerce & Product Marketing Videos, Explainer & Software Videos, Storytelling & Book Trailers.
  - **9 Additional Services:** Corporate & business videos, real estate videos, event recaps, employer branding, AI-assisted UGC creatives, video repurposing, ad campaign batches, creative variations matrix, and promotional content packages.
  - **17 Production Capabilities:** Concept development, scriptwriting, storyboarding, creative direction, AI-assisted visual production, high-speed macro optics, voiceover, sound design, original score, editing, ACES color grading, kinetic typography, 3D logo reveals, aspect ratio mastering, and platform adaptations.
  - **Dynamic Service Detail Pages (`/services/[slug]`):** Scope breakdown, sub-services checklist, deliverables, 4-step sequence, industry use cases, portfolio case studies, and FAQs.
- **UI/UX & Accessibility Fixes:**
  - High-contrast slate `--muted-foreground` in light mode for readability on `#FAF9F5`.
  - Tightened excessive vertical padding on mobile viewports (`max-md`).
  - Increased base font scale and enhanced button contrast.

## [Phase 2] - Git Repository Initialization & Vercel Preparation (November 2026)

### Added
- **Version Control:** Initialized local Git repository on default branch `main`.
- **Git Ignore:** Configured standard `.gitignore` strictly excluding `node_modules`, `.next`, `.env*` files, debug logs, and build artifacts.
- **Initial Commit:** Staged 55 project files and created initial commit `feat: complete phase 1 frontend and admin UI` (`dcc115b2fda1a6affbb6801cbe182f7c5d758ecb`).
- **Remote Integration:** Connected remote origin `https://github.com/Cresvano/Fixelora-Studio-Platform.git`.

## [Phase 1] - Complete Frontend Implementation (November 2026)
- Complete responsive frontend with public site, case studies, admin dashboard, mock data layer, and legal suite.
