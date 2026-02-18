"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import type { InvitationContent } from "@/lib/schemas/invitationContent"

export function Step6Wishes() {
  const form = useFormContext<InvitationContent>()
  const enableWishes = form.watch("enableWishes") ?? true
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "featuredWishes",
  })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium text-foreground">Wishes</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Let guests post wishes or messages. You can add sample wishes for the preview.
        </p>
      </div>

      <FormField
        control={form.control}
        name="enableWishes"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable wishes section</FormLabel>
              <p className="text-xs text-muted-foreground">
                Guests can post wishes on the invitation
              </p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {enableWishes && (
        <>
          <div>
            <h4 className="text-xs font-medium text-foreground">Featured wishes (optional)</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Sample wishes to show in the preview. Guests can still add their own.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-2 rounded-lg border border-border p-4">
                <div className="flex items-end gap-2">
                  <FormField
                    control={form.control}
                    name={`featuredWishes.${index}.name`}
                    render={({ field: f }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-xs">Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Guest name" {...f} value={f.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                    aria-label="Remove wish"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name={`featuredWishes.${index}.message`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Message</FormLabel>
                      <FormControl>
                        <Input placeholder="Wish message" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit gap-1.5"
            onClick={() => append({ name: "", message: "", id: crypto.randomUUID() })}
          >
            <Plus className="size-4" />
            Add featured wish
          </Button>
        </>
      )}
    </div>
  )
}
