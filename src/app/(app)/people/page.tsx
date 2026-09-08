import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/domain/page-header";
import { EmptyState } from "@/components/domain/empty-state";
import { AppIcon } from "@/components/icon";
import { CreatePersonDialog } from "@/features/people/create-person-dialog";
import { AddTeamDialog } from "@/features/people/add-team-dialog";
import { PeopleTable } from "@/features/people/people-table";
import { PeopleToolbar } from "@/features/people/people-toolbar";
import { TeamsView } from "@/features/people/teams-view";
import { getPeople, getTeams, getTeamsForPerson, getTeamMembers, getTeamPmPo } from "@/lib/queries";
import { roleLabels } from "@/lib/labels";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "افراد و تیم‌ها" };

const TABS = [
  { key: "people", label: "افراد" },
  { key: "teams", label: "تیم‌ها" },
] as const;

export default function PeoplePage({
  searchParams,
}: {
  searchParams: { q?: string; role?: string; team?: string; sort?: string; tab?: string };
}) {
  const allPeople = getPeople();
  const teams = getTeams();
  const tab = searchParams.tab === "teams" ? "teams" : "people";

  const q = (searchParams.q ?? "").trim();
  let people = allPeople;
  if (q) {
    people = people.filter(
      (p) =>
        p.name.includes(q) ||
        roleLabels[p.role].includes(q) ||
        getTeamsForPerson(p.id).some((t) => t.name.includes(q)),
    );
  }
  if (searchParams.role) people = people.filter((p) => p.role === searchParams.role);
  if (searchParams.team) {
    const team = teams.find((t) => t.id === searchParams.team);
    people = people.filter((p) => team?.memberIds.includes(p.id) || team?.leadId === p.id);
  }
  people = [...people].sort((a, b) => {
    if (searchParams.sort === "role") return a.role.localeCompare(b.role);
    return a.name.localeCompare(b.name, "fa");
  });

  const teamRows = teams.map((team) => {
    const members = getTeamMembers(team);
    const { pm, po } = getTeamPmPo(team);
    return { team, members, pm, po };
  });

  return (
    <div>
      <PageHeader
        title="افراد و تیم‌ها"
        description="فهرست همهٔ افراد و تیم‌های سازمان، برای مسئول‌کردن اقدامات و موانع."
        icon="people"
        actions={
          <>
            <AddTeamDialog people={allPeople} />
            <CreatePersonDialog teams={teams} />
          </>
        }
      />

      <nav aria-label="نمای افراد و تیم‌ها" className="mb-5 inline-flex items-center gap-1 rounded-lg bg-muted p-1">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "people" ? "/people" : "/people?tab=teams"}
            aria-current={tab === t.key ? "page" : undefined}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tab === t.key ? "bg-card text-foreground shadow-2xs" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <AppIcon name={t.key === "people" ? "people" : "profile"} size={16} />
            {t.label}
          </Link>
        ))}
      </nav>

      {tab === "teams" ? (
        teams.length === 0 ? (
          <EmptyState icon="people" title="تیمی ثبت نشده است" description="نخستین تیم سازمان را ثبت کنید." action={<AddTeamDialog people={allPeople} />} />
        ) : (
          <TeamsView rows={teamRows} />
        )
      ) : allPeople.length === 0 ? (
        <EmptyState icon="people" title="فردی ثبت نشده است" description="نخستین فرد سازمان را ثبت کنید." action={<CreatePersonDialog teams={teams} />} />
      ) : (
        <>
          <PeopleToolbar teams={teams} resultCount={people.length} />
          {people.length === 0 ? (
            <EmptyState icon="search" title="فردی با این مشخصات پیدا نشد" description="فیلترها یا عبارت جست‌وجو را تغییر دهید." />
          ) : (
            <Card className="overflow-hidden">
              <PeopleTable people={people} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}
