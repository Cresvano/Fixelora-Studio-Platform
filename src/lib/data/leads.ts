import { Lead, LeadStatus } from "@/types";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    clientName: "David Sterling",
    company: "Valence Global FinTech",
    email: "david.sterling@valence.io",
    phone: "+1 (415) 890-2341",
    projectType: "Flagship Commercial / Brand Anthem",
    estimatedBudget: "$75,000 – $120,000",
    timeline: "Q1 2027 Global Launch",
    description: "We are announcing our Series B round and launching our institutional custody platform. Need a 90-second cinematic film that positions us as the modern JP Morgan.",
    track: "brief",
    status: "new",
    notes: "High priority lead. Referral from Aura Motors marketing director.",
    createdAt: "2026-11-14T09:23:00Z"
  },
  {
    id: "lead-2",
    clientName: "Chloe Beaumont",
    company: "Maison Beaumont Perfumery",
    email: "c.beaumont@maisonbeaumont.fr",
    phone: "+33 6 42 19 88 02",
    projectType: "Commercial & DTC Social Suite",
    estimatedBudget: "$45,000 – $75,000",
    timeline: "Within 60 Days",
    description: "Launching our nocturnal fragrance line across European and North American markets. Require 1x 30s broadcast and 4x vertical social cuts with high-speed macro liquid cinematography.",
    track: "call",
    status: "in_discovery",
    notes: "Discovery call scheduled for Thursday 2pm CET. Moodboard reviewed.",
    createdAt: "2026-11-10T15:45:00Z"
  },
  {
    id: "lead-3",
    clientName: "Aaron Kovacs",
    company: "Apex Precision Optics",
    email: "aaron@apexoptics.com",
    projectType: "3D & VFX Product Launch",
    estimatedBudget: "$30,000 – $50,000",
    timeline: "Next 3 Months",
    description: "Photorealistic 3D product animation detailing our patent-pending dual-sensor sports optics.",
    track: "brief",
    status: "proposal_sent",
    notes: "Proposal sent on Nov 12. Awaiting procurement sign-off.",
    createdAt: "2026-11-05T11:10:00Z"
  }
];

export const leadRepository = {
  async getLeads(): Promise<Lead[]> {
    if (process.env.DATABASE_URL) {
      try {
        const live = await db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt));
        if (live.length > 0) {
          return live.map((l) => ({
            ...l,
            phone: l.phone || undefined,
            notes: l.notes || undefined,
            track: l.track as "brief" | "call",
            status: l.status as LeadStatus,
            createdAt: l.createdAt ? l.createdAt.toISOString() : new Date().toISOString(),
          }));
        }
      } catch (err) {
        console.error("Failed to query live leads from Neon:", err);
      }
    }
    return [...MOCK_LEADS];
  },

  async getLeadById(id: string): Promise<Lead | null> {
    if (process.env.DATABASE_URL) {
      try {
        const [lead] = await db.select().from(schema.leads).where(eq(schema.leads.id, id));
        if (lead) {
          return {
            ...lead,
            phone: lead.phone || undefined,
            notes: lead.notes || undefined,
            track: lead.track as "brief" | "call",
            status: lead.status as LeadStatus,
            createdAt: lead.createdAt ? lead.createdAt.toISOString() : new Date().toISOString(),
          };
        }
      } catch (err) {
        console.error("Failed to query live lead by ID from Neon:", err);
      }
    }
    const lead = MOCK_LEADS.find((l) => l.id === id);
    return lead || null;
  },

  async createLead(data: Omit<Lead, "id" | "status" | "createdAt">): Promise<{ success: boolean; id: string }> {
    const newId = `lead-${Date.now()}`;
    const newLeadRecord = {
      id: newId,
      clientName: data.clientName,
      company: data.company,
      email: data.email,
      phone: data.phone || null,
      projectType: data.projectType,
      estimatedBudget: data.estimatedBudget,
      timeline: data.timeline,
      description: data.description,
      track: data.track,
      status: "new",
      notes: data.notes || null,
    };

    if (process.env.DATABASE_URL) {
      try {
        await db.insert(schema.leads).values(newLeadRecord);
        return { success: true, id: newId };
      } catch (err) {
        console.error("Failed to write lead to Neon:", err);
      }
    }

    const newLead: Lead = {
      ...data,
      id: newId,
      status: "new",
      createdAt: new Date().toISOString()
    };
    MOCK_LEADS.unshift(newLead);
    return { success: true, id: newId };
  },

  async updateLeadStatus(id: string, status: LeadStatus): Promise<boolean> {
    if (process.env.DATABASE_URL) {
      try {
        await db.update(schema.leads).set({ status }).where(eq(schema.leads.id, id));
        return true;
      } catch (err) {
        console.error("Failed to update lead status in Neon:", err);
      }
    }
    const lead = MOCK_LEADS.find((l) => l.id === id);
    if (lead) {
      lead.status = status;
      return true;
    }
    return false;
  }
};
