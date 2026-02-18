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
import { Plus, Trash2 } from "lucide-react"
import type { InvitationContent } from "@/lib/schemas/invitationContent"

export function Step3EventAgenda() {
  const form = useFormContext<InvitationContent>()
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "eventAgenda",
  })

  const addItem = () => {
    append({ time: "", title: "", id: crypto.randomUUID() })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium text-foreground">Event Agenda</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Add the schedule for your event. Each item shows time and title in the invitation.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-lg border border-border p-4"
          >
            <div className="flex items-end gap-2">
              <FormField
                control={form.control}
                name={`eventAgenda.${index}.time`}
                render={({ field: f }) => (
                  <FormItem className="w-[100px] shrink-0">
                    <FormLabel className="text-xs">Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        {...f}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`eventAgenda.${index}.title`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-xs">Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Arrival, Ceremony, Dinner"
                        {...field}
                      />
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
                aria-label="Remove agenda item"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={addItem}
      >
        <Plus className="size-4" />
        Add agenda item
      </Button>

      {fields.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No agenda items yet. Add at least one to show the schedule on your invitation.
        </p>
      )}
    </div>
  )
}
