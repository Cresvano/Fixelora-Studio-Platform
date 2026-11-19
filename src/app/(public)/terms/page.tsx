import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Fixelora Studio",
  description: "Terms of service and commercial production agreements governing client engagements with Fixelora Studio.",
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col pt-32 pb-24 px-6 bg-background">
      <div className="container max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Studio</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-12 pb-8 border-b border-border/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[11px] font-mono uppercase tracking-[0.2em] mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Commercial Agreements</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.1] mb-4">
            Terms of Commercial Production
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: November 16, 2026 • Master Production Framework
          </p>
        </div>

        {/* Legal Text Layout */}
        <div className="prose prose-invert max-w-none text-muted-foreground text-xs sm:text-sm leading-relaxed space-y-8">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              1. Scope of Engagement & Proposals
            </h2>
            <p>
              These Terms of Commercial Production govern all video production, creative direction, cinematography, post-production, 3D visual effects, and consulting services executed by Fixelora Studio. Each commercial project is formalized through a project brief, creative treatment, and a mutually executed Master Services Agreement (MSA) or Statement of Work (SOW) detailing budgets, milestone schedules, and final deliverables.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              2. Intellectual Property & Commercial Usage Rights
            </h2>
            <p>
              Upon receipt of full and final payment under the applicable SOW:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li><strong>Final Delivered Masters:</strong> The client is granted an exclusive, worldwide, perpetual license (or full copyright assignment as specified in the SOW) to broadcast, display, and distribute the final approved master videos across broadcast, digital, theatrical, and out-of-home channels.</li>
              <li><strong>Production Raw Materials:</strong> Unless explicitly contracted in the SOW, unedited raw camera sensor data (RED RAW / ProRes camera cards), project project files (.drp, .prproj, .aep), and proprietary internal LUTs remain the intellectual property of Fixelora Studio.</li>
              <li><strong>Portfolio Exhibition Rights:</strong> Fixelora Studio retains the standard commercial right to exhibit the finished commercial work, case studies, behind-the-scenes footage, and project stills within our portfolio, website, awards entries, and social promotional channels, subject to pre-agreed public release dates.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              3. Production Milestones & Client Approvals
            </h2>
            <p>
              Our commercial production workflow operates through defined milestone sign-offs:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-xl border border-border/80 bg-card">
                <p className="font-bold text-foreground text-xs font-mono uppercase mb-1">
                  Milestone A: Creative Pre-Pro
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Approval of treatment, script, storyboard, and production budget prior to shoot mobilization.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-border/80 bg-card">
                <p className="font-bold text-foreground text-xs font-mono uppercase mb-1">
                  Milestone B: Offline Rough Cut
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Editorial pacing and narrative sequence sign-off prior to color grade and VFX conform.
                </p>
              </div>
            </div>
            <p className="pt-2">
              Each commercial contract includes up to two (2) rounds of consolidated editorial revisions during the offline editing stage. Structural changes requested after offline cut approval may incur additional production fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              4. Master Delivery Standards
            </h2>
            <p>
              All final commercials are mastered to broadcast and cinema standards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Master Deliverable: 4K ProRes 4444 XQ or ProRes 422 HQ with 10-bit/12-bit color fidelity.</li>
              <li>Digital Streaming Deliverable: Web-optimized MP4/WebM with fast-start MOOV atom placement for instant playback.</li>
              <li>Spatial Audio: 24-bit/48kHz uncompressed stereo masters, with 5.1 and spatial audio delivery available upon contract specification.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              5. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms and any commercial agreements arising hereunder shall be construed in accordance with standard international commercial arbitration principles. Any dispute arising under an engagement shall be submitted to binding international commercial arbitration.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
