import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "VIFC Database",
    short_name: "VIFC",
    description: "Vietnam Fintech & Financial Registry",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1117",
    theme_color: "#4B7BF5",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
