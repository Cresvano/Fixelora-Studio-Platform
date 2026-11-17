"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Project, ProjectCategory, MediaAsset } from "@/types";
import {
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Video,
  RefreshCw,
  Sparkles,
  X,
  ExternalLink,
  Film,
  Image as ImageIcon,
  Check,
  Star,
  Layers,
  Save,
  AlertCircle
} from "lucide-react";

const CATEGORIES: Exclude<ProjectCategory, "All">[] = [
  "Product Commercials",
  "Brand Films",
  "Social/Performance Advertising",
  "E-commerce",
  "Explainer/Software",
  "Storytelling/Book Trailers",
];

const EMPTY_FORM: Omit<Project, "id" | "createdAt"> = {
  title: "",
  slug: "",
  client: "",
  year: new Date().getFullYear().toString(),
  category: "Product Commercials",
  tags: ["Commercial", "Cinematic"],
  runtime: "1:00",
  aspectRatio: "16:9",
  tagline: "",
  description: "",
  creativeObjective: "",
  targetAudience: "",
  deliverables: ["60s Broadcast Master", "30s Digital Cut", "Vertical Social Cuts"],
  commercialImpact: [
    { metric: "+45%", label: "Brand Recall & Engagement" },
  ],
  stills: [],
  originalVideoUrl: "",
  playbackVideoUrl: "",
  thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
  featured: false,
  isPublished: true,
};

