import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProblemBySlug } from "@/lib/problems";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import ProblemDetailClient from "@/components/ProblemDetailClient";

type Params = { id: string };

// Inspirations are refreshed daily via the admin pipeline, so this page is
// rendered dynamically rather than statically generated at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const problem = await getProblemBySlug(id);

  if (!problem) {
    return { title: "找不到这个问题" };
  }

  const url = `${SITE_URL}/problems/${problem.id}`;

  return {
    title: problem.title,
    description: problem.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: problem.title,
      description: problem.description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: problem.title,
      description: problem.description,
    },
  };
}

export default async function ProblemDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const problem = await getProblemBySlug(id);

  if (!problem) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Question",
    name: problem.title,
    text: problem.description,
    url: `${SITE_URL}/problems/${problem.id}`,
    answerCount: 0,
    about: {
      "@type": "Thing",
      name: problem.category,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProblemDetailClient problem={problem} />
    </>
  );
}
