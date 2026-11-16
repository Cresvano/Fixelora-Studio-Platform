import { PrimaryService, AdditionalService, ProductionCapability } from "@/types";

export const PRIMARY_SERVICES: PrimaryService[] = [
  {
    id: "serv-1",
    slug: "product-commercials",
    title: "Product Commercials",
    tagline: "Cinematic commercial films that elevate physical hardware and luxury goods into iconic cultural statements.",
    shortDescription: "High-impact commercial advertisements engineered to showcase product aesthetics, tactile engineering, and sensory allure across television and digital prestige channels.",
    detailedOverview: "We conceive, direct, and master broadcast-grade product commercials. Utilizing high-speed Phantom cameras, custom macro probe lenses, probe-lighting rigs, and calibrated color workflows, we turn every angle, finish, and movement into an aspirational trigger. Whether launching an automotive flagship, a fine timepiece, or a cutting-edge consumer product, our films command attention from the very first frame.",
    subServices: [
      "Product advertising videos",
      "Cinematic product commercials",
      "Product launch videos",
      "Product feature showcases",
      "Product demonstration videos",
      "Luxury product advertisements"
    ],
    deliverables: [
      "Broadcast-ready 30s & 60s television spot masters (ProRes 4444 XQ)",
      "Digital Hero Cut (16:9 4K UHD)",
      "Vertical 9:16 cuts optimized for digital pre-roll & mobile prestige",
      "High-resolution 8K cinematography stills suite for print & billboard display"
    ],
    productionProcess: [
      { step: "01", phase: "Concept & Visual Treatment", detail: "Dissect product architecture, materials, and positioning. Develop 3 distinct visual treatments with lighting maps and motion references." },
      { step: "02", phase: "Pre-Light & Studio Staging", detail: "Custom set construction, precision robotic arm pre-programming, and macro lighting calibration for pristine highlight roll-off." },
      { step: "03", phase: "Principal Photography", detail: "Shot on RED 8K VV / ARRI Alexa 35 with specialized anamorphic and probe lenses for extreme tactile fidelity." },
      { step: "04", phase: "Conform, Color & Spatial Audio", detail: "ACES color pipeline, cleanup, beauty retouching, and bespoke sound design mixed in Dolby Atmos." }
    ],
    industryUseCases: [
      { industry: "Luxury & Horology", application: "Intimate macro mechanics, tourbillon movement tracking, and reflection management." },
      { industry: "Automotive & Mobility", application: "Dynamic aerodynamic reveals, studio turntable lighting, and speed plate integration." },
      { industry: "Consumer Electronics", application: "Precision hardware detailing, ergonomic interaction sequences, and display brilliance." }
    ],
    timeline: "3–5 Weeks Turnaround",
    associatedProjectSlugs: ["aura-x1-silence-of-speed", "verve-chrono-engineering-eternity"],
    heroImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
    videoPreviewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    faqs: [
      {
        question: "Do you handle product logistics and security on set?",
        answer: "Yes. We operate strict security protocols for unreleased prototypes, including climate-controlled secure holding, locked studio stages, and signed NDA workflows."
      },
      {
        question: "Can we receive both 16:9 widescreen and 9:16 vertical cuts from the same shoot?",
        answer: "Yes. We frame specifically using dual sensor safe-areas during principal photography, ensuring framing remains cinematic in both horizontal broadcast and vertical social formats."
      }
    ]
  },
  {
    id: "serv-2",
    slug: "brand-films",
    title: "Brand Films & Commercials",
    tagline: "Emotionally resonant company storytelling that builds generational brand authority and market leadership.",
    shortDescription: "Cinematic brand films, company anthems, and strategic commercials designed to articulate vision, mission, and competitive dominance.",
    detailedOverview: "A great brand film does not list features; it dramatizes what your company stands for. We craft narrative commercials and documentary-grade company anthems that unify enterprise teams, captivate prospective partners, and position corporate founders as category titans. Filmed globally on 35mm motion picture stock and state-of-the-art cinema sensors, our brand films create lasting brand equity.",
    subServices: [
      "Brand storytelling videos",
      "Company commercials",
      "Brand introduction videos",
      "Brand awareness campaigns",
      "Cinematic brand films",
      "Promotional brand videos"
    ],
    deliverables: [
      "2 to 4 minute flagship brand anthem manifesto",
      "60s broadcast and investor keynote cutdown",
      "30s digital PR and television cutdowns",
      "Uncompressed audio stems and original orchestral score recording"
    ],
    productionProcess: [
      { step: "01", phase: "Narrative Discovery", detail: "In-depth executive interviews, brand manifesto distillation, and strategic messaging alignment." },
      { step: "02", phase: "Scriptwriting & Casting", detail: "Screenplay scripting, professional international talent casting, and cinematic location scouting." },
      { step: "03", phase: "Cinematic Production", detail: "Multi-camera cinema setups, naturalistic lighting, and documentary-style cinematography with authentic texture." },
      { step: "04", phase: "Editorial & Scoring", detail: "Emotionally calibrated offline editing, bespoke musical score composition, and master sound mix." }
    ],
    industryUseCases: [
      { industry: "Enterprise & Venture", application: "Series funding announcements, IPO roadshows, and enterprise vision films." },
      { industry: "Heritage & Craft", application: "Generational legacy documentaries, manufacturing heritage, and founder philosophy." },
      { industry: "Healthcare & Biotech", application: "Human-centric breakthrough narratives that bridge scientific innovation with empathetic human stories." }
    ],
    timeline: "4–8 Weeks Turnaround",
    associatedProjectSlugs: ["sovereign-wealth-perpetual-motion", "cognitive-ai-architecting-the-mind"],
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop",
    videoPreviewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    faqs: [
      {
        question: "Can our executive leadership or founders appear on camera?",
        answer: "Absolutely. Our directors specialize in interview coaching to ensure founders deliver articulate, relaxed, and commanding on-camera performances."
      },
      {
        question: "What international locations can you shoot in?",
        answer: "Fixelora operates dual production hubs in Los Angeles and London, with trusted production fixers and camera crews stationed across Europe, North America, and East Asia."
      }
    ]
  },
  {
    id: "serv-3",
    slug: "social-performance-advertising",
    title: "Social Media & Performance Advertising",
    tagline: "Short-form video creatives engineered with scientific precision for thumb-stopping attention and scalable ROAS.",
    shortDescription: "High-converting TikTok ads, Instagram Reels, and YouTube Shorts commercial suites designed for performance marketing teams and direct-response campaigns.",
    detailedOverview: "We bridge high-end cinematic aesthetics with algorithmic performance marketing. Most social ads look disposable and cheap; our performance advertising combines tier-one camera optics, dynamic motion typography, and tested psychological hooks that capture attention within the first 1.5 seconds. We deliver modular creative variations that enable continuous A/B testing and sustained campaign scale.",
    subServices: [
      "TikTok video ads",
      "Instagram Reels advertisements",
      "YouTube Shorts advertisements",
      "Paid social advertising creatives",
      "Short-form promotional videos",
      "Multiple ad creative variations",
      "Campaign-specific promotional videos"
    ],
    deliverables: [
      "Core Hero Social Commercial (9:16 vertical & 4:5 social feeds)",
      "4x to 8x Modular Opening Hook Variations (for creative fatigue testing)",
      "Kinetic on-screen typography and high-contrast captions",
      "Platform-specific sound mixes optimized for mobile speaker systems"
    ],
    productionProcess: [
      { step: "01", phase: "Creative Hook Strategy", detail: "Analyze customer pain points, scroll-stopping visual triggers, and direct-response psychological angles." },
      { step: "02", phase: "High-Volume Shoot Day", detail: "Fast-paced studio and lifestyle shoot capturing dozens of setups, angles, and unboxing rituals in a single production block." },
      { step: "03", phase: "Rapid Post-Production", detail: "Paced for thumb-stopping retention: micro-cuts, sound effects, bespoke sound bites, and dynamic captions." },
      { step: "04", phase: "Variation Matrix Delivery", detail: "Exporting structured naming matrix for direct upload into Meta Ads Manager, TikTok Ads, and YouTube Pre-roll." }
    ],
    industryUseCases: [
      { industry: "Direct-to-Consumer (DTC)", application: "High-volume paid social customer acquisition for apparel, beauty, and consumer goods." },
      { industry: "Mobile Apps & Gaming", application: "Feature tease, UI walkthrough, and viral problem-solving hooks." },
      { industry: "Subscription Brands", application: "Unboxing rituals, lifestyle habit loops, and retention-focused creative suites." }
    ],
    timeline: "2–3 Weeks Turnaround",
    associatedProjectSlugs: ["verve-chrono-engineering-eternity", "botanica-the-alchemists-gin"],
    heroImage: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1600&auto=format&fit=crop",
    videoPreviewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    faqs: [
      {
        question: "How do you handle multiple hook testing?",
        answer: "We film 4 to 8 distinct opening 3-second visual and narrative hooks during the shoot, attaching them to our proven core offer body so your media buyers can test variations without extra shoot costs."
      },
      {
        question: "Do these creatives comply with platform text and safe-zone guidelines?",
        answer: "Yes. All typography and focal points are strictly aligned within Meta, TikTok, and YouTube UI safe zones so buttons and captions never obscure your visual message."
      }
    ]
  },
  {
    id: "serv-4",
    slug: "ecommerce-product-marketing",
    title: "E-commerce & Product Marketing Videos",
    tagline: "Conversion-optimized video suites built directly for modern online storefronts, Shopify Plus, and digital catalogs.",
    shortDescription: "Product page video loops, seasonal promotional campaigns, and interactive store creatives that eliminate buying hesitation and drive checkout velocity.",
    detailedOverview: "Static photography is no longer enough to win the modern consumer. Our e-commerce video suites deliver frictionless visual answers: how the fabric moves, how the light reflects, how the mechanism opens, and how the product feels in the hand. Designed for ultra-fast web loading, these videos seamlessly integrate into PDP (Product Detail Page) galleries, cart drawers, and email flows.",
    subServices: [
      "Shopify product videos",
      "E-commerce product advertisements",
      "Product page videos",
      "Online store promotional videos",
      "Seasonal promotional campaigns",
      "Product launch campaigns",
      "Conversion-focused product creatives"
    ],
    deliverables: [
      "Silent, high-resolution PDP video loops (1:1 and 4:5 ratios)",
      "Unboxing and packaging presentation commercial",
      "Seasonal sale / promotional hero banner video",
      "Web-optimized lightweight MP4 and WebM assets with zero layout shift"
    ],
    productionProcess: [
      { step: "01", phase: "Storefront UX Audit", detail: "Review current PDP layout, customer drop-off points, and key questions stopping purchase." },
      { step: "02", phase: "Sensory Showcase Shoot", detail: "Lighting engineered specifically for accurate color rendering, texture fidelity, and dimensional volume." },
      { step: "03", phase: "Web-Ready Optimization", detail: "Encoding with MOOV atom headers for instantaneous zero-delay video start times on Shopify and Headless builds." },
      { step: "04", phase: "Deployment Guidance", detail: "Providing code snippets, embed guidelines, and CDN optimization recommendations." }
    ],
    industryUseCases: [
      { industry: "Fashion & Apparel", application: "Fabric drape, movement dynamics, styling versatility, and fit demonstration." },
      { industry: "Home & Hardware", application: "Form-factor dimensions, tactile finishes, and functional utility in real living spaces." },
      { industry: "Cosmetics & Skincare", application: "Serum viscosity, applicator glide, skin finish, and ingredient textures." }
    ],
    timeline: "2–4 Weeks Turnaround",
    associatedProjectSlugs: ["verve-chrono-engineering-eternity", "aura-x1-silence-of-speed"],
    heroImage: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=1600&auto=format&fit=crop",
    videoPreviewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    faqs: [
      {
        question: "Will these videos slow down our Shopify store loading times?",
        answer: "No. We utilize advanced multi-pass compression (H.265/WebM) and custom poster frame preloading to deliver broadcast-crisp 4K fidelity at fractions of typical file sizes."
      },
      {
        question: "Can we get seasonal variations for Black Friday or Summer launches?",
        answer: "Yes. We offer modular campaign packages allowing for fast seasonal refreshes, promotional end-cards, and holiday color palettes without reshooting from scratch."
      }
    ]
  },
  {
    id: "serv-5",
    slug: "explainer-software-videos",
    title: "Explainer & Software Videos",
    tagline: "Translating abstract code, complex platforms, and SaaS products into intuitive, visually breathtaking narratives.",
    shortDescription: "SaaS promotional commercials, software product walkthroughs, and technology explainer films that demystify complex architectures for enterprise buyers.",
    detailedOverview: "Software companies often struggle to communicate intangible value. We bridge the gap between complex engineering and human utility by blending sleek 2D/3D UI choreography, physical hardware cinematography, and clear narrative scriptwriting. Our software videos clarify product functionality, eliminate customer onboarding friction, and accelerate enterprise sales cycles.",
    subServices: [
      "Explainer videos",
      "SaaS promotional videos",
      "Software product commercials",
      "App promotional videos",
      "Feature explanation videos",
      "Product walkthrough videos",
      "Technology promotional videos"
    ],
    deliverables: [
      "60s to 90s SaaS Hero Explainer Commercial",
      "30s feature-spotlight cutdowns for product release notes",
      "Interactive 3D UI screen recording animations",
      "Global broadcast voiceover licensing with professional voice talent"
    ],
    productionProcess: [
      { step: "01", phase: "Architecture & Workflow Synthesis", detail: "Deconstruct your software's core user journey, key aha-moments, and measurable business outcomes." },
      { step: "02", phase: "Scriptwriting & Visual Metaphor", detail: "Craft clear, jargon-free narration paired with inventive visual metaphors that make digital workflows tangible." },
      { step: "03", phase: "UI Animation & Motion Design", detail: "Rebuilding product UI in Vector/3D space for smooth camera sweeps, depth of field, and fluid cursor kinetics." },
      { step: "04", phase: "Sound & Voice Direction", detail: "Mastering with top-tier commercial voiceover artists and rhythmic electronic sound design." }
    ],
    industryUseCases: [
      { industry: "Generative AI & DeepTech", application: "Visualizing neural pipelines, autonomous workflows, and real-time data processing." },
      { industry: "FinTech & Web3", application: "Demystifying custody protocols, institutional payments, and automated treasury engines." },
      { industry: "Enterprise SaaS & B2B", application: "Demonstrating cross-departmental collaboration, security governance, and ROI metrics." }
    ],
    timeline: "3–5 Weeks Turnaround",
    associatedProjectSlugs: ["cognitive-ai-architecting-the-mind", "kinetica-sound-made-visible"],
    heroImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    videoPreviewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    faqs: [
      {
        question: "Do you use screen recordings or rebuild the UI in animation?",
        answer: "We rebuild key UI elements in high-resolution vector and 3D space. This allows for dramatic camera angles, cinematic depth of field, and seamless future updates when UI details change."
      },
      {
        question: "Can you provide localized voiceovers in multiple languages?",
        answer: "Yes. We source native commercial voice talent across English, German, French, Spanish, Japanese, and Mandarin with synchronized audio mixes."
      }
    ]
  },
  {
    id: "serv-6",
    slug: "storytelling-book-trailers",
    title: "Storytelling & Book Trailers",
    tagline: "Cinematic story teasers and publishing trailers that immerse readers in fiction, non-fiction, and author universes.",
    shortDescription: "Atmospheric literary trailers, BookTok promotional teasers, and character introduction films specifically engineered for independent authors, novelists, and major publishing houses.",
    detailedOverview: "Books possess entire universes that deserve cinematic expression. We pioneer cinematic book trailers and viral BookTok video campaigns that capture the moody tone, dramatic stakes, and romantic or thrilling tension of your novel. Combining live-action cinematography, atmospheric visual effects, evocative voice acting, and tailored soundscapes, our book trailers ignite reader anticipation and propel publishing campaigns.",
    subServices: [
      "Book trailers",
      "BookTok promotional videos",
      "Cinematic story teasers",
      "Character introduction videos",
      "Fiction and novel promotional videos",
      "Author promotional videos",
      "Publishing campaign videos"
    ],
    deliverables: [
      "60s Cinematic Story Trailer (16:9 & 9:16)",
      "3x Vertical BookTok / Instagram Reels teasers focusing on key tropes and romantic/action hooks",
      "Character introduction spotlight reels",
      "Author interview and world-building featurette"
    ],
    productionProcess: [
      { step: "01", phase: "Literary Analysis & Trope Mapping", detail: "Read manuscript passages, map key emotional hooks, reader tropes, and atmospheric visual tone." },
      { step: "02", phase: "Atmospheric Staging & Casting", detail: "Select period or modern wardrobe, atmospheric props, and cinematic lighting to mirror the world of the novel." },
      { step: "03", phase: "Cinematic Teaser Production", detail: "Shoot poetic vignettes, macro details (turning pages, daggers, letters, ambient elements), and actor silhouettes." },
      { step: "04", phase: "Haunting Soundscape & Narration", detail: "Original musical composition, rich Foley effects, and dramatic voiceover delivery." }
    ],
    industryUseCases: [
      { industry: "Fantasy & Sci-Fi Novels", application: "VFX magic embers, ancient map reveals, swordplay silhouettes, and epic orchestral themes." },
      { industry: "Thriller & Mystery", application: "Tense pulse pacing, noir shadows, typewriter clatter, and unresolved cliffhanger cuts." },
      { industry: "Non-Fiction & Memoir", application: "Intellectual author portraits, historical archival montage, and thought-leadership manifestos." }
    ],
    timeline: "2–4 Weeks Turnaround",
    associatedProjectSlugs: ["sovereign-wealth-perpetual-motion", "botanica-the-alchemists-gin"],
    heroImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
    videoPreviewUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    faqs: [
      {
        question: "Is this service suitable for self-published indie authors as well as major imprints?",
        answer: "Yes! We work with independent authors seeking high-performing BookTok promotional assets as well as traditional publishing houses running nationwide launch campaigns."
      },
      {
        question: "Can the video incorporate our actual cover art and typography?",
        answer: "Yes. We animate 3D book covers, title typography, and quote blurbs with custom particle and lighting effects."
      }
    ]
  }
];

