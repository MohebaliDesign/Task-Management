import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";

export const metadata: Metadata = { title: "خروج از حساب" };

/**
 * Minimal signed-out screen (item #26). The product has no finalized
 * authentication yet, so logout can't invalidate a real session — it only
 * leaves the (app) route group (and its shell) and lands here. Signing back
 * in is a stand-in link back to the dashboard, not a login flow.
 */
export default function SignedOutPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-muted-foreground">
        <AppIcon name="logout" size={26} />
      </span>
      <div>
        <h1 className="text-xl font-semibold">از حساب خارج شدید</h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          نشست شما در این پنل به پایان رسید. برای ادامهٔ کار باید دوباره وارد شوید.
        </p>
      </div>
      <Button asChild>
        <Link href="/">
          <AppIcon name="dashboard" size={18} />
          ورود مجدد
        </Link>
      </Button>
    </div>
  );
}
