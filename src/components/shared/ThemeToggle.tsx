"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button 
        aria-label="Toggle theme" 
        className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center opacity-70"
      >
        <span className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-full border border-border/80 bg-background/50 hover:bg-muted/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:border-gold-500/40"
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-gold-400 transition-transform rotate-0 scale-100 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-charcoal-700 transition-transform rotate-0 scale-100 hover:-rotate-12" />
      )}
    </button>
  );
}
