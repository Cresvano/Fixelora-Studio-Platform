import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const FIXELORA_SYSTEM_PROMPT =
  "You are the automated SDR for Fixelora Studio, a commercial video production agency. Your goal is to answer questions politely in simple terms and guide users to submit a brief on the Contact page. You know the 6 core services (Product Commercials, Brand Films, Social Ads, E-commerce, Explainer, Storytelling). You know budget tiers start at $50-$200 up to $1,500-$3,000+. Be concise, do not use confusing film jargon, and focus on business growth.";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

function buildFallbackSdrReply(userText: string): string {
  const q = userText.toLowerCase();

  if (
    q.includes("price") ||
    q.includes("cost") ||
    q.includes("budget") ||
    q.includes("how much") ||
    q.includes("rate") ||
    q.includes("tier")
  ) {
    return "Our production tiers are built to scale with your business goals:\n\n• $50 – $200 (Starter social & product clips)\n• $300 – $500 (Targeted ad creatives & product showcases)\n• $700 – $1,500 (Multi-format campaigns & explainer videos)\n• $1,500 – $3,000+ (Flagship commercials & brand films)\n• Custom Budget (Tailored enterprise packages)\n\nShare your goals on our Contact page (/contact) and our team will reply with a clear proposal within 24 hours.";
  }

  if (
    q.includes("service") ||
    q.includes("offer") ||
    q.includes("what do you") ||
    q.includes("video") ||
    q.includes("make")
  ) {
    return "Fixelora Studio specializes in 6 core video services designed to grow your revenue:\n\n1. Product Commercials\n2. Brand Films\n3. Social & Performance Ads\n4. E-commerce Product Videos\n5. Explainer & Software Videos\n6. Storytelling & Book Trailers\n\nWhich of these fits your upcoming launch? You can also submit a quick 2-minute brief on our Contact page (/contact) to get started right away.";
  }

  if (
    q.includes("time") ||
    q.includes("fast") ||
    q.includes("long") ||
    q.includes("turnaround") ||
    q.includes("deadline")
  ) {
    return "Most campaigns are delivered within 1 to 4 weeks depending on scope, and we review every new brief within 24 hours. Head over to our Contact page (/contact) to share your target launch date and we'll map out the fastest schedule for your team.";
  }

  if (
    q.includes("start") ||
    q.includes("contact") ||
    q.includes("brief") ||
    q.includes("book") ||
    q.includes("call") ||
    q.includes("hire")
  ) {
    return "Getting started is simple! Visit our Contact page (/contact) to submit a quick 2-minute Project Brief or book a 20-minute discovery call. We'll review your business goals and send back a clear plan within 24 hours.";
  }

  if (q.includes("work") || q.includes("portfolio") || q.includes("example") || q.includes("sample")) {
    return "You can explore our recent commercials and results on the Selected Works page (/work). If you see a style you love, drop a quick brief on our Contact page (/contact) and tell us what you want to achieve for your brand.";
  }

  return "Thanks for reaching out to Fixelora Studio! We help growing brands turn attention into sales through Product Commercials, Brand Films, Social Ads, E-commerce videos, Explainers, and Storytelling—with flexible budget tiers from $50–$200 up to $1,500–$3,000+.\n\nTell me a bit about what you're launching, or submit a quick 2-minute brief on our Contact page (/contact) for a tailored proposal within 24 hours.";
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

    if (sanitizedMessages.length === 0) {
      return createTextStreamResponse(
        "Hi! Welcome to Fixelora Studio. Ask me about our 6 video production services, budget tiers, or how to kick off your next campaign."
      );
    }

    const lastUserMessage =
      [...sanitizedMessages].reverse().find((m) => m.role === "user")?.content || "";

    // Use Vercel AI SDK + OpenAI when OPENAI_API_KEY is configured
    if (process.env.OPENAI_API_KEY) {
      try {
        const result = streamText({
          model: openai("gpt-4o-mini"),
          system: FIXELORA_SYSTEM_PROMPT,
          messages: sanitizedMessages,
        });

        return result.toTextStreamResponse();
      } catch (aiError) {
        console.error("[Chat API] OpenAI stream fallback:", aiError);
      }
    }

    // Graceful built-in Fixelora SDR fallback if OPENAI_API_KEY is not set yet
    return createTextStreamResponse(buildFallbackSdrReply(lastUserMessage));
  } catch (error) {
    console.error("[Chat API] POST error:", error);
    return createTextStreamResponse(
      "I'm here to help you grow your brand with high-converting video! Please visit our Contact page (/contact) to share your project brief and receive a tailored response within 24 hours."
    );
  }
}
