"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PageContent, TeamMember } from "@/types";
import { DEFAULT_PAGE_CONTENT } from "@/lib/data/page-content";
import {
  LayoutTemplate,
  Users,
  Save,
  Check,
  RefreshCw,
  Plus,
  Edit3,
  Trash2,
  Upload,
  X,
  ExternalLink,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  FileText
} from "lucide-react";

const EMPTY_MEMBER: Omit<TeamMember, "id" | "createdAt"> = {
  name: "",
  role: "",
  bio: "",
  headshotUrl: "",
  displayOrder: 0,
};

export default function AdminPagesCMS() {
  const [activeTab, setActiveTab] = React.useState<"copy" | "team">("copy");

  // Page Copy State
  const [content, setContent] = React.useState<PageContent>(DEFAULT_PAGE_CONTENT);
  const [isLoadingCopy, setIsLoadingCopy] = React.useState(true);
  const [isSavingCopy, setIsSavingCopy] = React.useState(false);
  const [copySaved, setCopySaved] = React.useState(false);
  const [copyError, setCopyError] = React.useState<string | null>(null);

  // Team Roster State
  const [members, setMembers] = React.useState<TeamMember[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingMemberId, setEditingMemberId] = React.useState<string | null>(null);
  const [memberForm, setMemberForm] = React.useState<Omit<TeamMember, "id" | "createdAt">>(EMPTY_MEMBER);
  const [isSavingMember, setIsSavingMember] = React.useState(false);
  const [memberError, setMemberError] = React.useState<string | null>(null);

  // Headshot Upload State
  const [isUploadingHeadshot, setIsUploadingHeadshot] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch Page Copy
  const fetchPageContent = React.useCallback(async () => {
    setIsLoadingCopy(true);
    try {
      const res = await fetch("/api/page-content");
      const data = await res.json();
      if (data.success && data.content) {
        setContent(data.content);
      }
    } catch (err) {
      console.error("Failed to fetch page content:", err);
    } finally {
      setIsLoadingCopy(false);
    }
  }, []);

  // Fetch Team Roster
  const fetchTeam = React.useCallback(async () => {
    setIsLoadingTeam(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      if (data.success && data.members) {
        setMembers(data.members);
      }
    } catch (err) {
      console.error("Failed to fetch team roster:", err);
    } finally {
      setIsLoadingTeam(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPageContent();
    fetchTeam();
  }, [fetchPageContent, fetchTeam]);

  // Save Page Copy
  const handleSaveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCopy(true);
    setCopyError(null);
    setCopySaved(false);

    try {
      const res = await fetch("/api/page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const result = await res.json();
      if (result.success) {
        setCopySaved(true);
        setTimeout(() => setCopySaved(false), 3000);
      } else {
        setCopyError(result.error || "Failed to save page content.");
      }
    } catch (err) {
      console.error("Save page content error:", err);
      setCopyError("Network error while saving page copy to Neon.");
    } finally {
      setIsSavingCopy(false);
    }
  };

  // Team Modal Triggers
  const handleOpenAddMember = () => {
    setEditingMemberId(null);
    setMemberForm({
      ...EMPTY_MEMBER,
      displayOrder: members.length + 1,
    });
    setMemberError(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditMember = (member: TeamMember) => {
    setEditingMemberId(member.id);
    setMemberForm({
      name: member.name,
      role: member.role,
      bio: member.bio,
      headshotUrl: member.headshotUrl,
      displayOrder: member.displayOrder,
    });
    setMemberError(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  // Headshot Direct Upload via Vercel Blob Pipeline
  const handleHeadshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingHeadshot(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assetType", "headshot");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (result.success && result.url) {
        setMemberForm((prev) => ({ ...prev, headshotUrl: result.url }));
      } else {
        setUploadError(result.error || "Headshot upload failed.");
      }
    } catch (err) {
      console.error("Headshot upload error:", err);
      setUploadError("Network error uploading headshot to Vercel Blob.");
    } finally {
      setIsUploadingHeadshot(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Save Team Member
  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingMember(true);
    setMemberError(null);

    try {
      if (editingMemberId) {
        const res = await fetch("/api/team", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingMemberId, ...memberForm }),
        });
        const result = await res.json();
        if (result.success) {
          setMembers((prev) =>
            prev
              .map((m) => (m.id === editingMemberId ? { ...m, ...memberForm } : m))
              .sort((a, b) => a.displayOrder - b.displayOrder)
          );
          setIsModalOpen(false);
        } else {
          setMemberError(result.error || "Failed to update team member.");
        }
      } else {
        const res = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(memberForm),
        });
        const result = await res.json();
        if (result.success && result.member) {
          setMembers((prev) =>
            [...prev, result.member].sort((a, b) => a.displayOrder - b.displayOrder)
          );
          setIsModalOpen(false);
        } else {
          setMemberError(result.error || "Failed to add team member.");
        }
      }
    } catch (err) {
      console.error("Save team member error:", err);
      setMemberError("Network error while saving team member.");
    } finally {
      setIsSavingMember(false);
    }
  };

  // Delete Team Member
  const handleDeleteMember = async (member: TeamMember) => {
    if (!confirm(`Remove "${member.name}" from the studio roster?`)) return;

    setMembers((prev) => prev.filter((m) => m.id !== member.id));

    try {
      const res = await fetch(`/api/team?id=${encodeURIComponent(member.id)}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!result.success) {
        alert(result.error || "Failed to delete team member.");
        fetchTeam();
      }
    } catch (err) {
      console.error("Delete team member error:", err);
      fetchTeam();
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Global Page Copy & Team CMS
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon DB Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Edit public page headlines, manifesto copy, service summaries, and manage the directing roster with Vercel Blob headshot uploads.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span>Home</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/about"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span>About</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/services"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <span>Services</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/80 w-fit">
        <button
          onClick={() => setActiveTab("copy")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
            activeTab === "copy"
              ? "bg-gold-500 text-black font-bold shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Global Page Copy</span>
        </button>

        <button
          onClick={() => setActiveTab("team")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
            activeTab === "team"
              ? "bg-gold-500 text-black font-bold shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Team & Directors ({members.length})</span>
        </button>
      </div>

      {/* TAB 1: GLOBAL PAGE COPY FORM */}
      {activeTab === "copy" && (
        <form onSubmit={handleSaveCopy} className="flex flex-col gap-6">
          {copyError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{copyError}</span>
            </div>
          )}

          {isLoadingCopy ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-7 h-7 animate-spin text-gold-400 mb-3" />
              <p className="text-xs font-mono uppercase text-muted-foreground">
                Loading page copy from Neon...
              </p>
            </div>
          ) : (
            <>
              {/* 1. HOMEPAGE COPY */}
              <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-5">
                <div className="pb-3 border-b border-border/60 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
                      Homepage Copy (/)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Controls the primary hero slide headline, subheadline, and services overview heading.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Eyebrow Pill Tag
                    </label>
                    <input
                      type="text"
                      value={content.homeHeroTag}
                      onChange={(e) => setContent({ ...content, homeHeroTag: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Headline (Line 1)
                    </label>
                    <input
                      type="text"
                      required
                      value={content.homeHeroHeadline}
                      onChange={(e) => setContent({ ...content, homeHeroHeadline: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Headline Gold Accent (Line 2)
                    </label>
                    <input
                      type="text"
                      required
                      value={content.homeHeroHeadlineAccent}
                      onChange={(e) =>
                        setContent({ ...content, homeHeroHeadlineAccent: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Subheadline
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={content.homeHeroSubheadline}
                      onChange={(e) =>
                        setContent({ ...content, homeHeroSubheadline: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:border-gold-500/60 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Slider Intro / Trust Line (Replaces Technical Jargon)
                    </label>
                    <input
                      type="text"
                      value={content.sliderIntroText}
                      onChange={(e) =>
                        setContent({ ...content, sliderIntroText: e.target.value })
                      }
                      placeholder="Built to help ambitious brands stand out, earn instant trust, and turn attention into measurable sales."
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Homepage Services Eyebrow
                    </label>
                    <input
                      type="text"
                      value={content.homeServicesEyebrow}
                      onChange={(e) =>
                        setContent({ ...content, homeServicesEyebrow: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Homepage Services Section Title
                    </label>
                    <input
                      type="text"
                      value={content.homeServicesTitle}
                      onChange={(e) =>
                        setContent({ ...content, homeServicesTitle: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>
                </div>
              </div>

              {/* 2. ABOUT PAGE COPY */}
              <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-5">
                <div className="pb-3 border-b border-border/60">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
                    About Page Copy (/about)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Controls the studio story hero and creative manifesto body paragraphs. Use blank lines to separate paragraphs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      About Hero Eyebrow
                    </label>
                    <input
                      type="text"
                      value={content.aboutHeroEyebrow}
                      onChange={(e) => setContent({ ...content, aboutHeroEyebrow: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      About Hero Headline (Line 1)
                    </label>
                    <input
                      type="text"
                      value={content.aboutHeroHeadline}
                      onChange={(e) => setContent({ ...content, aboutHeroHeadline: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      About Hero Accent (Line 2)
                    </label>
                    <input
                      type="text"
                      value={content.aboutHeroHeadlineAccent}
                      onChange={(e) =>
                        setContent({ ...content, aboutHeroHeadlineAccent: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      About Hero Intro Subheadline
                    </label>
                    <textarea
                      rows={2}
                      value={content.aboutHeroSubheadline}
                      onChange={(e) =>
                        setContent({ ...content, aboutHeroSubheadline: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:border-gold-500/60 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Manifesto Heading
                    </label>
                    <input
                      type="text"
                      value={content.aboutManifestoTitle}
                      onChange={(e) =>
                        setContent({ ...content, aboutManifestoTitle: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      About Main Body Text (Blank line = new paragraph)
                    </label>
                    <textarea
                      rows={5}
                      value={content.aboutMainBody}
                      onChange={(e) => setContent({ ...content, aboutMainBody: e.target.value })}
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:border-gold-500/60 resize-y"
                    />
                  </div>
                </div>
              </div>

              {/* 3. SERVICES PAGE COPY */}
              <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-5">
                <div className="pb-3 border-b border-border/60">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
                    Services Page Summary (/services)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Controls the headline and studio positioning summary at the top of the Services page.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Services Headline (Line 1)
                    </label>
                    <input
                      type="text"
                      value={content.servicesHeroHeadline}
                      onChange={(e) =>
                        setContent({ ...content, servicesHeroHeadline: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Services Accent (Line 2)
                    </label>
                    <input
                      type="text"
                      value={content.servicesHeroHeadlineAccent}
                      onChange={(e) =>
                        setContent({ ...content, servicesHeroHeadlineAccent: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 sm:col-span-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Services Overview Summary
                    </label>
                    <textarea
                      rows={3}
                      value={content.servicesHeroSummary}
                      onChange={(e) =>
                        setContent({ ...content, servicesHeroSummary: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:border-gold-500/60 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 4. GLOBAL CTA BANNERS & FOOTER BIO */}
              <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-5">
                <div className="pb-3 border-b border-border/60">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
                    Global CTA Banners & Footer Bio (Site-Wide)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Controls the bottom &ldquo;Start a Project&rdquo; banners across all pages and the brand bio inside the global footer.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Global Closing CTA Heading
                    </label>
                    <input
                      type="text"
                      required
                      value={content.globalCtaHeading}
                      onChange={(e) =>
                        setContent({ ...content, globalCtaHeading: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Global Closing CTA Subtext
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={content.globalCtaSubtext}
                      onChange={(e) =>
                        setContent({ ...content, globalCtaSubtext: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:border-gold-500/60 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Global Footer Studio Bio / Description
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={content.footerDescription}
                      onChange={(e) =>
                        setContent({ ...content, footerDescription: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm leading-relaxed focus:outline-none focus:border-gold-500/60 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Save Action */}
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={isSavingCopy}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-md disabled:opacity-50"
                >
                  {isSavingCopy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Neon...</span>
                    </>
                  ) : copySaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved & Published Live</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Publish Page Copy</span>
                    </>
                  )}
                </button>
                {copySaved && (
                  <span className="text-xs font-mono text-emerald-400">
                    Public routes revalidated immediately.
                  </span>
                )}
              </div>
            </>
          )}
        </form>
      )}

      {/* TAB 2: TEAM ROSTER CRUD */}
      {activeTab === "team" && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-border/80 bg-card">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Directing Minds & Studio Roster
              </h3>
              <p className="text-xs text-muted-foreground">
                Members added here render dynamically on the public <code className="text-gold-400">/about</code> page. Headshots upload directly to Vercel Blob CDN.
              </p>
            </div>
            <button
              onClick={handleOpenAddMember}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team Member</span>
            </button>
          </div>

          {isLoadingTeam ? (
            <div className="py-16 flex flex-col items-center justify-center text-center">
              <RefreshCw className="w-7 h-7 animate-spin text-gold-400 mb-3" />
              <p className="text-xs font-mono uppercase text-muted-foreground">
                Querying Neon team_members table...
              </p>
            </div>
          ) : members.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-border text-center flex flex-col items-center justify-center">
              <Users className="w-10 h-10 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-base font-bold text-foreground mb-1">No Team Members Listed</h3>
              <p className="text-xs text-muted-foreground max-w-sm mb-6">
                Add directors, colorists, producers, or VFX leads to display on the About page.
              </p>
              <button
                onClick={handleOpenAddMember}
                className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors"
              >
                Add First Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="rounded-2xl border border-border/80 bg-card overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/5] w-full bg-black/40 border-b border-border/60">
                      {member.headshotUrl ? (
                        <Image
                          src={member.headshotUrl}
                          alt={member.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-10 h-10 opacity-40" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-black/75 backdrop-blur-md text-gold-400 border border-white/10">
                        Order #{member.displayOrder}
                      </span>
                    </div>

                    <div className="p-5">
                      <h4 className="text-base font-bold text-foreground">{member.name}</h4>
                      <p className="text-xs font-mono text-gold-400 mb-3">{member.role}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                        {member.bio}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 border-t border-border/60 bg-background/40 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditMember(member)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/80 text-xs font-mono text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD / EDIT TEAM MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {editingMemberId ? "Edit Team Member" : "Add Studio Team Member"}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Saves to Neon <code className="text-gold-400">team_members</code> + Vercel Blob Headshots.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="p-6 overflow-y-auto flex flex-col gap-5 text-xs">
              {memberError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{memberError}</span>
                </div>
              )}

              {/* Headshot Upload Block */}
              <div className="p-4 rounded-2xl bg-background/60 border border-border/80 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-24 h-28 rounded-xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                  {memberForm.headshotUrl ? (
                    <Image
                      src={memberForm.headshotUrl}
                      alt="Headshot preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground opacity-50" />
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-2 w-full">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Portrait Headshot (Vercel Blob Upload)
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleHeadshotUpload}
                      className="hidden"
                      id="headshot-file-upload"
                    />
                    <label
                      htmlFor="headshot-file-upload"
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                        isUploadingHeadshot
                          ? "bg-muted text-muted-foreground cursor-wait"
                          : "bg-gold-500 text-black hover:bg-gold-400"
                      }`}
                    >
                      {isUploadingHeadshot ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to Blob...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Headshot</span>
                        </>
                      )}
                    </label>
                  </div>

                  {uploadError && (
                    <p className="text-[11px] text-rose-400">{uploadError}</p>
                  )}

                  <input
                    type="url"
                    required
                    value={memberForm.headshotUrl}
                    onChange={(e) => setMemberForm({ ...memberForm, headshotUrl: e.target.value })}
                    placeholder="Or paste direct image URL (https://...)"
                    className="mt-1 px-3 py-2 rounded-xl bg-background border border-border text-foreground text-[11px] font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    placeholder="e.g. Julian Vance"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={memberForm.displayOrder}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, displayOrder: Number(e.target.value) })
                    }
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Studio Role / Title *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  placeholder="e.g. Founder & Executive Creative Director"
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Director Biography *
                </label>
                <textarea
                  required
                  rows={4}
                  value={memberForm.bio}
                  onChange={(e) => setMemberForm({ ...memberForm, bio: e.target.value })}
                  placeholder="Highlight notable brand campaigns, cinematography specialties, and creative background..."
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

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
                  disabled={isSavingMember || isUploadingHeadshot}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 text-black hover:bg-gold-400 text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {isSavingMember
                      ? "Saving..."
                      : editingMemberId
                      ? "Update Member"
                      : "Add to Roster"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
