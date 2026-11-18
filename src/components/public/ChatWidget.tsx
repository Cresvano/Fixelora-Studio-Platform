"use client";

import * as React from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "What services do you offer?",
  "What are your budget tiers?",
  "How do I start a project?",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm the Fixelora Studio assistant. Ask me about our 6 commercial video services, budget tiers ($50–$200 up to $1,500–$3,000+), or how we can help grow your brand.",
  },
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const scrollEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };

    const assistantId = `assistant-${Date.now()}`;
    const nextHistory = [...messages, userMsg];

    setMessages([
      ...nextHistory,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Chat response unavailable");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const snapshot = accumulated;
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: snapshot } : m))
        );
      }

      if (!accumulated.trim()) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "Thanks for reaching out! Visit our Contact page (/contact) to submit a brief and our producers will respond within 24 hours.",
                }
              : m
          )
        );
      }
    } catch (err) {
      console.error("ChatWidget error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I had trouble connecting. You can always reach our team directly on the Contact page (/contact) for a response within 24 hours.",
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Fixelora Studio AI Assistant"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[540px] rounded-3xl border border-border bg-card text-foreground shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="px-5 py-4 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-500/15 border border-gold-500/40 text-gold-700 dark:text-gold-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-tight">
                  Fixelora Assistant
                </p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Online • Instant Project Guidance</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat assistant"
              className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/40 min-h-[260px] max-h-[340px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-gold-500 text-black font-medium rounded-br-sm"
                      : "bg-card border border-border/80 text-foreground rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Thinking...</span>
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Quick Starter Chips on first message */}
            {messages.length === 1 && !isStreaming && (
              <div className="pt-1 flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => sendMessage(prompt)}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium border border-border bg-card text-foreground hover:border-gold-500/60 hover:text-gold-700 dark:hover:text-gold-400 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={scrollEndRef} />
          </div>

          {/* Direct Contact Brief Shortcut */}
          <div className="px-4 py-2 border-t border-border/60 bg-muted/40 flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">
              Ready to get a custom quote?
            </span>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gold-700 dark:text-gold-400 hover:underline"
            >
              <span>Submit Brief</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-border bg-card flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isStreaming}
              placeholder="Ask about services, budgets, or timelines..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground text-xs focus:outline-none focus:border-gold-500/60 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-gold-500 text-black hover:bg-gold-400 transition-colors disabled:opacity-40 shrink-0"
            >
              {isStreaming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close Fixelora chat" : "Open Fixelora chat"}
        className="group inline-flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gold-500 text-black font-semibold text-xs uppercase tracking-wider shadow-xl shadow-gold-500/25 hover:bg-gold-400 hover:scale-105 transition-all duration-200"
      >
        {isOpen ? (
          <>
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close Chat</span>
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask Fixelora</span>
          </>
        )}
      </button>
    </div>
  );
}
