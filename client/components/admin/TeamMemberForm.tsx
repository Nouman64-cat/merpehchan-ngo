"use client";

import { useState, type FormEvent } from "react";
import type { TeamMember } from "@/lib/admin/api";

export function TeamMemberForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: TeamMember;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    initial?.photo_url ?? null
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Empty file inputs still submit an empty File entry — strip it so
    // the backend doesn't try to treat "no selection" as a new photo.
    const photo = formData.get("photo");
    if (photo instanceof File && photo.size === 0) {
      formData.delete("photo");
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={initial?.name}
            className="mt-1.5 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
          />
        </div>
        <div>
          <label htmlFor="role" className="text-sm font-medium text-ink">
            Role / Title
          </label>
          <input
            id="role"
            name="role"
            type="text"
            required
            defaultValue={initial?.role}
            className="mt-1.5 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bio" className="text-sm font-medium text-ink">
          Bio (optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          defaultValue={initial?.bio ?? ""}
          className="mt-1.5 w-full resize-none rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="display_order" className="text-sm font-medium text-ink">
            Display Order
          </label>
          <input
            id="display_order"
            name="display_order"
            type="number"
            defaultValue={initial?.display_order ?? 0}
            className="mt-1.5 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
          />
          <p className="mt-1 text-xs text-ink-soft">
            Lower numbers appear first on the site.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-7">
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            value="true"
            defaultChecked={initial?.is_active ?? true}
            className="h-4 w-4 rounded border-black/20 text-primary-500 focus:ring-primary-500"
          />
          {/* Unchecked checkboxes omit themselves from FormData, so this
              fallback guarantees "is_active" is always present. Its DOM
              order after the checkbox matters: FormData.get() returns the
              first same-named value, which is "true" only when checked. */}
          <input type="hidden" name="is_active" value="false" />
          <label htmlFor="is_active" className="text-sm font-medium text-ink">
            Visible on website
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="photo" className="text-sm font-medium text-ink">
          Photo (optional)
        </label>
        <div className="mt-2 flex items-center gap-4">
          {photoPreview ? (
            // Local/blob preview URLs aren't valid next/image sources.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoPreview}
              alt="Preview"
              className="h-16 w-16 rounded-full border border-black/10 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-muted text-xs text-ink-soft">
              No photo
            </div>
          )}
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setPhotoPreview(URL.createObjectURL(file));
            }}
            className="text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-500"
          />
        </div>
        <p className="mt-1 text-xs text-ink-soft">JPEG, PNG, or WEBP, up to 5MB.</p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
