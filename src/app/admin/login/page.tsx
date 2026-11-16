"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid administrative credentials");
      }
    } catch (err) {
      setError("Unable to authenticate. Please verify network connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white relative overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 sm:p-10 rounded-3xl border border-white/10 bg-[#0E0E12]/90 backdrop-blur-xl shadow-2xl flex flex-col gap-8">
        {/* Emblem & Branding */}
        <div className="flex flex-col items-center text-center gap-3">
          <div className="relative w-12 h-12 transition-transform duration-300 hover:scale-105">
            <Image
              src="/brand/fixelora-icon-gold.png"
              alt="Fixelora Studio Emblem"
              width={48}
              height={48}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <div className="flex items-center justify-center gap-1.5 leading-none">
              <span className="font-bold tracking-[0.25em] text-base uppercase text-white">
                FIXELORA
              </span>
              <span className="font-light tracking-[0.3em] text-sm uppercase text-gold-400">
                STUDIO
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 mt-1.5">
              Executive Management Portal
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="p-3 rounded-xl border border-gold-500/30 bg-gold-500/10 flex items-center gap-2.5 text-xs text-gold-300">
          <Lock className="w-4 h-4 text-gold-400 shrink-0" />
          <span>Restricted session. Enter administrative passkey to access.</span>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 flex items-center gap-2.5 text-xs text-rose-300 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono uppercase tracking-wider text-neutral-400">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: fixelora2026)"
                className="w-full px-4 py-3.5 pr-11 rounded-xl border border-white/10 bg-white/5 text-white text-sm focus:outline-none focus:border-gold-500/60 placeholder:text-neutral-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-lg disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Studio Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Return to Public Website */}
        <div className="pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-gold-400 font-mono uppercase tracking-wider transition-colors"
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
