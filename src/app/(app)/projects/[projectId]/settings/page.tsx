import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { ProjectInfoCard } from "@/features/projects/project-info-card";
import { getProject, getPeople, getProjectApproval } from "@/lib/queries";
import { faDate } from "@/lib/utils";

export default function SettingsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const approval = getProjectApproval(project.id);
  const closed = project.lifecycle === "closed";

  return (
    <div className="max-w-2xl space-y-8">
      <ProjectInfoCard project={project} people={getPeople()} />

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

