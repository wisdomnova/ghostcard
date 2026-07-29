import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // PLACEHOLDER: Replace 'https://your-domain-here.com' with your production URL or configure NEXT_PUBLIC_SITE_URL in .env
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain-here.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
