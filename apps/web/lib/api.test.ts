import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./api";

describe("apiFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("sends the demo organization header when no public env override is present", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true })
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/cases");

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/cases",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-organization-id": "org_demo_jurisflow"
        })
      })
    );
  });
});
