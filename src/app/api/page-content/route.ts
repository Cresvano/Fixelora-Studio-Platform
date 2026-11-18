import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { DEFAULT_PAGE_CONTENT } from "@/lib/data/page-content";
import { PageContent } from "@/types";

function mapDbPageContent(row: typeof schema.pageContent.$inferSelect): PageContent {
  return {
    id: row.id,
    homeHeroTag: row.homeHeroTag,
    homeHeroHeadline: row.homeHeroHeadline,
    homeHeroHeadlineAccent: row.homeHeroHeadlineAccent,
    homeHeroSubheadline: row.homeHeroSubheadline,
    homeServicesEyebrow: row.homeServicesEyebrow,
    homeServicesTitle: row.homeServicesTitle,
    aboutHeroEyebrow: row.aboutHeroEyebrow,
    aboutHeroHeadline: row.aboutHeroHeadline,
    aboutHeroHeadlineAccent: row.aboutHeroHeadlineAccent,
    aboutHeroSubheadline: row.aboutHeroSubheadline,
    aboutManifestoTitle: row.aboutManifestoTitle,
    aboutMainBody: row.aboutMainBody,
    servicesHeroHeadline: row.servicesHeroHeadline,
    servicesHeroHeadlineAccent: row.servicesHeroHeadlineAccent,
    servicesHeroSummary: row.servicesHeroSummary,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : new Date().toISOString(),
  };
}

// GET: Retrieve global page copy from Neon
export async function GET(): Promise<NextResponse> {
  try {
    if (process.env.DATABASE_URL) {
      const [row] = await db
        .select()
        .from(schema.pageContent)
        .where(eq(schema.pageContent.id, 1));

      if (row) {
        return NextResponse.json({
          success: true,
          source: "neon_postgresql",
          content: mapDbPageContent(row),
        });
      }
    }

    return NextResponse.json({
      success: true,
      source: "default_fallback",
      content: DEFAULT_PAGE_CONTENT,
    });
  } catch (error) {
    console.error("[PageContent API] GET error:", error);
    return NextResponse.json({
      success: true,
      source: "fallback_on_error",
      content: DEFAULT_PAGE_CONTENT,
    });
  }
}

// PUT: Upsert global page copy in Neon
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    const record = {
      id: 1,
      homeHeroTag: data.homeHeroTag ?? DEFAULT_PAGE_CONTENT.homeHeroTag,
      homeHeroHeadline: data.homeHeroHeadline ?? DEFAULT_PAGE_CONTENT.homeHeroHeadline,
      homeHeroHeadlineAccent:
        data.homeHeroHeadlineAccent ?? DEFAULT_PAGE_CONTENT.homeHeroHeadlineAccent,
      homeHeroSubheadline:
        data.homeHeroSubheadline ?? DEFAULT_PAGE_CONTENT.homeHeroSubheadline,
      homeServicesEyebrow:
        data.homeServicesEyebrow ?? DEFAULT_PAGE_CONTENT.homeServicesEyebrow,
      homeServicesTitle: data.homeServicesTitle ?? DEFAULT_PAGE_CONTENT.homeServicesTitle,
      aboutHeroEyebrow: data.aboutHeroEyebrow ?? DEFAULT_PAGE_CONTENT.aboutHeroEyebrow,
      aboutHeroHeadline: data.aboutHeroHeadline ?? DEFAULT_PAGE_CONTENT.aboutHeroHeadline,
      aboutHeroHeadlineAccent:
        data.aboutHeroHeadlineAccent ?? DEFAULT_PAGE_CONTENT.aboutHeroHeadlineAccent,
      aboutHeroSubheadline:
        data.aboutHeroSubheadline ?? DEFAULT_PAGE_CONTENT.aboutHeroSubheadline,
      aboutManifestoTitle:
        data.aboutManifestoTitle ?? DEFAULT_PAGE_CONTENT.aboutManifestoTitle,
      aboutMainBody: data.aboutMainBody ?? DEFAULT_PAGE_CONTENT.aboutMainBody,
      servicesHeroHeadline:
        data.servicesHeroHeadline ?? DEFAULT_PAGE_CONTENT.servicesHeroHeadline,
      servicesHeroHeadlineAccent:
        data.servicesHeroHeadlineAccent ?? DEFAULT_PAGE_CONTENT.servicesHeroHeadlineAccent,
      servicesHeroSummary:
        data.servicesHeroSummary ?? DEFAULT_PAGE_CONTENT.servicesHeroSummary,
      updatedAt: new Date(),
    };

    if (process.env.DATABASE_URL) {
      await db
        .insert(schema.pageContent)
        .values(record)
        .onConflictDoUpdate({
          target: schema.pageContent.id,
          set: {
            homeHeroTag: record.homeHeroTag,
            homeHeroHeadline: record.homeHeroHeadline,
            homeHeroHeadlineAccent: record.homeHeroHeadlineAccent,
            homeHeroSubheadline: record.homeHeroSubheadline,
            homeServicesEyebrow: record.homeServicesEyebrow,
            homeServicesTitle: record.homeServicesTitle,
            aboutHeroEyebrow: record.aboutHeroEyebrow,
            aboutHeroHeadline: record.aboutHeroHeadline,
            aboutHeroHeadlineAccent: record.aboutHeroHeadlineAccent,
            aboutHeroSubheadline: record.aboutHeroSubheadline,
            aboutManifestoTitle: record.aboutManifestoTitle,
            aboutMainBody: record.aboutMainBody,
            servicesHeroHeadline: record.servicesHeroHeadline,
            servicesHeroHeadlineAccent: record.servicesHeroHeadlineAccent,
            servicesHeroSummary: record.servicesHeroSummary,
            updatedAt: record.updatedAt,
          },
        });
    }

    try {
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/services");
      revalidatePath("/admin/pages");
    } catch {
      // dev cache notice
    }

    return NextResponse.json({
      success: true,
      content: mapDbPageContent(record),
    });
  } catch (error) {
    console.error("[PageContent API] PUT error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to save page content to Neon." },
      { status: 500 }
    );
  }
}
