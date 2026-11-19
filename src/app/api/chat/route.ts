import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { pageContentRepository } from "@/lib/data/page-content";
import { projectRepository } from "@/lib/data/projects";
import { PageContent, TeamMember, Project } from "@/types";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatContext {
  pageContent: PageContent;
  teamMembers: TeamMember[];
  projects: Project[];
}

function buildFallbackSdrReply(userText: string, context: ChatContext): string {
  const q = userText.toLowerCase();
  const { pageContent, teamMembers, projects } = context;

  // 1. Pricing / Budget / Rates
  if (
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("budget") ||
    q.includes("how much") ||
    q.includes("rate") ||
    q.includes("tier") ||
    q.includes("quote")
  ) {
    return `Our commercial production tiers are designed to scale with your brand objectives:\n\n• $50 – $200 (Starter social cuts & product clips)\n• $300 – $500 (Targeted ad creatives & product showcases)\n• $700 – $1,500 (Multi-format campaigns & explainer suites)\n• $1,500 – $3,000+ (Flagship commercials & cinematic brand films)\n• Custom Budget (Tailored enterprise & multi-market campaigns)\n\n${pageContent.contactResponsePromise}\n\nSubmit your project brief directly on our Contact page (/contact) to receive a transparent proposal.`;
  }

  // 2. Services / Capabilities
  if (
    q.includes("service") ||
    q.includes("offer") ||
    q.includes("what do you") ||
    q.includes("video") ||
    q.includes("make") ||
    q.includes("discipline") ||
    q.includes("capability")
  ) {
    return `Fixelora Studio directs 6 core commercial video disciplines:\n\n1. Product Commercials (Flagship reveals & tactile macro films)\n2. Brand Films (Cinematic founder & brand narrative campaigns)\n3. Social & Performance Advertising (High-ROAS TikTok, Reels, & Shorts)\n4. E-commerce Video Suites (Conversion-focused product showcases)\n5. Explainer & Software Videos (SaaS & technical product walk-throughs)\n6. Storytelling & Book Trailers (Atmospheric cinematic narratives)\n\n${pageContent.servicesHeroSummary}\n\nExplore full details on our Services page (/services) or kick off a project brief on /contact.`;
  }

  // 3. Team & Leadership
  if (
    q.includes("team") ||
    q.includes("who") ||
    q.includes("founder") ||
    q.includes("director") ||
    q.includes("julian") ||
    q.includes("elena") ||
    q.includes("kaelen") ||
    q.includes("people") ||
    q.includes("leadership")
  ) {
    const rosterList =
      teamMembers.length > 0
        ? teamMembers.map((m) => `• ${m.name} — ${m.role}`).join("\n")
        : "• Julian Vance — Founder & Executive Creative Director\n• Elena Rostova — Technical Director & Senior Colorist\n• Kaelen Voss — Head of 3D & Spatial Simulation";

    return `Our creative leadership pairs brand executives directly with seasoned directors and artists:\n\n${rosterList}\n\nWe strip away traditional agency layers so you collaborate directly with the directing minds shaping your film. Learn more on our About page (/about).`;
  }

  // 4. Portfolio / Work / Case Studies
  if (
    q.includes("work") ||
    q.includes("portfolio") ||
    q.includes("example") ||
    q.includes("sample") ||
    q.includes("case study") ||
    q.includes("project")
  ) {
    const projectList =
      projects.length > 0
        ? projects
            .slice(0, 4)
            .map((p) => `• ${p.title} (${p.category})`)
            .join("\n")
        : "• Aura X1: The Silence of Speed (Product Commercials)\n• Verve Chrono: Engineering Eternity (E-commerce)\n• Lumina Aura: Sculpting the Invisible (Brand Films)\n• Kinetix Pro: Precision in Motion (Social & Performance)";

    return `Here are some of our recent commercial case studies:\n\n${projectList}\n\nYou can stream our full 4K showreels and deliverables breakdown on the Selected Works page (/work). Ready to create something unforgettable for your brand? Tell us about your goals on /contact!`;
  }

  // 5. Timeline / Delivery / Schedule
  if (
    q.includes("time") ||
    q.includes("fast") ||
    q.includes("long") ||
    q.includes("turnaround") ||
    q.includes("deadline") ||
    q.includes("schedule") ||
    q.includes("how quick")
  ) {
    return `Most commercial campaigns are delivered within 1 to 4 weeks depending on project complexity:\n\n• Social & performance ad suites: 7 to 14 days\n• Product commercials & explainers: 2 to 3 weeks\n• Flagship brand films & cinematic campaigns: 3 to 4 weeks\n\n${pageContent.contactResponsePromise} Share your target launch deadline on our Contact page (/contact) and we'll confirm the production roadmap immediately.`;
  }

  // 6. About / Global Operations / Location
  if (
    q.includes("about") ||
    q.includes("location") ||
    q.includes("where") ||
    q.includes("office") ||
    q.includes("hub") ||
    q.includes("city") ||
    q.includes("country")
  ) {
    return `Fixelora Studio operates as an international commercial video production agency with borderless worldwide deployment.\n\nOur philosophy: ${pageContent.aboutHeroHeadline} ${pageContent.aboutHeroHeadlineAccent}\n\nWe assemble vetted directors, camera units, and post-production specialists across North America, Europe, and Asia for seamless remote collaboration and international filming. Contact our production office directly at production@fixelorastudio.com or submit a brief at /contact.`;
  }

  // 7. Contact / How to start
  if (
    q.includes("start") ||
    q.includes("contact") ||
    q.includes("brief") ||
    q.includes("book") ||
    q.includes("call") ||
    q.includes("hire") ||
    q.includes("reach") ||
    q.includes("email")
  ) {
    return `Initiating production with Fixelora Studio is seamless:\n\n1. Visit our Contact page (/contact)\n2. Select Track A to submit a 2-minute Project Brief, or Track B to schedule a 20-minute Discovery Call.\n3. Direct studio email: production@fixelorastudio.com | Studio line: +1 (310) 902-8800\n\n${pageContent.contactResponsePromise}`;
  }

  // Default SDR greeting
  return `Welcome to Fixelora Studio! We direct high-impact commercials, brand films, and social ad suites designed to elevate brands and drive measurable conversions.\n\n• 6 Production Disciplines: Product Commercials, Brand Films, Social Ads, E-commerce, Explainers, and Storytelling.\n• Flexible Budget Tiers: From $50–$200 starter clips up to $1,500–$3,000+ flagship commercials and custom packages.\n• Global Reach: Operating internationally with borderless commercial deployment.\n\nWhat kind of campaign is your team planning? You can also jump right over to our Contact page (/contact) to submit a quick 2-minute brief!`;
}

