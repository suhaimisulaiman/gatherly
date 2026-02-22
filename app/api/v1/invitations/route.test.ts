import { describe, it, expect, vi, beforeEach } from "vitest"
import { GET, POST } from "./route"

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

describe("GET /api/v1/invitations", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null)
    const res = await GET(new Request("http://localhost/api/v1/invitations"))
    expect(res.status).toBe(401)
  })

  it("returns list of invitations when authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)
    const list = [
      { id: "inv-1", template_id: "elegant-rose", content: {}, status: "draft", slug: null, created_at: "", updated_at: "" },
    ]
    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: list, error: null }),
          }),
        }),
      }),
    } as any)
    const res = await GET(new Request("http://localhost/api/v1/invitations"))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(Array.isArray(json)).toBe(true)
    expect(json).toHaveLength(1)
    expect(json[0]).toHaveProperty("id", "inv-1")
  })
})

describe("POST /api/v1/invitations", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 401 when not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null)

    const res = await POST(
      new Request("http://localhost/api/v1/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: "elegant-rose", content: { invitationTitle: "Test" } }),
      })
    )

    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Unauthorized")
  })

  it("returns 400 for invalid JSON body", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1", email: "a@b.com" } as any)

    const res = await POST(
      new Request("http://localhost/api/v1/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "invalid json",
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Invalid JSON")
  })

  it("creates invitation when authenticated and valid body", async () => {
    const mockUser = { id: "user-1", email: "a@b.com" }
    mockGetCurrentUser.mockResolvedValue(mockUser as any)

    const createdData = {
      id: "inv-123",
      user_id: "user-1",
      template_id: "elegant-rose",
      content: { invitationTitle: "Wedding" },
      status: "draft",
    }

    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
          }),
        }),
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: createdData, error: null }),
          }),
        }),
      }),
    } as any)

    const res = await POST(
      new Request("http://localhost/api/v1/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template_id: "elegant-rose",
          content: { invitationTitle: "Wedding", hostNames: "A & B" },
        }),
      })
    )

    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toHaveProperty("id", "inv-123")
    expect(json).toHaveProperty("status", "draft")
  })

  it("returns 404 when updating non-existent invitation", async () => {
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

    const res = await POST(
      new Request("http://localhost/api/v1/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "inv-nonexistent",
          template_id: "elegant-rose",
          content: { invitationTitle: "Test" },
        }),
      })
    )

    expect(res.status).toBe(404)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Invitation not found")
  })

  it("returns 403 when updating invitation owned by another user", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)

    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "inv-1", user_id: "other-user", status: "draft" },
              error: null,
                }),
          }),
        }),
      }),
    } as any)

    const res = await POST(
      new Request("http://localhost/api/v1/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "inv-1",
          template_id: "elegant-rose",
          content: { invitationTitle: "Test" },
        }),
      })
    )

    expect(res.status).toBe(403)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Forbidden")
  })

  it("returns 400 when trying to edit published invitation", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: "user-1" } as any)

    mockCreateClient.mockResolvedValue({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { id: "inv-1", user_id: "user-1", status: "published" },
              error: null,
            }),
          }),
        }),
      }),
    } as any)

    const res = await POST(
      new Request("http://localhost/api/v1/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "inv-1",
          template_id: "elegant-rose",
          content: { invitationTitle: "Test" },
        }),
      })
    )

    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json).toHaveProperty("error", "Cannot edit published invitation")
  })
})
