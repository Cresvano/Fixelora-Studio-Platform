"use client";

import * as React from "react";
import Link from "next/link";
import { MOCK_PITCHES } from "@/lib/data/pitches";
import { Pitch } from "@/types";
import { Plus, Send, Copy, Eye, Check, Clock, ExternalLink } from "lucide-react";

export default function AdminPitchesPage() {
  const [pitches, setPitches] = React.useState<Pitch[]>(MOCK_PITCHES);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyLink = (slug: string, id: string) => {
    const fullUrl = `${window.location.origin}/pitch/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Outbound Private Pitch Engine
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Generate unlisted, branded landing pages with speculative commercial videos for high-value cold outreach.
          </p>
        </div>

        <button
          onClick={() => alert("Simulated: Opens Pitch Creator with Brand Name, Video Link, and Director Note.")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Private Pitch</span>
        </button>
      </div>

      {/* Pitches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pitches.map((pitch) => (
          <div
            key={pitch.id}
            className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col justify-between gap-6"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
                <span className="text-[11px] font-mono uppercase tracking-wider text-gold-400 font-bold">
                  {pitch.brandName}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {pitch.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-2">
                {pitch.proposalTitle}
              </h3>

              <p className="text-xs text-muted-foreground mb-4">
                Recipient: <span className="text-foreground font-medium">{pitch.contactName}</span>
              </p>

              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed italic bg-background/50 p-4 rounded-xl border border-border/60">
                &ldquo;{pitch.customNote}&rdquo;
              </p>
            </div>

            <div className="pt-4 border-t border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[11px] font-mono text-muted-foreground">
                Expires: {pitch.validUntil}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyLink(pitch.slug, pitch.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {copiedId === pitch.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/pitch/${pitch.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500 text-black text-xs font-medium hover:bg-gold-400 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
