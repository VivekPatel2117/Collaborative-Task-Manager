import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";

export const getUsers = () =>
  apiFetch<User[]>("/api/users"); // backend must expose this
