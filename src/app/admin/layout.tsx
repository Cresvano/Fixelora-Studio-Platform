"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  LayoutDashboard,
  Film,
  Video,
  FileText,
  Users,
  Send,
  Settings,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Menu,
  X,
  LogOut,
  LayoutTemplate
} from "lucide-react";

const ADMIN_LINKS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Pages & Team", href: "/admin/pages", icon: LayoutTemplate },
  { label: "Portfolio CRUD", href: "/admin/portfolio", icon: Film },
  { label: "Media & Storage", href: "/admin/media", icon: Video },
  { label: "Blog CMS", href: "/admin/blog", icon: FileText },
  { label: "Leads CRM", href: "/admin/leads", icon: Users },
  { label: "Private Pitches", href: "/admin/pitches", icon: Send },
  { label: "Studio Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // If on login page, render clean without admin sidebar/topbar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand & Header */}
        <div>
          <div className="h-16 px-6 flex items-center justify-between border-b border-border/60">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-7 h-7">
                <Image
                  src="/brand/fixelora-icon-gold.png"
                  alt="Fixelora Icon"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold tracking-widest text-xs uppercase text-foreground">
                  FIXELORA
                </span>
                <span className="text-[9px] font-mono tracking-widest text-gold-400 uppercase">
                  Studio Admin
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1.5">
            <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Management
            </p>
            {ADMIN_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gold-500/10 text-gold-400 border border-gold-500/30 font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Production Architecture Live Status */}
        <div className="p-4 border-t border-border/60 flex flex-col gap-3">
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Neon DB & Blob Storage Live</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-normal">
              Full relational persistence & CDN edge media pipeline active.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
              title="Lock Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        {/* Admin Topbar */}
        <header className="h-16 px-6 border-b border-border/80 bg-background/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-border text-foreground hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold tracking-wide uppercase font-mono text-muted-foreground">
              Fixelora Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border/60">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-300 flex items-center justify-center font-bold text-xs">
                AC
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  Alexander Cole
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Executive Producer
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
