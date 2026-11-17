import { BlogPost } from "@/types";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "The Anatomy of a High-Converting 30-Second Commercial in 2026",
    slug: "anatomy-of-high-converting-30-second-commercial",
    excerpt: "Why the standard 3-act structure is obsolete, and how leading luxury and tech brands hook affluent audiences in the first 1.8 seconds.",
    content: `
# The Anatomy of a High-Converting 30-Second Commercial

In commercial advertising, the battle for attention is won or lost before the viewer even consciously registers the brand name. The conventional broadcast formula—slow build-up, mid-point revelation, logo resolve—no longer functions in a world dominated by friction-free digital feeds and demanding consumer expectations.

## 1. The Visceral Sensory Hook (0:00 – 0:03)
Rather than introducing a narrative or a spoken voiceover, the most effective modern commercials deploy an immediate sensory dislocation. This can be achieved through:
* **Extreme macro optics:** A magnified drop of botanical oil or the laser-machined edge of a timepiece.
* **Spatial acoustic contrast:** Sudden silence followed by high-fidelity tactile audio.
* **Color tension:** Deep blacks broken by an intentional, saturated burst of gold or chromatic radiance.

## 2. Emotional Stakes Over Feature Catalogs (0:03 – 0:18)
High-converting commercials do not explain what a product does; they dramatize how the world feels once the customer possesses it. In our campaign for *Aura Motors*, we focused on the sheer absence of vibration and noise, transforming mechanical specs into an emotional statement of dominance.

## 3. The Unresolved Desire & Direct Call to Power (0:18 – 0:30)
The resolution must never close the loop completely. Instead, it leaves an appetizing vacuum that can only be satisfied by visiting the project page, experiencing the product, or scheduling a consultation.
    `,
    featuredImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
    category: "Commercial Strategy",
    tags: ["Creative Direction", "Conversion", "Commercial Ads"],
    author: {
      name: "Julian Vance",
      role: "Creative Director, Fixelora Studio",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
    },
    readingTime: "4 min read",
    isPublished: true,
    publishDate: "2026-10-24",
    ctaVariant: "commercial"
  },
  {
    id: "post-2",
    title: "Color Grading for Luxury Brands: Beyond the Teal-and-Orange Cliché",
    slug: "color-grading-luxury-brands-beyond-teal-orange",
    excerpt: "How bespoke LUT engineering and highlight roll-off shape perceptual brand value and command 7-figure price tags.",
    content: `
# Color Grading for Luxury Brands

When luxury brands shoot commercial campaigns, the colorist is not simply adjusting exposure; they are calibrating perceived brand equity. 

## The Fallacy of Saturated Presets
Commercials targeting ultra-high-net-worth consumers require restrained color spaces. When shadows are clipped to pure digital zeros or highlights are blown out into harsh white clips, the subconscious signal is "consumer electronic."

## Preserving Skin Tones in Dynamic Light
In high-fashion and automotive cinematography, we build custom color matrices specifically designed to isolate and protect natural skin tones even when shooting under harsh sodium-vapor city lamps or blinding alpine snow.
    `,
    featuredImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop",
    category: "Post-Production",
    tags: ["Color Grading", "Cinematography", "Luxury"],
    author: {
      name: "Elena Rostova",
      role: "Senior Colorist & Technical Director",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
    },
    readingTime: "6 min read",
    isPublished: true,
    publishDate: "2026-09-18",
    ctaVariant: "strategy"
  }
];

function mapDbBlogPost(p: typeof schema.blogPosts.$inferSelect): BlogPost {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    featuredImage: p.featuredImage,
    category: p.category,
    tags: (p.tags as string[]) || [],
    author: (p.author as { name: string; role: string; avatar: string }) || {
      name: "Julian Vance",
      role: "Creative Director",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    readingTime: p.readingTime || "4 min read",
    isPublished: p.isPublished,
    publishDate: p.publishDate || new Date().toISOString().split("T")[0],
    ctaVariant: (p.ctaVariant as "commercial" | "strategy" | "dtc") || "commercial",
  };
}

export const blogRepository = {
  async getPosts(): Promise<BlogPost[]> {
    if (process.env.DATABASE_URL) {
      try {
        const live = await db
          .select()
          .from(schema.blogPosts)
          .orderBy(desc(schema.blogPosts.createdAt));

        if (live.length > 0) {
          return live.filter((p) => p.isPublished).map(mapDbBlogPost);
        }
      } catch (err) {
        console.error("Live blog query notice:", err);
      }
    }
    return MOCK_BLOG_POSTS.filter((p) => p.isPublished);
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (process.env.DATABASE_URL) {
      try {
        const [post] = await db
          .select()
          .from(schema.blogPosts)
          .where(eq(schema.blogPosts.slug, slug));

        if (post) {
          return mapDbBlogPost(post);
        }
      } catch (err) {
        console.error("Live blog slug query notice:", err);
      }
    }
    const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
    return post || null;
  },

  async getAllPostsAdmin(): Promise<BlogPost[]> {
    if (process.env.DATABASE_URL) {
      try {
        const live = await db
          .select()
          .from(schema.blogPosts)
          .orderBy(desc(schema.blogPosts.createdAt));

        if (live.length > 0) {
          return live.map(mapDbBlogPost);
        }
      } catch (err) {
        console.error("Live blog admin query notice:", err);
      }
    }
    return [...MOCK_BLOG_POSTS];
  }
};
