import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  id: string;
  name: string;
  email: string;
};

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: (data) =>
      apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}
