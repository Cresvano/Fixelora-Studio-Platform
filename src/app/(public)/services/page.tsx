import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { serviceRepository } from "@/lib/data/services";
import { pageContentRepository } from "@/lib/data/page-content";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Film,
  Sparkles,
  Layers,
  Sliders,
  Play,
  Clock,
  ChevronRight,
  ShieldCheck,
  Check
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commercial Video Production Services",
  description:
    "Explore Fixelora Studio's comprehensive commercial video production services: Product commercials, brand films, performance social ads, e-commerce suites, SaaS explainers, and cinematic book trailers.",
  openGraph: {
    title: "Commercial Video Production Services | Fixelora Studio",
    description:
      "Product commercials, brand films, performance social ads, e-commerce suites, SaaS explainers, and cinematic book trailers.",
    type: "website",
    url: "/services",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commercial Video Production Services | Fixelora Studio",
    description:
      "Broadcast-grade commercial video production and multi-platform visual campaigns.",
  },
};

export default async function ServicesPage() {
  const [primaryServices, additionalServices, capabilities, pageContent] = await Promise.all([
    serviceRepository.getPrimaryServices(),
    serviceRepository.getAdditionalServices(),
    serviceRepository.getProductionCapabilities(),
    pageContentRepository.getPageContent(),
  ]);

  // Group capabilities by category
  const capabilityCategories = [
    "Creative Strategy",
    "Visual Production",
    "Post-Production & Audio",
    "Multi-Format Adaptation"
  ] as const;

  return (
    <div className="flex flex-col pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 bg-background">
      <div className="container max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-mono uppercase tracking-[0.2em] mb-4">
            <Film className="w-3.5 h-3.5" />
            <span>Commercial Production Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-6">
            {pageContent.servicesHeroHeadline} <br />
            <span className="gold-gradient-text">{pageContent.servicesHeroHeadlineAccent}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            {pageContent.servicesHeroSummary}
          </p>
        </div>

        {/* 1. PRIMARY SERVICES (6 CATEGORIES - PROMINENT DISPLAY) */}
        <div className="mb-24 sm:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-border/60">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
                Core Production Disciplines
              </p>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
                Primary Commercial Services
              </h2>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              6 Dedicated Production Divisions
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10">
            {primaryServices.map((service, idx) => (
              <div
                key={service.id}
                className="group rounded-3xl border border-border/80 bg-card overflow-hidden hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                {/* Visual Header with Thumbnail */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                  <Image
                    src={service.heroImage}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-black/40 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-black/75 backdrop-blur-md text-gold-400 border border-gold-500/30">
                      0{idx + 1} • Discipline
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-black/75 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {service.timeline}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gold-300/90 italic line-clamp-1">
                      &ldquo;{service.tagline}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {service.shortDescription}
                    </p>

                    {/* Sub-Services Tag Cloud */}
                    <div className="mb-6">
                      <p className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold mb-3">
                        Included Formats & Sub-Services:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {service.subServices.map((sub, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg text-xs bg-muted/60 text-foreground/90 border border-border/60"
                          >
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key Deliverables */}
                    <div className="p-4 rounded-2xl bg-background/60 border border-border/60">
                      <p className="text-xs font-mono uppercase tracking-wider text-gold-400 font-semibold mb-2.5">
                        Key Master Deliverables:
                      </p>
                      <ul className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                        {service.deliverables.slice(0, 3).map((item, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions & Links */}
                  <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                      <span>Explore Full Production Scope</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/contact?service=${encodeURIComponent(service.title)}`}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-semibold bg-foreground text-background hover:bg-gold-500 hover:text-black transition-colors"
                    >
                      <span>Book Service</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. ADDITIONAL SERVICES (SECONDARY UI DISPLAY - 9 CATEGORIES) */}
        <div className="mb-24 sm:mb-32 p-8 sm:p-12 rounded-3xl border border-border/80 bg-card/40">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
              Expanded Scope
            </p>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
              Additional Commercial Services
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Targeted video production solutions engineered for specific business events, real estate developments, employer branding, and multi-version campaign scaling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl border border-border/80 bg-background/60 hover:border-gold-500/40 transition-colors flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gold-400" />
                    <span>{item.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-mono text-gold-400/90">
                  <span>{item.deliverables}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CREATIVE & PRODUCTION CAPABILITIES (17 CATEGORIES - CAPABILITIES UI) */}
        <div className="mb-24 sm:mb-32">
          <div className="max-w-2xl mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
              Internal Infrastructure
            </p>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
              Creative & Production Capabilities
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every phase of production is handled in-house under meticulous quality control, pairing cinematic hardware with agile digital workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilityCategories.map((category) => {
              const categoryCaps = capabilities.filter((c) => c.category === category);
              return (
                <div
                  key={category}
                  className="p-6 sm:p-7 rounded-3xl border border-border/80 bg-card flex flex-col gap-4"
                >
                  <div className="pb-3 border-b border-border/60">
                    <span className="text-xs font-mono text-gold-400 uppercase tracking-widest font-semibold block mb-1">
                      Pillar
                    </span>
                    <h3 className="text-lg font-bold text-foreground">
                      {category}
                    </h3>
                  </div>

                  <ul className="flex flex-col gap-3.5">
                    {categoryCaps.map((cap) => (
                      <li key={cap.id} className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                          <span>{cap.title}</span>
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                          {cap.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. PRODUCTION METHODOLOGY */}
        <div className="p-8 sm:p-12 rounded-3xl border border-gold-500/30 bg-card mb-20">
          <div className="max-w-2xl mb-10">
            <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
              The Studio Standard
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              4-Phase Master Methodology
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", phase: "Creative Blueprint & Treatment", desc: "Positioning analysis, treatment decks, scripted timings, and visual storyboards." },
              { step: "02", phase: "Pre-Production & Set Staging", desc: "Studio set builds, talent casting, macro lighting rigs, and precision logistics." },
              { step: "03", phase: "Principal Cinematography", desc: "Shot on RED 8K VV / ARRI 35 with anamorphic glass and robotic camera motion." },
              { step: "04", phase: "Color, VFX & Spatial Master", desc: "ACES color conforming, OLED grading, and Dolby Atmos audio stem delivery." },
            ].map((st) => (
              <div key={st.step} className="p-5 rounded-2xl bg-background/60 border border-border/60 flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-black font-mono text-gold-400 block mb-2">{st.step}</span>
                  <h4 className="text-sm font-bold text-foreground mb-2">{st.phase}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. CLOSING CTA BANNER */}
        <div className="p-10 sm:p-16 rounded-3xl border border-gold-500/40 bg-gradient-to-b from-card to-background text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground mb-4">
            Commission Your Next Campaign
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mb-8 leading-relaxed font-light">
            Our producers and directors are ready to translate your product vision into high-impact commercial cinema.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-lg"
            >
              <span>Submit Project Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-xs uppercase tracking-widest font-medium border border-border text-foreground hover:bg-muted transition-colors"
            >
              <span>Explore Case Studies</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
