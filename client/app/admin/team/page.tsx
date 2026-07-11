"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  deleteTeamMember,
  fetchAdminTeam,
  type TeamMember,
} from "@/lib/admin/api";
import { clearStoredToken } from "@/lib/admin/auth";

export default function AdminTeamListPage() {
  const router = useRouter();
  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMembers = useCallback(async () => {
    try {
      const data = await fetchAdminTeam();
      setMembers(data);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearStoredToken();
        router.replace("/admin/login");
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load team.");
    }
  }, [router]);

  useEffect(() => {
    // Fetch-on-mount: state is set asynchronously inside loadMembers's
    // promise callbacks, not synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMembers();
  }, [loadMembers]);

  async function handleDelete(id: string) {
    if (!window.confirm("Remove this team member? This cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteTeamMember(id);
      setMembers((current) => current?.filter((m) => m._id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete member.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Team</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Manage the members shown on the public Our Team page.
          </p>
        </div>
        <Link
          href="/admin/team/new"
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
        >
          Add Team Member
        </Link>
      </div>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-2xl border border-black/5 bg-white">
        {members === null ? (
          <p className="p-8 text-center text-sm text-ink-soft">Loading…</p>
        ) : members.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">
            No team members yet. Add the first one above.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-paper-muted text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-6 py-3 font-semibold">Member</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Order</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} className="border-b border-black/5 last:border-0">
                  <td className="flex items-center gap-3 px-6 py-4">
                    {member.photo_url ? (
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                        <Image
                          src={member.photo_url}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-500">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-ink">{member.name}</span>
                  </td>
                  <td className="px-6 py-4 text-ink-soft">{member.role}</td>
                  <td className="px-6 py-4 text-ink-soft">{member.display_order}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        member.is_active
                          ? "bg-primary-50 text-primary-500"
                          : "bg-black/5 text-ink-soft"
                      }`}
                    >
                      {member.is_active ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/team/${member._id}`}
                      className="mr-4 font-semibold text-primary-500 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(member._id)}
                      disabled={deletingId === member._id}
                      className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === member._id ? "Removing…" : "Delete"}
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
