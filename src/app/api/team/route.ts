import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";
import { DEFAULT_TEAM_MEMBERS } from "@/lib/data/page-content";
import { TeamMember } from "@/types";

function mapDbTeamMember(row: typeof schema.teamMembers.$inferSelect): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    headshotUrl: row.headshotUrl,
    displayOrder: row.displayOrder,
    createdAt: row.createdAt ? row.createdAt.toISOString() : new Date().toISOString(),
  };
}

// GET: Retrieve team roster from Neon
export async function GET(): Promise<NextResponse> {
  try {
    if (process.env.DATABASE_URL) {
      const rows = await db
        .select()
        .from(schema.teamMembers)
        .orderBy(asc(schema.teamMembers.displayOrder), asc(schema.teamMembers.createdAt));

      return NextResponse.json({
        success: true,
        source: "neon_postgresql",
        members: rows.map(mapDbTeamMember),
      });
    }

    return NextResponse.json({
      success: true,
      source: "default_fallback",
      members: DEFAULT_TEAM_MEMBERS,
    });
  } catch (error) {
    console.error("[Team API] GET error:", error);
    return NextResponse.json({
      success: true,
      source: "fallback_on_error",
      members: DEFAULT_TEAM_MEMBERS,
    });
  }
}

// POST: Add a new team member to Neon
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.name || !data.role || !data.bio) {
      return NextResponse.json(
        { error: "Name, Role, and Bio are required." },
        { status: 400 }
      );
    }

    const memberId = data.id || `team-${Date.now()}`;
    const newRecord = {
      id: memberId,
      name: data.name,
      role: data.role,
      bio: data.bio,
      headshotUrl:
        data.headshotUrl ||
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
      displayOrder: Number(data.displayOrder) || 0,
      createdAt: new Date(),
    };

    if (process.env.DATABASE_URL) {
      await db.insert(schema.teamMembers).values(newRecord);
    }

    try {
      revalidatePath("/about");
      revalidatePath("/admin/pages");
    } catch {
      // dev
    }

    return NextResponse.json({
      success: true,
      member: mapDbTeamMember(newRecord),
    });
  } catch (error) {
    console.error("[Team API] POST error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to add team member." },
      { status: 500 }
    );
  }
}

// PUT: Update an existing team member
export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json(
        { error: "Team member ID is required." },
        { status: 400 }
      );
    }

    const updateFields: Record<string, any> = {};
    if (data.name !== undefined) updateFields.name = data.name;
    if (data.role !== undefined) updateFields.role = data.role;
    if (data.bio !== undefined) updateFields.bio = data.bio;
    if (data.headshotUrl !== undefined) updateFields.headshotUrl = data.headshotUrl;
    if (data.displayOrder !== undefined) updateFields.displayOrder = Number(data.displayOrder);

    if (process.env.DATABASE_URL) {
      await db
        .update(schema.teamMembers)
        .set(updateFields)
        .where(eq(schema.teamMembers.id, data.id));
    }

    try {
      revalidatePath("/about");
      revalidatePath("/admin/pages");
    } catch {
      // dev
    }

    return NextResponse.json({
      success: true,
      updatedId: data.id,
      fields: updateFields,
    });
  } catch (error) {
    console.error("[Team API] PUT error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update team member." },
      { status: 500 }
    );
  }
}

// DELETE: Remove a team member from Neon
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
        { error: "Team member ID is required for deletion." },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      await db.delete(schema.teamMembers).where(eq(schema.teamMembers.id, id));
    }

    try {
      revalidatePath("/about");
      revalidatePath("/admin/pages");
    } catch {
      // dev
    }

    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    console.error("[Team API] DELETE error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to delete team member." },
      { status: 500 }
    );
  }
}
