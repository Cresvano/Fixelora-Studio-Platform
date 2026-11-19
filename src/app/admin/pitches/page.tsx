"use client";

import * as React from "react";
import Link from "next/link";
import { Pitch } from "@/types";
import {
  Plus,
  Send,
  Copy,
  Eye,
  Check,
  Clock,
  ExternalLink,
  Edit3,
  Trash2,
  X,
  Save,
  RefreshCw,
  Video,
  AlertCircle
} from "lucide-react";

const EMPTY_PITCH: Omit<Pitch, "id" | "createdAt"> = {
  slug: "",
  brandName: "",
  brandLogo: "",
  contactName: "",
  proposalTitle: "",
  customNote: "",
  playbackVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  thumbnailUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1600&auto=format&fit=crop",
  keyTakeaways: [
    "Custom 60s broadcast master and vertical cutdowns.",
    "Zero noise: bespoke spatial sound design and master audio mix.",
    "Turnkey pipeline with 3-week turnaround from pre-light to final grade."
  ],
  recommendedTimeline: "4-Week Turnaround",
  validUntil: "2026-12-31",
  status: "active",
};

export default function AdminPitchesPage() {
  const [pitches, setPitches] = React.useState<Pitch[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPitchId, setEditingPitchId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Omit<Pitch, "id" | "createdAt">>(EMPTY_PITCH);
  const [keyTakeawaysText, setKeyTakeawaysText] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Fetch Pitches from API
  const fetchPitches = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/pitches");
      const data = await res.json();
      if (data.success && data.pitches) {
        setPitches(data.pitches);
      }
    } catch (err) {
      console.error("Failed to load pitches:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPitches();
  }, [fetchPitches]);

  const handleCopyLink = (slug: string, id: string) => {
    const fullUrl = `${window.location.origin}/pitch/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenCreate = () => {
    setEditingPitchId(null);
    setFormData(EMPTY_PITCH);
    setKeyTakeawaysText(EMPTY_PITCH.keyTakeaways.join("\n"));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pitch: Pitch) => {
    setEditingPitchId(pitch.id);
    setFormData({
      slug: pitch.slug,
      brandName: pitch.brandName,
      brandLogo: pitch.brandLogo || "",
      contactName: pitch.contactName,
      proposalTitle: pitch.proposalTitle,
      customNote: pitch.customNote,
      playbackVideoUrl: pitch.playbackVideoUrl,
      thumbnailUrl: pitch.thumbnailUrl,
      keyTakeaways: pitch.keyTakeaways,
      recommendedTimeline: pitch.recommendedTimeline,
      validUntil: pitch.validUntil,
      status: pitch.status,
    });
    setKeyTakeawaysText(pitch.keyTakeaways.join("\n"));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (pitch: Pitch) => {
    if (!confirm(`Are you sure you want to delete the pitch for "${pitch.brandName}"?`)) {
      return;
    }

    setPitches((prev) => prev.filter((p) => p.id !== pitch.id));

    try {
      const res = await fetch(`/api/pitches?id=${encodeURIComponent(pitch.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to delete pitch from Neon.");
        fetchPitches();
      }
    } catch (err) {
      console.error("Delete pitch failed:", err);
      fetchPitches();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    const takeawaysArray = keyTakeawaysText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      keyTakeaways: takeawaysArray,
    };

    try {
      if (editingPitchId) {
        const res = await fetch("/api/pitches", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPitchId, ...payload }),
        });
        const result = await res.json();
        if (result.success) {
          setPitches((prev) =>
            prev.map((p) => (p.id === editingPitchId ? { ...p, ...payload } : p))
          );
          setIsModalOpen(false);
        } else {
          setFormError(result.error || "Failed to update pitch.");
        }
      } else {
        const res = await fetch("/api/pitches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (result.success && result.pitch) {
          setPitches((prev) => [result.pitch, ...prev]);
          setIsModalOpen(false);
        } else {
          setFormError(result.error || "Failed to create pitch.");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setFormError("Network error occurred while saving to Neon database.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Outbound Private Pitch Engine
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon DB Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate unlisted, branded landing pages with speculative commercial videos for high-value cold outreach.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPitches}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-mono transition-colors disabled:opacity-50"
            title="Refresh pitches from Neon"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-400" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Private Pitch</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-gold-400 mb-3" />
          <p className="text-xs font-mono uppercase text-muted-foreground">
            Querying Neon pitches table...
          </p>
        </div>
      ) : pitches.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-border text-center flex flex-col items-center justify-center">
          <Send className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-base font-bold text-foreground mb-1">No Active Pitches</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">
            Create your first unlisted outbound pitch page to start sending targeted proposals to prospective brands.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors"
          >
            Create Pitch
          </button>
        </div>
      ) : (
        /* Pitches List */
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
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                      pitch.status === "active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : pitch.status === "accepted"
                        ? "bg-gold-500/10 text-gold-400 border border-gold-500/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}
                  >
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

                  <button
                    onClick={() => handleOpenEdit(pitch)}
                    className="p-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    title="Edit Pitch"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(pitch)}
                    className="p-1.5 rounded-lg border border-border/80 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Pitch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT PITCH MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {editingPitchId ? "Edit Private Pitch" : "Create New Private Pitch"}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Saves directly to Neon PostgreSQL <code className="text-gold-400">pitches</code> table.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex flex-col gap-5 text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Polestar Electric Performance"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Custom Pitch Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. polestar-silence-in-motion"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Contact Recipient *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Marcus Lindqvist (Head of Global Brand)"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Proposal Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.proposalTitle}
                    onChange={(e) => setFormData({ ...formData, proposalTitle: e.target.value })}
                    placeholder="Speculative Commercial: The Architecture of Pure Silence"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Director&apos;s Custom Pitch Note *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.customNote}
                  onChange={(e) => setFormData({ ...formData, customNote: e.target.value })}
                  placeholder="Explain why this commercial concept was designed specifically for this brand..."
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Playback Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.playbackVideoUrl}
                    onChange={(e) => setFormData({ ...formData, playbackVideoUrl: e.target.value })}
                    placeholder="https://...blob.vercel-storage.com/...mp4"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Poster Thumbnail URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Recommended Timeline
                  </label>
                  <input
                    type="text"
                    value={formData.recommendedTimeline}
                    onChange={(e) => setFormData({ ...formData, recommendedTimeline: e.target.value })}
                    placeholder="4-Week Turnaround"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Valid Until Date
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Pitch Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                  >
                    <option value="active">Active</option>
                    <option value="viewed">Viewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Key Takeaways (One item per line)
                </label>
                <textarea
                  rows={3}
                  value={keyTakeawaysText}
                  onChange={(e) => setKeyTakeawaysText(e.target.value)}
                  placeholder="Custom 60s broadcast master&#10;Cinema-grade spatial sound&#10;3-week delivery guarantee"
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none font-mono"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground text-xs uppercase font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 text-black hover:bg-gold-400 text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving to Neon..." : editingPitchId ? "Update Pitch" : "Publish Pitch"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
