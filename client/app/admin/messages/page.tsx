"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ApiError,
  deleteMessage,
  fetchAdminMessages,
  type ContactMessage,
  type MessageFilter,
} from "@/lib/admin/api";
import { clearStoredToken } from "@/lib/admin/auth";

const FILTERS: { value: MessageFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "read", label: "Read" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminMessagesListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<MessageFilter>("all");
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadMessages = useCallback(
    async (activeFilter: MessageFilter) => {
      setMessages(null);
      try {
        const data = await fetchAdminMessages(activeFilter);
        setMessages(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearStoredToken();
          router.replace("/admin/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to load messages.");
      }
    },
    [router]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMessages(filter);
  }, [filter, loadMessages]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this message? This cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteMessage(id);
      setMessages((current) => current?.filter((m) => m._id !== id) ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message.");
    } finally {
      setDeletingId(null);
    }
  }

  const unreadCount = messages?.filter((m) => !m.is_read).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Messages</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Submissions from the public Contact Us form.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              filter === option.value
                ? "bg-primary-500 text-white"
                : "bg-white text-ink-soft hover:bg-paper-muted"
            }`}
          >
            {option.label}
            {option.value === "unread" && unreadCount > 0 && filter !== "unread"
              ? ` (${unreadCount})`
              : ""}
          </button>
        ))}
      </div>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white">
        {messages === null ? (
          <p className="p-8 text-center text-sm text-ink-soft">Loading…</p>
        ) : messages.length === 0 ? (
          <p className="p-8 text-center text-sm text-ink-soft">
            No messages here.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/5 bg-paper-muted text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-6 py-3 font-semibold">From</th>
                <th className="px-6 py-3 font-semibold">Subject</th>
                <th className="px-6 py-3 font-semibold">Received</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((message) => (
                <tr key={message._id} className="border-b border-black/5 last:border-0">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/messages/${message._id}`}
                      className="block hover:underline"
                    >
                      <span
                        className={
                          message.is_read
                            ? "text-ink-soft"
                            : "font-semibold text-ink"
                        }
                      >
                        {message.name}
                      </span>
                      <span className="block text-xs text-ink-soft">
                        {message.email}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/messages/${message._id}`} className="hover:underline">
                      <span className={message.is_read ? "text-ink-soft" : "font-medium text-ink"}>
                        {message.subject}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-ink-soft">{formatDate(message.created_at)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        message.is_read
                          ? "bg-black/5 text-ink-soft"
                          : "bg-primary-50 text-primary-500"
                      }`}
                    >
                      {message.is_read ? "Read" : "Unread"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/messages/${message._id}`}
                      className="mr-4 font-semibold text-primary-500 hover:underline"
                    >
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(message._id)}
                      disabled={deletingId === message._id}
                      className="font-semibold text-red-600 hover:underline disabled:opacity-50"
                    >
                      {deletingId === message._id ? "Removing…" : "Delete"}
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
