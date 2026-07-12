"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import {
  ApiError,
  fetchEvent,
  updateEvent,
  type EventRecord,
} from "@/lib/admin/api";
import { clearStoredToken } from "@/lib/admin/auth";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent(params.id)
      .then(setEvent)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearStoredToken();
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load event.");
      });
  }, [params.id, router]);

  async function handleSubmit(formData: FormData) {
    await updateEvent(params.id, formData);
    router.push("/admin/events");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-ink">Edit Event</h1>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-8">
        {event ? (
          <EventForm initial={event} onSubmit={handleSubmit} submitLabel="Save Changes" />
        ) : !error ? (
          <p className="text-sm text-ink-soft">Loading…</p>
        ) : null}
      </div>
    </div>
  );
}
