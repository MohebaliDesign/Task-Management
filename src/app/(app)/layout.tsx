import { AppShell } from "@/components/layout/app-shell";

// Pages read the local JSON store per request; render dynamically.
export const dynamic = "force-dynamic";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
