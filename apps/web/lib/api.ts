const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const DEV_ORG_ID = process.env.NEXT_PUBLIC_DEV_ORGANIZATION_ID ?? "";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      "x-user-id": "dev-user",
      "x-user-email": "demo@jurisflow.local",
      ...(DEV_ORG_ID ? { "x-organization-id": DEV_ORG_ID } : {}),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}
