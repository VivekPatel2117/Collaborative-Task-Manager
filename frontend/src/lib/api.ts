export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://collaborative-task-manager-o0c8.onrender.com";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}
