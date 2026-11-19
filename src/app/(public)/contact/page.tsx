import type { Metadata } from "next";
import { pageContentRepository } from "@/lib/data/page-content";
import { ContactClient } from "@/components/public/ContactClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Commercial Brief | Fixelora Studio",
  description:
    "Initiate a commercial brief or schedule a discovery call with Fixelora Studio's executive production team. Response guaranteed within 24 hours.",
  openGraph: {
    title: "Contact & Commercial Brief | Fixelora Studio",
    description:
      "Initiate a commercial brief or schedule a discovery call with Fixelora Studio's executive production team.",
    type: "website",
    url: "/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Fixelora Studio",
    description:
      "Initiate a commercial brief or schedule a discovery call with Fixelora Studio's production team.",
  },
};

export default async function ContactPage() {
  const pageContent = await pageContentRepository.getPageContent();
  return <ContactClient pageContent={pageContent} />;
}
