import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET } from "./route"

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}))

import { getCurrentUser } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"

const mockGetCurrentUser = vi.mocked(getCurrentUser)
const mockCreateClient = vi.mocked(createClient)

describe("GET /api/v1/invitations/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 404 when invitation not found", async () => {
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    } as any)

    const res = await GET(new Request("http://localhost/api/v1/invitations/inv-1"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Invitation not found")
  })

  it("returns 403 for draft when not owned by user", async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "inv-1", user_id: "user-1", status: "draft", content: {} },
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const res = await GET(new Request("http://localhost/api/v1/invitations/inv-1"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Forbidden")
  })

  it("returns 403 for draft when user is different owner", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "other-user" } as any)
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "inv-1", user_id: "user-1", status: "draft", content: {} },
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const res = await GET(new Request("http://localhost/api/v1/invitations/inv-1"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(403)
  })

  it("returns invitation when published (public access)", async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    const invitation = { id: "inv-1", user_id: "user-1", status: "published", slug: "abc123", content: {} }
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: invitation, error: null }),
          }),
        }),
      }),
    } as any)

    const res = await GET(new Request("http://localhost/api/v1/invitations/inv-1"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual(invitation)
  })

  it("returns invitation when user owns draft", async () => {
    const invitation = { id: "inv-1", user_id: "user-1", status: "draft", content: {} }
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: invitation, error: null }),
          }),
        }),
      }),
    } as any)

    const res = await GET(new Request("http://localhost/api/v1/invitations/inv-1"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual(invitation)
  })
})