export default function AdminPortfolioPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [mediaAssets, setMediaAssets] = React.useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [publishedFilter, setPublishedFilter] = React.useState<string>("All");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProjectId, setEditingProjectId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState(EMPTY_FORM);
  const [tagsInput, setTagsInput] = React.useState("");
  const [deliverablesInput, setDeliverablesInput] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Media Picker Modal State
  const [isMediaPickerOpen, setIsMediaPickerOpen] = React.useState(false);
  const [mediaPickerTarget, setMediaPickerTarget] = React.useState<
    "thumbnail" | "playback" | "original"
  >("thumbnail");
  const [mediaPickerFilter, setMediaPickerFilter] = React.useState<string>("all");

  // Fetch Projects from Neon
  const fetchProjects = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success && Array.isArray(data.projects)) {
        setProjects(data.projects);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Fetch Media Assets for Selector
  const fetchMediaAssets = React.useCallback(async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success && Array.isArray(data.assets)) {
        setMediaAssets(data.assets);
      }
    } catch (err) {
      console.error("Failed to load media assets for picker:", err);
    }
  }, []);

  React.useEffect(() => {
    fetchProjects();
    fetchMediaAssets();
  }, [fetchProjects, fetchMediaAssets]);

  // Handle Open Create Modal
  const handleOpenCreate = () => {
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
    setTagsInput(EMPTY_FORM.tags.join(", "));
    setDeliverablesInput(EMPTY_FORM.deliverables.join(", "));
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle Open Edit Modal
  const handleOpenEdit = (project: Project) => {
    setEditingProjectId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      client: project.client,
      year: project.year,
      category: project.category,
      tags: project.tags,
      runtime: project.runtime,
      aspectRatio: project.aspectRatio,
      tagline: project.tagline || "",
      description: project.description,
      creativeObjective: project.creativeObjective || "",
      targetAudience: project.targetAudience || "",
      deliverables: project.deliverables,
      commercialImpact: project.commercialImpact,
      stills: project.stills,
      originalVideoUrl: project.originalVideoUrl || "",
      playbackVideoUrl: project.playbackVideoUrl || "",
      thumbnailUrl: project.thumbnailUrl,
      featured: project.featured,
      isPublished: project.isPublished,
    });
    setTagsInput(project.tags.join(", "));
    setDeliverablesInput(project.deliverables.join(", "));
    setFormError(null);
    setIsModalOpen(true);
  };

  // Auto-slugify on title change if creating new
  const handleTitleChange = (val: string) => {
    if (!editingProjectId) {
      const slug = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({ ...prev, title: val, slug }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  // Save Project (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const deliverablesArray = deliverablesInput
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: tagsArray,
      deliverables: deliverablesArray,
    };

    try {
      if (editingProjectId) {
        // PUT update
        const res = await fetch("/api/projects", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProjectId, ...payload }),
        });
        const result = await res.json();
        if (result.success) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editingProjectId ? { ...p, ...payload } : p))
          );
          setIsModalOpen(false);
        } else {
          setFormError(result.error || "Failed to update project.");
        }
      } else {
        // POST create
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (result.success && result.project) {
          setProjects((prev) => [result.project, ...prev]);
          setIsModalOpen(false);
        } else {
          setFormError(result.error || "Failed to create project.");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setFormError("Network error occurred while saving to Neon database.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Toggle Publish
  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const nextStatus = !currentStatus;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isPublished: nextStatus } : p))
    );

    try {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isPublished: nextStatus }),
      });
    } catch (err) {
      console.error("Toggle publish failed:", err);
    }
  };

  // Quick Toggle Featured
  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: nextFeatured } : p))
    );

    try {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, featured: nextFeatured }),
      });
    } catch (err) {
      console.error("Toggle featured failed:", err);
    }
  };

  // Delete Project
  const handleDeleteProject = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This will permanently remove the case study from Neon PostgreSQL.`)) {
      return;
    }

    setProjects((prev) => prev.filter((p) => p.id !== project.id));

    try {
      await fetch(`/api/projects?id=${project.id}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Media Picker Selection
  const handleSelectMedia = (asset: MediaAsset) => {
    if (mediaPickerTarget === "thumbnail") {
      setFormData((prev) => ({ ...prev, thumbnailUrl: asset.url }));
    } else if (mediaPickerTarget === "playback") {
      setFormData((prev) => ({ ...prev, playbackVideoUrl: asset.url }));
    } else if (mediaPickerTarget === "original") {
      setFormData((prev) => ({ ...prev, originalVideoUrl: asset.url }));
    }
    setIsMediaPickerOpen(false);
  };

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchesPublished =
      publishedFilter === "All" ||
      (publishedFilter === "published" && p.isPublished) ||
      (publishedFilter === "draft" && !p.isPublished);
    return matchesSearch && matchesCategory && matchesPublished;
  });

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const featuredCount = projects.filter((p) => p.featured).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Portfolio Project Management
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon DB Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Create, edit, publish, and assign Vercel Blob media assets to commercial case studies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-mono transition-colors disabled:opacity-50"
            title="Refresh projects from Neon"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-400" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Commercial Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Total Projects</span>
          <span className="text-2xl font-bold font-mono text-foreground">{projects.length}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Published Live</span>
          <span className="text-2xl font-bold font-mono text-emerald-400">{publishedCount}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Drafts</span>
          <span className="text-2xl font-bold font-mono text-amber-400">{projects.length - publishedCount}</span>
        </div>
        <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col gap-1">
          <span className="text-[10px] font-mono uppercase text-muted-foreground">Featured in Hero</span>
          <span className="text-2xl font-bold font-mono text-gold-400">{featuredCount}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, client, slug..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono focus:outline-none focus:border-gold-500/60"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:border-gold-500/60 font-mono"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Published Filter */}
          <select
            value={publishedFilter}
            onChange={(e) => setPublishedFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:border-gold-500/60 font-mono"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
        </div>
      </div>

      {/* Projects List Table */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Project / Thumbnail</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
                      <span>Loading commercial projects from Neon...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No commercial projects match your filters. Click "New Commercial Project" to create one.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-border/60">
                          {project.thumbnailUrl ? (
                            <img
                              src={project.thumbnailUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">{project.title}</span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            /{project.slug}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-foreground">
                      {project.client}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-foreground border border-border/60">
                        {project.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleFeatured(project.id, project.featured)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          project.featured
                            ? "border-gold-500/40 bg-gold-500/10 text-gold-400"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                        title={project.featured ? "Featured in Hero Showcase" : "Mark as Featured"}
                      >
                        <Star className={`w-3.5 h-3.5 ${project.featured ? "fill-gold-400" : ""}`} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(project.id, project.isPublished)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold transition-colors ${
                          project.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {project.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/work/${project.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Preview Live Case Study"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-muted hover:border-gold-500/40 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="p-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Editor / Creator Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 px-6 border-b border-border/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingProjectId ? "Edit Commercial Project" : "New Commercial Project Case Study"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Persists directly to Neon PostgreSQL and updates the live /work portfolio.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveProject} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Aura X1: The Silence of Speed"
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Slug / URL Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="aura-x1-silence-of-speed"
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Aura Motors International"
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Exclude<ProjectCategory, "All"> })}
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tagline & Technical Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Release Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Runtime
                  </label>
                  <input
                    type="text"
                    value={formData.runtime}
                    onChange={(e) => setFormData({ ...formData, runtime: e.target.value })}
                    placeholder="1:15"
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Aspect Ratio
                  </label>
                  <select
                    value={formData.aspectRatio}
                    onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value as "16:9" | "9:16" | "2.39:1" })}
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  >
                    <option value="16:9">16:9 (Broadcast / Web)</option>
                    <option value="2.39:1">2.39:1 (Anamorphic Cinema)</option>
                    <option value="9:16">9:16 (Vertical Social)</option>
                  </select>
                </div>
              </div>

              {/* Tagline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Commercial Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="Reimagining electric hyper-performance through whisper-quiet motion."
                  className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Case Study Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Cinematic case study overview..."
                  className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 leading-relaxed"
                />
              </div>

              {/* MEDIA ASSET ASSIGNMENT (VERCEL BLOB INTEGRATION) */}
              <div className="p-5 rounded-2xl border border-gold-500/40 bg-gold-500/5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase font-bold text-gold-400 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Vercel Blob Media Assets Integration</span>
                  </h4>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    Triple-Asset Pipeline
                  </span>
                </div>

                {/* 1. Thumbnail Selector */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-foreground">
                      Poster Thumbnail Image URL *
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget("thumbnail");
                        setMediaPickerFilter("thumbnail");
                        setIsMediaPickerOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] text-gold-400 hover:text-gold-300 font-mono"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Choose from Vercel Blob</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="url"
                      required
                      value={formData.thumbnailUrl}
                      onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                      placeholder="https://...blob.vercel-storage.com/...jpg"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                    />
                    {formData.thumbnailUrl && (
                      <div className="w-12 h-8 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                        <img
                          src={formData.thumbnailUrl}
                          alt="Thumbnail preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Web Playback Video Selector */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-foreground">
                      Web Playback Video URL (H.264 / MP4)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget("playback");
                        setMediaPickerFilter("playback_video");
                        setIsMediaPickerOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] text-gold-400 hover:text-gold-300 font-mono"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Choose from Vercel Blob</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={formData.playbackVideoUrl}
                    onChange={(e) => setFormData({ ...formData, playbackVideoUrl: e.target.value })}
                    placeholder="https://...blob.vercel-storage.com/...mp4"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                {/* 3. Original 4K Master Video */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-foreground">
                      4K ProRes Master Video URL (Optional)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMediaPickerTarget("original");
                        setMediaPickerFilter("original_video");
                        setIsMediaPickerOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] text-gold-400 hover:text-gold-300 font-mono"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Choose from Vercel Blob</span>
                    </button>
                  </div>
                  <input
                    type="url"
                    value={formData.originalVideoUrl}
                    onChange={(e) => setFormData({ ...formData, originalVideoUrl: e.target.value })}
                    placeholder="https://...blob.vercel-storage.com/...mov"
                    className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Tags & Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Automotive, Cinematic, Broadcast"
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Deliverables (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={deliverablesInput}
                    onChange={(e) => setDeliverablesInput(e.target.value)}
                    placeholder="60s Master, 30s Cut, Stills"
                    className="px-3.5 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Status Toggles */}
              <div className="flex items-center gap-6 p-4 rounded-xl bg-background border border-border/80">
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded border-border text-gold-500 focus:ring-gold-500 w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">Featured in Hero Showcase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-border text-gold-500 focus:ring-gold-500 w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">Published Immediately</span>
                </label>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-border/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gold-500 text-black hover:bg-gold-400 font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? "Saving to Neon..." : "Save Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VERCEL BLOB MEDIA SELECTOR MODAL */}
      {isMediaPickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 px-6 border-b border-border/80 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Select Asset from Vercel Blob Storage
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Assigning to: {mediaPickerTarget === "thumbnail" ? "Poster Thumbnail" : mediaPickerTarget === "playback" ? "Web Playback Video" : "Master 4K Video"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaPickerOpen(false)}
                className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Picker Filter Pills */}
            <div className="px-6 py-3 border-b border-border/60 bg-background/50 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMediaPickerFilter("all")}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${
                  mediaPickerFilter === "all" ? "bg-muted text-foreground font-bold" : "text-muted-foreground"
                }`}
              >
                All Assets ({mediaAssets.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaPickerFilter("thumbnail")}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${
                  mediaPickerFilter === "thumbnail" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-muted-foreground"
                }`}
              >
                Posters / Stills
              </button>
              <button
                type="button"
                onClick={() => setMediaPickerFilter("playback_video")}
                className={`px-3 py-1 rounded-lg text-xs font-mono ${
                  mediaPickerFilter === "playback_video" ? "bg-blue-500/20 text-blue-400 font-bold" : "text-muted-foreground"
                }`}
              >
                Playback Streams
              </button>
            </div>

            {/* Picker Grid */}
            <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
              {mediaAssets
                .filter((a) => mediaPickerFilter === "all" || a.assetType === mediaPickerFilter)
                .map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => handleSelectMedia(asset)}
                    className="group border border-border hover:border-gold-500 rounded-2xl overflow-hidden bg-background cursor-pointer flex flex-col transition-all hover:scale-[1.02] shadow-sm"
                  >
                    <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                      {asset.assetType === "thumbnail" ? (
                        <img
                          src={asset.url}
                          alt={asset.filename}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Film className="w-8 h-8 text-gold-400" />
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="px-3 py-1 rounded-lg bg-gold-500 text-black font-bold text-xs uppercase font-mono shadow-sm">
                          Select
                        </span>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <span className="font-mono text-xs text-foreground font-semibold truncate" title={asset.filename}>
                        {asset.filename}
                      </span>
                      <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                        <span>{asset.formattedSize}</span>
                        <span className="uppercase">{asset.assetType.replace("_", " ")}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
