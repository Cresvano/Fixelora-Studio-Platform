"use client";

import * as React from "react";
import Link from "next/link";
import { MOCK_BLOG_POSTS } from "@/lib/data/blog";
import { BlogPost } from "@/types";
import { Plus, Search, Eye, Edit3, Sparkles, FileText, CheckCircle2 } from "lucide-react";

export default function AdminBlogPage() {
  const [posts, setPosts] = React.useState<BlogPost[]>(MOCK_BLOG_POSTS);

  const togglePublish = (id: string) => {
    setPosts(
      posts.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Blog & Editorial CMS
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Publish SEO articles, manage author profiles, and embed high-converting in-article sales CTAs.
          </p>
        </div>

        <button
          onClick={() => alert("Simulated: Opens Rich Article Editor with Injectable CTA block.")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Article</span>
        </button>
      </div>

      {/* Posts Table */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card overflow-hidden">
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
              {posts.map((post) => (
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
                      onClick={() => togglePublish(post.id)}
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
                        className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="View Public Article"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => alert(`Simulated: Edit article ${post.title}`)}
                        className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Article"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
