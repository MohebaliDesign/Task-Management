import { notFound } from "next/navigation";
import { getProject } from "@/lib/queries";
import { ProjectHeader } from "@/features/projects/project-header";
import { ProjectTabs } from "@/features/projects/project-tabs";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { projectId: string };
}) {
  const project = getProject(params.projectId);
  if (!project) notFound();
  return (
    <div>
      <ProjectHeader project={project} />
      <ProjectTabs projectId={project.id} />
      {children}
    </div>
  );
}
