"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from "react";
import Image from "next/image";
import {
  fetchAdminTeam,
  type ProjectRecord,
  type TeamMember,
} from "@/lib/admin/api";

type StagedImage = {
  file: File;
  previewUrl: string;
};

export function ProjectForm({
  initial,
  onSubmit,
  submitLabel,
}: {
  initial?: ProjectRecord;
  onSubmit: (formData: FormData) => Promise<void>;
  submitLabel: string;
}) {
  const isEdit = Boolean(initial);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [removedKeys, setRemovedKeys] = useState<Set<string>>(new Set());

  const [areas, setAreas] = useState<string[]>(initial?.areas ?? []);
  const [areaInput, setAreaInput] = useState("");

  const [team, setTeam] = useState<TeamMember[] | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<Set<string>>(
    new Set(initial?.team_member_ids ?? [])
  );

  useEffect(() => {
    fetchAdminTeam()
      .then(setTeam)
      .catch(() => setTeam([]));
  }, []);

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    setStagedImages((current) => [
      ...current,
      ...files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) })),
    ]);
    // Reset so selecting the same file again still fires onChange.
    event.target.value = "";
  }

  function removeStagedImage(index: number) {
    setStagedImages((current) => current.filter((_, i) => i !== index));
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

  function addArea() {
    const value = areaInput.trim();
    if (value && !areas.includes(value)) {
      setAreas((current) => [...current, value]);
    }
    setAreaInput("");
  }

  function handleAreaKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addArea();
    }
  }

  function removeArea(area: string) {
    setAreas((current) => current.filter((a) => a !== area));
  }

  function toggleMember(id: string) {
    setSelectedMemberIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    for (const area of areas) {
      formData.append("areas", area);
    }
    for (const id of selectedMemberIds) {
      formData.append("team_member_ids", id);
    }

    // The file input has no `name`, so files are staged in state (to support
    // per-file preview/removal before submit) and appended here individually —
    // a single native FormData file field can't represent that.
    const imageField = isEdit ? "new_images" : "images";
    for (const staged of stagedImages) {
      formData.append(imageField, staged.file);
    }
    if (isEdit) {
      for (const key of removedKeys) {
        formData.append("remove_image_keys", key);
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

  const remainingExistingImages =
    initial?.images.filter((image) => !removedKeys.has(image.key)) ?? [];

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
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={6}
          required
          defaultValue={initial?.description ?? ""}
          className="mt-1.5 w-full resize-none rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
        />
      </div>

      <div>
        <label htmlFor="youtube_url" className="text-sm font-medium text-ink">
          YouTube Video Link (optional)
        </label>
        <input
          id="youtube_url"
          name="youtube_url"
          type="url"
          placeholder="https://youtu.be/..."
          defaultValue={initial?.youtube_url ?? ""}
          className="mt-1.5 w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm text-ink outline-none focus:border-primary-500"
        />
        {isEdit ? (
          <p className="mt-1 text-xs text-ink-soft">
            Clear this field to remove the video from the project.
          </p>
        ) : null}
      </div>

      <div>
        <p className="text-sm font-medium text-ink">Focus Areas</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {areas.map((area) => (
            <span
              key={area}
              className="flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-500"
            >
              {area}
              <button
                type="button"
                onClick={() => removeArea(area)}
                aria-label={`Remove ${area}`}
                className="text-primary-500 hover:text-primary-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            value={areaInput}
            onChange={(event) => setAreaInput(event.target.value)}
            onKeyDown={handleAreaKeyDown}
            placeholder="e.g. Healthcare"
            className="flex-1 rounded-lg border border-black/10 px-4 py-2 text-sm text-ink outline-none focus:border-primary-500"
          />
          <button
            type="button"
            onClick={addArea}
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-ink hover:bg-paper-muted"
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-ink">Team Members</p>
        {team === null ? (
          <p className="mt-2 text-sm text-ink-soft">Loading team…</p>
        ) : team.length === 0 ? (
          <p className="mt-2 text-sm text-ink-soft">No team members yet.</p>
        ) : (
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {team.map((member) => (
              <label
                key={member._id}
                className="flex items-center gap-3 rounded-lg border border-black/10 px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={selectedMemberIds.has(member._id)}
                  onChange={() => toggleMember(member._id)}
                  className="h-4 w-4 rounded border-black/20 text-primary-500 focus:ring-primary-500"
                />
                {member.photo_url ? (
                  <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full">
                    <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-500">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span>
                  <span className="block font-medium text-ink">{member.name}</span>
                  <span className="block text-xs text-ink-soft">{member.role}</span>
                </span>
              </label>
            ))}
          </div>
        )}
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
            Lower numbers appear first among projects on the same date.
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
          <p className="text-sm font-medium text-ink">Existing Images</p>
          {initial.images.length === 0 ? (
            <p className="mt-2 text-sm text-ink-soft">No images yet.</p>
          ) : (
            <div className="mt-2 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {initial.images.map((image) => {
                const isRemoved = removedKeys.has(image.key);
                return (
                  <div key={image.key} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image.url}
                      alt=""
                      className={`h-24 w-full rounded-lg border border-black/10 object-cover ${
                        isRemoved ? "opacity-30" : ""
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => toggleRemoveExisting(image.key)}
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
            {remainingExistingImages.length} image
            {remainingExistingImages.length === 1 ? "" : "s"} will remain after saving.
          </p>
        </div>
      ) : null}

      <div>
        <label htmlFor="images" className="text-sm font-medium text-ink">
          {isEdit ? "Add Images (optional)" : "Images (optional)"}
        </label>
        <input
          id="images"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFilesSelected}
          className="mt-2 text-sm text-ink-soft file:mr-4 file:rounded-full file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-500"
        />
        <p className="mt-1 text-xs text-ink-soft">JPEG, PNG, or WEBP, up to 5MB each.</p>

        {stagedImages.length > 0 ? (
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {stagedImages.map((staged, index) => (
              <div key={staged.previewUrl} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={staged.previewUrl}
                  alt="New image preview"
                  className="h-24 w-full rounded-lg border border-black/10 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeStagedImage(index)}
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