export const ADDITIONAL_SERVICES: AdditionalService[] = [
  {
    id: "add-1",
    title: "Corporate & Business Videos",
    description: "Executive town halls, corporate vision announcements, and shareholder communications filmed with prestige cinema optics.",
    deliverables: "4K Master • Keynote Cut • Confidential Internal Delivery"
  },
  {
    id: "add-2",
    title: "Real Estate & Property Promotional Videos",
    description: "Architectural cinematography, golden-hour drone sweeps, and interior lighting design for ultra-luxury residential and commercial developments.",
    deliverables: "High-Res Cinema Tour • Vertical Social Cutdowns • Drone Master"
  },
  {
    id: "add-3",
    title: "Event Promotional Videos",
    description: "High-energy festival teasers, executive summit recaps, and live-experience promotional videos that sell out subsequent event editions.",
    deliverables: "Same-Week Recap Master • Next-Year Teaser Cut • Social Stills"
  },
  {
    id: "add-4",
    title: "Recruitment & Employer Branding Videos",
    description: "Authentic, visually striking company culture films that attract top-tier global engineering, executive, and creative talent.",
    deliverables: "Company Culture Anthem • Employee Spotlight Vignettes"
  },
  {
    id: "add-5",
    title: "AI-Powered UGC-Style Advertisements",
    description: "Naturalistic, authentic short-form ads developed with cutting-edge AI production assistance for high-velocity social testing.",
    deliverables: "Vertical Ad Matrix • Multiple Hook Variations • Caption Styling"
  },
  {
    id: "add-6",
    title: "Video Repurposing & Transformation",
    description: "Transform existing long-form webinars, podcasts, or raw shoot footage into dozens of high-converting social cuts and micro-content.",
    deliverables: "Multi-Platform Cutdowns • Kinetic Typography • Safe-Zone Framing"
  },
  {
    id: "add-7",
    title: "Video Ad Campaign Production",
    description: "Turnkey multi-month video advertising campaign production, delivering coordinated creative batches aligned with quarterly sales targets.",
    deliverables: "Quarterly Asset Delivery • Coordinated Themes • Performance Review"
  },
  {
    id: "add-8",
    title: "Advertising Creative Variations",
    description: "Engineering systematic visual, hook, pacing, and CTA permutations to prevent ad fatigue and maintain scale on paid media channels.",
    deliverables: "8x to 16x Systematic Variations • Structured Asset Matrix"
  },
  {
    id: "add-9",
    title: "Promotional Video Content Packages",
    description: "All-in-one commercial media packages combining broadcast hero cuts, social suites, photo stills, and web loops in a unified shoot.",
    deliverables: "Full-Spectrum Deliverable Bundle • Omnichannel Master Suite"
  }
];

