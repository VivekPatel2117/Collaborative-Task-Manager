import { apiFetch } from "@/lib/api";

export interface Profile {
  id: string;
  name: string;
  email: string;
}

export const getProfile = () =>
  apiFetch<Profile>("/auth/me");

export const updateProfile = (data: {
  name: string;
  email: string;
}) =>
  apiFetch<Profile>("/api/users/me", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
