import * as React from "react";
import { pageContentRepository } from "@/lib/data/page-content";
import { PublicShell } from "@/components/public/PublicShell";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageContent = await pageContentRepository.getPageContent();

  return (
    <PublicShell footerDescription={pageContent.footerDescription}>
      {children}
    </PublicShell>
  );
}