export const PRODUCTION_CAPABILITIES: ProductionCapability[] = [
  { id: "cap-1", title: "Creative Concept Development", category: "Creative Strategy", description: "Market positioning dissection, conceptual moodboards, and multi-treatment creative proposals." },
  { id: "cap-2", title: "Advertising Scriptwriting", category: "Creative Strategy", description: "Pacing-calibrated 15s, 30s, and 60s commercial scripts with exact spoken cadence and timing." },
  { id: "cap-3", title: "Storyboarding & Pre-Visualization", category: "Creative Strategy", description: "Scene-by-scene visual blueprints and camera choreography prior to entering studio stages." },
  { id: "cap-4", title: "Executive Creative Direction", category: "Creative Strategy", description: "Direct oversight by award-winning commercial directors from initial pitch to final master color." },
  
  { id: "cap-5", title: "AI-Assisted Visual Production", category: "Visual Production", description: "Utilizing generative and neural imaging tools as an agile production pipeline capability to accelerate prototyping and concept design." },
  { id: "cap-6", title: "High-Speed & Macro Cinematography", category: "Visual Production", description: "Phantom Flex 4K at 1000fps and specialized probe optics for tactile, microscopic detail." },
  { id: "cap-7", title: "Location Scouting & Studio Set Builds", category: "Visual Production", description: "Custom architectural sets, cyclorama stages, and global location coordination in LA, London, and remote." },
  { id: "cap-8", title: "Talent Casting & Wardrobe Styling", category: "Visual Production", description: "Professional SAG-AFTRA and international commercial talent casting, grooming, and luxury styling." },
  
  { id: "cap-9", title: "Voiceover Production & Voice Direction", category: "Post-Production & Audio", description: "Sourcing and directing premier international commercial voice actors in world-class audio booths." },
  { id: "cap-10", title: "Bespoke Sound Design & Foley", category: "Post-Production & Audio", description: "Tactile acoustic design, mechanical foley, and spatial sound manipulation mixed in Dolby Atmos." },
  { id: "cap-11", title: "Custom Music Selection & Original Scoring", category: "Post-Production & Audio", description: "Curated orchestral, electronic, or bespoke compositions recorded specifically for campaign resonance." },
  { id: "cap-12", title: "High-End Video Editing & Conforming", category: "Post-Production & Audio", description: "Rhythmically refined offline and online editing suites powered by DaVinci Resolve Studio." },
  { id: "cap-13", title: "ACES Color Grading & Look Profiles", category: "Post-Production & Audio", description: "Custom LUT creation and calibrated OLED color grading by seasoned studio colorists." },
  
  { id: "cap-14", title: "Captions & On-Screen Kinetic Typography", category: "Multi-Format Adaptation", description: "Custom brand-font kinetic subtitles and text animations engineered for sound-off digital viewing." },
  { id: "cap-15", title: "3D Logo Animation & Branded End Cards", category: "Multi-Format Adaptation", description: "Metallic 3D logo reveals, particle simulations, and high-impact call-to-action end slates." },
  { id: "cap-16", title: "Multiple Aspect Ratios (16:9, 9:16, 4:5, 1:1)", category: "Multi-Format Adaptation", description: "Mastering separate crops with custom composition re-centering for every social and broadcast channel." },
  { id: "cap-17", title: "Platform-Specific Adaptations & Cutdowns", category: "Multi-Format Adaptation", description: "Precision re-edits for YouTube Pre-roll, Meta, TikTok, Connected TV, and cinema theatrical trailers." }
];

export const serviceRepository = {
  async getPrimaryServices(): Promise<PrimaryService[]> {
    return [...PRIMARY_SERVICES];
  },

  async getServiceBySlug(slug: string): Promise<PrimaryService | null> {
    const service = PRIMARY_SERVICES.find((s) => s.slug === slug);
    return service || null;
  },

  async getAdditionalServices(): Promise<AdditionalService[]> {
    return [...ADDITIONAL_SERVICES];
  },

  async getProductionCapabilities(): Promise<ProductionCapability[]> {
    return [...PRODUCTION_CAPABILITIES];
  }
};
