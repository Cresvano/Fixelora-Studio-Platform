import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageContentRepository } from "@/lib/data/page-content";
import { ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Fixelora Studio | Creative Directors & Production Standards",
  description:
    "Meet the directors, colorists, and visual artists behind Fixelora Studio. Learn about our international commercial filmmaking ethos and 8K cinema production pipeline.",
  openGraph: {
    title: "About Fixelora Studio | We Reject Generic. We Direct Prestige.",
    description:
      "Meet the directors, colorists, and visual artists behind Fixelora Studio.",
    type: "website",
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Fixelora Studio",
    description:
      "Meet the international directors and visual artists behind Fixelora Studio.",
  },
};

const TECHNICAL_GEAR = [
  { item: "RED V-Raptor XL 8K VV & ARRI Alexa 35", desc: "Flagship cinema sensor packages with 17+ stops of dynamic range" },
  { item: "Tribe7 Blackwing7 & Master Anamorphics", desc: "Tuned vintage glass with custom flare coatings and creamy highlight roll-off" },
  { item: "Phantom Flex 4K High-Speed Rig", desc: "Up to 1000fps in full uncompressed 4K for macro liquids and kinetics" },
  { item: "Dolby Atmos 7.1.4 Mixing Suite", desc: "Immersive spatial audio engineering for cinema and prestige streaming" }
];

export default async function AboutPage() {
  const [pageContent, teamMembers] = await Promise.all([
    pageContentRepository.getPageContent(),
    pageContentRepository.getTeamMembers(),
  ]);

  const bodyParagraphs = pageContent.aboutMainBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col pt-32 pb-24 px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="max-w-3xl mb-20">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-700 dark:text-gold-400 font-semibold mb-3">
            {pageContent.aboutHeroEyebrow}
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-6">
            {pageContent.aboutHeroHeadline} <br />
            <span className="gold-gradient-text">{pageContent.aboutHeroHeadlineAccent}</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            {pageContent.aboutHeroSubheadline}
          </p>
        </div>

        {/* Studio Manifesto / Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-8 sm:p-12 rounded-3xl border border-border/80 bg-card mb-24">
          <div className="flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-700 dark:text-gold-400 font-semibold mb-2">
                Creative Manifesto
              </p>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground mb-4">
                {pageContent.aboutManifestoTitle}
              </h2>
              <div className="space-y-4">
                {bodyParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <div className="pt-6 mt-6 border-t border-border/40 flex items-center gap-6 text-xs text-muted-foreground font-mono">
              <span>EST. 2024</span>
              <span>•</span>
              <span>LOS ANGELES / LONDON</span>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-border/60">
            <Image
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop"
              alt="Fixelora Studio Cinematography On Set"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Directors & Leadership (Dynamic Neon Roster) */}
        <div className="mb-24">
          <div className="max-w-2xl mb-12">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-700 dark:text-gold-400 font-semibold mb-2">
              Creative Leadership
            </p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
              Directing Minds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((director) => (
              <div
                key={director.id}
                className="flex flex-col rounded-2xl border border-border/80 bg-card overflow-hidden hover:border-gold-500/40 transition-colors"
              >
                <div className="relative aspect-[4/5] w-full bg-black/40">
                  <Image
                    src={director.headshotUrl}
                    alt={director.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{director.name}</h3>
                    <p className="text-xs font-mono font-medium text-gold-700 dark:text-gold-400 mb-3">{director.role}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {director.bio}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Standard / Camera Packages */}
        <div className="p-8 sm:p-12 rounded-3xl border border-gold-500/30 bg-card mb-20">
          <div className="max-w-2xl mb-8">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-700 dark:text-gold-400 font-semibold mb-2">
              Production Infrastructure
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground">
              Production Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {TECHNICAL_GEAR.map((item, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-border/60 bg-background/50">
                <p className="text-xs font-bold text-foreground mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-600 dark:bg-gold-400" />
                  <span>{item.item}</span>
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed pl-3.5">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA (Dynamic Global CTA Copy) */}
        <div className="text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground mb-4 max-w-2xl">
            {pageContent.globalCtaHeading}
          </h2>
          <p className="text-sm text-muted-foreground max-w-lg mb-8 leading-relaxed">
            {pageContent.globalCtaSubtext}
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
