import { Project, ProjectCategory } from "@/types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Aura X1: The Silence of Speed",
    slug: "aura-x1-silence-of-speed",
    client: "Aura Motors International",
    year: "2026",
    category: "Commercial",
    tags: ["Automotive", "Cinematic", "Broadcast", "Sound Design"],
    runtime: "1:15",
    aspectRatio: "2.39:1",
    tagline: "Reimagining electric hyper-performance through whisper-quiet motion.",
    description: "A flagship cinematic campaign introducing the Aura X1 electric hypercar to the European and North American markets. Shot across Iceland's volcanic black sand deserts and Alpine switchbacks, the film contrasts pure aerodynamic silence with raw acceleration.",
    creativeObjective: "Disrupt conventional combustion-heavy supercar advertising by framing electric silence as the ultimate expression of dominance and sensory luxury.",
    targetAudience: "Ultra-high-net-worth innovators (32–55), design enthusiasts, and next-generation luxury collectors.",
    deliverables: ["60s Broadcast Master", "30s Digital Hero Cut", "4x 15s Vertical Social Cuts", "Full High-Res Still Suite"],
    commercialImpact: [
      { metric: "14.2M+", label: "Organic Global Views" },
      { metric: "+38%", label: "Test Drive Reservations" },
      { metric: "2x", label: "Cannes Corporate Laurel Winner" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1600&auto=format&fit=crop"
    ],
    originalVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    isPublished: true,
    createdAt: "2026-09-12T10:00:00Z"
  },
  {
    id: "proj-2",
    title: "Verve Chrono: Engineering Eternity",
    slug: "verve-chrono-engineering-eternity",
    client: "Verve Horology Geneva",
    year: "2026",
    category: "DTC & E-Commerce",
    tags: ["Luxury", "Macro Film", "Product Commercial", "DTC"],
    runtime: "0:45",
    aspectRatio: "16:9",
    tagline: "Every millisecond engineered with astronomical precision.",
    description: "An intimate macro-cinematography showcase of the Verve Tourbillon. Combining extreme probe-lens tracking with liquid metal simulation, this commercial drove the most successful direct-to-consumer pre-order in the brand's history.",
    creativeObjective: "Translate high-horology mechanical complexity into an emotive, aspirational purchase trigger for affluent online buyers.",
    targetAudience: "Luxury collectors, executive professionals, and horology enthusiasts across London, Zurich, and New York.",
    deliverables: ["45s DTC Hero Video", "3x 9:16 Instagram Reels / TikTok Editions", "E-commerce Landing Page Interactive Video Loop"],
    commercialImpact: [
      { metric: "$3.8M", label: "Pre-Order Revenue in 72h" },
      { metric: "4.8x", label: "ROAS on Paid Meta Campaigns" },
      { metric: "+420%", label: "Product Page Dwell Time" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop"
    ],
    originalVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    isPublished: true,
    createdAt: "2026-08-20T14:30:00Z"
  },
  {
    id: "proj-3",
    title: "Cognitive AI: Architecting The Mind",
    slug: "cognitive-ai-architecting-the-mind",
    client: "Synthetix Labs San Francisco",
    year: "2026",
    category: "Tech & Innovation",
    tags: ["Technology", "Keynote Film", "VFX", "Sci-Fi Aesthetic"],
    runtime: "2:05",
    aspectRatio: "2.39:1",
    tagline: "Where neural intelligence meets tangible human possibility.",
    description: "The global launch film for Synthetix Foundation 4. Directed with a grounded neo-futuristic tone, blending anamorphic live-action cinematography with bespoke photorealistic volumetric VFX.",
    creativeObjective: "Humanize deep generative AI architecture, distinguishing Synthetix from generic tech boilerplate and establishing enterprise trust.",
    targetAudience: "Global enterprise CTOs, venture partners, and top tier AI researchers.",
    deliverables: ["2-minute Keynote Anthem", "Press Kit Visual Assets", "Website Background Video Pipeline"],
    commercialImpact: [
      { metric: "100K+", label: "Keynote Concurrent Streamers" },
      { metric: "$45M", label: "Enterprise Pipeline Generated" },
      { metric: "Top 3", label: "Trending on YouTube Tech" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop"
    ],
    originalVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    featured: true,
    isPublished: true,
    createdAt: "2026-07-05T09:15:00Z"
  },
  {
    id: "proj-4",
    title: "Botanica: The Alchemist's Gin",
    slug: "botanica-the-alchemists-gin",
    client: "L'Elixir Botanical Spirits",
    year: "2026",
    category: "Commercial",
    tags: ["Spirits", "Editorial", "Color Grading", "High-Speed Phantom"],
    runtime: "0:30",
    aspectRatio: "16:9",
    tagline: "Distilled under midnight moonlight. Poured for the uncompromising.",
    description: "Shot on the Phantom Flex 4K at 1000fps with custom prism filters, this cinematic commercial captures the kinetic clash of botanical herbs, alpine glaciers, and crystalline spirit.",
    creativeObjective: "Create an intense, sensory cocktail ritual that commands top-shelf bar placement and luxury retail pull.",
    targetAudience: "Discerning cocktail connoisseurs, Michelin-starred hospitality buyers, and luxury nightlife culture.",
    deliverables: ["30s Master TV Spot", "15s Digital Cut", "Print & Out-Of-Home 8K Stills"],
    commercialImpact: [
      { metric: "+54%", label: "Retail Distributor Inquiries" },
      { metric: "88%", label: "Video Completion Rate" },
      { metric: "D&AD", label: "Wood Pencil for Cinematography" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=1600&auto=format&fit=crop"
    ],
    originalVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    isPublished: true,
    createdAt: "2026-06-18T16:45:00Z"
  },
  {
    id: "proj-5",
    title: "Kinetica: Sound Made Visible",
    slug: "kinetica-sound-made-visible",
    client: "Bang & Olufsen Special Edition",
    year: "2026",
    category: "3D & Motion",
    tags: ["Audio", "CGI", "3D Simulation", "Acoustics"],
    runtime: "0:50",
    aspectRatio: "16:9",
    tagline: "When sound waves carve physical art.",
    description: "A hybrid physical-digital campaign blending machined aluminum audio hardware with parametric fluid cymatics that respond in exact real-time resonance to a custom orchestral track.",
    creativeObjective: "Visually articulate acoustic perfection and Scandinavian minimalist craftsmanship without saying a single spoken word.",
    targetAudience: "Audiophiles, high-end interior architects, and modern design collectors.",
    deliverables: ["50s Hero Brand Spot", "Interactive Sound Installation Asset Pack"],
    commercialImpact: [
      { metric: "5.4M", label: "Impressions" },
      { metric: "Sold Out", label: "Limited Edition in 48 Hours" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop"
    ],
    originalVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    isPublished: true,
    createdAt: "2026-05-14T11:00:00Z"
  },
  {
    id: "proj-6",
    title: "Sovereign: Wealth In Perpetual Motion",
    slug: "sovereign-wealth-perpetual-motion",
    client: "Sovereign Private Capital",
    year: "2026",
    category: "Brand Film",
    tags: ["Finance", "Documentary", "35mm Film", "Global"],
    runtime: "1:45",
    aspectRatio: "2.39:1",
    tagline: "True wealth is measured in generations, not quarters.",
    description: "Filmed on 35mm Kodak motion picture stock across Singapore, Tokyo, and Zurich. A poetic, cinematic essay on generational resilience and quiet capital management.",
    creativeObjective: "Break free from sterile banking tropes (skyscrapers, handshakes) and establish a philosophical, deeply trusted brand voice.",
    targetAudience: "Family offices, institutional allocators, and generational wealth holders.",
    deliverables: ["1:45 Brand Manifesto", "30s Targeted Private Banking Cuts"],
    commercialImpact: [
      { metric: "+64%", label: "HNW Inbound Consultation Requests" },
      { metric: "99.2%", label: "Client Brand Sentiment Rating" }
    ],
    stills: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop"
    ],
    originalVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    featured: false,
    isPublished: true,
    createdAt: "2026-04-02T13:20:00Z"
  }
];

export const projectRepository = {
  async getProjects(category?: ProjectCategory): Promise<Project[]> {
    if (!category || category === "All") {
      return MOCK_PROJECTS.filter((p) => p.isPublished);
    }
    return MOCK_PROJECTS.filter((p) => p.isPublished && p.category === category);
  },

  async getFeaturedProjects(): Promise<Project[]> {
    return MOCK_PROJECTS.filter((p) => p.isPublished && p.featured);
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    const project = MOCK_PROJECTS.find((p) => p.slug === slug);
    return project || null;
  },

  async getAllProjectsAdmin(): Promise<Project[]> {
    return [...MOCK_PROJECTS];
  },
};
