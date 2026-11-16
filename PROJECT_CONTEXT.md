# PROJECT CONTEXT: FIXELORA STUDIO PLATFORM

## 1. Product Overview & Vision
**Fixelora Studio** is an international, tier-one commercial creative video production agency platform. The platform serves as a high-end commercial portfolio, a client acquisition engine, an outbound private pitch system, an SEO content engine, and an operational media and content management system.

The platform is explicitly designed to reflect cinematic authority, premium typography, asymmetrical editorial grid layouts, and deep negative space. It rejects generic AI aesthetics, cookie-cutter SaaS templates, and standard digital agency clichés. While AI technology forms part of the studio's advanced production pipeline, Fixelora is positioned firmly as an elite commercial video production house crafting creative advertisements and powerful brand stories for global brands.

---

## 2. Target Audience & Core Personas
1. **The Corporate Brand Director / CMO (Inbound):**
   - High-budget enterprise and mid-market decision-makers looking for broadcast-quality commercials, corporate anthems, and campaign videos.
   - Requires proof of creative excellence, detailed case studies (objectives, audience, metrics), and seamless booking/brief submission.
2. **The High-Growth E-Commerce & DTC Founder (Inbound):**
   - Fast-moving brand builders needing high-converting visual ads, social proof assets, and product reels.
   - Demands rapid turnaround, transparent process breakdowns, and easy scheduling.
3. **The High-Value Outbound Prospect (Outbound):**
   - Prospects who receive a personalized, private, unlisted Fixelora Pitch URL (`/pitch/[slug]`) containing custom video proposals, targeted messaging, and a friction-free booking action.
4. **The Studio Admin / Creative Director (Internal):**
   - Internal team managing portfolio projects, multi-gigabyte commercial 4K video assets, private pitches, client leads, and editorial blog articles.

---

## 3. Approved Technology Stack

| Layer | Technology | Rationale & Status |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (App Router, React 19, TypeScript) | High-performance SSR/SSG for SEO, modern routing, server components, and API routes. |
| **Styling & Tokens** | Tailwind CSS + CSS Custom Variables | Custom dark/light semantic design tokens; cinematic dark theme default with luxury gold accents (`#E6A640` / `#F0C068`). |
| **Animation & Micro-interactions** | Framer Motion / Lucide Icons | Smooth editorial page transitions, cinematic reveal effects, and clean iconography without bloat. |
| **Database** | Neon (Serverless PostgreSQL) | Fully relational serverless database scheduled for Phase 3 integration via Drizzle ORM or Prisma. |
| **Media & Object Storage** | Cloudflare R2 (S3-compatible API) | Global low-latency media storage; direct browser-to-R2 presigned uploads to bypass serverless payload limits. |
| **Authentication** | NextAuth.js / Auth.js (Session JWT) | Single-tenant, invite-only admin security protecting administrative dashboard and media mutations. |
| **Email & Notification** | Resend | Transactional notifications for client brief submissions and pitch engagement. |
| **Deployment & CI/CD** | GitHub + Vercel | Automatic preview and production deployments. |

---

## 4. Key Architectural Constraints & Non-Negotiables
1. **Phased Frontend-First Approach:**
   - Complete, responsive, production-grade frontend built and verified *prior* to backend/database wiring.
   - Frontend must run against a type-safe mock data abstraction layer mirroring future database entities.
2. **Direct Browser-to-R2 Upload Architecture:**
   - No routing of heavy video files through Vercel serverless functions (which impose 4.5MB/50MB payload limits).
   - Serverless functions will strictly handle authorization and generate short-lived S3 Presigned URLs for direct client-to-R2 PUT/multipart transfers.
   - Absolute rejection of arbitrary 50MB application limits. Upload capacity is governed by infrastructure and configurable environment variables.
3. **Triple-Tier Media Asset Model:**
   - Every portfolio project distinguishes between:
     - `original_video`: Archival master copy preserved intact (ProRes/4K master).
     - `playback_video`: Optimized, web-friendly streamable version (H.264/H.265/WebM).
     - `thumbnail_image`: High-resolution poster frame.
4. **Editorial & Brand Guidelines:**
   - Dark theme default with metallic brushed gold accents matching the official Fixelora emblem.
   - Clean, readable light mode for daylight reading.
   - Asymmetric, magazine-grade layouts, fluid typography, and bespoke video player controls.
