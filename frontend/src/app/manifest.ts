import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SevaCare Rural",
    short_name: "SevaCare",
    description: "Rural healthcare appointment optimizer",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0d9488",
    lang: "en",
    icons: [
      { src: "/favicon.ico", sizes: "any", type: "image/x-icon" },
      { src: "/next.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  };
}
