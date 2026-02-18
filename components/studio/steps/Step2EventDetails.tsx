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
import { Checkbox } from "@/components/ui/checkbox"
import type { InvitationContent } from "@/lib/schemas/invitationContent"

export function Step2EventDetails() {
  return (
    <div className="flex flex-col gap-6">
      <FormField
        name="eventType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Type</FormLabel>
            <FormControl>
              <Input
                placeholder='e.g. Wedding Ceremony, Birthday'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="invitationTitle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invitation Title *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Sayf Turns One!, We're Getting Married"
                {...field}
              />
            </FormControl>
            <FormDescription>Main headline shown on the invitation</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="hostNames"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Names (optional)</FormLabel>
            <FormControl>
              <Input
                placeholder='e.g. Adam & Hawa, Bride & Groom names'
                {...field}
              />
            </FormControl>
            <FormDescription>Shown after the title, e.g. bride and groom names</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="shortGreeting"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Greeting / Heading (optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. You're Invited, Join us to celebrate"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="eventDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="includeHijriDate"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start gap-3 rounded-lg border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-0.5">
              <FormLabel className="text-base">Add equivalent Hijri date</FormLabel>
              <FormDescription>
                Show the Islamic calendar date alongside the Gregorian date
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  )
}
