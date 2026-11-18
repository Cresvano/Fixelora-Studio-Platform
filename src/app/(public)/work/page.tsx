import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { projectRepository } from "@/lib/data/projects";
import { ProjectCategory } from "@/types";
import { Play, Clock, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Selected Commercial Works & Portfolio",
  description:
    "Watch Fixelora Studio's commercial video portfolio spanning product commercials, brand films, e-commerce campaigns, performance social ads, software explainers, and book trailers.",
  openGraph: {
    title: "Selected Commercial Works | Fixelora Studio",
    description:
      "Commercial video portfolio spanning product commercials, brand films, performance advertising, and e-commerce campaigns.",
    type: "website",
    url: "/work",
  },
  twitter: {
    card: "summary_large_image",
    title: "Selected Commercial Works | Fixelora Studio",
    description:
      "Watch our flagship commercial advertisements, brand films, and product campaigns.",
  },
};

const CATEGORIES: ProjectCategory[] = [
  "All",
  "Product Commercials",
  "Brand Films",
  "Social/Performance Advertising",
  "E-commerce",
  "Explainer/Software",
  "Storytelling/Book Trailers",
];

interface WorkPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function WorkPage({ searchParams }: WorkPageProps) {
  const resolvedParams = await searchParams;
  const currentCategory = (resolvedParams.category as ProjectCategory) || "All";
  const projects = await projectRepository.getProjects(
    currentCategory === "All" ? undefined : currentCategory
  );

  return (
    <div className="flex flex-col pt-32 pb-24 px-6 bg-background">
      <div className="container max-w-7xl mx-auto">
        {/* Page Title & Category Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-border/60">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-700 dark:text-gold-400 font-semibold mb-3">
              Commercial Portfolio
            </p>
            <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground">
              Selected Works
            </h1>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => {
              const isActive = currentCategory === cat;
              return (
                <Link
                  key={cat}
                  href={cat === "All" ? "/work" : `/work?category=${encodeURIComponent(cat)}`}
                  className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-gold-500 text-black font-semibold shadow-sm"
                      : "bg-card border border-border/80 text-muted-foreground hover:text-foreground hover:border-gold-500/40"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-border/80 bg-card hover:border-gold-500/40 transition-all duration-500"
            >
              {/* Media Container with 16:9 Aspect Ratio */}
              <Link
                href={`/work/${project.slug}`}
                className="relative aspect-[16/9] w-full overflow-hidden bg-black/40 block"
              >
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Play Trigger Badge */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 rounded-full bg-gold-500/90 text-black flex items-center justify-center shadow-xl backdrop-blur-sm transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Play className="w-6 h-6 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                    {project.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-black/60 backdrop-blur-md text-neutral-300 border border-white/10 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gold-400" />
                    {project.runtime}
                  </span>
                </div>

                {/* Client & Title On Thumbnail */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-[11px] font-mono uppercase tracking-widest text-gold-400 mb-1">
                    {project.client} • {project.year}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {project.title}
                  </h3>
                </div>
              </Link>

              {/* Bottom Card Summary */}
              <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  {project.commercialImpact[0] && (
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold font-mono text-gold-700 dark:text-gold-400">
                        {project.commercialImpact[0].metric}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {project.commercialImpact[0].label}
                      </span>
                    </div>
                  )}
                  <Link
                    href={`/work/${project.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-foreground hover:text-gold-700 dark:hover:text-gold-400 inline-flex items-center gap-1 transition-colors"
                  >
                    <span>View Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
