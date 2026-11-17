"use client";

import * as React from "react";
import { Lead, LeadStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import {
  Users,
  Mail,
  Phone,
  Clock,
  FileText,
  CheckCircle2,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  Database,
  Calendar,
  DollarSign
} from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchLeads = React.useCallback(async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success && Array.isArray(data.leads)) {
        setLeads(data.leads);
        if (data.leads.length > 0) {
          setSelectedLead((current) => {
            if (current) {
              const updated = data.leads.find((l: Lead) => l.id === current.id);
              return updated || data.leads[0];
            }
            return data.leads[0];
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }

    try {
      await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status on server:", err);
    }
  };

  const filteredLeads = leads.filter((l) => {
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.projectType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const newLeadsCount = leads.filter((l) => l.status === "new").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title & Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Inbound Leads & Client Inquiries CRM
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Neon DB Live
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage prospective client briefs, discovery call inquiries, and project budget tiers in real-time.
          </p>
        </div>

        {/* Top Actions & Sync */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-foreground hover:bg-muted text-xs font-mono transition-colors disabled:opacity-50"
            title="Refresh leads from Neon"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-gold-400" : ""}`} />
            <span>Sync</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-mono">
            <span>{newLeadsCount} New Inquiries</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-border/80 bg-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search client, company, or brief..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono focus:outline-none focus:border-gold-500/60"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-background border border-border/80">
          {["All", "new", "in_discovery", "proposal_sent", "won"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-[11px] font-mono uppercase transition-colors ${
                statusFilter === s
                  ? "bg-gold-500 text-black font-bold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Main CRM Grid (List + Detail Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leads Table / List (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl border border-border/80 bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Budget</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-gold-400" />
                        <span>Loading leads from Neon PostgreSQL...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-muted-foreground">
                      No inbound inquiries found. Submissions from the public Contact page will appear here.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-gold-500/10 border-l-2 border-gold-500"
                            : "hover:bg-muted/40"
                        }`}
                      >
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-foreground">{lead.clientName}</p>
                          <p className="text-[11px] text-muted-foreground">{lead.company}</p>
                        </td>
                        <td className="py-3.5 px-3 font-mono font-semibold text-gold-400">
                          {lead.estimatedBudget}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                              lead.status === "new"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : lead.status === "in_discovery"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : lead.status === "won"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            }`}
                          >
                            {lead.status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono text-[11px] text-muted-foreground">
                          {formatDate(lead.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Lead Detail Drawer (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-6">
          {selectedLead ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-border/60">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {selectedLead.clientName}
                  </h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {selectedLead.company}
                  </p>
                </div>

                {/* Status Switcher Dropdown */}
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    handleUpdateStatus(selectedLead.id, e.target.value as LeadStatus)
                  }
                  className="px-3 py-1.5 rounded-xl border border-border/80 bg-background text-foreground text-xs font-mono uppercase focus:outline-none focus:border-gold-500/60"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_discovery">In Discovery</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="won">Won / Contract</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Contact Data */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-background border border-border/60">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Work Email
                  </p>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="font-medium text-foreground hover:text-gold-400 truncate block"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div className="p-3 rounded-xl bg-background border border-border/60">
                  <p className="text-[10px] font-mono uppercase text-muted-foreground mb-1">
                    Phone
                  </p>
                  {selectedLead.phone ? (
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="font-medium text-foreground hover:text-gold-400 truncate block"
                    >
                      {selectedLead.phone}
                    </a>
                  ) : (
                    <p className="font-medium text-muted-foreground">Not provided</p>
                  )}
                </div>
              </div>

              {/* Project Specs */}
              <div className="p-4 rounded-xl bg-background border border-border/60 flex flex-col gap-2.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-muted-foreground">
                    Production Category
                  </span>
                  <p className="font-bold text-foreground">{selectedLead.projectType}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      Target Budget
                    </span>
                    <p className="font-bold text-gold-400 font-mono">
                      {selectedLead.estimatedBudget}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">
                      Timeline
                    </span>
                    <p className="font-semibold text-foreground">{selectedLead.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Brief Content */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                  Project Description & Strategic Brief
                </p>
                <div className="p-4 rounded-xl bg-background/60 border border-border/60 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedLead.description}
                </div>
              </div>

              {/* Internal Producer Notes */}
              {selectedLead.notes && (
                <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-500/30 text-xs">
                  <p className="font-bold text-gold-400 text-[10px] font-mono uppercase mb-1">
                    Producer Internal Note
                  </p>
                  <p className="text-muted-foreground">{selectedLead.notes}</p>
                </div>
              )}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">Select a lead from the list.</p>
          )}
        </div>
      </div>
    </div>
  );
}
