"use client";

import * as React from "react";
import { ArrowUpRight, CheckCircle2, Calendar, FileText, Clock, Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [activeTrack, setActiveTrack] = React.useState<"brief" | "call">("brief");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  // Form State
  const [formData, setFormData] = React.useState({
    clientName: "",
    company: "",
    email: "",
    phone: "",
    projectType: "Flagship Commercial / TV Spot",
    estimatedBudget: "$50,000 – $100,000",
    timeline: "Within 60 Days",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: formData.clientName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          estimatedBudget: formData.estimatedBudget,
          timeline: formData.timeline,
          description: formData.description,
          track: activeTrack,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSubmitted(true);
      } else {
        alert(result.error || "Failed to submit project brief.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Network error. Please try again or reach out directly to production@fixelorastudio.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col pt-32 pb-24 px-6 bg-background">
      <div className="container max-w-5xl mx-auto">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-gold-400 mb-3">
            Start A Project
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-foreground leading-[1.08] mb-4">
            Initiate Production.
          </h1>
          <p className="text-base text-muted-foreground font-light leading-relaxed">
            Select your preferred inquiry track: submit a detailed project brief for an immediate formal proposal, or book a 20-minute introductory discovery call with our executive producer.
          </p>
        </div>

        {/* Dual-Track Tabs */}
        <div className="flex items-center gap-4 p-1.5 rounded-2xl bg-card border border-border/80 w-fit mb-10 shadow-sm">
          <button
            onClick={() => setActiveTrack("brief")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
              activeTrack === "brief"
                ? "bg-gold-500 text-black font-bold shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Track A: Submit Project Brief</span>
          </button>
          <button
            onClick={() => setActiveTrack("call")}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-all duration-200 ${
              activeTrack === "call"
                ? "bg-gold-500 text-black font-bold shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Track B: Schedule Discovery Call</span>
          </button>
        </div>

        {/* Main Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Active Track Form or Calendar (8 Cols) */}
          <div className="lg:col-span-8">
            {activeTrack === "brief" ? (
              <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card">
                {submitted ? (
                  <div className="py-12 flex flex-col items-center text-center animate-in fade-in duration-300">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold uppercase text-foreground mb-2">
                      Brief Received Successfully
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
                      Thank you, {formData.clientName}. Our executive production team has received your brief for {formData.company}. We review all submissions within 24 hours.
                    </p>
                    <div className="p-4 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground font-mono mb-6">
                      Brief ID: #FIX-{Date.now().toString().slice(-6)} • Lead stored in Studio CRM
                    </div>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          clientName: "",
                          company: "",
                          email: "",
                          phone: "",
                          projectType: "Flagship Commercial / TV Spot",
                          estimatedBudget: "$50,000 – $100,000",
                          timeline: "Within 60 Days",
                          description: "",
                        });
                      }}
                      className="text-xs uppercase tracking-wider text-gold-400 hover:underline font-mono"
                    >
                      Submit Another Brief
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between pb-4 border-b border-border/60">
                      <div>
                        <h2 className="text-lg font-bold text-foreground">
                          Project Brief Form
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Fill out the details below. Response guaranteed within 24 hours.
                        </p>
                      </div>
                      <span className="text-[10px] font-mono uppercase px-2 py-1 rounded bg-muted text-gold-400 border border-border/60">
                        Avg. Time: 2 mins
                      </span>
                    </div>

                    {/* Row 1: Name & Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.clientName}
                          onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                          placeholder="e.g. David Sterling"
                          className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Company / Brand Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Aura Motors"
                          className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                        />
                      </div>
                    </div>

                    {/* Row 2: Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Work Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="david@auramotors.com"
                          className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                        />
                      </div>
                    </div>

                    {/* Row 3: Project Type & Budget */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Production Type
                        </label>
                        <select
                          value={formData.projectType}
                          onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                          className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                        >
                          <option>Flagship Commercial / TV Spot</option>
                          <option>DTC Paid Social Campaign Suite</option>
                          <option>Brand Anthem / Keynote Film</option>
                          <option>3D Animation & CGI Visuals</option>
                          <option>Color Grading / Post-Production Only</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                          Target Budget Tier
                        </label>
                        <select
                          value={formData.estimatedBudget}
                          onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                          className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60 font-mono"
                        >
                          <option>$25,000 – $50,000</option>
                          <option>$50,000 – $100,000</option>
                          <option>$100,000 – $250,000</option>
                          <option>$250,000+</option>
                        </select>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Target Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
                      >
                        <option>Urgent (&lt; 30 Days)</option>
                        <option>Within 60 Days</option>
                        <option>Q1 / Q2 Next Year</option>
                        <option>Flexible / Exploratory</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        Project Overview & Creative Goals *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Tell us about the product or brand story, desired deliverables, target audience, and any reference links..."
                        className="px-4 py-3 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60 resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-lg disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Brief...</span>
                      ) : (
                        <>
                          <span>Submit Project Brief</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* TRACK B: CALENDAR BOOKING WIDGET */
              <div className="p-8 sm:p-10 rounded-3xl border border-border/80 bg-card flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">
                    Discovery Call Scheduler
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Direct 20-minute video conference with Julian Vance (Executive Creative Director).
                  </p>
                </div>

                <div className="p-8 rounded-2xl border border-dashed border-border/80 bg-background/50 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-1">
                    Select a Convenient Meeting Slot
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
                    Available Tuesdays and Thursdays for European and North American timezones.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                    {["Tomorrow • 2:00 PM EST", "Tomorrow • 4:30 PM EST", "Thursday • 10:00 AM EST", "Thursday • 1:30 PM EST"].map((slot, i) => (
                      <button
                        key={i}
                        onClick={() => alert(`Simulated slot selected: ${slot}. In production, this syncs with Cal.com / Calendly.`)}
                        className="px-4 py-3 rounded-xl border border-border/80 hover:border-gold-500/60 bg-card hover:bg-gold-500/10 text-xs font-mono text-foreground transition-all duration-200 text-center"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] font-mono text-muted-foreground mt-6">
                    Direct Google Meet link generated automatically upon booking confirmation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Studio Contact Info & SLA (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-6">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-gold-400 mb-1">
                  Guaranteed Response
                </p>
                <p className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Under 24 Hours</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Every inquiry is reviewed directly by our producers, not an automated sales filter.
                </p>
              </div>

              <div className="pt-4 border-t border-border/40 flex flex-col gap-4 text-xs text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-semibold">Direct Production Email</p>
                    <a href="mailto:production@fixelorastudio.com" className="hover:text-gold-400">
                      production@fixelorastudio.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-semibold">Studio Line</p>
                    <p>+1 (310) 902-8800</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-semibold">Hubs</p>
                    <p>Century City, Los Angeles</p>
                    <p>Soho, London</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-gold-500/20 bg-card/60 flex flex-col gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-gold-400 font-bold">
                Confidentiality Guaranteed
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We regularly execute mutual Non-Disclosure Agreements (NDAs) prior to receiving unannounced product samples or proprietary brand strategy decks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
