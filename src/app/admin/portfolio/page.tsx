"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MOCK_PROJECTS } from "@/lib/data/projects";
import { Project, ProjectCategory } from "@/types";
import { Plus, Search, Filter, Edit3, Trash2, Eye, CheckCircle2, Clock, Video } from "lucide-react";

export default function AdminPortfolioPage() {
  const [projects, setProjects] = React.useState<Project[]>(MOCK_PROJECTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePublish = (id: string) => {
    setProjects(
      projects.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Portfolio Project Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, edit, publish, and assign commercial video masters to client case studies.
          </p>
        </div>

        <button
          onClick={() => alert("Simulated: Opens Full Project Creator modal with Triple-Asset video assignment.")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Commercial Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title or client..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:border-gold-500/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground text-xs focus:outline-none focus:border-gold-500/60"
          >
            <option value="All">All Categories</option>
            <option value="Commercial">Commercial</option>
            <option value="DTC & E-Commerce">DTC & E-Commerce</option>
            <option value="Brand Film">Brand Film</option>
            <option value="Tech & Innovation">Tech & Innovation</option>
            <option value="3D & Motion">3D & Motion</option>
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
                <th className="py-3 px-4">Runtime</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {filteredProjects.map((project) => (
                <tr key={project.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-black shrink-0 border border-border/60">
                        <Image
                          src={project.thumbnailUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{project.title}</span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          /{project.slug}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">
                    {project.client}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-muted text-foreground border border-border/60">
                      {project.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-muted-foreground">
                    {project.runtime}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => togglePublish(project.id)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-semibold transition-colors ${
                        project.isPublished
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {project.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/work/${project.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Preview Live Case Study"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => alert(`Simulated: Editing ${project.title}`)}
                        className="p-1.5 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Project"
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
