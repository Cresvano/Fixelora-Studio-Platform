"use client";

import * as React from "react";
import { MOCK_LEADS } from "@/lib/data/leads";
import { Lead, LeadStatus } from "@/types";
import { formatDate } from "@/lib/utils";
import { Users, Mail, Phone, Clock, FileText, CheckCircle2, ChevronRight, Filter } from "lucide-react";

export default function AdminLeadsPage() {
  const [leads, setLeads] = React.useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = React.useState<Lead | null>(MOCK_LEADS[0] || null);
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  const filteredLeads = leads.filter(
    (l) => statusFilter === "All" || l.status === statusFilter
  );

  const handleUpdateStatus = (id: string, newStatus: LeadStatus) => {
    setLeads(
      leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
    );
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Inbound Leads & Client Inquiries CRM
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage prospective client briefs, discovery call requests, and project budget tiers.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-card border border-border/80">
          {["All", "new", "in_discovery", "proposal_sent", "won"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-mono uppercase ${
                statusFilter === s
                  ? "bg-gold-500 text-black font-bold"
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
                {filteredLeads.map((lead) => {
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
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
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
                })}
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
                  <p className="font-medium text-foreground">
                    {selectedLead.phone || "Not provided"}
                  </p>
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
