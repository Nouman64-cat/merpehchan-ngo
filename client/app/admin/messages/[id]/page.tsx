"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ApiError,
  deleteMessage,
  fetchMessage,
  updateMessageReadStatus,
  type ContactMessage,
} from "@/lib/admin/api";
import { clearStoredToken } from "@/lib/admin/auth";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminMessageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [message, setMessage] = useState<ContactMessage | null>(null);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // Fetching a message marks it read as a side effect on the backend.
    fetchMessage(params.id)
      .then(setMessage)
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) {
          clearStoredToken();
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load message.");
      });
  }, [params.id, router]);

  async function toggleReadStatus() {
    if (!message) return;
    setIsUpdating(true);
    try {
      const updated = await updateMessageReadStatus(message._id, !message.is_read);
      setMessage(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update message.");
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!message) return;
    if (!window.confirm("Delete this message? This cannot be undone.")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteMessage(message._id);
      router.push("/admin/messages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/admin/messages"
        className="text-sm font-semibold text-primary-500 hover:underline"
      >
        ← Back to Messages
      </Link>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      {message ? (
        <div className="mt-6 rounded-2xl border border-black/5 bg-white p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-xl font-bold text-ink">
                {message.subject}
              </h1>
              <p className="mt-2 text-sm text-ink-soft">
                From <span className="font-medium text-ink">{message.name}</span>{" "}
                &lt;
                <a href={`mailto:${message.email}`} className="text-primary-500 hover:underline">
                  {message.email}
                </a>
                &gt;
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                Received {formatDate(message.created_at)}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                message.is_read
                  ? "bg-black/5 text-ink-soft"
                  : "bg-primary-50 text-primary-500"
              }`}
            >
              {message.is_read ? "Read" : "Unread"}
            </span>
          </div>

          <p className="mt-6 whitespace-pre-wrap text-sm leading-relaxed text-ink">
            {message.message}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-black/5 pt-6">
            <a
              href={`mailto:${message.email}?subject=${encodeURIComponent(
                `Re: ${message.subject}`
              )}`}
              className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600"
            >
              Reply by Email
            </a>
            <button
              type="button"
              onClick={toggleReadStatus}
              disabled={isUpdating}
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold text-ink hover:bg-paper-muted disabled:opacity-50"
            >
              {message.is_read ? "Mark as Unread" : "Mark as Read"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="ml-auto inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      ) : !error ? (
        <p className="mt-6 text-sm text-ink-soft">Loading…</p>
      ) : null}
    </div>
  );
}
