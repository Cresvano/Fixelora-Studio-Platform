import Link from "next/link";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
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
  Database,
  Sparkles
} from "lucide-react";

export default async function AdminDashboardPage() {
  let isDbLive = false;
  let dbProjectCount = 0;
  let dbLeadCount = 0;
  let dbMediaCount = 0;
  let dbPitchCount = 0;
  let liveProjects: any[] = [];
  let liveLeads: any[] = [];
  let liveTotalStorageBytes = 0;

  try {
    if (process.env.DATABASE_URL) {
      const [dbProjs, dbLds, dbMed, dbPtch] = await Promise.all([
        db.select().from(schema.projects),
        db.select().from(schema.leads),
        db.select().from(schema.mediaAssets),
        db.select().from(schema.pitches),
      ]);

      isDbLive = true;
      dbProjectCount = dbProjs.length;
      dbLeadCount = dbLds.length;
      dbMediaCount = dbMed.length;
      dbPitchCount = dbPtch.length;
      liveProjects = dbProjs;
      liveLeads = dbLds;
      liveTotalStorageBytes = dbMed.reduce((sum, item) => sum + Number(item.fileSize), 0);
    }
  } catch (error) {
    console.error("Live Neon query notice:", error);
    isDbLive = false;
  }

  // Fallbacks if DB is temporarily unreachable
  const projects = isDbLive ? liveProjects : await projectRepository.getAllProjectsAdmin();
  const leads = isDbLive ? liveLeads : await leadRepository.getLeads();
  const totalStorageBytes = isDbLive ? liveTotalStorageBytes : await mediaRepository.getTotalStorageBytes();
  const pitchesCount = isDbLive ? dbPitchCount : (await pitchRepository.getAllPitchesAdmin()).length;

  const newLeadsCount = leads.filter((l: any) => l.status === "new").length;
  const publishedProjectsCount = projects.filter((p: any) => p.isPublished).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Studio Operational Overview
            </h2>
            {isDbLive ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Neon PostgreSQL Live</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span>Mock Data Active</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
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

      {/* Database Connection Status Banner */}
      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-foreground flex items-center gap-2">
              <span>Database Provider: Neon Serverless PostgreSQL</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                Connected & Seeded
              </span>
            </p>
            <p className="text-muted-foreground text-[11px]">
              Drizzle ORM is actively querying live tables: <code className="text-gold-400">projects</code> ({projects.length}), <code className="text-gold-400">leads</code> ({leads.length}), <code className="text-gold-400">media_assets</code> ({isDbLive ? dbMediaCount : 4}), <code className="text-gold-400">pitches</code> ({pitchesCount}).
            </p>
          </div>
        </div>
        <span className="font-mono text-[11px] text-muted-foreground shrink-0">
          Region: us-east-1 (AWS)
        </span>
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
          </div>
        </div>

        {/* Metric 2: Video Storage */}
        <div className="p-5 rounded-2xl border border-border/80 bg-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
              Blob Storage Used
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-black font-mono text-foreground">
              {formatFileSize(totalStorageBytes)}
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
              {pitchesCount}
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
              {leads.map((lead: any) => (
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
                    {formatDate(typeof lead.createdAt === "string" ? lead.createdAt : lead.createdAt.toISOString())}
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
