import Image from "next/image";

type TeamCardMember = {
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return initials.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

export function TeamCard({ member }: { member: TeamCardMember }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-8 text-center">
      {member.photoUrl ? (
        <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
          <Image
            src={member.photoUrl}
            alt={member.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
      ) : (
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 font-display text-xl font-bold text-white">
          {getInitials(member.name)}
        </span>
      )}
      <h3 className="mt-4 font-display text-lg font-bold text-ink">
        {member.name}
      </h3>
      <p className="mt-1 text-sm font-medium text-primary-500">{member.role}</p>
      {member.bio ? (
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">{member.bio}</p>
      ) : null}
    </div>
  );
}
