import type { MetadataRoute } from "next";
import { listProblems } from "@/lib/problems";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const { items } = await listProblems({ limit: 200 });
  const problemRoutes: MetadataRoute.Sitemap = items.map((problem) => ({
    url: `${SITE_URL}/problems/${problem.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...problemRoutes];
}
