import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { LifecycleBadge } from "@/components/domain/status";
import { PersonChip } from "@/components/domain/person";
import { getProject, getPerson, getProjectApproval } from "@/lib/queries";
import { faDate } from "@/lib/utils";

export default function SettingsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const approval = getProjectApproval(project.id);
  const closed = project.lifecycle === "closed";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <SectionHeader title="اطلاعات پروژه" icon="settings" />
        <Card>
          <CardContent className="divide-y divide-border p-0">
            <Row label="شناسهٔ پروژه"><span className="ltr text-sm text-muted-foreground">{project.id}</span></Row>
            <Row label="نسخه">{project.versionLabel}</Row>
            <Row label="وضعیت چرخهٔ عمر"><LifecycleBadge value={project.lifecycle} /></Row>
            <Row label="مدیر پروژه"><PersonChip person={getPerson(project.pmId)} /></Row>
            <Row label="مالک محصول"><PersonChip person={getPerson(project.poId)} /></Row>
            <Row label="تاریخ ایجاد">{faDate(project.createdAt)}</Row>
          </CardContent>
        </Card>
      </div>

      <div>
        <SectionHeader title="بازبینی و بستن نسخه" icon="verify" />
        {closed ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <AppIcon name="verify" size={18} variant="Bold" />
                این نسخه بسته شده است
              </CardTitle>
              <CardDescription>در {faDate(project.closedDate)} با تأیید نهایی مدیرعامل بسته شد.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.finalResult && (
                <div className="rounded-md bg-muted/50 p-3 text-sm">
                  <p className="mb-1 font-medium">نتیجهٔ نهایی</p>
                  <p className="text-muted-foreground">{project.finalResult}</p>
                </div>
              )}
              {approval && (
                <div className="rounded-md border border-success/20 bg-success-subtle p-3 text-sm">
                  <p className="flex items-center gap-2 font-medium text-success">
                    <AppIcon name="approval" size={16} /> تأیید مدیرعامل: {approval.approverName}
                  </p>
                  {approval.comment && <p className="mt-1 text-muted-foreground">{approval.comment}</p>}
                  <p className="mt-1 text-xs text-muted-foreground">{faDate(approval.signedAt, true)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>بستن نسخهٔ پروژه</CardTitle>
              <CardDescription>
                برای بستن این نسخه، ابتدا نتیجهٔ نهایی را آماده کنید و سپس تأیید نهایی مدیرعامل را ثبت نمایید. تاریخچهٔ نسخه پس از بستن حفظ می‌شود.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/final-review/project/${project.id}`}>
                  <AppIcon name="verify" size={18} />
                  شروع بازبینی نهایی
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 p-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span>{children}</span>
    </div>
  );
}
