import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { serviceRepository } from "@/lib/data/services";
import { projectRepository } from "@/lib/data/projects";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Film,
  Sparkles,
  Layers,
  ChevronRight,
  HelpCircle
} from "lucide-react";
import { Metadata } from "next";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await serviceRepository.getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found | Fixelora Studio" };
  }

  return {
    title: `${service.title} | Fixelora Commercial Production`,
    description: service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await serviceRepository.getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  // Fetch associated case studies
  const allProjects = await projectRepository.getProjects();
  const associatedProjects = allProjects.filter((p) =>
    service.associatedProjectSlugs.includes(p.slug)
  );

  return (
    <div className="flex flex-col pt-28 sm:pt-32 pb-24 px-4 sm:px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Commercial Disciplines</span>
          </Link>
        </div>

        {/* Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-border/60">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-mono uppercase tracking-widest mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>Production Division</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-4">
              {service.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed italic">
              &ldquo;{service.tagline}&rdquo;
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-lg"
            >
              <span>Commission Campaign</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hero Media Container */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-border/80 mb-16">
          <Image
            src={service.heroImage}
            alt={service.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white">
            <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
              Turnaround: {service.timeline}
            </span>
            <span className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-gold-400">
              Format: 4K ProRes 4444 XQ / 8K RAW
            </span>
          </div>
        </div>

        {/* Detailed Overview & Sub-Services Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Left Column: Narrative & Sub-Services (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-2 font-semibold">
                Strategic Scope & Philosophy
              </p>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-foreground mb-4">
                Overview & Value Proposition
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {service.detailedOverview}
              </p>
            </div>

            {/* Sub-Services Checklist */}
            <div className="p-8 rounded-3xl border border-border/80 bg-card">
              <h3 className="text-base font-bold uppercase tracking-wider text-foreground mb-4">
                What We Produce Under This Discipline:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {service.subServices.map((sub, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span className="font-medium">{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Use Cases */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-2 font-semibold">
                Sector Applications
              </p>
              <h3 className="text-2xl font-bold uppercase text-foreground mb-6">
                Industry Use Cases
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {service.industryUseCases.map((useCase, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-border/80 bg-card/60 flex flex-col gap-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-gold-400 font-bold">
                      {useCase.industry}
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {useCase.application}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Production Process */}
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-2 font-semibold">
                Methodology
              </p>
              <h3 className="text-2xl font-bold uppercase text-foreground mb-6">
                Production Sequence
              </h3>
              <div className="flex flex-col gap-4">
                {service.productionProcess.map((step) => (
                  <div
                    key={step.step}
                    className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-black font-mono text-gold-400/80 shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{step.phase}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Deliverables & Specifications (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-3xl border border-border/80 bg-card flex flex-col gap-5 sticky top-24">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-gold-400 mb-1 font-semibold">
                  Deliverables Specification
                </p>
                <h3 className="text-lg font-bold text-foreground">
                  Master Asset Package
                </h3>
              </div>

              <ul className="flex flex-col gap-2.5 text-xs text-muted-foreground">
                {service.deliverables.map((deliv, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                    <span>{deliv}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-border/40 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Production Hub:</span>
                  <span className="font-semibold text-foreground">Los Angeles / London</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Audio Standard:</span>
                  <span className="font-semibold text-foreground">Dolby Atmos Mixed</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Color Grading:</span>
                  <span className="font-semibold text-foreground">ACES Calibrated OLED</span>
                </div>
              </div>

              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-md mt-2"
              >
                <span>Request Detailed Quote</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Relevant Portfolio Case Studies */}
        {associatedProjects.length > 0 && (
          <div className="mb-20 pt-12 border-t border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
                  Evidence of Execution
                </p>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-foreground">
                  Featured Case Studies in this Discipline
                </h3>
              </div>
              <Link
                href="/work"
                className="text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
              >
                <span>All Works</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {associatedProjects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/work/${proj.slug}`}
                  className="group rounded-2xl border border-border/80 bg-card overflow-hidden hover:border-gold-500/40 transition-colors flex flex-col"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/60">
                    <Image
                      src={proj.thumbnailUrl}
                      alt={proj.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[11px] font-mono text-gold-400 uppercase tracking-widest">
                        {proj.client}
                      </p>
                      <h4 className="text-xl font-bold text-white">{proj.title}</h4>
                    </div>
                  </div>
                  <div className="p-5 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{proj.category} • {proj.runtime}</span>
                    <span className="font-semibold text-foreground group-hover:text-gold-400 inline-flex items-center gap-1">
                      Case Study <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Frequently Asked Questions */}
        {service.faqs.length > 0 && (
          <div className="mb-20 pt-12 border-t border-border/60 max-w-3xl">
            <div className="mb-8">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
                Common Inquiries
              </p>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-foreground">
                Service Frequently Asked Questions
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {service.faqs.map((faq, fIdx) => (
                <div
                  key={fIdx}
                  className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-2"
                >
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="p-10 sm:p-14 rounded-3xl border border-gold-500/40 bg-card text-center flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground mb-3">
            Ready to Begin Production?
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mb-8 leading-relaxed font-light">
            Contact our executive creative producer to discuss scripts, timelines, and custom treatments.
          </p>
          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-lg"
          >
            <span>Start a Project Brief</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
