import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { blogRepository } from "@/lib/data/blog";
import { ArrowUpRight, Clock, User } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights & Commercial Filmmaking Journal",
  description:
    "Analytical essays, camera pipeline breakdowns, color grading techniques, and conversion case studies direct from Fixelora Studio's directors and colorists.",
  openGraph: {
    title: "Insights & Commercial Filmmaking Journal | Fixelora Studio",
    description:
      "Analytical essays, camera pipeline breakdowns, and conversion strategy from our directors and colorists.",
    type: "website",
    url: "/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights & Journal | Fixelora Studio",
    description:
      "Commercial filmmaking and advertising strategy from Fixelora Studio.",
  },
};

export default async function BlogIndexPage() {
  const posts = await blogRepository.getPosts();

  return (
    <div className="flex flex-col pt-32 pb-24 px-6 bg-background">
      <div className="container max-w-6xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-3">
            Journal & Insights
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-6">
            Commercial Filmmaking <br />
            <span className="gold-gradient-text">& Advertising Strategy.</span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
            Analytical essays, camera pipeline breakdowns, and conversion case studies direct from our directors and colorists.
          </p>
        </div>

        {/* Featured / Grid of Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group flex flex-col rounded-3xl border border-border/80 bg-card overflow-hidden hover:border-gold-500/40 transition-all duration-300"
            >
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/9] w-full bg-black/40 block overflow-hidden">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-black/70 backdrop-blur-md text-gold-400 border border-white/10">
                    {post.category}
                  </span>
                </div>
              </Link>

              <div className="p-8 flex flex-col flex-1 justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-3">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    <span>{post.readingTime}</span>
                    <span>•</span>
                    <span>{post.publishDate}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-gold-400 transition-colors mb-3">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-6 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden bg-black/40">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">
                      {post.author.name}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-semibold uppercase tracking-wider text-foreground hover:text-gold-400 inline-flex items-center gap-1"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
