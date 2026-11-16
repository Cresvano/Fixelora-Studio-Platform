import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Fixelora Studio",
  description: "Fixelora Studio privacy policy detailing our data handling, confidentiality protocols, and client protection standards.",
};

export default function PrivacyPolicyPage() {
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
            <Lock className="w-3.5 h-3.5" />
            <span>Legal & Confidentiality</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.1] mb-4">
            Privacy & Confidentiality Policy
          </h1>
          <p className="text-xs font-mono text-muted-foreground">
            Effective Date: November 16, 2026 • Last Reviewed: November 2026
          </p>
        </div>

        {/* Legal Text Layout */}
        <div className="prose prose-invert max-w-none text-muted-foreground text-xs sm:text-sm leading-relaxed space-y-8">
          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              1. Our Commitment to Client Confidentiality
            </h2>
            <p>
              At Fixelora Studio (&ldquo;Fixelora,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), we operate at the highest echelons of international commercial video production. We frequently handle unannounced hardware releases, confidential scripts, intellectual property, and proprietary marketing campaigns. Protecting your confidential information and personal data is fundamental to our operational integrity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              2. Information We Collect
            </h2>
            <p>
              We collect information that you directly provide to us through our dual-track inquiry systems, project briefs, discovery scheduling, and client onboarding workflows:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li><strong>Contact Information:</strong> Full name, corporate email address, telephone number, and company name.</li>
              <li><strong>Project Specifications:</strong> Target budget tiers, campaign timelines, creative deliverables, target demographics, and conceptual briefs.</li>
              <li><strong>Media Assets:</strong> Client brand guidelines, reference video files, and proprietary assets submitted for pitch or production purposes.</li>
              <li><strong>Automated Telemetry:</strong> Anonymized technical diagnostics, including browser type, geographic region, and page dwell times to optimize video streaming performance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              3. Mutual Non-Disclosure & Security Standards
            </h2>
            <p>
              All project brief submissions received through our platform are treated as strictly confidential. Prior to the exchange of sensitive product prototypes, high-resolution CAD models, or unreleased campaign material, Fixelora routinely executes bilateral Non-Disclosure Agreements (NDAs).
            </p>
            <p>
              All video assets uploaded to our storage architecture are stored within enterprise-grade, S3-compatible encrypted object storage (Cloudflare R2), utilizing AES-256 server-side encryption at rest and TLS 1.3 in transit.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              4. How We Use Collected Data
            </h2>
            <p>
              We process client information strictly to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
              <li>Prepare and deliver custom commercial video production proposals and cost estimates.</li>
              <li>Coordinate shoot logistics, talent casting, and crew schedules.</li>
              <li>Deliver private, unlisted pitch presentations (<code className="text-gold-400">/pitch/[slug]</code>) to designated stakeholders.</li>
              <li>Maintain operational billing, invoicing, and contract management records.</li>
            </ul>
            <p>
              We do not sell, rent, monetize, or publicly disclose client contact data or project brief details to third-party data brokers or marketing intermediaries under any circumstances.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              5. Data Retention & Deletion
            </h2>
            <p>
              Project briefs, pitch proposals, and media assets are retained for the duration of the commercial engagement or exploratory phase. Clients may request the complete deletion of their inquiry records, submitted brief documents, and associated media files at any time by contacting our legal compliance desk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-foreground font-mono">
              6. Contact Our Production & Legal Office
            </h2>
            <p>
              For legal inquiries, NDA requests, or questions regarding our data practices, please reach out directly:
            </p>
            <div className="p-5 rounded-2xl border border-border/80 bg-card font-mono text-xs text-muted-foreground space-y-1.5">
              <p><strong className="text-foreground">Fixelora Studio Legal & Compliance</strong></p>
              <p>Century City Media District, Los Angeles, CA</p>
              <p>Email: <a href="mailto:legal@fixelorastudio.com" className="text-gold-400 hover:underline">legal@fixelorastudio.com</a></p>
              <p>Production Line: +1 (310) 902-8800</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
