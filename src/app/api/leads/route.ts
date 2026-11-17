import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { MOCK_LEADS } from "@/lib/data/leads";

// GET: Retrieve all client leads for Admin CRM
export async function GET(): Promise<NextResponse> {
  try {
    if (process.env.DATABASE_URL) {
      const liveLeads = await db
        .select()
        .from(schema.leads)
        .orderBy(desc(schema.leads.createdAt));

      return NextResponse.json({
        success: true,
        source: "neon_postgresql",
        leads: liveLeads.map((lead) => ({
          ...lead,
          createdAt: lead.createdAt ? lead.createdAt.toISOString() : new Date().toISOString(),
        })),
      });
    }

    return NextResponse.json({
      success: true,
      source: "mock_fallback",
      leads: MOCK_LEADS,
    });
  } catch (error) {
    console.error("[Leads API] GET error:", error);
    return NextResponse.json({
      success: true,
      source: "mock_fallback_on_error",
      leads: MOCK_LEADS,
    });
  }
}

// POST: Public submission endpoint for inbound client briefs & discovery calls
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();

    // Required fields validation
    if (!body.clientName || !body.company || !body.email || !body.projectType) {
      return NextResponse.json(
        { error: "Client Name, Company, Work Email, and Project Type are required fields." },
        { status: 400 }
      );
    }

    const newLeadId = `lead-${Date.now()}`;
    const newLeadRecord = {
      id: newLeadId,
      clientName: String(body.clientName).trim(),
      company: String(body.company).trim(),
      email: String(body.email).trim().toLowerCase(),
      phone: body.phone ? String(body.phone).trim() : null,
      projectType: String(body.projectType),
      estimatedBudget: body.estimatedBudget ? String(body.estimatedBudget) : "$50,000 – $100,000",
      timeline: body.timeline ? String(body.timeline) : "Within 60 Days",
      description: body.description ? String(body.description).trim() : "Direct inquiry submitted via platform.",
      track: (body.track === "call" ? "call" : "brief") as "brief" | "call",
      status: "new",
      notes: body.notes ? String(body.notes) : null,
    };

    if (process.env.DATABASE_URL) {
      await db.insert(schema.leads).values(newLeadRecord);
    }

    return NextResponse.json(
      {
        success: true,
        id: newLeadId,
        message: "Commercial project brief received successfully.",
        lead: {
          ...newLeadRecord,
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Leads API] Inbound submission error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to process project brief submission." },
      { status: 500 }
    );
  }
}

// PATCH: Update lead status or notes in Admin CRM
export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const { id, status, notes } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Lead ID is required for status update." },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      const updateData: Record<string, any> = {};
      if (status) updateData.status = status;
      if (notes !== undefined) updateData.notes = notes;

      await db
        .update(schema.leads)
        .set(updateData)
        .where(eq(schema.leads.id, id));
    }

    return NextResponse.json({ success: true, updatedId: id });
  } catch (error) {
    console.error("[Leads API] PATCH error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to update lead status." },
      { status: 500 }
    );
  }
}
