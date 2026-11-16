import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { projectRepository } from "@/lib/data/projects";
import { ArrowLeft, ArrowUpRight, Play, CheckCircle2, Award, Clock, Layers } from "lucide-react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { slug } = await params;
  const project = await projectRepository.getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const allProjects = await projectRepository.getProjects();
  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return (
    <div className="flex flex-col pt-28 pb-24 px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Works</span>
          </Link>
        </div>

        {/* Title & Metadata Top Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-border/60">
          <div>
            <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-gold-400 mb-2">
              <span>{project.client}</span>
              <span>•</span>
              <span>{project.category}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground">
              {project.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-light italic mt-3 max-w-3xl">
              &ldquo;{project.tagline}&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-md"
            >
              <span>Inquire For Similar Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CINEMATIC VIDEO PLAYER CONTAINER */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-border/80 mb-16">
          <video
            controls
            playsInline
            preload="metadata"
            poster={project.thumbnailUrl}
            className="w-full h-full object-cover"
          >
            <source src={project.playbackVideoUrl} type="video/mp4" />
            Your browser does not support HTML5 video playback.
          </video>
        </div>

        {/* PROJECT SPECS RAIL & EDITORIAL CASE STUDY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Left Column: Metadata & Deliverables (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-8 p-6 rounded-2xl border border-border/80 bg-card h-fit">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-1">
                Client Organization
              </p>
              <p className="text-sm font-bold text-foreground">{project.client}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-1">
                  Runtime
                </p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  {project.runtime}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-1">
                  Aspect Ratio
                </p>
                <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                  {project.aspectRatio}
                </p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-3">
                Campaign Deliverables
              </p>
              <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
                {project.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-2">
                Production Tags
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground border border-border/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Case Study Narrative & ROI (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            {/* The Creative Challenge & Objective */}
            <div>
              <h2 className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-3">
                The Creative Objective
              </h2>
              <p className="text-base sm:text-lg text-foreground font-normal leading-relaxed mb-4">
                {project.creativeObjective}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Target Audience */}
            <div className="p-6 rounded-2xl border border-border/60 bg-card/50">
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-foreground font-semibold mb-2">
                Target Audience & Cultural Context
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {project.targetAudience}
              </p>
            </div>

            {/* Commercial Impact Metrics */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-4">
                Measurable Commercial Impact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {project.commercialImpact.map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-gold-500/30 bg-card flex flex-col justify-between"
                  >
                    <p className="text-2xl sm:text-3xl font-black font-mono text-gold-400">
                      {stat.metric}
                    </p>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mt-2">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stills Gallery */}
            {project.stills.length > 0 && (
              <div className="pt-6">
                <h3 className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-4">
                  Cinematography Stills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.stills.map((still, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[16/9] rounded-xl overflow-hidden border border-border/60 bg-black/40"
                    >
                      <Image
                        src={still}
                        alt={`${project.title} Production Still ${idx + 1}`}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* NEXT PROJECT BANNER */}
        {nextProject && (
          <div className="p-8 sm:p-12 rounded-3xl border border-border/80 bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-gold-500/40 transition-colors">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
                Next Case Study
              </p>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-foreground">
                {nextProject.title}
              </h3>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                Client: {nextProject.client} • {nextProject.category}
              </p>
            </div>
            <Link
              href={`/work/${nextProject.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-widest font-semibold bg-foreground text-background hover:bg-gold-500 hover:text-black transition-colors shrink-0"
            >
              <span>Explore Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
