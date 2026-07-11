import { ADMIN_TOKEN_KEY } from "@/lib/admin/config";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function storeToken(token: string): void {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}
