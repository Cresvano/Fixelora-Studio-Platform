import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MOCK_BLOG_POSTS } from "@/lib/data/blog";
import { BlogPost } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

// GET: Retrieve blog posts (optional published filter)
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get("published") === "true";

    if (process.env.DATABASE_URL) {
      let query = db.select().from(schema.blogPosts).orderBy(desc(schema.blogPosts.createdAt));
      const livePosts = await query;

      if (livePosts.length > 0) {
        let filtered = livePosts;
        if (publishedOnly) {
          filtered = filtered.filter((p) => p.isPublished);
        }
        return NextResponse.json({
          success: true,
          source: "neon_postgresql",
          posts: filtered.map(mapDbBlogPost),
        });
      }
    }

    const fallback = publishedOnly ? MOCK_BLOG_POSTS.filter((p) => p.isPublished) : MOCK_BLOG_POSTS;
    return NextResponse.json({
      success: true,
      source: "mock_fallback",
      posts: fallback,
    });
  } catch (error) {
    console.error("[Blog API] GET error:", error);
    return NextResponse.json({
      success: true,
      source: "mock_fallback_on_error",
      posts: MOCK_BLOG_POSTS,
    });
  }
}

// POST: Create a new blog post in Neon
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.title || !data.content) {
      return NextResponse.json(
        { error: "Title and content are required for articles." },
        { status: 400 }
      );
    }

    const postId = data.id || `post-${Date.now()}`;
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    const newRecord = {
      id: postId,
      title: data.title,
      slug,
      excerpt: data.excerpt || data.title,
      content: data.content,
      featuredImage: data.featuredImage || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
      category: data.category || "Commercial Strategy",
      tags: Array.isArray(data.tags) ? data.tags : ["Commercial Ads", "Creative Direction"],
      author: data.author || {
        name: "Julian Vance",
        role: "Creative Director, Fixelora Studio",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
      },
      readingTime: data.readingTime || "4 min read",
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      publishDate: data.publishDate || new Date().toISOString().split("T")[0],
      ctaVariant: data.ctaVariant || "commercial",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (process.env.DATABASE_URL) {
      await db.insert(schema.blogPosts).values(newRecord);
    }

    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/admin/blog");
    } catch (e) {
      // dev
    }

    return NextResponse.json({
      success: true,
      post: mapDbBlogPost(newRecord),
    });
  } catch (error) {
    console.error("[Blog API] POST error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create blog post in Neon." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing article
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "Article ID is required." }, { status: 400 });
    }

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };
    if (data.title !== undefined) updateFields.title = data.title;
    if (data.slug !== undefined) updateFields.slug = slugify(data.slug);
    if (data.excerpt !== undefined) updateFields.excerpt = data.excerpt;
    if (data.content !== undefined) updateFields.content = data.content;
    if (data.featuredImage !== undefined) updateFields.featuredImage = data.featuredImage;
    if (data.category !== undefined) updateFields.category = data.category;
    if (data.tags !== undefined) updateFields.tags = data.tags;
    if (data.author !== undefined) updateFields.author = data.author;
    if (data.readingTime !== undefined) updateFields.readingTime = data.readingTime;
    if (data.isPublished !== undefined) updateFields.isPublished = Boolean(data.isPublished);
    if (data.publishDate !== undefined) updateFields.publishDate = data.publishDate;
    if (data.ctaVariant !== undefined) updateFields.ctaVariant = data.ctaVariant;

    if (process.env.DATABASE_URL) {
      await db
        .update(schema.blogPosts)
        .set(updateFields)
        .where(eq(schema.blogPosts.id, data.id));
    }

    try {
      revalidatePath("/blog");
      if (data.slug) revalidatePath(`/blog/${data.slug}`);
      revalidatePath("/admin/blog");
    } catch (e) {
      // dev
    }

    return NextResponse.json({
      success: true,
      updatedId: data.id,
      fields: updateFields,
    });
  } catch (error) {
    console.error("[Blog API] PUT error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update article." },
      { status: 500 }
    );
  }
}

// DELETE: Remove an article from Neon
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
      } catch {
        // no body
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required for deletion." },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      await db.delete(schema.blogPosts).where(eq(schema.blogPosts.id, id));
    }

    try {
      revalidatePath("/blog");
      revalidatePath("/admin/blog");
    } catch (e) {
      // dev
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("[Blog API] DELETE error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete article." },
      { status: 500 }
    );
  }
}
