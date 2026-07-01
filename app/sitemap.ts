import type { MetadataRoute } from "next";
import { PROBLEMS } from "@/lib/data";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const problemRoutes: MetadataRoute.Sitemap = PROBLEMS.map((problem) => ({
    url: `${SITE_URL}/problems/${problem.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...problemRoutes];
}
