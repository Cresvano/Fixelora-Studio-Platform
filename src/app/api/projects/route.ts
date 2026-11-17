import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MOCK_PROJECTS } from "@/lib/data/projects";
import { Project, ProjectCategory } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// GET: Retrieve all projects (with optional status or category filter)
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const publishedOnly = searchParams.get("published") === "true";

    if (process.env.DATABASE_URL) {
      let query = db.select().from(schema.projects).orderBy(desc(schema.projects.createdAt));
      const liveProjects = await query;

      let filtered = liveProjects;
      if (publishedOnly) {
        filtered = filtered.filter((p) => p.isPublished);
      }
      if (category && category !== "All") {
        filtered = filtered.filter((p) => p.category === category);
      }

      const mapped: Project[] = filtered.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        client: p.client,
        year: p.year,
        category: (p.category as Exclude<ProjectCategory, "All">) || "Commercial",
        tags: (p.tags as string[]) || [],
        runtime: p.runtime,
        aspectRatio: (p.aspectRatio as "16:9" | "9:16" | "2.39:1") || "16:9",
        tagline: p.tagline || "",
        description: p.description,
        creativeObjective: p.creativeObjective || "",
        targetAudience: p.targetAudience || "",
        deliverables: (p.deliverables as string[]) || [],
        commercialImpact: (p.commercialImpact as any) || [],
        stills: (p.stills as string[]) || [],
        originalVideoUrl: p.originalVideoUrl || "",
        playbackVideoUrl: p.playbackVideoUrl || "",
        thumbnailUrl: p.thumbnailUrl,
        featured: p.featured,
        isPublished: p.isPublished,
        createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
      }));

      return NextResponse.json({
        success: true,
        source: "neon_postgresql",
        projects: mapped,
      });
    }

    return NextResponse.json({
      success: true,
      source: "mock_fallback",
      projects: MOCK_PROJECTS,
    });
  } catch (error) {
    console.error("[Projects API] GET error:", error);
    return NextResponse.json({
      success: true,
      source: "mock_fallback_on_error",
      projects: MOCK_PROJECTS,
    });
  }
}

// POST: Create a new commercial project in Neon
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.title || !data.client || !data.category) {
      return NextResponse.json(
        { error: "Title, Client name, and Category are required." },
        { status: 400 }
      );
    }

    const projectId = data.id || `proj-${Date.now()}`;
    const slug = data.slug ? slugify(data.slug) : slugify(data.title);

    const newRecord = {
      id: projectId,
      title: data.title,
      slug: slug,
      client: data.client,
      year: data.year || new Date().getFullYear().toString(),
      category: data.category,
      tags: Array.isArray(data.tags) ? data.tags : [],
      runtime: data.runtime || "1:00",
      aspectRatio: data.aspectRatio || "16:9",
      tagline: data.tagline || null,
      description: data.description || "",
      creativeObjective: data.creativeObjective || null,
      targetAudience: data.targetAudience || null,
      deliverables: Array.isArray(data.deliverables) ? data.deliverables : [],
      commercialImpact: Array.isArray(data.commercialImpact) ? data.commercialImpact : [],
      stills: Array.isArray(data.stills) ? data.stills : [],
      originalVideoUrl: data.originalVideoUrl || null,
      playbackVideoUrl: data.playbackVideoUrl || null,
      thumbnailUrl: data.thumbnailUrl || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
      featured: Boolean(data.featured),
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (process.env.DATABASE_URL) {
      await db.insert(schema.projects).values(newRecord);
    }

    // Trigger instant cache invalidation
    try {
      revalidatePath("/");
      revalidatePath("/work");
      revalidatePath(`/work/${slug}`);
      revalidatePath("/admin/portfolio");
    } catch (e) {
      // Revalidation in dev
    }

    return NextResponse.json(
      {
        success: true,
        project: {
          ...newRecord,
          createdAt: newRecord.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Projects API] POST error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create project." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing commercial project in Neon
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "Project ID is required for update." },
        { status: 400 }
      );
    }

    const slug = data.slug ? slugify(data.slug) : (data.title ? slugify(data.title) : undefined);

    const updateFields: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (data.title !== undefined) updateFields.title = data.title;
    if (slug !== undefined) updateFields.slug = slug;
    if (data.client !== undefined) updateFields.client = data.client;
    if (data.year !== undefined) updateFields.year = data.year;
    if (data.category !== undefined) updateFields.category = data.category;
    if (data.tags !== undefined) updateFields.tags = data.tags;
    if (data.runtime !== undefined) updateFields.runtime = data.runtime;
    if (data.aspectRatio !== undefined) updateFields.aspectRatio = data.aspectRatio;
    if (data.tagline !== undefined) updateFields.tagline = data.tagline;
    if (data.description !== undefined) updateFields.description = data.description;
    if (data.creativeObjective !== undefined) updateFields.creativeObjective = data.creativeObjective;
    if (data.targetAudience !== undefined) updateFields.targetAudience = data.targetAudience;
    if (data.deliverables !== undefined) updateFields.deliverables = data.deliverables;
    if (data.commercialImpact !== undefined) updateFields.commercialImpact = data.commercialImpact;
    if (data.stills !== undefined) updateFields.stills = data.stills;
    if (data.originalVideoUrl !== undefined) updateFields.originalVideoUrl = data.originalVideoUrl;
    if (data.playbackVideoUrl !== undefined) updateFields.playbackVideoUrl = data.playbackVideoUrl;
    if (data.thumbnailUrl !== undefined) updateFields.thumbnailUrl = data.thumbnailUrl;
    if (data.featured !== undefined) updateFields.featured = Boolean(data.featured);
    if (data.isPublished !== undefined) updateFields.isPublished = Boolean(data.isPublished);

    if (process.env.DATABASE_URL) {
      await db
        .update(schema.projects)
        .set(updateFields)
        .where(eq(schema.projects.id, data.id));
    }

    // Invalidate caches
    try {
      revalidatePath("/");
      revalidatePath("/work");
      if (slug) revalidatePath(`/work/${slug}`);
      revalidatePath("/admin/portfolio");
    } catch (e) {
      // Revalidation in dev
    }

    return NextResponse.json({
      success: true,
      updatedId: data.id,
      fields: updateFields,
    });
  } catch (error) {
    console.error("[Projects API] PUT error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update project." },
      { status: 500 }
    );
  }
}

// DELETE: Remove project from Neon
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
        { error: "Project ID is required for deletion." },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      await db.delete(schema.projects).where(eq(schema.projects.id, id));
    }

    try {
      revalidatePath("/");
      revalidatePath("/work");
      revalidatePath("/admin/portfolio");
    } catch (e) {
      // dev
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("[Projects API] DELETE error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete project." },
      { status: 500 }
    );
  }
}
