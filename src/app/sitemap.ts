import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: "https://www.patukrejomulyo.web.id/",
      lastModified: "2025-07-09T13:30:00Z",
      changeFrequency: "hourly", // sebelumnya "minutely"
      priority: 1,
    },
    {
      url: "https://www.patukrejomulyo.web.id/home",
      lastModified: "2025-07-09T13:30:00Z",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://www.patukrejomulyo.web.id/news",
      lastModified: "2025-07-09T13:30:00Z",
      changeFrequency: "hourly", // sebelumnya "minutely"
      priority: 0.7,
    },
    {
      url: "https://www.patukrejomulyo.web.id/report",
      lastModified: "2025-07-09T13:30:00Z",
      changeFrequency: "hourly", // sebelumnya "minutely"
      priority: 0.7,
    },
    {
      url: "https://www.patukrejomulyo.web.id/form",
      lastModified: "2025-07-09T13:30:00Z",
      changeFrequency: "hourly", // sebelumnya "minutely"
      priority: 0.7,
    },

  ];
}