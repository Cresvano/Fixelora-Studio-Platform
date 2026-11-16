import Link from "next/link";
import { projectRepository } from "@/lib/data/projects";
import { leadRepository } from "@/lib/data/leads";
import { mediaRepository } from "@/lib/data/media";
import { pitchRepository } from "@/lib/data/pitches";
import { formatFileSize, formatDate } from "@/lib/utils";
import {
  Film,
  HardDrive,
  Users,
  Send,
  ArrowUpRight,
  Plus,
  Video,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default async function AdminDashboardPage() {
  const projects = await projectRepository.getAllProjectsAdmin();
  const leads = await leadRepository.getLeads();
  const mediaAssets = await mediaRepository.getMediaAssets();
  const pitches = await pitchRepository.getAllPitchesAdmin();
  const totalStorageBytes = await mediaRepository.getTotalStorageBytes();

  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const publishedProjectsCount = projects.filter((p) => p.isPublished).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Studio Operational Overview
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Real-time management for commercial projects, high-capacity media, and prospective client briefs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/portfolio"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            href="/admin/pitches"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border border-border text-foreground hover:bg-muted transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Create Pitch</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Projects */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Commercial Projects
            </span>
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-foreground">
              {projects.length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>{publishedProjectsCount} Published on Live Portfolio</span>
            </p>
          </div>
        </div>

        {/* Metric 2: Video Storage */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              R2 Storage Used
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-foreground">
              {formatFileSize(totalStorageBytes)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
              <span className="text-gold-400 font-mono font-medium">No 50MB Cap</span>
              <span>• Direct Cloudflare R2</span>
            </p>
          </div>
        </div>

        {/* Metric 3: Leads */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Inbound Briefs
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-foreground">
              {leads.length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1.5">
              {newLeadsCount > 0 ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  <span className="text-amber-400 font-medium">{newLeadsCount} Need Initial Response</span>
                </>
              ) : (
                <span>All Inquiries Contacted</span>
              )}
            </p>
          </div>
        </div>

        {/* Metric 4: Private Pitches */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Outbound Pitches
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-foreground">
              {pitches.length}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Unlisted landing pages for brand outreach
            </p>
          </div>
        </div>
      </div>

      {/* Inbound Leads Table */}
      <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Recent Client Inquiries & Project Briefs
            </h3>
            <p className="text-xs text-muted-foreground">
              Dual-track inquiries captured from the website brief form and discovery calendar.
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center gap-1"
          >
            <span>View All Leads ({leads.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="py-3 px-4">Client / Company</th>
                <th className="py-3 px-4">Project Type</th>
                <th className="py-3 px-4">Budget Tier</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 text-xs">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-foreground">
                    <p>{lead.clientName}</p>
                    <p className="text-[11px] text-muted-foreground">{lead.company}</p>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground">
                    {lead.projectType}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-gold-400">
                    {lead.estimatedBudget}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase border border-border/60 bg-muted/60">
                      {lead.track === "brief" ? "Project Brief" : "Discovery Call"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase font-mono ${
                        lead.status === "new"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : lead.status === "in_discovery"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      }`}
                    >
                      {lead.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                    {formatDate(lead.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Triple-Asset Media Management Architecture Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-border/80 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Original 4K Masters
              </p>
              <p className="text-[10px] text-muted-foreground">Archival ProRes / RAW</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Preserved permanently without compression artifacts for future master delivery.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Optimized Playback
              </p>
              <p className="text-[10px] text-muted-foreground">Web-Ready H.264 / H.265</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            High-efficiency streamable MP4/WebM versions optimized for low latency and zero buffering.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-border/80 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                High-Res Posters
              </p>
              <p className="text-[10px] text-muted-foreground">WebP / JPG Stills</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Eliminates layout shifts (CLS) and guarantees instant visual impact before video playback starts.
          </p>
        </div>
      </div>
    </div>
  );
}
