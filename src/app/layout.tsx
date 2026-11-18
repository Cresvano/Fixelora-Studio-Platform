import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://fixelorastudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Fixelora Studio",
    default: "Fixelora Studio | Premium Commercial Video Production",
  },
  description:
    "Fixelora Studio is an international commercial video production studio crafting cinematic advertisements, flagship brand films, and high-converting commercial campaigns for global brands.",
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
  creator: "Fixelora Studio",
  publisher: "Fixelora Studio",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/brand/fixelora-icon-gold.png",
    shortcut: "/brand/fixelora-icon-gold.png",
    apple: "/brand/fixelora-icon-gold.png",
  },
  openGraph: {
    title: "Fixelora Studio | Commercial Video Production",
    description:
      "Creative Ads. Powerful Stories. Premium commercial video production for visionary brands worldwide.",
    url: SITE_URL,
    siteName: "Fixelora Studio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/brand/fixelora-logo-full.jpg",
        width: 1200,
        height: 630,
        alt: "Fixelora Studio — Creative Ads. Powerful Stories.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fixelora Studio | Commercial Video Production",
    description:
      "Creative Ads. Powerful Stories. Premium commercial video production for visionary brands worldwide.",
    images: ["/brand/fixelora-logo-full.jpg"],
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
