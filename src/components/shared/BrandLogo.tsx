"use client";

import Link from "next/link";
import Image from "next/image";

interface BrandLogoProps {
  variant?: "full" | "icon" | "minimal";
  className?: string;
  showTagline?: boolean;
}

export function BrandLogo({
  variant = "full",
  className = "",
  showTagline = false,
}: BrandLogoProps) {
  if (variant === "icon") {
    return (
      <Link href="/" className={`inline-flex items-center group ${className}`}>
        <div className="relative w-9 h-9 transition-transform duration-300 group-hover:scale-105">
          <Image
            src="/brand/fixelora-icon-gold.png"
            alt="Fixelora Studio Emblem"
            width={36}
            height={36}
            className="object-contain"
            priority
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href="/" className={`inline-flex items-center gap-3 group ${className}`}>
      <div className="relative w-8 h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:scale-105 shrink-0">
        <Image
          src="/brand/fixelora-icon-gold.png"
          alt="Fixelora Studio Emblem"
          width={36}
          height={36}
          className="object-contain"
          priority
        />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="font-bold tracking-[0.2em] text-sm md:text-base uppercase text-foreground">
            FIXELORA
          </span>
          <span className="font-medium tracking-[0.25em] text-xs md:text-sm uppercase text-gold-700 dark:text-gold-400">
            STUDIO
          </span>
        </div>
        {showTagline && (
          <span className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground mt-0.5">
            Creative Ads. Powerful Stories.
          </span>
        )}
      </div>
    </Link>
  );
}
