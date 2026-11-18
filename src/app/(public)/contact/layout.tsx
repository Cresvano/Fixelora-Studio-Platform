import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Start a Project | Contact & Project Brief",
  description:
    "Initiate your next commercial video production with Fixelora Studio. Submit a 2-minute project brief or schedule an executive discovery call with our producers.",
  openGraph: {
    title: "Start a Project | Fixelora Studio",
    description:
      "Submit a project brief or schedule a 20-minute introductory discovery call with our executive producer.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Initiate Production | Fixelora Studio",
    description:
      "Submit your commercial project brief or schedule a discovery call.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