function createTextStreamResponse(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const rawMessages: IncomingMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];

    const sanitizedMessages = rawMessages
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.trim().length > 0
      )
      .slice(-12)
      .map((m) => ({
        role: m.role,
        content: m.content.trim(),
      }));

    // Query live data from Neon PostgreSQL for real-time SDR accuracy
    const [pageContent, teamMembers, projects] = await Promise.all([
      pageContentRepository.getPageContent(),
      pageContentRepository.getTeamMembers(),
      projectRepository.getProjects(),
    ]);

    const context: ChatContext = {
      pageContent,
      teamMembers,
      projects,
    };

    if (sanitizedMessages.length === 0) {
      return createTextStreamResponse(
        `Hi! Welcome to Fixelora Studio. I'm your commercial production assistant. Ask me about our 6 core video disciplines, budget tiers ($50-$200 up to $1,500-$3,000+), team leadership, or how to submit a brief on /contact.`
      );
    }

    const lastUserMessage =
      [...sanitizedMessages].reverse().find((m) => m.role === "user")?.content || "";

    // If OPENAI_API_KEY is present, stream using Vercel AI SDK with dynamic Neon context injected
    if (process.env.OPENAI_API_KEY) {
      try {
        const teamSummary = teamMembers.map((m) => `${m.name} (${m.role})`).join("; ");
        const projectSummary = projects
          .slice(0, 5)
          .map((p) => `"${p.title}" [${p.category}]`)
          .join(", ");

        const dynamicSystemPrompt = `You are the automated SDR (Sales Development Representative) for Fixelora Studio, an international commercial video production agency.
Studio Identity: ${pageContent.homeHeroTag}. "${pageContent.homeHeroHeadline} ${pageContent.homeHeroHeadlineAccent}"
Subheadline: ${pageContent.homeHeroSubheadline}
Operations: Operating internationally as an agile, borderless commercial production unit.
Leadership: ${teamSummary || "Julian Vance, Founder & Executive Creative Director; Elena Rostova, Senior Colorist; Kaelen Voss, Head of 3D"}
Core Disciplines: 1. Product Commercials, 2. Brand Films, 3. Social/Performance Advertising, 4. E-commerce, 5. Explainer/Software, 6. Storytelling/Book Trailers
Services Overview: ${pageContent.servicesHeroSummary}
Budget Tiers:
- $50 - $200 (Starter social clips & fast product cuts)
- $300 - $500 (Targeted ad creatives & product showcases)
- $700 - $1,500 (Multi-format campaigns & explainer suites)
- $1,500 - $3,000+ (Flagship commercials & cinematic brand films)
- Custom Budget (Enterprise and international multi-market campaigns)
Recent Portfolio Works: ${projectSummary || "Aura X1, Verve Chrono, Lumina Aura, Kinetix Pro"}
Turnaround: 1 to 4 weeks based on scope.
Contact & SLA: ${pageContent.contactResponsePromise}. Studio email: production@fixelorastudio.com. URL: /contact.
Directives:
- Respond in clear, confident, commercial language. Do NOT use confusing camera sensors or gear jargon.
- Emphasize business growth, visual prestige, and conversions.
- Guide prospective clients to submit a 2-minute brief on the Contact page (/contact) or book a discovery call.`;

        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: dynamicSystemPrompt,
          messages: sanitizedMessages,
        });

        return result.toTextStreamResponse();
      } catch (aiError) {
        console.error("[Chat API] OpenAI stream fallback:", aiError);
      }
    }

    // Intelligent Zero-API-Key Local Fallback powered dynamically by live Neon data
    return createTextStreamResponse(buildFallbackSdrReply(lastUserMessage, context));
  } catch (error) {
    console.error("[Chat API] POST error:", error);
    return createTextStreamResponse(
      "I'm here to help you grow your brand with high-converting video! Please visit our Contact page (/contact) to share your project brief and receive a tailored response within 24 hours."
    );
  }
}
