"use client";

import * as React from "react";
import { MOCK_STUDIO_SETTINGS } from "@/lib/data/settings";
import { StudioSettings } from "@/types";
import { Sliders, Save, HardDrive, Mail, Phone, MapPin, Globe, Check } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = React.useState<StudioSettings>(MOCK_STUDIO_SETTINGS);
  const [saved, setSaved] = React.useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Studio System Settings
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure studio global parameters, contact destinations, and media upload capacity limits.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Media Storage Capacity Config */}
        <div className="p-6 rounded-2xl border border-gold-500/30 bg-card flex flex-col gap-4">
          <div className="flex items-center gap-2.5 text-gold-400 font-mono text-xs uppercase font-bold">
            <HardDrive className="w-4 h-4" />
            <span>Infrastructure Media Storage Capacity</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Per the approved SRS, Fixelora does not enforce arbitrary 50MB application limits. Upload threshold is governed by Cloudflare R2 bucket configuration and network bandwidth.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Max Allowed File Upload Size (GB)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={settings.maxUploadSizeGb}
                onChange={(e) =>
                  setSettings({ ...settings, maxUploadSizeGb: Number(e.target.value) })
                }
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm font-mono focus:outline-none focus:border-gold-500/60"
              />
              <span className="text-[10px] text-muted-foreground font-mono">
                Supports up to 100GB ProRes Masters via Cloudflare R2 Multipart.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Storage Provider Endpoint
              </label>
              <input
                type="text"
                disabled
                value="https://<r2-account-id>.r2.cloudflarestorage.com/fixelora-media"
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-muted/40 text-muted-foreground text-xs font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-muted-foreground font-mono">
                S3-Compatible Zero Egress Bucket (Phase 4 Integration)
              </span>
            </div>
          </div>
        </div>

        {/* Studio Contact Information */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card flex flex-col gap-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider font-mono">
            Contact & Location Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Studio Primary Name
              </label>
              <input
                type="text"
                value={settings.studioName}
                onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Master Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Inquiry Notification Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono uppercase text-muted-foreground">
                Studio Phone Line
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="px-4 py-2.5 rounded-xl border border-border/80 bg-background text-foreground text-sm focus:outline-none focus:border-gold-500/60"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-md self-start"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              <span>Settings Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
