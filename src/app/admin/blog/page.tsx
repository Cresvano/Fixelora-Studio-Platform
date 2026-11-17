"use client";

import * as React from "react";
import Link from "next/link";
import { BlogPost } from "@/types";
import {
  Plus,
  Search,
  Eye,
  Edit3,
  Trash2,
  Sparkles,
  FileText,
  CheckCircle2,
  X,
  Save,
  RefreshCw,
  AlertCircle
} from "lucide-react";

const EMPTY_POST: Omit<BlogPost, "id"> = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop",
  category: "Commercial Strategy",
  tags: ["Commercial Ads", "Creative Direction", "Conversion"],
  author: {
    name: "Julian Vance",
    role: "Creative Director, Fixelora Studio",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  readingTime: "4 min read",
  isPublished: true,
  publishDate: new Date().toISOString().split("T")[0],
  ctaVariant: "commercial",
};

export default function AdminBlogPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPostId, setEditingPostId] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState<Omit<BlogPost, "id">>(EMPTY_POST);
  const [tagsString, setTagsString] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  // Fetch Articles from API
  const fetchPosts = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/blog");
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Failed to load blog posts:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Toggle publish
  const togglePublish = async (post: BlogPost) => {
    const nextStatus = !post.isPublished;
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, isPublished: nextStatus } : p))
    );

    try {
      await fetch("/api/blog", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, isPublished: nextStatus }),
      });
    } catch (err) {
      console.error("Toggle publish failed:", err);
    }
  };

  const handleOpenCreate = () => {
    setEditingPostId(null);
    setFormData(EMPTY_POST);
    setTagsString(EMPTY_POST.tags.join(", "));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPostId(post.id);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags,
      author: post.author,
      readingTime: post.readingTime,
      isPublished: post.isPublished,
      publishDate: post.publishDate,
      ctaVariant: post.ctaVariant,
    });
    setTagsString(post.tags.join(", "));
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== post.id));

    try {
      const res = await fetch(`/api/blog?id=${encodeURIComponent(post.id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || "Failed to delete article from Neon.");
        fetchPosts();
      }
    } catch (err) {
      console.error("Delete article failed:", err);
      fetchPosts();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFormError(null);

    const tagsArray = tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...formData,
      tags: tagsArray,
    };

    try {
      if (editingPostId) {
        const res = await fetch("/api/blog", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingPostId, ...payload }),
        });
        const result = await res.json();
        if (result.success) {
          setPosts((prev) =>
            prev.map((p) => (p.id === editingPostId ? { ...p, ...payload } : p))
          );
          setIsModalOpen(false);
        } else {
          setFormError(result.error || "Failed to update article.");
        }
      } else {
        const res = await fetch("/api/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
        if (result.success && result.post) {
          setPosts((prev) => [result.post, ...prev]);
          setIsModalOpen(false);
        } else {
          setFormError(result.error || "Failed to create article.");
        }
      }
    } catch (err) {
      console.error("Save article error:", err);
      setFormError("Network error occurred while saving article to Neon database.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Blog & Editorial CMS
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon DB Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Publish SEO articles, manage author profiles, and embed high-converting in-article sales CTAs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPosts}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-mono transition-colors disabled:opacity-50"
            title="Refresh articles from Neon"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-400" : ""}`} />
            <span>Sync</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Journal Article</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, category, or slug..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono focus:outline-none focus:border-gold-500/60"
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          Total: {posts.length} articles ({posts.filter((p) => p.isPublished).length} published)
        </span>
      </div>

      {/* Posts Table */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card overflow-hidden">
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-gold-400 mb-3" />
            <p className="text-xs font-mono uppercase text-muted-foreground">
              Querying Neon blog_posts table...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No articles found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Article Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Injectable CTA</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-muted/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground max-w-sm">
                      <p className="line-clamp-1">{post.title}</p>
                      <p className="text-[11px] font-mono text-muted-foreground font-normal">
                        /{post.slug}
                      </p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-foreground border border-border/60">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-muted-foreground">
                      {post.author.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-gold-400 border border-gold-500/30 bg-gold-500/10 uppercase">
                        <Sparkles className="w-3 h-3" />
                        <span>{post.ctaVariant} CTA</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold transition-colors ${
                          post.isPublished
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : "bg-muted text-muted-foreground border border-border"
                        }`}
                      >
                        {post.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="View Public Article"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Edit Article"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post)}
                          className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT ARTICLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {editingPostId ? "Edit Journal Article" : "Create New Journal Article"}
                </h3>
                <p className="text-xs text-muted-foreground font-mono">
                  Saves directly to Neon PostgreSQL <code className="text-gold-400">blog_posts</code> table.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
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
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. The Anatomy of a High-Converting Commercial"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. anatomy-of-high-converting-commercial"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Excerpt / Meta Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="One or two sentences summarizing the key thesis for search engine previews..."
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Commercial Strategy"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={formData.readingTime}
                    onChange={(e) => setFormData({ ...formData, readingTime: e.target.value })}
                    placeholder="4 min read"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    In-Article CTA Type
                  </label>
                  <select
                    value={formData.ctaVariant}
                    onChange={(e) => setFormData({ ...formData, ctaVariant: e.target.value as any })}
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500 font-mono"
                  >
                    <option value="commercial">Commercial Production</option>
                    <option value="strategy">Brand Strategy</option>
                    <option value="dtc">DTC / E-Commerce</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Featured Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsString}
                    onChange={(e) => setTagsString(e.target.value)}
                    placeholder="Cinematography, Luxury, Conversion"
                    className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Author Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/30 border border-border/60">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={formData.author.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        author: { ...formData.author, name: e.target.value },
                      })
                    }
                    placeholder="Julian Vance"
                    className="px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono uppercase text-muted-foreground">
                    Author Title / Role
                  </label>
                  <input
                    type="text"
                    value={formData.author.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        author: { ...formData.author, role: e.target.value },
                      })
                    }
                    placeholder="Creative Director, Fixelora Studio"
                    className="px-3 py-2 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Content Body */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-mono uppercase text-muted-foreground">
                  Markdown Article Content *
                </label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="# Article Headline&#10;&#10;Write the full body here in markdown format..."
                  className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-xs font-mono leading-relaxed focus:outline-none focus:border-gold-500 resize-none"
                />
              </div>

              {/* Status & Options */}
              <div className="flex items-center gap-3 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 border-border bg-background"
                  />
                  <span className="text-xs font-mono uppercase text-foreground">
                    Publish Live Immediately
                  </span>
                </label>
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
                  <span>{isSaving ? "Saving to Neon..." : editingPostId ? "Update Article" : "Publish Article"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
