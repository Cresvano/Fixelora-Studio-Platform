import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MOCK_PITCHES } from "@/lib/data/pitches";
import { Pitch } from "@/types";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapDbPitch(p: typeof schema.pitches.$inferSelect): Pitch {
  return {
    id: p.id,
    slug: p.slug,
    brandName: p.brandName,
    brandLogo: p.brandLogo || undefined,
    contactName: p.contactName,
    proposalTitle: p.proposalTitle,
    customNote: p.customNote,
    playbackVideoUrl: p.playbackVideoUrl,
    thumbnailUrl: p.thumbnailUrl,
    keyTakeaways: (p.keyTakeaways as string[]) || [],
    recommendedTimeline: p.recommendedTimeline || "Immediate Turnaround",
    validUntil: p.validUntil || "2026-12-31",
    status: (p.status as "active" | "viewed" | "accepted" | "expired") || "active",
    createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
  };
}

// GET: Retrieve all private pitches
export async function GET(): Promise<NextResponse> {
  try {
    if (process.env.DATABASE_URL) {
      const livePitches = await db
        .select()
        .from(schema.pitches)
        .orderBy(desc(schema.pitches.createdAt));

      if (livePitches.length > 0) {
        return NextResponse.json({
          success: true,
          source: "neon_postgresql",
          pitches: livePitches.map(mapDbPitch),
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: "mock_fallback",
      pitches: MOCK_PITCHES,
    });
  } catch (error) {
    console.error("[Pitches API] GET error:", error);
    return NextResponse.json({
      success: true,
      source: "mock_fallback_on_error",
      pitches: MOCK_PITCHES,
    });
  }
}

// POST: Create a new pitch in Neon
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.brandName || !data.proposalTitle || !data.contactName) {
      return NextResponse.json(
        { error: "Brand name, Contact name, and Proposal title are required." },
        { status: 400 }
      );
    }

    const pitchId = data.id || `pitch-${Date.now()}`;
    const slug = data.slug ? slugify(data.slug) : slugify(`${data.brandName}-${Date.now().toString().slice(-4)}`);

    const newRecord = {
      id: pitchId,
      slug,
      brandName: data.brandName,
      brandLogo: data.brandLogo || null,
      contactName: data.contactName,
      proposalTitle: data.proposalTitle,
      customNote: data.customNote || "",
      playbackVideoUrl: data.playbackVideoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnailUrl: data.thumbnailUrl || "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
      keyTakeaways: Array.isArray(data.keyTakeaways) ? data.keyTakeaways : [],
      recommendedTimeline: data.recommendedTimeline || "4-Week Turnaround",
      validUntil: data.validUntil || "2026-12-31",
      status: data.status || "active",
      createdAt: new Date(),
    };

    if (process.env.DATABASE_URL) {
      await db.insert(schema.pitches).values(newRecord);
    }

    try {
      revalidatePath("/admin/pitches");
      revalidatePath(`/pitch/${slug}`);
    } catch (e) {
      // dev mode cache notice
    }

    return NextResponse.json({
      success: true,
      pitch: mapDbPitch(newRecord),
    });
  } catch (error) {
    console.error("[Pitches API] POST error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create pitch in Neon." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing pitch
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "Pitch ID is required." }, { status: 400 });
    }

    const updateFields: Record<string, any> = {};
    if (data.brandName !== undefined) updateFields.brandName = data.brandName;
    if (data.brandLogo !== undefined) updateFields.brandLogo = data.brandLogo;
    if (data.contactName !== undefined) updateFields.contactName = data.contactName;
    if (data.proposalTitle !== undefined) updateFields.proposalTitle = data.proposalTitle;
    if (data.customNote !== undefined) updateFields.customNote = data.customNote;
    if (data.playbackVideoUrl !== undefined) updateFields.playbackVideoUrl = data.playbackVideoUrl;
    if (data.thumbnailUrl !== undefined) updateFields.thumbnailUrl = data.thumbnailUrl;
    if (data.keyTakeaways !== undefined) updateFields.keyTakeaways = data.keyTakeaways;
    if (data.recommendedTimeline !== undefined) updateFields.recommendedTimeline = data.recommendedTimeline;
    if (data.validUntil !== undefined) updateFields.validUntil = data.validUntil;
    if (data.status !== undefined) updateFields.status = data.status;
    if (data.slug !== undefined) updateFields.slug = slugify(data.slug);

    if (process.env.DATABASE_URL) {
      await db
        .update(schema.pitches)
        .set(updateFields)
        .where(eq(schema.pitches.id, data.id));
    }

    try {
      revalidatePath("/admin/pitches");
      if (data.slug) revalidatePath(`/pitch/${data.slug}`);
    } catch (e) {
      // dev
    }

    return NextResponse.json({
      success: true,
      updatedId: data.id,
      fields: updateFields,
    });
  } catch (error) {
    console.error("[Pitches API] PUT error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update pitch." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a pitch from Neon
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
        { error: "Pitch ID is required for deletion." },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      await db.delete(schema.pitches).where(eq(schema.pitches.id, id));
    }

    try {
      revalidatePath("/admin/pitches");
    } catch (e) {
      // dev
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("[Pitches API] DELETE error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete pitch." },
      { status: 500 }
    );
  }
}
