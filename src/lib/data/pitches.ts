import { Pitch } from "@/types";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export const MOCK_PITCHES: Pitch[] = [
  {
    id: "pitch-1",
    slug: "polestar-silence-in-motion",
    brandName: "Polestar Electric Performance",
    brandLogo: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=200&auto=format&fit=crop",
    contactName: "Marcus Lindqvist (Head of Global Brand)",
    proposalTitle: "Speculative Commercial: The Architecture of Pure Silence",
    customNote: "Marcus, our creative directors at Fixelora have tracked Polestar's minimalist design philosophy with great admiration. We conceived and rendered this speculative 60-second commercial to demonstrate how Scandinavian architectural brutalism can be paired with high-speed macro optics to establish Polestar as the uncontested vanguard of EV luxury.",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
    keyTakeaways: [
      "Custom 60s broadcast and 4x vertical cutdowns engineered specifically for European and Asian growth corridors.",
      "Zero combustion noise: 100% bespoke spatial sound design produced in Dolby Atmos.",
      "Turnkey production pipeline with guaranteed 3-week turnaround from pre-light to final grade."
    ],
    recommendedTimeline: "Q1 Campaign Window (4-Week Turnaround)",
    validUntil: "2026-12-31",
    status: "active",
    createdAt: "2026-10-15T08:00:00Z"
  },
  {
    id: "pitch-2",
    slug: "aura-sleep-intelligence",
    brandName: "Aura Smart Ring",
    contactName: "Sophia Chen (VP of Growth Marketing)",
    proposalTitle: "High-Converting DTC Commercial Suite: The Invisible Guardian",
    customNote: "Sophia, current DTC health ads look interchangeable. We directed this speculative campaign to break through the algorithmic noise: an emotive, cinematic story connecting biometric recovery with high-stakes executive clarity.",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
    keyTakeaways: [
      "Engineered for high-performing Paid Social ROAS (Meta, TikTok, YouTube Pre-roll).",
      "Dynamic hook variations (5 alternative opening hooks tested for thumb-stop rate).",
      "Includes full product-page video embed suite with instant load times."
    ],
    recommendedTimeline: "Immediate Holiday / Q1 Surge Deployment",
    validUntil: "2026-12-15",
    status: "active",
    createdAt: "2026-11-01T12:00:00Z"
  }
];

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

export const pitchRepository = {
  async getPitchBySlug(slug: string): Promise<Pitch | null> {
    if (process.env.DATABASE_URL) {
      try {
        const [pitch] = await db
          .select()
          .from(schema.pitches)
          .where(eq(schema.pitches.slug, slug));

        if (pitch) {
          return mapDbPitch(pitch);
        }
      } catch (err) {
        console.error("Live pitch query notice:", err);
      }
    }
    const pitch = MOCK_PITCHES.find((p) => p.slug === slug);
    return pitch || null;
  },

  async getAllPitchesAdmin(): Promise<Pitch[]> {
    if (process.env.DATABASE_URL) {
      try {
        const live = await db
          .select()
          .from(schema.pitches)
          .orderBy(desc(schema.pitches.createdAt));

        if (live.length > 0) {
          return live.map(mapDbPitch);
        }
      } catch (err) {
        console.error("Live pitches admin query notice:", err);
      }
    }
    return [...MOCK_PITCHES];
  }
};
