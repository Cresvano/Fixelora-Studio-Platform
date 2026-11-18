"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { ChatWidget } from "@/components/public/ChatWidget";
import { Menu, X, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

interface PublicShellProps {
  footerDescription: string;
  children: React.ReactNode;
}

export function PublicShell({ footerDescription, children }: PublicShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground">
      {/* Floating Header (Adaptive glass surface guarantees legibility in Light & Dark modes) */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          mobileMenuOpen
            ? "py-4 bg-background border-b border-border/60 shadow-sm"
            : scrolled
            ? "py-3 bg-background/95 backdrop-blur-md border-b border-border/60 shadow-sm"
            : "py-5 bg-background/85 backdrop-blur-md border-b border-border/40"
        }`}
      >
        <div className="container max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <BrandLogo showTagline={!scrolled} />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.18em] transition-colors duration-200 ${
                    isActive
                      ? "text-gold-700 dark:text-gold-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-[0.15em] font-medium bg-foreground text-background hover:bg-gold-500 hover:text-black transition-all duration-300 shadow-sm"
            >
              <span>Start Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background text-foreground md:hidden flex flex-col pt-28 px-8 pb-12 justify-between animate-in fade-in duration-200">
          <div className="flex flex-col gap-6">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold-700 dark:text-gold-400 font-mono font-semibold">
              Navigation
            </p>
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl tracking-wider transition-colors ${
                    isActive
                      ? "text-gold-700 dark:text-gold-400 font-bold"
                      : "text-foreground font-medium hover:text-gold-700 dark:hover:text-gold-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-col gap-4 pt-8 border-t border-border">
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 shadow-lg transition-colors"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Editorial Footer */}
      <footer className="border-t border-border/60 bg-card/40 backdrop-blur-sm pt-20 pb-28 md:pb-16">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border/40">
            {/* Col 1: Brand & Dynamic Bio */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <BrandLogo showTagline />
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mt-2">
                {footerDescription}
              </p>
              <div className="flex items-center gap-2 text-xs text-gold-700 dark:text-gold-400 font-mono font-medium mt-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Now Booking Commercial Projects</span>
              </div>
            </div>

            {/* Col 2: Navigation */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-foreground font-semibold">
                Studio
              </p>
              <Link
                href="/work"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Commercial Work
              </Link>
              <Link
                href="/services"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Capabilities
              </Link>
              <Link
                href="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About Fixelora
              </Link>
              <Link
                href="/blog"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Insights & Journal
              </Link>
              <Link
                href="/contact"
                className="text-sm text-gold-700 dark:text-gold-400 hover:underline transition-colors font-medium"
              >
                Start a Project
              </Link>
            </div>

            {/* Col 3: Services */}
            <div className="md:col-span-2 flex flex-col gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-foreground font-semibold">
                Services
              </p>
              <Link
                href="/services/product-commercials"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Product Commercials
              </Link>
              <Link
                href="/services/brand-films"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Brand Films
              </Link>
              <Link
                href="/services/social-performance-advertising"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Social Advertising
              </Link>
              <Link
                href="/services/ecommerce-product-marketing"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                E-commerce Video
              </Link>
              <Link
                href="/services/explainer-software-videos"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Explainer Videos
              </Link>
            </div>

            {/* Col 4: Studio Hubs */}
            <div className="md:col-span-3 flex flex-col gap-3">
              <p className="text-[11px] uppercase tracking-[0.2em] font-mono text-foreground font-semibold">
                Production Hubs
              </p>
              <div className="text-sm text-muted-foreground">
                <p className="text-foreground font-medium">Los Angeles</p>
                <p className="text-xs">Century City Media District</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="text-foreground font-medium">London</p>
                <p className="text-xs">Soho Creative Quarter</p>
              </div>
              <div className="pt-2">
                <a
                  href="mailto:production@fixelorastudio.com"
                  className="text-xs font-mono uppercase tracking-wider text-gold-700 dark:text-gold-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>production@fixelorastudio.com</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar (Secured: No Admin link or stray separator dots) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Fixelora Studio. All rights
              reserved.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/privacy"
                className="hover:text-gold-700 dark:hover:text-gold-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <span aria-hidden="true">•</span>
              <Link
                href="/terms"
                className="hover:text-gold-700 dark:hover:text-gold-400 transition-colors"
              >
                Terms of Production
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Fixelora AI SDR Chatbot */}
      <ChatWidget />
    </div>
  );
}
