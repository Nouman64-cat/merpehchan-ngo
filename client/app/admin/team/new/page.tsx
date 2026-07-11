"use client";

import { useRouter } from "next/navigation";
import { TeamMemberForm } from "@/components/admin/TeamMemberForm";
import { createTeamMember } from "@/lib/admin/api";

export default function NewTeamMemberPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await createTeamMember(formData);
    router.push("/admin/team");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Add Team Member</h1>
      <p className="mt-1 text-sm text-ink-soft">
        This person will appear on the public Our Team page once saved.
      </p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-8">
        <TeamMemberForm onSubmit={handleSubmit} submitLabel="Add Team Member" />
      </div>
    </div>
  );
}
