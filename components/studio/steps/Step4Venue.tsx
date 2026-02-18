"use client"

import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import type { InvitationContent } from "@/lib/schemas/invitationContent"

export function Step4Venue() {
  const form = useFormContext<InvitationContent>()
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium text-foreground">Venue</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Set the event location and map links so guests can navigate easily.
        </p>
      </div>

      <FormField
        control={form.control}
        name="venueName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue Name</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. The Grand Pavilion, Dewan Sri Pinang"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Full address of the venue"
                className="min-h-[80px] resize-y"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription>Full street address for the venue</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="googleMapsLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Google Maps Link</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://maps.google.com/..."
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription>Paste the share link from Google Maps</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="wazeLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Waze Link</FormLabel>
            <FormControl>
              <Input
                type="url"
                placeholder="https://waze.com/ul/..."
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription>Paste the share link from Waze</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
