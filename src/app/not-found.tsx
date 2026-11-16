import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Film, Home, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-background text-foreground relative overflow-hidden text-center selection:bg-gold-500/20 selection:text-gold-300">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Icon */}
      <div className="relative w-12 h-12 mb-8">
        <Image
          src="/brand/fixelora-icon-gold.png"
          alt="Fixelora Studio Emblem"
          width={48}
          height={48}
          className="object-contain"
        />
      </div>

      {/* 404 Number */}
      <p className="text-7xl sm:text-9xl font-black font-mono gold-gradient-text tracking-tighter mb-4">
        404
      </p>

      {/* Headline */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-[11px] font-mono uppercase tracking-[0.25em] mb-6">
        <Film className="w-3.5 h-3.5" />
        <span>Scene Out Of Frame</span>
      </div>

      <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-foreground max-w-lg mb-4">
        This Production Take Does Not Exist.
      </h1>

      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mb-10 leading-relaxed font-light">
        The commercial reel, client proposal, or page you were looking for may have been archived, renamed, or cut in post-production.
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold bg-gold-500 text-black hover:bg-gold-400 transition-colors shadow-lg"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return To Homepage</span>
        </Link>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-medium border border-border text-foreground hover:bg-muted transition-colors"
        >
          <span>Explore Commercial Work</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
