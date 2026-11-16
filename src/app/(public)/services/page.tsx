import Link from "next/link";
import { ArrowUpRight, Film, Sparkles, Award, Play, CheckCircle2, Sliders, Eye } from "lucide-react";

const PRODUCTION_SERVICES = [
  {
    id: "commercial-tv",
    title: "Broadcast & TV Commercials",
    tagline: "High-concept narrative films designed for international broadcast and cinema.",
    description: "From concept creation to final DCP mastering, we deliver broadcast commercials with tier-one production values. Our directors specialize in visual choreography, anamorphic lenses, and high-impact pacing that stops channel-flipping in its tracks.",
    deliverables: [
      "Broadcast Clearcast approval and global delivery specs",
      "Master DCP for theatrical cinema pre-roll",
      "Full 4K ProRes 4444 XQ and uncompressed audio stems",
      "Dedicated behind-the-scenes documentary cut"
    ],
    timeline: "4–6 Weeks Turnaround"
  },
  {
    id: "dtc-social",
    title: "DTC & Paid Social Commercial Suites",
    tagline: "High-performing visual advertising engineered for measurable ROAS.",
    description: "Commercials that look like luxury cinema, structured with scientific precision for conversion. We test and generate multiple thumb-stopping hooks, problem/solution sequences, and aspirational product rituals optimized for Meta, TikTok, and YouTube.",
    deliverables: [
      "1x Core Hero Commercial (16:9 & 9:16)",
      "4x Iterative Hook Variations for A/B testing",
      "Direct-to-checkout interactive video elements",
      "High-converting lifestyle still pack for catalog ads"
    ],
    timeline: "2–3 Weeks Turnaround"
  },
  {
    id: "brand-anthems",
    title: "Brand Anthems & Keynote Films",
    tagline: "Generational storytelling for enterprise milestones and category leaders.",
    description: "When your brand is launching a flagship innovation, closing a major funding round, or redefining an entire industry, a standard video won't suffice. We craft cinematic brand manifestos that rally investors, customers, and global talent.",
    deliverables: [
      "2 to 4 minute cinematic manifesto film",
      "30s and 60s cutdowns for digital PR distribution",
      "Stage-ready 4K 60fps keynote playback files",
      "Global talent casting and location scouting"
    ],
    timeline: "4–8 Weeks Turnaround"
  },
  {
    id: "vfx-3d",
    title: "Photorealistic 3D & CGI Motion",
    tagline: "Flawless digital reality when physical cameras cannot go far enough.",
    description: "Combining physical cinema with photorealistic 3D modeling, fluid dynamics, and volumetric lighting. Ideal for luxury timepieces, consumer tech internals, automotive reveals, and surreal architectural environments.",
    deliverables: [
      "CAD-to-Cinema photorealistic hardware modeling",
      "Exploded mechanical assembly animations",
      "Parametric fluid, fabric, and particulate simulations",
      "Interactive 3D web-compatible video textures"
    ],
    timeline: "3–5 Weeks Turnaround"
  }
];

const METHODOLOGY_STEPS = [
  {
    step: "01",
    phase: "Discovery & Creative Blueprint",
    detail: "We dissect your brand positioning, campaign objectives, and competitive landscape. We deliver three distinct creative treatments, complete with moodboards, script drafts, and visual references."
  },
  {
    step: "02",
    phase: "Pre-Production & Precision Logistics",
    detail: "Location scouting, casting, technical storyboarding, and custom set design. Every lighting setup, lens choice, and camera movement is pre-visualized to eliminate guesswork on set."
  },
  {
    step: "03",
    phase: "Principal Photography",
    detail: "Shot with tier-one cinema packages (RED V-Raptor XL 8K / ARRI Alexa 35), master anamorphic glass, and precision motion-control rigs under award-winning commercial directors."
  },
  {
    step: "04",
    phase: "Post-Production, Color & Spatial Sound",
    detail: "Offline edit, custom VFX integration, high-end color grading on calibrated OLED monitoring, and spatial sound design mixed in Dolby Atmos."
  }
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col pt-32 pb-24 px-6 bg-background">
      <div className="container max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="max-w-3xl mb-20">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-3">
            Production Capabilities
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-6">
            Commercial Video <br />
            <span className="gold-gradient-text">Engineered For Impact.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            We partner with visionary corporate directors, high-growth DTC founders, and creative agencies to produce visual campaigns that build brand authority and generate measurable commercial returns.
          </p>
        </div>

        {/* Services List */}
        <div className="flex flex-col gap-12 mb-28">
          {PRODUCTION_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-card hover:border-gold-500/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="text-[11px] font-mono text-gold-400 font-semibold tracking-widest">
                  SERVICE 0{index + 1}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {service.title}
                </h2>
                <p className="text-sm font-medium text-gold-300/90 italic">
                  {service.tagline}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2">
                  {service.description}
                </p>
                <div className="pt-4 mt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-mono bg-muted text-foreground border border-border/60">
                    Typical Turnaround: {service.timeline}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-between h-full bg-background/50 p-6 sm:p-8 rounded-2xl border border-border/60">
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold mb-4">
                    Key Deliverables & Specifications
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                    {service.deliverables.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-mono">
                    Custom tailored for brand requirements
                  </span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300"
                  >
                    <span>Request Brief</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology */}
        <div className="mb-24">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-2">
              Our Methodology
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              From Concept to Master Delivery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {METHODOLOGY_STEPS.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-black font-mono text-gold-400/60 block mb-4">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-foreground mb-3">
                    {step.phase}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="p-10 sm:p-16 rounded-3xl border border-gold-500/40 bg-card text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
            Have a project in mind?
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mb-8 leading-relaxed">
            Fill out our 3-minute project brief or schedule a direct discovery call with our executive producer.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-lg"
          >
            <span>Start a Project Brief</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
