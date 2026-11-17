import Link from "next/link";
import Image from "next/image";
import { projectRepository } from "@/lib/data/projects";
import { blogRepository } from "@/lib/data/blog";
import { serviceRepository } from "@/lib/data/services";
import { HeroSlider } from "@/components/public/HeroSlider";
import { ArrowUpRight, Play, Sparkles, Film, Award, Clock, ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const featuredProjects = await projectRepository.getFeaturedProjects();
  const allProjects = await projectRepository.getProjects();
  const latestArticles = await blogRepository.getPosts();
  const primaryServices = await serviceRepository.getPrimaryServices();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. DYNAMIC HERO SLIDER (AUTO CROSS-FADING) */}
      <HeroSlider />

      {/* 2. SELECTED COMMERCIAL WORKS (PORTFOLIO SHOWCASE) */}
      <section id="showcase" className="py-12 md:py-24 px-4 sm:px-6 bg-background">
        <div className="container max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-16 pb-6 border-b border-border/60">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
                Selected Portfolio
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
                Commercial Projects
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-medium text-gold-400 hover:text-gold-300 transition-colors"
            >
              <span>Explore All Works ({allProjects.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
            {featuredProjects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col rounded-3xl overflow-hidden border border-border/80 bg-card hover:border-gold-500/50 transition-all duration-500 shadow-sm"
              >
                {/* Media Container with 16:9 Aspect Ratio */}
                <Link
                  href={`/work/${project.slug}`}
                  className="relative aspect-[16/9] w-full overflow-hidden bg-black/60 block"
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
                    <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-black/75 backdrop-blur-md text-white border border-white/10">
                      {project.category}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-black/75 backdrop-blur-md text-neutral-200 border border-white/10 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold-400" />
                      {project.runtime}
                    </span>
                  </div>

                  {/* Client & Title On Thumbnail */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-mono uppercase tracking-widest text-gold-400 mb-1">
                      {project.client}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {project.title}
                    </h3>
                  </div>
                </Link>

                {/* Bottom Card Summary */}
                <div className="p-6 flex flex-col justify-between flex-1 gap-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    {project.commercialImpact[0] && (
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-gold-400">
                          {project.commercialImpact[0].metric}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {project.commercialImpact[0].label}
                        </span>
                      </div>
                    )}
                    <Link
                      href={`/work/${project.slug}`}
                      className="text-xs font-semibold uppercase tracking-wider text-foreground hover:text-gold-400 inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Case Study</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. STUDIO PRODUCTION DISCIPLINES (NEW SERVICES OVERVIEW) */}
      <section className="py-12 md:py-24 px-4 sm:px-6 bg-card/40 border-y border-border/60">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-16">
            <div className="max-w-2xl">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
                Commercial Capabilities
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground">
                Production Disciplines
              </h2>
            </div>
            <Link
              href="/services"
              className="text-xs font-mono uppercase tracking-wider text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
            >
              <span>View All 6 Divisions & Capabilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {primaryServices.map((service, idx) => (
              <div
                key={service.id}
                className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-background/60 hover:border-gold-500/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-gold-400 uppercase tracking-widest font-bold">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {service.timeline}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs font-mono text-muted-foreground">
                    {service.subServices.length} Formats
                  </span>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. COMMERCIAL IMPACT STATS */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-background">
        <div className="container max-w-7xl mx-auto">
          <div className="p-8 sm:p-12 rounded-3xl border border-gold-500/30 bg-gradient-to-b from-card to-background relative overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/60">
              <div className="pt-4 md:pt-0">
                <p className="text-3xl sm:text-5xl font-black font-mono text-gold-400 mb-1">
                  45M+
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Organic Video Views
                </p>
              </div>

              <div className="pt-4 md:pt-0">
                <p className="text-3xl sm:text-5xl font-black font-mono text-gold-400 mb-1">
                  $85M+
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Client Pipeline Generated
                </p>
              </div>

              <div className="pt-4 md:pt-0">
                <p className="text-3xl sm:text-5xl font-black font-mono text-gold-400 mb-1">
                  100%
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  4K / ProRes Master Standard
                </p>
              </div>

              <div className="pt-4 md:pt-0">
                <p className="text-3xl sm:text-5xl font-black font-mono text-gold-400 mb-1">
                  &lt; 24h
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Brief Response Guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. EDITORIAL JOURNAL PREVIEW */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-card/30">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-gold-400 mb-1">
                Studio Journal
              </p>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
                Commercial Insights
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs uppercase tracking-[0.18em] font-medium text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {latestArticles.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group p-6 sm:p-8 rounded-3xl border border-border/80 bg-background hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-4">
                    <span className="text-gold-400 font-semibold uppercase">{post.category}</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-gold-400 transition-colors mb-3">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span>By {post.author.name}</span>
                  <span className="inline-flex items-center gap-1 text-foreground font-medium group-hover:text-gold-400">
                    Read Article <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLOSING CTA BANNER */}
      <section className="py-16 md:py-28 px-4 sm:px-6 bg-background relative overflow-hidden">
        <div className="container max-w-5xl mx-auto text-center flex flex-col items-center">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-gold-400 mb-3">
            Start Your Next Production
          </p>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-6">
            Let&apos;s Craft Something <br />
            <span className="gold-gradient-text">Unforgettable.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl font-light mb-8 leading-relaxed">
            Whether you need a flagship television commercial, a multi-platform DTC video campaign, 
            or high-concept 3D visuals, our directors are ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold bg-gold-500 text-black hover:bg-gold-400 hover:scale-105 transition-all duration-300 shadow-xl shadow-gold-500/20"
            >
              <span>Submit Project Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium border border-border text-foreground hover:bg-card transition-all duration-300"
            >
              <span>Book Discovery Call</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
