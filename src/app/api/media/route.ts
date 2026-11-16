import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MOCK_MEDIA_ASSETS } from "@/lib/data/media";

// GET: Fetch all active media assets
export async function GET(): Promise<NextResponse> {
  try {
    if (process.env.DATABASE_URL) {
      const liveAssets = await db
        .select()
        .from(schema.mediaAssets)
        .orderBy(desc(schema.mediaAssets.uploadedAt));

      return NextResponse.json({
        success: true,
        source: "neon_postgresql",
        assets: liveAssets.map((asset) => ({
          ...asset,
          uploadedAt: asset.uploadedAt ? asset.uploadedAt.toISOString() : new Date().toISOString(),
        })),
      });
    }

    return NextResponse.json({
      success: true,
      source: "mock_fallback",
      assets: MOCK_MEDIA_ASSETS,
    });
  } catch (error) {
    console.error("[Media API] GET error:", error);
    return NextResponse.json({
      success: true,
      source: "mock_fallback_on_error",
      assets: MOCK_MEDIA_ASSETS,
    });
  }
}

// POST: Save a new media asset record manually to Neon
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.filename || !data.url) {
      return NextResponse.json(
        { error: "Filename and URL are mandatory fields." },
        { status: 400 }
      );
    }

    const newRecord = {
      id: data.id || `media-${Date.now()}`,
      filename: data.filename,
      assetType: data.assetType || "original_video",
      fileSize: Number(data.fileSize) || 0,
      formattedSize: data.formattedSize || "0 MB",
      mimeType: data.mimeType || "application/octet-stream",
      dimensions: data.dimensions || null,
      duration: data.duration || null,
      url: data.url,
      associatedProjectId: data.associatedProjectId || null,
      associatedProjectTitle: data.associatedProjectTitle || null,
    };

    if (process.env.DATABASE_URL) {
      await db.insert(schema.mediaAssets).values(newRecord);
    }

    return NextResponse.json({
      success: true,
      asset: {
        ...newRecord,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Media API] POST error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to persist media asset." },
      { status: 500 }
    );
  }
}

// DELETE: Remove media asset from Neon and purge blob from Vercel Storage
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get("id");
    let url = searchParams.get("url");

    if (!id) {
      try {
        const body = await request.json();
        id = body.id;
        url = body.url || url;
      } catch {
        // no body provided
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "Asset ID is required for deletion." },
        { status: 400 }
      );
    }

    // Purge from Vercel Blob if URL belongs to Vercel Blob storage
    if (url && url.includes(".blob.vercel-storage.com")) {
      try {
        await del(url);
      } catch (blobDelErr) {
        console.warn("[Vercel Blob] Blob deletion warning:", blobDelErr);
      }
    }

    // Delete record from Neon
    if (process.env.DATABASE_URL) {
      await db.delete(schema.mediaAssets).where(eq(schema.mediaAssets.id, id));
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("[Media API] DELETE error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete media asset." },
      { status: 500 }
    );
  }
}
