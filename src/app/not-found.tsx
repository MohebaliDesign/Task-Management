import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-muted-foreground">
        <AppIcon name="search" size={28} />
      </span>
      <div>
        <h1 className="text-xl font-semibold">صفحه یافت نشد</h1>
        <p className="mt-1 text-sm text-muted-foreground">آدرسی که دنبال آن هستید وجود ندارد یا جابه‌جا شده است.</p>
      </div>
      <Button asChild>
        <Link href="/">
          <AppIcon name="dashboard" size={18} />
          بازگشت به داشبورد
        </Link>
      </Button>
    </div>
  );
}
