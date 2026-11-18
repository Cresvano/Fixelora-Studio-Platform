import { PageContent, TeamMember } from "@/types";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { asc, eq } from "drizzle-orm";

export const DEFAULT_PAGE_CONTENT: PageContent = {
  id: 1,
  homeHeroTag: "Commercial Video Production Studio",
  homeHeroHeadline: "Creative Ads.",
  homeHeroHeadlineAccent: "Powerful Stories.",
  homeHeroSubheadline:
    "We direct broadcast-grade commercials, luxury product films, and cinematic brand campaigns for visionary companies worldwide.",
  sliderIntroText:
    "Built to help ambitious brands stand out, earn instant trust, and turn attention into measurable sales.",
  homeServicesEyebrow: "Commercial Capabilities",
  homeServicesTitle: "Production Disciplines",
  aboutHeroEyebrow: "The Studio Story",
  aboutHeroHeadline: "We Reject Generic.",
  aboutHeroHeadlineAccent: "We Direct Prestige.",
  aboutHeroSubheadline:
    "Fixelora Studio was founded on a simple conviction: commercial advertising should be as unforgettable, visually breathtaking, and emotionally resonant as award-winning cinema.",
  aboutManifestoTitle: "Cinema Craftsmanship Meets Commercial Strategy",
  aboutMainBody:
    "In an era where digital noise is at an all-time peak, most brand videos disappear into the background. They look identical, sound identical, and convert poorly.\n\nFixelora operates as an agile, international commercial production unit. We strip away agency bloat to pair brand leaders directly with world-class directors, cinematographers, and visual artists.",
  servicesHeroHeadline: "Commercial Video",
  servicesHeroHeadlineAccent: "Engineered For Prestige.",
  servicesHeroSummary:
    "Fixelora Studio combines tier-one cinematography, high-concept narrative direction, and algorithmic performance strategy. We direct broadcast-grade commercials and multi-platform visual campaigns that position brands at the summit of their industry.",
  globalCtaHeading: "Let's Craft Something Unforgettable.",
  globalCtaSubtext:
    "Whether you need a flagship product commercial, a high-converting social ad campaign, or an unforgettable brand film, our team is ready to bring your vision to life.",
  footerDescription:
    "Fixelora Studio is an international commercial video production agency. We combine cinematic craftsmanship, high-concept visual storytelling, and marketing strategy to produce high-impact brand commercials worldwide.",
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "team-1",
    name: "Julian Vance",
    role: "Founder & Executive Creative Director",
    bio: "Former commercial director at RSA Films and Grey London. Julian has directed global campaigns for Audi, Bang & Olufsen, and Polestar, specializing in automotive velocity and quiet luxury aesthetics.",
    headshotUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    displayOrder: 1,
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "team-2",
    name: "Elena Rostova",
    role: "Technical Director & Senior Colorist",
    bio: "Pioneering colorist and camera pipeline architect. Elena supervises the studio's custom look profile creation, ACES color workflow, and high-speed Phantom macro shoots.",
    headshotUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    displayOrder: 2,
    createdAt: "2026-01-02T00:00:00Z",
  },
  {
    id: "team-3",
    name: "Kaelen Voss",
    role: "Head of 3D & Spatial Simulation",
    bio: "Specializing in procedural visual effects, photorealistic hardware rendering, and generative sound design. Kaelen bridges tactile live-action cinema with futuristic CGI.",
    headshotUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    displayOrder: 3,
    createdAt: "2026-01-03T00:00:00Z",
  },
];

function mapDbPageContent(row: typeof schema.pageContent.$inferSelect): PageContent {
  return {
    id: row.id,
    homeHeroTag: row.homeHeroTag,
    homeHeroHeadline: row.homeHeroHeadline,
    homeHeroHeadlineAccent: row.homeHeroHeadlineAccent,
    homeHeroSubheadline: row.homeHeroSubheadline,
    sliderIntroText: row.sliderIntroText || DEFAULT_PAGE_CONTENT.sliderIntroText,
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
    globalCtaHeading: row.globalCtaHeading || DEFAULT_PAGE_CONTENT.globalCtaHeading,
    globalCtaSubtext: row.globalCtaSubtext || DEFAULT_PAGE_CONTENT.globalCtaSubtext,
    footerDescription: row.footerDescription || DEFAULT_PAGE_CONTENT.footerDescription,
    updatedAt: row.updatedAt ? row.updatedAt.toISOString() : new Date().toISOString(),
  };
}

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

export const pageContentRepository = {
  async getPageContent(): Promise<PageContent> {
    if (process.env.DATABASE_URL) {
      try {
        const [row] = await db
          .select()
          .from(schema.pageContent)
          .where(eq(schema.pageContent.id, 1));

        if (row) {
          return mapDbPageContent(row);
        }
      } catch (err) {
        console.error("Live page_content query notice:", err);
      }
    }
    return DEFAULT_PAGE_CONTENT;
  },

  async getTeamMembers(): Promise<TeamMember[]> {
    if (process.env.DATABASE_URL) {
      try {
        const rows = await db
          .select()
          .from(schema.teamMembers)
          .orderBy(asc(schema.teamMembers.displayOrder), asc(schema.teamMembers.createdAt));

        if (rows.length > 0) {
          return rows.map(mapDbTeamMember);
        }
      } catch (err) {
        console.error("Live team_members query notice:", err);
      }
    }
    return [...DEFAULT_TEAM_MEMBERS];
  },
};
