export type ProjectCategory = 
  | "All"
  | "Product Commercials"
  | "Brand Films"
  | "Social/Performance Advertising"
  | "E-commerce"
  | "Explainer/Software"
  | "Storytelling/Book Trailers";

export interface CommercialImpactMetric {
  metric: string;
  label: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  year: string;
  category: Exclude<ProjectCategory, "All">;
  tags: string[];
  runtime: string;
  aspectRatio: "16:9" | "9:16" | "2.39:1";
  tagline: string;
  description: string;
  creativeObjective: string;
  targetAudience: string;
  deliverables: string[];
  commercialImpact: CommercialImpactMetric[];
  stills: string[];
  originalVideoUrl: string;
  playbackVideoUrl: string;
  thumbnailUrl: string;
  featured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface PrimaryService {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  detailedOverview: string;
  subServices: string[];
  deliverables: string[];
  productionProcess: { step: string; phase: string; detail: string }[];
  industryUseCases: { industry: string; application: string }[];
  timeline: string;
  associatedProjectSlugs: string[];
  heroImage: string;
  videoPreviewUrl?: string;
  faqs: ServiceFAQ[];
}

export interface AdditionalService {
  id: string;
  title: string;
  description: string;
  deliverables: string;
}

export interface ProductionCapability {
  id: string;
  title: string;
  category: "Creative Strategy" | "Visual Production" | "Post-Production & Audio" | "Multi-Format Adaptation";
  description: string;
}

export interface Pitch {
  id: string;
  slug: string;
  brandName: string;
  brandLogo?: string;
  contactName: string;
  proposalTitle: string;
  customNote: string;
  playbackVideoUrl: string;
  thumbnailUrl: string;
  keyTakeaways: string[];
  recommendedTimeline: string;
  validUntil: string;
  status: "active" | "viewed" | "accepted" | "expired";
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  readingTime: string;
  isPublished: boolean;
  publishDate: string;
  ctaVariant: "commercial" | "strategy" | "dtc";
}

export type LeadStatus = "new" | "contacted" | "in_discovery" | "proposal_sent" | "won" | "archived";

export interface Lead {
  id: string;
  clientName: string;
  company: string;
  email: string;
  phone?: string;
  projectType: string;
  estimatedBudget: string;
  timeline: string;
  description: string;
  track: "brief" | "call";
  status: LeadStatus;
  notes?: string;
  createdAt: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  assetType: "original_video" | "playback_video" | "thumbnail" | "headshot";
  fileSize: number;
  formattedSize: string;
  mimeType: string;
  dimensions?: string;
  duration?: string;
  url: string;
  associatedProjectId?: string;
  associatedProjectTitle?: string;
  uploadedAt: string;
}

export interface StudioSettings {
  studioName: string;
  tagline: string;
  contactEmail: string;
  phone: string;
  address: string;
  instagram: string;
  vimeo: string;
  youtube: string;
  linkedin: string;
  maxUploadSizeGb: number;
}

export interface PageContent {
  id: number;
  homeHeroTag: string;
  homeHeroHeadline: string;
  homeHeroHeadlineAccent: string;
  homeHeroSubheadline: string;
  sliderIntroText: string;
  homeServicesEyebrow: string;
  homeServicesTitle: string;
  aboutHeroEyebrow: string;
  aboutHeroHeadline: string;
  aboutHeroHeadlineAccent: string;
  aboutHeroSubheadline: string;
  aboutManifestoTitle: string;
  aboutMainBody: string;
  servicesHeroHeadline: string;
  servicesHeroHeadlineAccent: string;
  servicesHeroSummary: string;
  globalCtaHeading: string;
  globalCtaSubtext: string;
  footerDescription: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  headshotUrl: string;
  displayOrder: number;
  createdAt: string;
}
