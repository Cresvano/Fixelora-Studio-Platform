import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogRepository } from "@/lib/data/blog";
import { ArrowLeft, ArrowUpRight, Clock, Calendar, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await blogRepository.getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: [post.category, ...post.tags],
    authors: [{ name: post.author.name }],
    openGraph: {
      title: `${post.title} | Fixelora Studio Journal`,
      description: post.excerpt,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishDate,
      authors: [post.author.name],
      images: [
        {
          url: post.featuredImage,
          width: 1600,
          height: 900,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await blogRepository.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col pt-32 pb-24 px-6 bg-background">
      <article className="container max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Articles</span>
          </Link>
        </div>

        {/* Post Metadata Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wider text-gold-400 mb-4">
            <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30">
              {post.category}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
            <span>•</span>
            <span>{post.publishDate}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-foreground leading-[1.1] mb-6">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author Block */}
          <div className="flex items-center justify-between py-4 border-y border-border/60">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-black/40">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">{post.author.name}</p>
                <p className="text-[11px] text-muted-foreground font-mono">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="hidden sm:inline-block px-2.5 py-0.5 rounded text-[10px] font-mono bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-border/80 bg-black/40 mb-14 shadow-lg">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm sm:text-base space-y-6">
          <p>
            In commercial advertising, the battle for attention is won or lost before the viewer even consciously registers the brand name. The conventional broadcast formula—slow build-up, mid-point revelation, logo resolve—no longer functions in a world dominated by friction-free digital feeds and demanding consumer expectations.
          </p>

          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground pt-4">
            1. The Visceral Sensory Hook (0:00 – 0:03)
          </h2>
          <p>
            Rather than introducing a narrative or a spoken voiceover, the most effective modern commercials deploy an immediate sensory dislocation. This can be achieved through:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Extreme macro optics:</strong> A magnified drop of botanical oil or the laser-machined edge of a timepiece.</li>
            <li><strong>Spatial acoustic contrast:</strong> Sudden silence followed by high-fidelity tactile audio.</li>
            <li><strong>Color tension:</strong> Deep blacks broken by an intentional, saturated burst of gold or chromatic radiance.</li>
          </ul>

          {/* INJECTABLE SALES CTA BLOCK (Mandated by PRD Section 4.2) */}
          <div className="my-12 p-8 sm:p-10 rounded-3xl border border-gold-500/40 bg-card relative overflow-hidden">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground mb-3">
              Ready to engineer your brand&apos;s next commercial film?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl mb-6">
              Our directors and camera operators partner with high-growth brands to direct campaigns that capture attention and drive measurable revenue.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-md"
              >
                <span>Submit 2-Min Project Brief</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/work"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-medium border border-border text-foreground hover:bg-muted transition-colors"
              >
                <span>View Portfolio Case Studies</span>
              </Link>
            </div>
          </div>

          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground pt-4">
            2. Emotional Stakes Over Feature Catalogs (0:03 – 0:18)
          </h2>
          <p>
            High-converting commercials do not explain what a product does; they dramatize how the world feels once the customer possesses it. In our campaign for <em>Aura Motors</em>, we focused on the sheer absence of vibration and noise, transforming mechanical specs into an emotional statement of dominance.
          </p>

          <h2 className="text-2xl font-bold uppercase tracking-tight text-foreground pt-4">
            3. The Unresolved Desire & Direct Call to Power (0:18 – 0:30)
          </h2>
          <p>
            The resolution must never close the loop completely. Instead, it leaves an appetizing vacuum that can only be satisfied by visiting the project page, experiencing the product, or scheduling a consultation.
          </p>
        </div>
      </article>
    </div>
  );
}
