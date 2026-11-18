import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
import { MOCK_PROJECTS } from "../data/projects";
import { MOCK_MEDIA_ASSETS } from "../data/media";
import { MOCK_PITCHES } from "../data/pitches";
import { MOCK_LEADS } from "../data/leads";
import { MOCK_BLOG_POSTS } from "../data/blog";
import { MOCK_STUDIO_SETTINGS } from "../data/settings";
import { DEFAULT_PAGE_CONTENT, DEFAULT_TEAM_MEMBERS } from "../data/page-content";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log("Beginning database seeding on Neon PostgreSQL...");

  try {
    // 1. Seed Studio Settings
    console.log("Seeding studio settings...");
    await db.insert(schema.studioSettings).values({
      id: 1,
      studioName: MOCK_STUDIO_SETTINGS.studioName,
      tagline: MOCK_STUDIO_SETTINGS.tagline,
      contactEmail: MOCK_STUDIO_SETTINGS.contactEmail,
      phone: MOCK_STUDIO_SETTINGS.phone,
      address: MOCK_STUDIO_SETTINGS.address,
      instagram: MOCK_STUDIO_SETTINGS.instagram,
      vimeo: MOCK_STUDIO_SETTINGS.vimeo,
      youtube: MOCK_STUDIO_SETTINGS.youtube,
      linkedin: MOCK_STUDIO_SETTINGS.linkedin,
      maxUploadSizeGb: MOCK_STUDIO_SETTINGS.maxUploadSizeGb,
    }).onConflictDoNothing();

    // 2. Seed Admin User
    console.log("Seeding admin user...");
    await db.insert(schema.adminUsers).values({
      email: "admin@fixelorastudio.com",
      passwordHash: "fixelora2026", // interim password hash
      name: "Alexander Cole",
      role: "admin",
    }).onConflictDoNothing();

    // 3. Seed Projects
    console.log(`Seeding ${MOCK_PROJECTS.length} commercial projects...`);
    for (const proj of MOCK_PROJECTS) {
      await db.insert(schema.projects).values({
        id: proj.id,
        title: proj.title,
        slug: proj.slug,
        client: proj.client,
        year: proj.year,
        category: proj.category,
        tags: proj.tags,
        runtime: proj.runtime,
        aspectRatio: proj.aspectRatio,
        tagline: proj.tagline,
        description: proj.description,
        creativeObjective: proj.creativeObjective,
        targetAudience: proj.targetAudience,
        deliverables: proj.deliverables,
        commercialImpact: proj.commercialImpact,
        stills: proj.stills,
        originalVideoUrl: proj.originalVideoUrl,
        playbackVideoUrl: proj.playbackVideoUrl,
        thumbnailUrl: proj.thumbnailUrl,
        featured: proj.featured,
        isPublished: proj.isPublished,
        createdAt: new Date(proj.createdAt),
      }).onConflictDoNothing();
    }

    // 4. Seed Media Assets
    console.log(`Seeding ${MOCK_MEDIA_ASSETS.length} media assets...`);
    for (const asset of MOCK_MEDIA_ASSETS) {
      await db.insert(schema.mediaAssets).values({
        id: asset.id,
        filename: asset.filename,
        assetType: asset.assetType,
        fileSize: asset.fileSize,
        formattedSize: asset.formattedSize,
        mimeType: asset.mimeType,
        dimensions: asset.dimensions,
        duration: asset.duration,
        url: asset.url,
        associatedProjectId: asset.associatedProjectId,
        associatedProjectTitle: asset.associatedProjectTitle,
        uploadedAt: new Date(asset.uploadedAt),
      }).onConflictDoNothing();
    }

    // 5. Seed Pitches
    console.log(`Seeding ${MOCK_PITCHES.length} private pitches...`);
    for (const pitch of MOCK_PITCHES) {
      await db.insert(schema.pitches).values({
        id: pitch.id,
        slug: pitch.slug,
        brandName: pitch.brandName,
        brandLogo: pitch.brandLogo,
        contactName: pitch.contactName,
        proposalTitle: pitch.proposalTitle,
        customNote: pitch.customNote,
        playbackVideoUrl: pitch.playbackVideoUrl,
        thumbnailUrl: pitch.thumbnailUrl,
        keyTakeaways: pitch.keyTakeaways,
        recommendedTimeline: pitch.recommendedTimeline,
        validUntil: pitch.validUntil,
        status: pitch.status,
        createdAt: new Date(pitch.createdAt),
      }).onConflictDoNothing();
    }

    // 6. Seed Inbound Leads
    console.log(`Seeding ${MOCK_LEADS.length} client leads...`);
    for (const lead of MOCK_LEADS) {
      await db.insert(schema.leads).values({
        id: lead.id,
        clientName: lead.clientName,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        projectType: lead.projectType,
        estimatedBudget: lead.estimatedBudget,
        timeline: lead.timeline,
        description: lead.description,
        track: lead.track,
        status: lead.status,
        notes: lead.notes,
        createdAt: new Date(lead.createdAt),
      }).onConflictDoNothing();
    }

    // 7. Seed Blog Posts
    console.log(`Seeding ${MOCK_BLOG_POSTS.length} blog posts...`);
    for (const post of MOCK_BLOG_POSTS) {
      await db.insert(schema.blogPosts).values({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage,
        category: post.category,
        tags: post.tags,
        author: post.author,
        readingTime: post.readingTime,
        isPublished: post.isPublished,
        publishDate: post.publishDate,
        ctaVariant: post.ctaVariant,
        createdAt: new Date(),
      }).onConflictDoNothing();
    }

    // 8. Seed Global Page Content
    console.log("Seeding global page content...");
    await db.insert(schema.pageContent).values({
      id: 1,
      homeHeroTag: DEFAULT_PAGE_CONTENT.homeHeroTag,
      homeHeroHeadline: DEFAULT_PAGE_CONTENT.homeHeroHeadline,
      homeHeroHeadlineAccent: DEFAULT_PAGE_CONTENT.homeHeroHeadlineAccent,
      homeHeroSubheadline: DEFAULT_PAGE_CONTENT.homeHeroSubheadline,
      homeServicesEyebrow: DEFAULT_PAGE_CONTENT.homeServicesEyebrow,
      homeServicesTitle: DEFAULT_PAGE_CONTENT.homeServicesTitle,
      aboutHeroEyebrow: DEFAULT_PAGE_CONTENT.aboutHeroEyebrow,
      aboutHeroHeadline: DEFAULT_PAGE_CONTENT.aboutHeroHeadline,
      aboutHeroHeadlineAccent: DEFAULT_PAGE_CONTENT.aboutHeroHeadlineAccent,
      aboutHeroSubheadline: DEFAULT_PAGE_CONTENT.aboutHeroSubheadline,
      aboutManifestoTitle: DEFAULT_PAGE_CONTENT.aboutManifestoTitle,
      aboutMainBody: DEFAULT_PAGE_CONTENT.aboutMainBody,
      servicesHeroHeadline: DEFAULT_PAGE_CONTENT.servicesHeroHeadline,
      servicesHeroHeadlineAccent: DEFAULT_PAGE_CONTENT.servicesHeroHeadlineAccent,
      servicesHeroSummary: DEFAULT_PAGE_CONTENT.servicesHeroSummary,
    }).onConflictDoNothing();

    // 9. Seed Team Members
    console.log(`Seeding ${DEFAULT_TEAM_MEMBERS.length} studio directors & team members...`);
    for (const member of DEFAULT_TEAM_MEMBERS) {
      await db.insert(schema.teamMembers).values({
        id: member.id,
        name: member.name,
        role: member.role,
        bio: member.bio,
        headshotUrl: member.headshotUrl,
        displayOrder: member.displayOrder,
        createdAt: new Date(member.createdAt),
      }).onConflictDoNothing();
    }

    console.log("✓ Seeding completed successfully on Neon PostgreSQL!");
  } catch (error) {
    console.error("Seeding failed with error:", error);
    process.exit(1);
  }
}

seed();
