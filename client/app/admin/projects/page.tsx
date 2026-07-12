"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  deleteProject,
  fetchAdminProjects,
  type ProjectRecord,
} from "@/lib/admin/api";
import { clearStoredToken } from "@/lib/admin/auth";

export default function AdminProjectsListPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectRecord[] | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      const data = await fetchAdminProjects();
      setProjects(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearStoredToken();
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load projects.");
    }
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProjects();
  }, [loadProjects]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this project? This cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteProject(id);
      setProjects((current) => current?.filter((p) => p._id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete project.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Projects</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage the projects shown on the public Projects page.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Add Project
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-2xl border border-black/5 bg-white">
        {projects === null ? (
          <p className="p-8 text-center text-sm text-ink-soft">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">
            No projects yet. Add the first one above.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-paper-muted text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-6 py-3 font-semibold">Project</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Areas</th>
                <th className="px-6 py-3 font-semibold">Order</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id} className="border-b border-black/5 last:border-0">
                  <td className="flex items-center gap-3 px-6 py-4">
                    {project.images[0] ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={project.images[0].url}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-xs font-semibold text-primary-500">
                        {project.title.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-ink">{project.title}</span>
                  </td>
                  <td className="px-6 py-4 text-ink-soft">{project.date}</td>
                  <td className="px-6 py-4 text-ink-soft">
                    {project.areas.length > 0 ? project.areas.join(", ") : "—"}
                  </td>
                  <td className="px-6 py-4 text-ink-soft">{project.display_order}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        project.is_active
                          ? "bg-primary-50 text-primary-500"
                          : "bg-black/5 text-ink-soft"
                      }`}
                    >
                      {project.is_active ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/projects/${project._id}`}
                      className="mr-4 font-semibold text-primary-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(project._id)}
                      disabled={deletingId === project._id}
                      className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === project._id ? "Removing…" : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
