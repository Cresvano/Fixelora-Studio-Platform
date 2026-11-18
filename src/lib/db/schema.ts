import { pgTable, text, varchar, timestamp, boolean, bigint, integer, jsonb, date, uuid } from "drizzle-orm/pg-core";

// 1. ADMIN USERS
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("admin").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. PROJECTS (Commercial Portfolio Case Studies)
export const projects = pgTable("projects", {
  id: text("id").primaryKey(), // e.g. "proj-1"
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  client: varchar("client", { length: 255 }).notNull(),
  year: varchar("year", { length: 10 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  runtime: varchar("runtime", { length: 20 }).notNull(),
  aspectRatio: varchar("aspect_ratio", { length: 20 }).default("16:9").notNull(),
  tagline: text("tagline"),
  description: text("description").notNull(),
  creativeObjective: text("creative_objective"),
  targetAudience: text("target_audience"),
  deliverables: jsonb("deliverables").$type<string[]>().default([]).notNull(),
  commercialImpact: jsonb("commercial_impact").$type<{ metric: string; label: string }[]>().default([]).notNull(),
  stills: jsonb("stills").$type<string[]>().default([]).notNull(),
  originalVideoUrl: text("original_video_url"),
  playbackVideoUrl: text("playback_video_url"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  featured: boolean("featured").default(false).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. MEDIA ASSETS
export const mediaAssets = pgTable("media_assets", {
  id: text("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  assetType: varchar("asset_type", { length: 50 }).notNull(), // "original_video" | "playback_video" | "thumbnail"
  fileSize: bigint("file_size", { mode: "number" }).notNull(),
  formattedSize: varchar("formatted_size", { length: 50 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  dimensions: varchar("dimensions", { length: 50 }),
  duration: varchar("duration", { length: 20 }),
  url: text("url").notNull(),
  associatedProjectId: text("associated_project_id").references(() => projects.id, { onDelete: "set null" }),
  associatedProjectTitle: varchar("associated_project_title", { length: 255 }),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. PITCHES
export const pitches = pgTable("pitches", {
  id: text("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  brandName: varchar("brand_name", { length: 255 }).notNull(),
  brandLogo: text("brand_logo"),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  proposalTitle: varchar("proposal_title", { length: 255 }).notNull(),
  customNote: text("custom_note").notNull(),
  playbackVideoUrl: text("playback_video_url").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  keyTakeaways: jsonb("key_takeaways").$type<string[]>().default([]).notNull(),
  recommendedTimeline: varchar("recommended_timeline", { length: 100 }),
  validUntil: varchar("valid_until", { length: 50 }),
  status: varchar("status", { length: 50 }).default("active").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. LEADS
export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 100 }),
  projectType: varchar("project_type", { length: 150 }).notNull(),
  estimatedBudget: varchar("estimated_budget", { length: 100 }).notNull(),
  timeline: varchar("timeline", { length: 100 }).notNull(),
  description: text("description").notNull(),
  track: varchar("track", { length: 20 }).default("brief").notNull(),
  status: varchar("status", { length: 50 }).default("new").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 6. BLOG POSTS
export const blogPosts = pgTable("blog_posts", {
  id: text("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  featuredImage: text("featured_image").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  tags: jsonb("tags").$type<string[]>().default([]).notNull(),
  author: jsonb("author").$type<{ name: string; role: string; avatar: string }>().notNull(),
  readingTime: varchar("reading_time", { length: 50 }).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  publishDate: varchar("publish_date", { length: 50 }).notNull(),
  ctaVariant: varchar("cta_variant", { length: 50 }).default("commercial").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 7. STUDIO SETTINGS
export const studioSettings = pgTable("studio_settings", {
  id: integer("id").primaryKey().default(1),
  studioName: varchar("studio_name", { length: 255 }).default("Fixelora Studio").notNull(),
  tagline: varchar("tagline", { length: 255 }).default("Creative Ads. Powerful Stories.").notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).default("production@fixelorastudio.com").notNull(),
  phone: varchar("phone", { length: 100 }).default("+1 (310) 902-8800"),
  address: text("address").default("Century City Media District, Los Angeles, CA"),
  instagram: text("instagram").default("https://instagram.com/fixelorastudio"),
  vimeo: text("vimeo").default("https://vimeo.com/fixelorastudio"),
  youtube: text("youtube").default("https://youtube.com/@fixelorastudio"),
  linkedin: text("linkedin").default("https://linkedin.com/company/fixelorastudio"),
  maxUploadSizeGb: integer("max_upload_size_gb").default(25).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 8. GLOBAL PAGE CONTENT CMS
export const pageContent = pgTable("page_content", {
  id: integer("id").primaryKey().default(1),
  homeHeroTag: varchar("home_hero_tag", { length: 255 })
    .default("Commercial Video Production Studio")
    .notNull(),
  homeHeroHeadline: varchar("home_hero_headline", { length: 255 })
    .default("Creative Ads.")
    .notNull(),
  homeHeroHeadlineAccent: varchar("home_hero_headline_accent", { length: 255 })
    .default("Powerful Stories.")
    .notNull(),
  homeHeroSubheadline: text("home_hero_subheadline")
    .default(
      "We direct broadcast-grade commercials, luxury product films, and cinematic brand campaigns for visionary companies worldwide."
    )
    .notNull(),
  homeServicesEyebrow: varchar("home_services_eyebrow", { length: 255 })
    .default("Commercial Capabilities")
    .notNull(),
  homeServicesTitle: varchar("home_services_title", { length: 255 })
    .default("Production Disciplines")
    .notNull(),
  aboutHeroEyebrow: varchar("about_hero_eyebrow", { length: 255 })
    .default("The Studio Story")
    .notNull(),
  aboutHeroHeadline: varchar("about_hero_headline", { length: 255 })
    .default("We Reject Generic.")
    .notNull(),
  aboutHeroHeadlineAccent: varchar("about_hero_headline_accent", { length: 255 })
    .default("We Direct Prestige.")
    .notNull(),
  aboutHeroSubheadline: text("about_hero_subheadline")
    .default(
      "Fixelora Studio was founded on a simple conviction: commercial advertising should be as unforgettable, visually breathtaking, and emotionally resonant as award-winning cinema."
    )
    .notNull(),
  aboutManifestoTitle: varchar("about_manifesto_title", { length: 255 })
    .default("Cinema Craftsmanship Meets Commercial Strategy")
    .notNull(),
  aboutMainBody: text("about_main_body")
    .default(
      "In an era where digital noise is at an all-time peak, most brand videos disappear into the background. They look identical, sound identical, and convert poorly.\n\nFixelora operates as an agile, international commercial production unit. We strip away agency bloat to pair brand leaders directly with world-class directors, cinematographers, and visual artists."
    )
    .notNull(),
  servicesHeroHeadline: varchar("services_hero_headline", { length: 255 })
    .default("Commercial Video")
    .notNull(),
  servicesHeroHeadlineAccent: varchar("services_hero_headline_accent", { length: 255 })
    .default("Engineered For Prestige.")
    .notNull(),
  servicesHeroSummary: text("services_hero_summary")
    .default(
      "Fixelora Studio combines tier-one cinematography, high-concept narrative direction, and algorithmic performance strategy. We direct broadcast-grade commercials and multi-platform visual campaigns that position brands at the summit of their industry."
    )
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 9. TEAM MEMBERS / ROSTER
export const teamMembers = pgTable("team_members", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  bio: text("bio").notNull(),
  headshotUrl: text("headshot_url").notNull(),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
