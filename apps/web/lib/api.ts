const API_URL = normalizeApiUrl(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000");
const DEV_ORG_ID = process.env.NEXT_PUBLIC_DEV_ORGANIZATION_ID ?? "org_demo_jurisflow";
const AUTH_ENABLED = process.env.NEXT_PUBLIC_AUTH_MODE === "authjs";

function normalizeApiUrl(value: string) {
  const trimmed = value.replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

export type ApiRequestContext = {
  accessToken?: string | null;
  userEmail?: string | null;
  organizationId?: string | null;
};

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
  context?: ApiRequestContext
): Promise<T> {
  const headers = new Headers(init?.headers ?? {});

  if (!headers.has("content-type") && init?.body && !(init.body instanceof FormData)) {
    headers.set("content-type", "application/json");
  }

  if (context?.accessToken) {
    headers.set("authorization", `Bearer ${context.accessToken}`);
  }

  if (context?.userEmail) {
    headers.set("x-user-email", context.userEmail);
  }

  if (context?.organizationId) {
    headers.set("x-organization-id", context.organizationId);
  }

  if (!AUTH_ENABLED) {
    headers.set("x-user-id", "dev-user");
    headers.set("x-user-email", "demo@jurisflow.local");
    headers.set("x-organization-id", context?.organizationId ?? DEV_ORG_ID);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`API ${response.status}: ${await response.text()}`);
  }
  return response.json() as Promise<T>;
}
