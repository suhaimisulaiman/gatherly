"use client"

import { useRef } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash2 } from "lucide-react"
import type { InvitationContent } from "@/lib/schemas/invitationContent"
import { resizeAndCompressImage } from "@/lib/imageUtils"

const MAX_PHOTOS = 20

export function Step5Gallery() {
  const form = useFormContext<InvitationContent>()
  const photos = form.watch("galleryPhotos") ?? []
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remaining = MAX_PHOTOS - photos.length
    if (remaining <= 0) return

    const toAdd = Math.min(remaining, files.length)
    const newPhotos: string[] = []

    for (let i = 0; i < toAdd; i++) {
      const file = files[i]
      if (!file?.type.startsWith("image/")) continue
      try {
        const dataUrl = await resizeAndCompressImage(file)
        newPhotos.push(dataUrl)
      } catch {
        // Skip failed images
      }
    }

    if (newPhotos.length > 0) {
      form.setValue("galleryPhotos", [...photos, ...newPhotos], { shouldDirty: true })
    }

    e.target.value = ""
  }

  const removePhoto = (index: number) => {
    const next = photos.filter((_, i) => i !== index)
    form.setValue("galleryPhotos", next, { shouldDirty: true })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium text-foreground">Photo Gallery</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add up to {MAX_PHOTOS} photos. Images are resized to keep the draft manageable.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {photos.map((src, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`Gallery ${index + 1}`} className="size-full object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100"
              aria-label="Remove photo"
            >
              <Trash2 className="size-3" />
            </button>
          </div>
        ))}
        {photos.length < MAX_PHOTOS && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border bg-muted/50 text-muted-foreground transition-colors hover:border-muted-foreground/30 hover:bg-muted/80"
          >
            <ImagePlus className="size-6" />
            <span className="text-[10px]">Add</span>
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        {photos.length} / {MAX_PHOTOS} photos
      </p>
    </div>
  )
}
