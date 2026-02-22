import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { loadGuestWishes, saveGuestWish } from "./guestWishes"

describe("guestWishes", () => {
  const eventId = "evt-1"
  let store: Record<string, string>

  beforeEach(() => {
    store = {}
    const mockStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => {
        store[key] = value
      },
      clear: () => {},
      length: 0,
      removeItem: () => {},
      key: () => null,
    }
    vi.stubGlobal("localStorage", mockStorage)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns empty array when no wishes stored", () => {
    expect(loadGuestWishes(eventId)).toEqual([])
  })

  it("saves and loads a wish with generated id", () => {
    const wish = saveGuestWish(eventId, { name: "Alice", message: "Congrats!" })
    expect(wish.id).toBeDefined()
    expect(wish.name).toBe("Alice")
    expect(wish.message).toBe("Congrats!")

    const loaded = loadGuestWishes(eventId)
    expect(loaded).toHaveLength(1)
    expect(loaded[0]).toEqual(wish)
  })

  it("filters out malformed entries", () => {
    store["wishes:evt-1"] = JSON.stringify([
      { id: "1", name: "Alice", message: "Hi" },
      { id: "2", message: "No name" },
      { id: "3", name: "Bob" },
      null,
      "string",
    ])
    const loaded = loadGuestWishes(eventId)
    expect(loaded).toHaveLength(1)
    expect(loaded[0]?.name).toBe("Alice")
    expect(loaded[0]?.message).toBe("Hi")
  })

  it("returns empty array for invalid JSON", () => {
    store["wishes:evt-1"] = "not json"
    expect(loadGuestWishes(eventId)).toEqual([])
  })

  it("returns empty array when stored value is not an array", () => {
    store["wishes:evt-1"] = JSON.stringify({})
    expect(loadGuestWishes(eventId)).toEqual([])
  })

  it("appends new wish to existing", () => {
    saveGuestWish(eventId, { name: "A", message: "1" })
    saveGuestWish(eventId, { name: "B", message: "2" })
    const loaded = loadGuestWishes(eventId)
    expect(loaded).toHaveLength(2)
    expect(loaded.map((w) => w.name)).toEqual(["A", "B"])
  })

  it("uses separate keys per event", () => {
    saveGuestWish("evt-1", { name: "A", message: "1" })
    saveGuestWish("evt-2", { name: "B", message: "2" })
    expect(loadGuestWishes("evt-1")).toHaveLength(1)
    expect(loadGuestWishes("evt-2")).toHaveLength(1)
    expect(loadGuestWishes("evt-1")[0]?.name).toBe("A")
    expect(loadGuestWishes("evt-2")[0]?.name).toBe("B")
  })
})
