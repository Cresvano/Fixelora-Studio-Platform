import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { pitchRepository } from "@/lib/data/pitches";
import { Metadata } from "next";
import { ArrowUpRight, CheckCircle2, ShieldAlert, Clock, Calendar, Lock } from "lucide-react";

interface PitchPageProps {
  params: Promise<{ slug: string }>;
}

// Ensure private pitch pages are never indexed by search engines
export async function generateMetadata({ params }: PitchPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pitch = await pitchRepository.getPitchBySlug(slug);

  if (!pitch) {
    return { title: "Pitch Not Found" };
  }

  return {
    title: `Confidential Proposal for ${pitch.brandName} | Fixelora Studio`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function PitchDetailPage({ params }: PitchPageProps) {
  const { slug } = await params;
  const pitch = await pitchRepository.getPitchBySlug(slug);

  if (!pitch) {
    notFound();
  }

  return (
    <div className="flex flex-col pt-28 pb-24 px-6 bg-background">
      <div className="container max-w-5xl mx-auto">
        {/* Confidentiality Pill */}
        <div className="mb-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-mono uppercase tracking-widest">
            <Lock className="w-3 h-3" />
            <span>Confidential Outbound Speculative Proposal</span>
          </div>

          <span className="text-[11px] font-mono text-muted-foreground">
            Valid Until: {pitch.validUntil}
          </span>
        </div>

        {/* Branded Co-Headline */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-400 mb-2">
              <span>Prepared for: {pitch.brandName}</span>
              <span>•</span>
              <span>Attn: {pitch.contactName}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
              {pitch.proposalTitle}
            </h1>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-md shrink-0"
          >
            <span>Schedule Pitch Review</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Video Player Container */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-border/80 mb-12">
          <video
            controls
            playsInline
            preload="metadata"
            poster={pitch.thumbnailUrl}
            className="w-full h-full object-cover"
          >
            <source src={pitch.playbackVideoUrl} type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>
        </div>

        {/* Pitch Body & Personal Note */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
          <div className="md:col-span-8 flex flex-col gap-8">
            {/* Custom Director's Note */}
            <div className="p-8 rounded-3xl border border-border/80 bg-card">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-3">
                Creative Director&apos;s Strategy Note
              </p>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed italic">
                &ldquo;{pitch.customNote}&rdquo;
              </p>
              <div className="pt-4 mt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">Julian Vance</span>
                <span className="font-mono text-[11px]">Executive Creative Director, Fixelora Studio</span>
              </div>
            </div>

            {/* Proposal Key Takeaways */}
            <div className="p-8 rounded-3xl border border-border/80 bg-card">
              <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-foreground font-bold mb-4">
                Campaign Architecture & Deliverables
              </h2>
              <ul className="flex flex-col gap-3 text-xs sm:text-sm text-muted-foreground">
                {pitch.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logistics Rail (4 Cols) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-4 text-xs">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-gold-400 mb-1">
                  Proposed Timeline
                </p>
                <p className="font-bold text-foreground flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gold-400" />
                  {pitch.recommendedTimeline}
                </p>
              </div>

              <div className="pt-3 border-t border-border/40">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gold-400 mb-1">
                  Commercial Rights
                </p>
                <p className="text-muted-foreground">
                  Includes full worldwide digital and broadcast usage rights in perpetuity.
                </p>
              </div>

              <div className="pt-3 border-t border-border/40">
                <p className="text-[10px] font-mono uppercase tracking-widest text-gold-400 mb-1">
                  Direct Inquiries
                </p>
                <a
                  href="mailto:production@fixelorastudio.com"
                  className="text-foreground hover:text-gold-400 font-mono text-[11px]"
                >
                  production@fixelorastudio.com
                </a>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-gold-500/20 bg-card/60 flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase text-foreground">
                Next Steps
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Schedule a 20-minute executive review call to discuss custom adaptations, talent casting, and shoot schedules.
              </p>
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm"
              >
                <span>Book Pitch Review</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
