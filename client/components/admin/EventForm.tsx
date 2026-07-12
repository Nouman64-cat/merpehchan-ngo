"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import type { EventRecord } from "@/lib/admin/api";

type StagedPhoto = {
  file: File;
  previewUrl: string;
};

export function EventForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: EventRecord;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const isEdit = Boolean(initial);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stagedPhotos, setStagedPhotos] = useState<StagedPhoto[]>([]);
  const [removedKeys, setRemovedKeys] = useState<Set<string>>(new Set());

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setStagedPhotos((current) => [
      ...current,
      ...files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
    // Reset so selecting the same file again still fires onChange.
    event.target.value = "";
  }

  function removeStagedPhoto(index: number) {
    setStagedPhotos((current) => current.filter((_, i) => i !== index));
  }

  function toggleRemoveExisting(key: string) {
    setRemovedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    // The file input has no `name`, so files are staged in state (to support
    // per-file preview/removal before submit) and appended here individually —
    // a single native FormData file field can't represent that.
    const photoField = isEdit ? "new_photos" : "photos";
    for (const staged of stagedPhotos) {
      formData.append(photoField, staged.file);
    }
    if (isEdit) {
      for (const key of removedKeys) {
        formData.append("remove_photo_keys", key);
      }
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const remainingExistingPhotos =
    initial?.photos.filter((photo) => !removedKeys.has(photo.key)) ?? [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="text-sm font-medium text-ink">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={initial?.title}
            className="mt-1.5 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
          />
        </div>
        <div>
          <label htmlFor="date" className="text-sm font-medium text-ink">
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            defaultValue={initial?.date}
            className="mt-1.5 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium text-ink">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={initial?.description ?? ""}
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
            Lower numbers appear first among events on the same date.
          </p>
        </div>
        <div className="flex items-center gap-2 pt-7">
          {/* See TeamMemberForm for why this hidden input must come before
              the checkbox: Starlette's multipart parser resolves duplicate
              field names to the LAST value, unlike FormData.get(). */}
          <input type="hidden" name="is_active" value="false" />
          <input
            id="is_active"
            name="is_active"
            type="checkbox"
            value="true"
            defaultChecked={initial?.is_active ?? true}
            className="h-4 w-4 rounded border-black/20 text-primary-500 focus:ring-primary-500"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-ink">
            Visible on website
          </label>
        </div>
      </div>

      {isEdit && initial ? (
        <div>
          <p className="text-sm font-medium text-ink">Existing Photos</p>
          {initial.photos.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">No photos yet.</p>
          ) : (
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {initial.photos.map((photo) => {
                const isRemoved = removedKeys.has(photo.key);
                return (
                  <div key={photo.key} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt=""
                      className={`h-24 w-full rounded-lg border border-black/10 object-cover ${
                        isRemoved ? "opacity-30" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => toggleRemoveExisting(photo.key)}
                      className={`absolute right-1 top-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isRemoved
                          ? "bg-primary-500 text-white"
                          : "bg-white/90 text-red-600"
                      }`}
                    >
                      {isRemoved ? "Undo" : "Remove"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-1 text-xs text-ink-soft">
            {remainingExistingPhotos.length} photo
            {remainingExistingPhotos.length === 1 ? "" : "s"} will remain after saving.
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor="photos" className="text-sm font-medium text-ink">
          {isEdit ? "Add Photos (optional)" : "Photos (optional)"}
        </label>
        <input
          id="photos"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesSelected}
          className="mt-2 text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-500"
        />
        <p className="mt-1 text-xs text-ink-soft">JPEG, PNG, or WEBP, up to 5MB each.</p>

        {stagedPhotos.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {stagedPhotos.map((staged, index) => (
              <div key={staged.previewUrl} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={staged.previewUrl}
                  alt="New photo preview"
                  className="h-24 w-full rounded-lg border border-black/10 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeStagedPhoto(index)}
                  className="absolute right-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : null}
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
