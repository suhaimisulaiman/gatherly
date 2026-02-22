import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

import { createClient } from "@/lib/supabase/server"

const mockCreateClient = vi.mocked(createClient)

describe("GET /api/v1/invitations/slug/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 400 when slug is empty", async () => {
    const res = await GET(new Request("http://localhost/api/v1/invitations/slug/"), {
      params: Promise.resolve({ slug: "" }),
    })
    expect(res.status).toBe(400)
  })

  it("returns 404 when invitation not found", async () => {
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
            }),
          }),
        }),
      }),
    } as any)

    const res = await GET(new Request("http://localhost/api/v1/invitations/slug/abc123"), {
      params: Promise.resolve({ slug: "abc123" }),
    })
    expect(res.status).toBe(404)
  })

  it("returns invitation when found and published", async () => {
    const invitation = {
      id: "inv-1",
      slug: "abc123",
      status: "published",
      template_id: "elegant-rose",
      content: { invitationTitle: "Wedding" },
    }
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: invitation, error: null }),
            }),
          }),
        }),
      }),
    } as any)

    const res = await GET(new Request("http://localhost/api/v1/invitations/slug/abc123"), {
      params: Promise.resolve({ slug: "abc123" }),
    })
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual(invitation)
  })
})
