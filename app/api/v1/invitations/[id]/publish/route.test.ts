import { describe, it, expect, vi, beforeEach } from "vitest"
import { POST } from "./route"

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

describe("POST /api/v1/invitations/[id]/publish", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const res = await POST(new Request("http://localhost/api/v1/invitations/inv-1/publish"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Unauthorized")
  })

  it("returns 404 when invitation not found", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
          }),
        }),
      }),
    } as any)

    const res = await POST(new Request("http://localhost/api/v1/invitations/inv-1/publish"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Invitation not found")
  })

  it("returns 403 when user does not own invitation", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "other-user" } as any)
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "inv-1", user_id: "user-1", status: "draft", slug: null },
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const res = await POST(new Request("http://localhost/api/v1/invitations/inv-1/publish"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Forbidden")
  })

  it("returns existing data when already published", async () => {
    const existing = { id: "inv-1", user_id: "user-1", status: "published", slug: "existing-slug" }
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: existing, error: null }),
          }),
        }),
      }),
    } as any)

    const res = await POST(new Request("http://localhost/api/v1/invitations/inv-1/publish"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty("message", "Already published")
    expect(json).toHaveProperty("slug", "existing-slug")
  })

  it("publishes draft and returns updated invitation with slug", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)

    const updated = {
      id: "inv-1",
      user_id: "user-1",
      status: "published",
      slug: "inv-abc123xyz",
      content: {},
    }

    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "inv-1", user_id: "user-1", status: "draft", slug: null },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: updated, error: null }),
            }),
          }),
        }),
      }),
    } as any)

    const res = await POST(new Request("http://localhost/api/v1/invitations/inv-1/publish"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty("status", "published")
    expect(json).toHaveProperty("slug")
  })

  it("returns 409 on slug conflict", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)

    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "inv-1", user_id: "user-1", status: "draft", slug: null },
              error: null,
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({
                data: null,
                error: { code: "23505", message: "duplicate key" },
              }),
            }),
          }),
        }),
      }),
    } as any)

    const res = await POST(new Request("http://localhost/api/v1/invitations/inv-1/publish"), {
      params: Promise.resolve({ id: "inv-1" }),
    })

    expect(res.status).toBe(409)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Slug conflict, please retry")
  })
})
