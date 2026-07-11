import type { TeamMember } from "@/lib/data/team";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-8 text-center">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 font-display text-xl font-bold text-white">
        {member.initials}
      </span>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">
        {member.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-primary-500">
        {member.role}
      </p>
    </div>
  );
}
