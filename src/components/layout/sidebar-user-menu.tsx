"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PersonAvatar, PersonChip } from "@/components/domain/person";
import { AppIcon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { roleLabels } from "@/lib/labels";
import type { Person } from "@/lib/domain";

/**
 * Bottom-of-sidebar identity + logout (items #22-26). The product has no
 * finalized authentication yet (PROJECT_CONTEXT.md boundaries), so "logout"
 * is the smallest realistic prototype behavior: it never invents a real
 * session, it just leaves the app shell and lands on a minimal signed-out
 * screen outside the (app) route group. See final report for this limitation.
 */
export function SidebarUserMenu({ operator, collapsed }: { operator: Person | undefined; collapsed: boolean }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  function confirmLogout() {
    setOpen(false);
    router.push("/signed-out");
  }

  if (!operator) return null;

  return (
    <div className="flex flex-col gap-1">
      {collapsed ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="mx-auto flex h-9 w-9 items-center justify-center" tabIndex={0} aria-label={`${operator.name} — ${roleLabels[operator.role]}`}>
              <PersonAvatar person={operator} className="h-8 w-8" />
            </span>
          </TooltipTrigger>
          <TooltipContent side="left">
            {operator.name} · {roleLabels[operator.role]}
          </TooltipContent>
        </Tooltip>
      ) : (
        <div className="rounded-lg px-1 py-1.5">
          <PersonChip person={operator} showRole />
        </div>
      )}

      <AlertDialog open={open} onOpenChange={setOpen}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mx-auto text-destructive-text hover:bg-destructive-subtle hover:text-destructive-text"
                  aria-label="خروج از حساب"
                >
                  <AppIcon name="logout" size={18} />
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent side="left">خروج از حساب</TooltipContent>
          </Tooltip>
        ) : (
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              className="justify-start gap-3 px-2 text-destructive-text hover:bg-destructive-subtle hover:text-destructive-text"
            >
              <AppIcon name="logout" size={18} />
              خروج از حساب
            </Button>
          </AlertDialogTrigger>
        )}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>از حساب خارج می‌شوید؟</AlertDialogTitle>
            <AlertDialogDescription>آیا مطمئنید می‌خواهید از این پنل خارج شوید؟</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmLogout}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              خروج از حساب
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
