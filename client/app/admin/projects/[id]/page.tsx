"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import {
  ApiError,
  fetchProject,
  updateProject,
  type ProjectRecord,
} from "@/lib/admin/api";
import { clearStoredToken } from "@/lib/admin/auth";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<ProjectRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProject(params.id)
      .then(setProject)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearStoredToken();
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load project.");
      });
  }, [params.id, router]);

  async function handleSubmit(formData: FormData) {
    await updateProject(params.id, formData);
    router.push("/admin/projects");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Project</h1>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-8">
        {project ? (
          <ProjectForm initial={project} onSubmit={handleSubmit} submitLabel="Save Changes" />
        ) : !error ? (
          <p className="text-sm text-ink-soft">Loading…</p>
        ) : null}
      </div>
    </div>
  );
}
