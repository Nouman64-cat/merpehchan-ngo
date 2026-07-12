"use client";

import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { createProject } from "@/lib/admin/api";

export default function NewProjectPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await createProject(formData);
    router.push("/admin/projects");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Add Project</h1>
      <p className="mt-1 text-sm text-ink-soft">
        This project will appear on the public Projects page once saved.
      </p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-8">
        <ProjectForm onSubmit={handleSubmit} submitLabel="Add Project" />
      </div>
    </div>
  );
}
