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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { InvitationContent } from "@/lib/schemas/invitationContent"

export function Step7Rsvp() {
  const form = useFormContext<InvitationContent>()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-medium text-foreground">RSVP</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Configure how guests respond to the invitation.
        </p>
      </div>

      <FormField
        control={form.control}
        name="rsvpMode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RSVP mode</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="guest-list">Guest List (named invites)</SelectItem>
                <SelectItem value="open">Open (link)</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Guest List: named invites per recipient. Open: anyone with the link can RSVP.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rsvpDeadline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>RSVP deadline</FormLabel>
            <FormControl>
              <Input type="date" {...field} value={field.value ?? ""} />
            </FormControl>
            <FormDescription>Optional. Guests see when to respond by.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="maxGuests"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maximum guests (optional)</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                placeholder="Leave empty for no limit"
                {...field}
                value={field.value ?? ""}
                onChange={(e) => {
                  const v = e.target.value
                  field.onChange(v === "" ? undefined : parseInt(v, 10))
                }}
              />
            </FormControl>
            <FormDescription>Total capacity. Leave empty for no limit.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="maxGuestsPerInvitee"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Max guests per invitee</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={0}
                {...field}
                value={field.value ?? 0}
                onChange={(e) => field.onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
              />
            </FormControl>
            <FormDescription>How many extra guests each invitee can bring. 0 = no extras.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rsvpMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Custom RSVP message</FormLabel>
            <FormControl>
              <Textarea
                placeholder="e.g. Please let us know if you can make it!"
                className="min-h-[80px] resize-y"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormDescription>Message shown above the RSVP buttons.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
