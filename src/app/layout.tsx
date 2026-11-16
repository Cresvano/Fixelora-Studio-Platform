import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Fixelora Studio",
    default: "Fixelora Studio | Premium Commercial Video Production",
  },
  description: "Fixelora Studio is an international commercial video production studio crafting cinematic advertisements, flagship brand films, and high-converting commercial campaigns for global brands.",
  keywords: [
    "commercial video production",
    "cinematic advertisements",
    "commercial film studio",
    "brand anthem",
    "4K video production",
    "luxury commercials",
    "DTC video advertising",
  ],
  authors: [{ name: "Fixelora Studio" }],
  icons: {
    icon: "/brand/fixelora-icon-gold.png",
    shortcut: "/brand/fixelora-icon-gold.png",
    apple: "/brand/fixelora-icon-gold.png",
  },
  openGraph: {
    title: "Fixelora Studio | Commercial Video Production",
    description: "Creative Ads. Powerful Stories. Premium commercial video production for visionary brands worldwide.",
    url: "https://fixelorastudio.com",
    siteName: "Fixelora Studio",
    locale: "en_US",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080809" },
    { media: "(prefers-color-scheme: light)", color: "#FAF9F5" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col font-sans bg-background text-foreground antialiased selection:bg-gold-500/20 selection:text-gold-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
