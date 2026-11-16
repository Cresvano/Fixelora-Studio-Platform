import Link from "next/link";
import Image from "next/image";
import { projectRepository } from "@/lib/data/projects";
import { blogRepository } from "@/lib/data/blog";
import { ArrowUpRight, Play, Sparkles, Film, Award, Clock, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const featuredProjects = await projectRepository.getFeaturedProjects();
  const allProjects = await projectRepository.getProjects();
  const latestArticles = await blogRepository.getPosts();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* 1. HERO SHOWREEL SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-black">
        {/* Cinematic Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1920&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-45 scale-105 transition-transform duration-1000"
          >
            <source
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
              type="video/mp4"
            />
          </video>
          {/* Gradients to blend smoothly with theme */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-background/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container max-w-6xl mx-auto flex flex-col items-center text-center">
          {/* Micro Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold-500/30 bg-background/60 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-gold-300 font-medium">
              Commercial Video Production Studio
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05] max-w-5xl mb-6">
            Creative Ads. <br />
            <span className="gold-gradient-text">Powerful Stories.</span>
          </h1>

          {/* Editorial Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed mb-10 text-balance">
            We direct and produce broadcast-grade commercial campaigns, luxury brand films, 
            and high-converting video suites for visionary brands worldwide.
          </p>

          {/* Action Triggers */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.18em] font-semibold bg-gold-500 text-black hover:bg-gold-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-500/20"
            >
              <span>Initiate Project Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="#showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs uppercase tracking-[0.18em] font-medium border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              <Play className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
              <span>Watch Showreel</span>
            </Link>
          </div>

          {/* Bottom Reel Spec Bar */}
          <div className="mt-16 pt-8 border-t border-white/10 w-full max-w-3xl flex flex-wrap items-center justify-between gap-4 text-[11px] font-mono text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">MASTER FORMAT:</span>
              <span>4K ProRes 4444 XQ / RED 8K RAW</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">LOCATIONS:</span>
              <span>Los Angeles • London • Global Remote</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">AUDIO:</span>
              <span>Dolby Atmos Spatial Master</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SELECTED COMMERCIAL WORKS (PORTFOLIO SHOWCASE) */}
      <section id="showcase" className="py-24 px-6 bg-background">
        <div className="container max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-6 border-b border-border/60">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-2">
                Selected Portfolio
              </p>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {featuredProjects.slice(0, 4).map((project, idx) => (
              <div
                key={project.id}
                className="group relative flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-card hover:border-gold-500/40 transition-all duration-500"
              >
                {/* Media Container with 16:9 Aspect Ratio */}
                <Link href={`/work/${project.slug}`} className="relative aspect-[16/9] w-full overflow-hidden bg-black/40 block">
                  <Image
                    src={project.thumbnailUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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
                      {project.client}
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
                    {/* Primary Commercial Metric */}
                    {project.commercialImpact[0] && (
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold font-mono text-gold-400">
                          {project.commercialImpact[0].metric}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
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

      {/* 3. STUDIO CAPABILITIES SECTION */}
      <section className="py-24 px-6 bg-card/50 border-y border-border/60">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-2">
              End-To-End Capabilities
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground">
              What We Produce
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Capability 1 */}
            <div className="p-8 rounded-2xl border border-border/60 bg-background/50 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-6">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-foreground mb-3">
                  Broadcast & TV Commercials
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  High-concept 30s and 60s television spots built for national and global broadcast, theatrical distribution, and digital prestige.
                </p>
              </div>
              <p className="text-[10px] font-mono text-gold-400/80 mt-6 pt-4 border-t border-border/40 uppercase">
                4K Master • Clearcast Ready
              </p>
            </div>

            {/* Capability 2 */}
            <div className="p-8 rounded-2xl border border-border/60 bg-background/50 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-foreground mb-3">
                  DTC & Paid Social Suites
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  High-converting vertical 9:16 and 4:5 video ads with tested psychological hooks engineered to maximize ROAS on Meta and TikTok.
                </p>
              </div>
              <p className="text-[10px] font-mono text-gold-400/80 mt-6 pt-4 border-t border-border/40 uppercase">
                Performance Optimized
              </p>
            </div>

            {/* Capability 3 */}
            <div className="p-8 rounded-2xl border border-border/60 bg-background/50 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-foreground mb-3">
                  Brand Anthems & Keynotes
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Long-form cinematic manifestos for enterprise launches, venture funding announcements, and industry-defining product keynotes.
                </p>
              </div>
              <p className="text-[10px] font-mono text-gold-400/80 mt-6 pt-4 border-t border-border/40 uppercase">
                Venture & Enterprise Scale
              </p>
            </div>

            {/* Capability 4 */}
            <div className="p-8 rounded-2xl border border-border/60 bg-background/50 hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 mb-6">
                  <Play className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-foreground mb-3">
                  3D Animation & VFX
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Photorealistic CGI product renders, exploded mechanical views, and surreal fluid simulations for hardware and luxury brands.
                </p>
              </div>
              <p className="text-[10px] font-mono text-gold-400/80 mt-6 pt-4 border-t border-border/40 uppercase">
                Photorealistic Physics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEASURABLE COMMERCIAL IMPACT STATS */}
      <section className="py-20 px-6 bg-background">
        <div className="container max-w-7xl mx-auto">
          <div className="p-12 rounded-3xl border border-gold-500/30 bg-gradient-to-b from-card to-background relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border/60">
              <div className="pt-6 md:pt-0">
                <p className="text-4xl sm:text-5xl font-black font-mono text-gold-400 mb-2">
                  45M+
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Organic Video Views
                </p>
              </div>

              <div className="pt-6 md:pt-0">
                <p className="text-4xl sm:text-5xl font-black font-mono text-gold-400 mb-2">
                  $85M+
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Client Pipeline Generated
                </p>
              </div>

              <div className="pt-6 md:pt-0">
                <p className="text-4xl sm:text-5xl font-black font-mono text-gold-400 mb-2">
                  100%
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  4K / ProRes Master Standard
                </p>
              </div>

              <div className="pt-6 md:pt-0">
                <p className="text-4xl sm:text-5xl font-black font-mono text-gold-400 mb-2">
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

      {/* 5. EDITORIAL JOURNAL / INSIGHTS PREVIEW */}
      <section className="py-20 px-6 bg-card/30">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-2">
                Studio Journal
              </p>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-foreground">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestArticles.slice(0, 2).map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group p-8 rounded-2xl border border-border/60 bg-background hover:border-gold-500/40 transition-all duration-300 flex flex-col justify-between"
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

      {/* 6. HIGH-CONVERTING CLOSING CTA BANNER */}
      <section className="py-28 px-6 bg-background relative overflow-hidden">
        <div className="container max-w-5xl mx-auto text-center flex flex-col items-center">
          <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-gold-400 mb-4">
            Start Your Next Production
          </p>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-8">
            Let&apos;s Craft Something <br />
            <span className="gold-gradient-text">Unforgettable.</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl font-light mb-10 leading-relaxed">
            Whether you need a flagship television commercial, a multi-platform DTC video campaign, 
            or high-concept 3D visuals, our directors are ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-semibold bg-gold-500 text-black hover:bg-gold-400 hover:scale-105 transition-all duration-300 shadow-xl shadow-gold-500/20"
            >
              <span>Submit Project Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium border border-border text-foreground hover:bg-card transition-all duration-300"
            >
              <span>Book Discovery Call</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
