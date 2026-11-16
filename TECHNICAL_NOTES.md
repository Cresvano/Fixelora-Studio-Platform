# TECHNICAL NOTES: FIXELORA STUDIO PLATFORM

## 1. Local Runtime & Development Environment
- **Operating System:** Windows 11
- **Node.js Version:** `v22.11.0`
- **npm Version:** `10.9.0`
- **PowerShell Execution Policy Constraint:**
  - Standard PowerShell blocks `.ps1` script execution (e.g. `npm` directly invokes `npm.ps1` and fails with `UnauthorizedAccess`).
  - *Fix / Best Practice:* Always invoke `npm.cmd` or `npx.cmd` directly in CLI commands (e.g. `npm.cmd run dev`, `npm.cmd run build`).
- **Git Availability:**
  - `git` was not found in the initial PATH. Prior to Phase 2 (GitHub & Vercel deployment), Git will either be added to PATH or installed via winget/standalone installer.

---

## 2. Mock Data Abstraction Layer Architecture (Phase 1)
To ensure zero UI refactoring when moving from Phase 1 (Mock Data) to Phase 3 (Neon PostgreSQL):
- All data models are strictly defined in `@/types/index.ts`.
- Repositories are located in `@/lib/data/`:
  - `projectRepository.getProjects(filters?: ProjectFilters): Promise<Project[]>`
  - `projectRepository.getProjectBySlug(slug: string): Promise<Project | null>`
  - `pitchRepository.getPitchBySlug(slug: string): Promise<Pitch | null>`
  - `blogRepository.getPosts(): Promise<BlogPost[]>`
  - `blogRepository.getPostBySlug(slug: string): Promise<BlogPost | null>`
  - `leadRepository.getLeads(): Promise<Lead[]>`
  - `leadRepository.createLead(brief: LeadSubmission): Promise<{ success: boolean; id: string }>`
- Frontend components and server components import these repository functions directly.
- In Phase 3, the internal implementation of these functions will swap from in-memory arrays to Neon SQL queries via Drizzle ORM, keeping the public function signatures 100% identical.

---

## 3. Video Delivery & Mobile Playback Best Practices
- **Autoplay Policies:**
  - Modern browsers strictly disallow unmuted autoplay.
  - The hero background showreel must have attributes: `autoPlay`, `muted`, `loop`, `playsInline`, `preload="auto"`.
- **Poster Images:**
  - Every video tag must provide a high-resolution `poster` attribute to eliminate layout shifts (CLS) and ensure immediate visual impact while video packets buffer.
- **Triple-Asset Strategy:**
  - `original_video`: Archival master copy preserved intact (ProRes/4K master).
  - `playback_video`: Web-optimized MP4/WebM (H.264/AAC, high profile, web-optimized fast-start MOOV atom at head of file).
  - `thumbnail_image`: WebP/JPG poster frame.

---

## 4. Phase 4: Cloudflare R2 Direct Upload Architecture
Standard serverless functions (like Vercel functions) have strict execution timeout (10-15s) and payload size limits (4.5MB to 50MB). Therefore:
```
[ Browser / Admin UI ]
       │
       │ 1. POST /api/media/authorize-upload
       │    (filename, size, contentType)
       ▼
[ Next.js API Route (Auth & Validation) ]
       │
       │ 2. Generate S3 Presigned PUT URL via @aws-sdk/s3-request-presigner
       ▼
[ Browser / Admin UI ]
       │
       │ 3. Direct PUT / Multipart Upload to Cloudflare R2
       ▼
[ Cloudflare R2 Bucket ]
       │
       │ 4. POST /api/media/confirm-upload
       ▼
[ Next.js API Route -> Neon DB ]
```
- Completely bypasses Vercel payload limits.
- Supports commercial video files of 1GB to 10GB+.
- Cloudflare R2 charges $0 egress fees, drastically lowering media delivery costs compared to AWS S3.
