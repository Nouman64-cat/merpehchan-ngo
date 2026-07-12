"use client";

import { useRouter } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { createEvent } from "@/lib/admin/api";

export default function NewEventPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await createEvent(formData);
    router.push("/admin/events");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Add Event</h1>
      <p className="mt-1 text-sm text-ink-soft">
        This event will appear on the public Gallery page once saved.
      </p>
      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-8">
        <EventForm onSubmit={handleSubmit} submitLabel="Add Event" />
      </div>
    </div>
  );
}
