"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Play, ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  tag: string;
  headlineFirst: string;
  headlineGold: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  ctaText: string;
  ctaLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    tag: "Commercial Video Production Studio",
    headlineFirst: "Creative Ads.",
    headlineGold: "Powerful Stories.",
    subtitle: "We direct broadcast-grade commercials, luxury product films, and cinematic brand campaigns for visionary companies worldwide.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1920&auto=format&fit=crop",
    ctaText: "Initiate Project Brief",
    ctaLink: "/contact",
  },
  {
    tag: "Cinematic Product Advertisements",
    headlineFirst: "Tactile Precision.",
    headlineGold: "Sensory Allure.",
    subtitle: "Extreme macro probe optics, high-speed kinetics, and calibrated lighting that turn physical products into iconic luxury statements.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1920&auto=format&fit=crop",
    ctaText: "Explore Product Commercials",
    ctaLink: "/services/product-commercials",
  },
  {
    tag: "Brand Anthems & Manifestos",
    headlineFirst: "Brand Identity.",
    headlineGold: "Elevated to Cinema.",
    subtitle: "Emotionally resonant company anthems and documentary-grade storytelling that builds institutional trust and commands market dominance.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    posterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop",
    ctaText: "Discover Brand Films",
    ctaLink: "/services/brand-films",
  },
  {
    tag: "Social & Performance Advertising",
    headlineFirst: "Social Feeds.",
    headlineGold: "Engineered to Convert.",
    subtitle: "Tested psychological hooks and multi-format vertical video suites designed for scalable direct-response ROAS on Meta, TikTok, and YouTube.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    posterUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1920&auto=format&fit=crop",
    ctaText: "View Performance Ads",
    ctaLink: "/services/social-performance-advertising",
  },
];

export interface HeroContentProps {
  heroTag?: string;
  heroHeadline?: string;
  heroHeadlineAccent?: string;
  heroSubheadline?: string;
}

export function HeroSlider({
  heroTag,
  heroHeadline,
  heroHeadlineAccent,
  heroSubheadline,
}: HeroContentProps = {}) {
  const slides = React.useMemo(() => {
    return HERO_SLIDES.map((s, idx) => {
      if (idx === 0) {
        return {
          ...s,
          tag: heroTag || s.tag,
          headlineFirst: heroHeadline || s.headlineFirst,
          headlineGold: heroHeadlineAccent || s.headlineGold,
          subtitle: heroSubheadline || s.subtitle,
        };
      }
      return s;
    });
  }, [heroTag, heroHeadline, heroHeadlineAccent, heroSubheadline]);

  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  // Auto-advance slides every 6 seconds
  React.useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center pt-20 md:pt-24 pb-8 md:pb-16 px-4 sm:px-6 overflow-hidden bg-black">
      {/* Background Media with Cross-fade */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-45 scale-100" : "opacity-0 pointer-events-none scale-105"
          }`}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster={s.posterUrl}
            className="w-full h-full object-cover"
          >
            <source src={s.videoUrl} type="video/mp4" />
          </video>
        </div>
      ))}

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-background via-background/30 to-black/75 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-background/90 pointer-events-none" />

      {/* Slider Content */}
      <div className="relative z-10 container max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Pillar Tag Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold-500/30 bg-background/70 backdrop-blur-md mb-6 md:mb-8 transition-all duration-500">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-gold-300 font-medium">
            {slide.tag}
          </span>
        </div>

        {/* Dynamic Animated Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05] max-w-5xl mb-4 md:mb-6 min-h-[1.2em]">
          {slide.headlineFirst} <br />
          <span className="gold-gradient-text">{slide.headlineGold}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-neutral-200 max-w-2xl font-light leading-relaxed mb-6 md:mb-10 text-balance px-2">
          {slide.subtitle}
        </p>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <Link
            href={slide.ctaLink}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-[0.18em] font-semibold bg-gold-500 text-black hover:bg-gold-400 hover:scale-105 transition-all duration-300 shadow-lg shadow-gold-500/20"
          >
            <span>{slide.ctaText}</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          <Link
            href="#showcase"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-[0.18em] font-medium border border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
          >
            <Play className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
            <span>Watch Selected Works</span>
          </Link>
        </div>

        {/* Slide Indicator Navigation Controls */}
        <div className="mt-8 md:mt-12 flex items-center gap-3">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            }}
            aria-label="Previous slide"
            className="p-1.5 rounded-full border border-white/20 bg-black/40 text-neutral-300 hover:text-white hover:border-gold-500/60 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? "w-8 h-2 bg-gold-500"
                    : "w-2 h-2 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentSlide((prev) => (prev + 1) % slides.length);
            }}
            aria-label="Next slide"
            className="p-1.5 rounded-full border border-white/20 bg-black/40 text-neutral-300 hover:text-white hover:border-gold-500/60 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Spec Bar: Hidden on mobile viewports to reduce text clutter */}
        <div className="hidden md:flex mt-12 pt-6 border-t border-white/10 w-full max-w-3xl flex-wrap items-center justify-between gap-4 text-xs font-mono text-neutral-300">
          <div className="flex items-center gap-1.5">
            <span className="text-gold-400 font-bold">FORMAT:</span>
            <span>4K ProRes 4444 XQ / RED 8K</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gold-400 font-bold">LOCATIONS:</span>
            <span>Los Angeles • London • Global</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gold-400 font-bold">AUDIO:</span>
            <span>Dolby Atmos Spatial Master</span>
          </div>
        </div>
      </div>
    </section>
  );
}
