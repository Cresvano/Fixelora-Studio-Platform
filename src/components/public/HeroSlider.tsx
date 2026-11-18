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
    subtitle:
      "We direct broadcast-grade commercials, luxury product films, and cinematic brand campaigns for visionary companies worldwide.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1920&auto=format&fit=crop",
    ctaText: "Initiate Project Brief",
    ctaLink: "/contact",
  },
  {
    tag: "Cinematic Product Advertisements",
    headlineFirst: "Tactile Precision.",
    headlineGold: "Sensory Allure.",
    subtitle:
      "High-impact product showcases, crisp visual storytelling, and tailored lighting that turn physical products into unmistakable market leaders.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1920&auto=format&fit=crop",
    ctaText: "Explore Product Commercials",
    ctaLink: "/services/product-commercials",
  },
  {
    tag: "Brand Anthems & Manifestos",
    headlineFirst: "Brand Identity.",
    headlineGold: "Elevated to Cinema.",
    subtitle:
      "Emotionally resonant company films and documentary-grade storytelling that build instant credibility and drive sustained customer growth.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop",
    ctaText: "Discover Brand Films",
    ctaLink: "/services/brand-films",
  },
  {
    tag: "Social & Performance Advertising",
    headlineFirst: "Social Feeds.",
    headlineGold: "Engineered to Convert.",
    subtitle:
      "Attention-grabbing opening hooks and multi-format vertical video campaigns built to scale conversions across Meta, TikTok, and YouTube.",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    posterUrl:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=1920&auto=format&fit=crop",
    ctaText: "View Performance Ads",
    ctaLink: "/services/social-performance-advertising",
  },
];

export interface HeroContentProps {
  heroTag?: string;
  heroHeadline?: string;
  heroHeadlineAccent?: string;
  heroSubheadline?: string;
  sliderIntroText?: string;
}

export function HeroSlider({
  heroTag,
  heroHeadline,
  heroHeadlineAccent,
  heroSubheadline,
  sliderIntroText,
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
    <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center pt-24 md:pt-28 pb-12 md:pb-16 px-4 sm:px-6 overflow-hidden bg-black">
      {/* Background Media with Cross-fade */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? "opacity-50 scale-100" : "opacity-0 pointer-events-none scale-105"
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

      {/* Dark Cinematic Overlays (Always dark so hero text maintains AAA contrast in Light & Dark Mode) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/90 via-black/45 to-black/75 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/40 to-black/85 pointer-events-none" />

      {/* Slider Content */}
      <div className="relative z-10 container max-w-6xl mx-auto flex flex-col items-center text-center">
        {/* Pillar Tag Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold-500/40 bg-black/65 backdrop-blur-md mb-6 md:mb-8 transition-all duration-500">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-gold-300 font-medium">
            {slide.tag}
          </span>
        </div>

        {/* Dynamic Animated Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase leading-[1.05] max-w-5xl mb-4 md:mb-6 min-h-[1.2em]">
          {slide.headlineFirst} <br />
          <span className="hero-gold-gradient-text">{slide.headlineGold}</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg md:text-xl text-neutral-100 max-w-2xl font-light leading-relaxed mb-6 md:mb-10 text-balance px-2">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-[0.18em] font-medium border border-white/25 bg-black/40 backdrop-blur-md text-white hover:bg-white/15 hover:border-white/50 transition-all duration-300"
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
            className="p-1.5 rounded-full border border-white/25 bg-black/50 text-neutral-200 hover:text-white hover:border-gold-500/60 transition-colors"
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
                    : "w-2 h-2 bg-white/35 hover:bg-white/65"
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
            className="p-1.5 rounded-full border border-white/25 bg-black/50 text-neutral-200 hover:text-white hover:border-gold-500/60 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Business-Focused Intro Text (Replaces Deleted Technical Jargon) */}
        {sliderIntroText && (
          <p className="mt-6 md:mt-10 pt-5 border-t border-white/15 max-w-2xl text-xs sm:text-sm text-neutral-200/90 font-light leading-relaxed px-2">
            {sliderIntroText}
          </p>
        )}
      </div>
    </section>
  );
}
