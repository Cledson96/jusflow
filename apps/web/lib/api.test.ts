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

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("http://localhost:4000/api/cases");

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("x-organization-id")).toBe("org_demo_jurisflow");
    expect(headers.get("x-user-id")).toBe("dev-user");
  });
});
