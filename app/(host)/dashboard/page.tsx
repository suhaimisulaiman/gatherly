"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, FileEdit, ExternalLink, Copy } from "lucide-react"
import { fetchInvitations, fetchTemplates, type Invitation, type ApiTemplate } from "@/lib/invitationApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

function InvitationTile({
  inv,
  template,
  onCopyShare,
}: {
  inv: Invitation
  template: ApiTemplate | undefined
  onCopyShare: (url: string) => void
}) {
  const content = (inv.content || {}) as { invitationTitle?: string }
  const title = content.invitationTitle?.trim() || "Untitled invitation"
  const updated = inv.updated_at
    ? new Date(inv.updated_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : ""

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="p-0">
        <div className="aspect-[4/3] relative bg-muted">
          {template?.thumbnail ? (
            <Image
              src={template.thumbnail}
              alt={template.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 280px"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              {template?.name ?? inv.template_id}
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-sm truncate">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {template?.name ?? inv.template_id} · {updated}
          </p>
          <div className="flex gap-2 mt-3">
            {inv.status === "draft" ? (
              <Button asChild size="sm" variant="default" className="flex-1 gap-1.5">
                <Link href={`/events/${inv.id}/studio`}>
                  <FileEdit className="size-3.5" />
                  Edit
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="sm" variant="default" className="flex-1 gap-1.5">
                  <a href={`/i/${inv.slug ?? ""}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-3.5" />
                    View
                  </a>
                </Button>
                {inv.slug && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5"
                    onClick={() => onCopyShare(typeof window !== "undefined" ? `${window.location.origin}/i/${inv.slug}` : `/i/${inv.slug}`)}
                  >
                    <Copy className="size-3.5" />
                    Share
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { toast } = useToast()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [templates, setTemplates] = useState<ApiTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchInvitations(), fetchTemplates()])
      .then(([invs, tpls]) => {
        setInvitations(invs)
        setTemplates(tpls)
      })
      .catch(() => toast({ title: "Could not load invitations", variant: "destructive" }))
      .finally(() => setLoading(false))
  }, [toast])

  const drafts = invitations.filter((i) => i.status === "draft")
  const published = invitations.filter((i) => i.status === "published")

  function handleCopyShare(url: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      toast({ title: "Link copied to clipboard" })
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">My Invitations</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Create and manage your digital invitations
            </p>
          </div>
          {!loading && invitations.length > 0 && (
            <Button asChild size="sm" className="gap-2 w-fit">
              <Link href="/studio">
                <Plus className="size-4" />
                Create Invitation
              </Link>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="size-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          </div>
        ) : (
          <>
            {drafts.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Drafts</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {drafts.map((inv) => (
                    <InvitationTile key={inv.id} inv={inv} template={templates.find((t) => t.id === inv.template_id)} onCopyShare={handleCopyShare} />
                  ))}
                </div>
              </section>
            )}

            {published.length > 0 && (
              <section>
                <h2 className="text-sm font-medium text-muted-foreground mb-3">Published</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {published.map((inv) => (
                    <InvitationTile key={inv.id} inv={inv} template={templates.find((t) => t.id === inv.template_id)} onCopyShare={handleCopyShare} />
                  ))}
                </div>
              </section>
            )}

            {!loading && invitations.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <p className="text-muted-foreground">No invitations yet</p>
                <Button asChild size="sm">
                  <Link href="/studio">Create your first invitation</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
