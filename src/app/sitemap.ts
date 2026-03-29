import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://vifcdatabase.com";
  const now = new Date();

  return [
    { url: baseUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/search`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/investors`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/banks`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/securities`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/insurance`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/neobanks`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/trends`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/deals`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/asean`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/capital-markets`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/why-vietnam`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/vifc`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/sandbox`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/regulators`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/investor-guide`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/market-size`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/risks`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/calendar`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/carbon`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/commodities`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/ratings`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/dfi`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
