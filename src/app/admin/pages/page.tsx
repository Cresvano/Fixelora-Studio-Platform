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
  FileText,
  Compass,
  Sliders,
  BookOpen,
  Mail,
  Globe
} from "lucide-react";

type PageTab = "home" | "about" | "services" | "insights" | "contact" | "global" | "team";

const EMPTY_MEMBER: Omit<TeamMember, "id" | "createdAt"> = {
  name: "",
  role: "",
  bio: "",
  headshotUrl: "",
  displayOrder: 0,
};

export default function AdminPagesCMS() {
  const [activeTab, setActiveTab] = React.useState<PageTab>("home");

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

  const tabsConfig = [
    { id: "home" as PageTab, label: "Home (/)", icon: LayoutTemplate, preview: "/" },
    { id: "about" as PageTab, label: "About (/about)", icon: Compass, preview: "/about" },
    { id: "services" as PageTab, label: "Services (/services)", icon: Sliders, preview: "/services" },
    { id: "insights" as PageTab, label: "Insights (/blog)", icon: BookOpen, preview: "/blog" },
    { id: "contact" as PageTab, label: "Contact (/contact)", icon: Mail, preview: "/contact" },
    { id: "global" as PageTab, label: "Global (Footer & CTA)", icon: Globe, preview: "/" },
    { id: "team" as PageTab, label: "Team Roster", icon: Users, preview: "/about" },
  ];

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Global Page CMS & Team Manager
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon DB Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Edit live copy across all 5 public pages, global elements, and direct your creative team roster.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tabsConfig
            .find((t) => t.id === activeTab)
            ?.preview && (
              <Link
                href={tabsConfig.find((t) => t.id === activeTab)!.preview}
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <span>Preview Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}
        </div>
      </div>

      {/* Tabbed Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-card border border-border/80 w-full">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
                isActive
                  ? "bg-gold-500 text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Copy Notification Banners */}
      {activeTab !== "team" && (
        <>
          {copySaved && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Page content successfully saved and revalidated across public routes!</span>
              </div>
            </div>
          )}

          {copyError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center gap-2 text-xs font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{copyError}</span>
            </div>
          )}
        </>
      )}

      {/* TAB CONTENT: COPY SECTIONS (HOME, ABOUT, SERVICES, INSIGHTS, CONTACT, GLOBAL) */}
      {activeTab !== "team" ? (
        <form onSubmit={handleSaveCopy} className="flex flex-col gap-6">
          {isLoadingCopy ? (
            <div className="p-16 rounded-3xl border border-border bg-card flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-gold-400" />
              <p className="text-xs font-mono text-muted-foreground">Loading copy from Neon...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: HOME (/) */}
              {activeTab === "home" && (
                <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card flex flex-col gap-5">
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Homepage Copy (/)</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Hero headlines, slider introductory summary, and capabilities section headers.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Route: /
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Category Badge
                    </label>
                    <input
                      type="text"
                      value={content.homeHeroTag}
                      onChange={(e) => setContent({ ...content, homeHeroTag: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Hero Main Headline
                      </label>
                      <input
                        type="text"
                        value={content.homeHeroHeadline}
                        onChange={(e) => setContent({ ...content, homeHeroHeadline: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-gold-700 dark:text-gold-400 font-semibold">
                        Hero Accent Headline (Gold Gradient)
                      </label>
                      <input
                        type="text"
                        value={content.homeHeroHeadlineAccent}
                        onChange={(e) => setContent({ ...content, homeHeroHeadlineAccent: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Subheadline
                    </label>
                    <textarea
                      rows={2}
                      value={content.homeHeroSubheadline}
                      onChange={(e) => setContent({ ...content, homeHeroSubheadline: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Slider Intro Text (Replaces technical camera metadata)
                    </label>
                    <textarea
                      rows={2}
                      value={content.sliderIntroText}
                      onChange={(e) => setContent({ ...content, sliderIntroText: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Services Section Eyebrow
                      </label>
                      <input
                        type="text"
                        value={content.homeServicesEyebrow}
                        onChange={(e) => setContent({ ...content, homeServicesEyebrow: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Services Section Title
                      </label>
                      <input
                        type="text"
                        value={content.homeServicesTitle}
                        onChange={(e) => setContent({ ...content, homeServicesTitle: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ABOUT (/about) */}
              {activeTab === "about" && (
                <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card flex flex-col gap-5">
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">About Page Copy (/about)</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Studio story, executive manifesto, and creative philosophy.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Route: /about
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Eyebrow
                    </label>
                    <input
                      type="text"
                      value={content.aboutHeroEyebrow}
                      onChange={(e) => setContent({ ...content, aboutHeroEyebrow: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Hero Main Headline
                      </label>
                      <input
                        type="text"
                        value={content.aboutHeroHeadline}
                        onChange={(e) => setContent({ ...content, aboutHeroHeadline: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-gold-700 dark:text-gold-400 font-semibold">
                        Hero Accent Headline (Gold Gradient)
                      </label>
                      <input
                        type="text"
                        value={content.aboutHeroHeadlineAccent}
                        onChange={(e) => setContent({ ...content, aboutHeroHeadlineAccent: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Hero Subheadline
                    </label>
                    <textarea
                      rows={2}
                      value={content.aboutHeroSubheadline}
                      onChange={(e) => setContent({ ...content, aboutHeroSubheadline: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Manifesto Title
                    </label>
                    <input
                      type="text"
                      value={content.aboutManifestoTitle}
                      onChange={(e) => setContent({ ...content, aboutManifestoTitle: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Manifesto Main Body (Paragraphs separated by blank line)
                    </label>
                    <textarea
                      rows={6}
                      value={content.aboutMainBody}
                      onChange={(e) => setContent({ ...content, aboutMainBody: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SERVICES (/services) */}
              {activeTab === "services" && (
                <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card flex flex-col gap-5">
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Services Page Copy (/services)</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Page title, gold accent, and executive commercial summary.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Route: /services
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Services Hero Headline
                      </label>
                      <input
                        type="text"
                        value={content.servicesHeroHeadline}
                        onChange={(e) => setContent({ ...content, servicesHeroHeadline: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-gold-700 dark:text-gold-400 font-semibold">
                        Services Accent Headline (Gold Gradient)
                      </label>
                      <input
                        type="text"
                        value={content.servicesHeroHeadlineAccent}
                        onChange={(e) =>
                          setContent({ ...content, servicesHeroHeadlineAccent: e.target.value })
                        }
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Services Executive Summary
                    </label>
                    <textarea
                      rows={4}
                      value={content.servicesHeroSummary}
                      onChange={(e) => setContent({ ...content, servicesHeroSummary: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: INSIGHTS (/blog) */}
              {activeTab === "insights" && (
                <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card flex flex-col gap-5">
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Insights & Journal Copy (/blog)</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Header copy for our commercial filmmaking and advertising strategy publication.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Route: /blog
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={content.blogHeroEyebrow}
                      onChange={(e) => setContent({ ...content, blogHeroEyebrow: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={content.blogHeroHeadline}
                        onChange={(e) => setContent({ ...content, blogHeroHeadline: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-gold-700 dark:text-gold-400 font-semibold">
                        Accent Headline (Gold Gradient)
                      </label>
                      <input
                        type="text"
                        value={content.blogHeroHeadlineAccent}
                        onChange={(e) => setContent({ ...content, blogHeroHeadlineAccent: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Introductory Summary
                    </label>
                    <textarea
                      rows={3}
                      value={content.blogHeroIntro}
                      onChange={(e) => setContent({ ...content, blogHeroIntro: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: CONTACT (/contact) */}
              {activeTab === "contact" && (
                <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card flex flex-col gap-5">
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Contact & Brief Copy (/contact)</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Header copy, brief intro instructions, and production response SLA promise.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Route: /contact
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Eyebrow Tag
                    </label>
                    <input
                      type="text"
                      value={content.contactHeroEyebrow}
                      onChange={(e) => setContent({ ...content, contactHeroEyebrow: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Main Headline
                      </label>
                      <input
                        type="text"
                        value={content.contactHeroHeadline}
                        onChange={(e) => setContent({ ...content, contactHeroHeadline: e.target.value })}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-mono uppercase text-gold-700 dark:text-gold-400 font-semibold">
                        Accent Headline (Gold Gradient)
                      </label>
                      <input
                        type="text"
                        value={content.contactHeroHeadlineAccent}
                        onChange={(e) =>
                          setContent({ ...content, contactHeroHeadlineAccent: e.target.value })
                        }
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Introductory Explanation
                    </label>
                    <textarea
                      rows={3}
                      value={content.contactHeroIntro}
                      onChange={(e) => setContent({ ...content, contactHeroIntro: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Response SLA Promise (Right-hand column)
                    </label>
                    <input
                      type="text"
                      value={content.contactResponsePromise}
                      onChange={(e) => setContent({ ...content, contactResponsePromise: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 6: GLOBAL (FOOTER & CTA) */}
              {activeTab === "global" && (
                <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card flex flex-col gap-5">
                  <div className="border-b border-border/60 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-foreground">Global Banner & Footer Copy</h3>
                      <p className="text-xs text-muted-foreground font-mono">
                        Affects global call-to-action sections and footer branding across the entire site.
                      </p>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      Sitewide
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Global CTA Heading
                    </label>
                    <input
                      type="text"
                      value={content.globalCtaHeading}
                      onChange={(e) => setContent({ ...content, globalCtaHeading: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Global CTA Subtext
                    </label>
                    <textarea
                      rows={2}
                      value={content.globalCtaSubtext}
                      onChange={(e) => setContent({ ...content, globalCtaSubtext: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 pt-2">
                    <label className="text-xs font-mono uppercase text-muted-foreground">
                      Footer Brand Bio
                    </label>
                    <textarea
                      rows={3}
                      value={content.footerDescription}
                      onChange={(e) => setContent({ ...content, footerDescription: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500"
                    />
                  </div>
                </div>
              )}

              {/* SAVE ACTION BAR */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                <p className="text-xs text-muted-foreground font-mono">
                  Changes save to Neon PostgreSQL and immediately invalidate route cache.
                </p>

                <button
                  type="submit"
                  disabled={isSavingCopy}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 text-black hover:bg-gold-400 text-xs font-semibold uppercase tracking-wider disabled:opacity-50 transition-colors shadow-md"
                >
                  {isSavingCopy ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Neon...</span>
                    </>
                  ) : copySaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Changes Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Page Copy</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      ) : (
        /* TAB 7: TEAM ROSTER */
        <div className="flex flex-col gap-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
              <div>
                <h3 className="text-base font-bold text-foreground">Directing Minds & Creative Roster</h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Managed dynamically in Neon <code className="text-gold-400">team_members</code>. Renders on /about.
                </p>
              </div>

              <button
                onClick={handleOpenAddMember}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 text-black hover:bg-gold-400 text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            {isLoadingTeam ? (
              <div className="py-16 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-gold-400" />
                <p className="text-xs font-mono text-muted-foreground">Loading team roster from Neon...</p>
              </div>
            ) : members.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs font-mono">
                No team members found. Click "Add Team Member" above to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="p-5 rounded-2xl border border-border bg-background/50 flex flex-col justify-between gap-4 hover:border-gold-500/40 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0">
                        {member.headshotUrl ? (
                          <Image
                            src={member.headshotUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="text-sm font-bold text-foreground truncate">{member.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground shrink-0">
                            #{member.displayOrder}
                          </span>
                        </div>
                        <p className="text-xs font-mono text-gold-700 dark:text-gold-400 mb-2 truncate">
                          {member.role}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {member.bio}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditMember(member)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-mono text-foreground transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-gold-400" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteMember(member)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 text-xs font-mono text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
