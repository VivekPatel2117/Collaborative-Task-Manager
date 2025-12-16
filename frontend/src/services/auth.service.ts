import {apiFetch} from "@/lib/api";

export const getMe = async () => {
  const res = await apiFetch<any>("/auth/me");
  return res;
};
