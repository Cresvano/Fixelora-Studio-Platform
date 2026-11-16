import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { formatFileSize } from "@/lib/utils";

const ALLOWED_MIME_TYPES = [
  // Commercial Video Formats
  "video/mp4",
  "video/quicktime", // Apple ProRes, QuickTime MOV
  "video/webm",
  "video/x-matroska",
  // Image & Poster Thumbnail Formats
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export async function POST(request: Request): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") || "";

  // 1. Direct Client-Side Token Handler (@vercel/blob/client handleUpload)
  if (contentType.includes("application/json")) {
    try {
      const body = (await request.json()) as HandleUploadBody;
      const jsonResponse = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          return {
            allowedContentTypes: ALLOWED_MIME_TYPES,
            maximumSizeInBytes: 500 * 1024 * 1024, // 500MB
            addRandomSuffix: true,
          };
        },
        onUploadCompleted: async ({ blob }) => {
          console.log("[Vercel Blob] Upload completed client-side:", blob.url);
        },
      });

      return NextResponse.json(jsonResponse);
    } catch (error) {
      console.error("[Vercel Blob] Client upload token error:", error);
      return NextResponse.json(
        { error: (error as Error).message || "Token generation failed" },
        { status: 400 }
      );
    }
  }

  // 2. Direct Multipart FormData or Raw File Upload
  try {
    let file: File | Blob | null = null;
    let filename = "";
    let mimeType = "";
    let assetType = "original_video";
    let associatedProjectId: string | null = null;
    let associatedProjectTitle: string | null = null;
    let dimensions: string | null = null;
    let duration: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const formFile = formData.get("file");

      if (!formFile || !(formFile instanceof Blob)) {
        return NextResponse.json(
          { error: "No valid file attached to upload request." },
          { status: 400 }
        );
      }

      file = formFile;
      filename = (formFile as File).name || "unnamed_media_asset";
      mimeType = formFile.type || "application/octet-stream";
      assetType = (formData.get("assetType") as string) || "original_video";
      associatedProjectId = (formData.get("associatedProjectId") as string) || null;
      associatedProjectTitle = (formData.get("associatedProjectTitle") as string) || null;
      dimensions = (formData.get("dimensions") as string) || null;
      duration = (formData.get("duration") as string) || null;
    } else {
      // Raw Stream Upload with ?filename=
      const { searchParams } = new URL(request.url);
      filename = searchParams.get("filename") || `upload-${Date.now()}`;
      assetType = searchParams.get("assetType") || "original_video";
      mimeType = contentType.split(";")[0].trim() || "application/octet-stream";
      file = await request.blob();
    }

    // Validate MIME type
    if (mimeType && !ALLOWED_MIME_TYPES.includes(mimeType)) {
      return NextResponse.json(
        {
          error: `Unsupported file format (${mimeType}). Permitted formats include ProRes/MOV, MP4, WebM, JPEG, PNG, and WebP.`,
        },
        { status: 400 }
      );
    }

    // Determine storage path prefix based on asset type
    const folder =
      assetType === "thumbnail"
        ? "thumbnails"
        : assetType === "playback_video"
        ? "playback"
        : "masters";

    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const blobPath = `fixelora/${folder}/${sanitizedFilename}`;

    // Upload to Vercel Blob
    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: mimeType,
    });

    // Derive file attributes
    const fileSize = file.size;
    const formattedSize = formatFileSize(fileSize);
    const mediaId = `media-${Date.now()}`;

    const newAssetRecord = {
      id: mediaId,
      filename: filename,
      assetType: assetType,
      fileSize: fileSize,
      formattedSize: formattedSize,
      mimeType: mimeType,
      dimensions: dimensions || (assetType === "thumbnail" ? "1920x1080" : "3840x2160"),
      duration: duration || (assetType === "thumbnail" ? null : "0:60"),
      url: blob.url,
      associatedProjectId: associatedProjectId || null,
      associatedProjectTitle: associatedProjectTitle || null,
    };

    // Save record to Neon PostgreSQL
    if (process.env.DATABASE_URL) {
      try {
        await db.insert(schema.mediaAssets).values(newAssetRecord);
      } catch (dbError) {
        console.error("[Vercel Blob] Database record synchronization notice:", dbError);
      }
    }

    return NextResponse.json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      asset: {
        ...newAssetRecord,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("[Vercel Blob] Upload handler error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal server upload failure." },
      { status: 500 }
    );
  }
}
