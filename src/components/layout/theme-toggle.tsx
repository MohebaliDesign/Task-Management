"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "روشن‌کردن پوسته" : "تیره‌کردن پوسته"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? <AppIcon name={isDark ? "sun" : "moon"} size={20} /> : <span className="h-5 w-5" />}
    </Button>
  );
}
