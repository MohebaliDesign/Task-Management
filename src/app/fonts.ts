import localFont from "next/font/local";

/**
 * Vazirmatn — self-hosted variable font (offline-capable, no runtime CDN).
 * Stands in for the design system's "Vazir FD-WOL" family; both are the same
 * Vazir lineage. Rationale: docs/OPEN_PRODUCT_DECISIONS.md.
 */
export const vazirmatn = localFont({
  src: "./fonts/Vazirmatn.woff2",
  variable: "--font-sans",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "Tahoma", "sans-serif"],
});
