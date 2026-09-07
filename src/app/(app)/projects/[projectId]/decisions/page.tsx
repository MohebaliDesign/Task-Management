import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AppIcon } from "@/components/icon";
import { SectionHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { AddDecisionDialog } from "@/features/meetings/add-decision-dialog";
import { faDate, toFa } from "@/lib/utils";
import { getProject, getDecisions, getPerson, getPeople, getMeeting, getMeetings, getActions } from "@/lib/queries";

export default function DecisionsPage({ params }: { params: { projectId: string } }) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  const decisions = getDecisions(project.id);
  const actions = getActions(project.id);
  const readOnly = project.lifecycle === "closed";

  return (
    <div>
      <SectionHeader
        title="تصمیم‌ها"
        description="تصمیم‌ها رکوردهای مستقل و قابل‌ردیابی هستند و به جلسهٔ منبع و اقدامات ناشی از خود پیوند دارند."
        icon="decision"
        actions={
          !readOnly && (
            <AddDecisionDialog
              projectId={project.id}
              meetings={getMeetings(project.id)}
              people={getPeople()}
              unlinkedActions={actions.filter((a) => !a.relatedDecisionId)}
            />
          )
        }
      />
      {decisions.length === 0 ? (
        <EmptyState icon="decision" title="تصمیمی ثبت نشده است" description="تصمیم‌ها هنگام ثبت جلسه اضافه می‌شوند." />
      ) : (
        <div className="space-y-3">
          {decisions.map((d) => {
            const meeting = getMeeting(d.meetingId);
            const derived = actions.filter((a) => a.relatedDecisionId === d.id);
            return (
              <Card key={d.id} className="p-4">
                <div className="flex items-start gap-3">
                  <AppIcon name="decision" size={20} className="mt-0.5 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{d.text}</p>
                    {d.description && <p className="mt-0.5 text-sm text-muted-foreground">{d.description}</p>}
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>تصمیم‌گیرنده: {getPerson(d.deciderId)?.name}</span>
                      <span>حوزه: {d.area}</span>
                      <span>اثر: {d.impact}</span>
                      <span>{faDate(d.date)}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {meeting ? (
                        <>
                          ایجادشده از جلسه:{" "}
                          <Link href={`/projects/${project.id}/meetings/${meeting.id}`} className="inline-flex items-center gap-1 text-foreground hover:underline">
                            <AppIcon name="meetings" size={13} /> {meeting.title}
                          </Link>{" "}
                          · {faDate(meeting.date)}
                        </>
                      ) : (
                        "بدون جلسهٔ منبع (ثبت مستقیم)"
                      )}
                    </p>
                    {derived.length > 0 && (
                      <div className="mt-2 rounded-md bg-muted/50 p-2">
                        <p className="mb-1 text-xs font-medium text-muted-foreground">اقدامات ناشی از این تصمیم ({toFa(derived.length)}):</p>
                        <ul className="space-y-0.5">
                          {derived.map((a) => (
                            <li key={a.id} className="flex items-center gap-1.5 text-xs">
                              <AppIcon name="actions" size={12} className="text-muted-foreground" />
                              {a.title}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
