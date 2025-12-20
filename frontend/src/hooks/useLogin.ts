import { useMutation } from "@tanstack/react-query";
import { apiFetch, setAuthToken } from "@/lib/api";

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginPayload) =>
      apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    onSuccess: (data) => {
      // ✅ STORE TOKEN
      setAuthToken(data.token);

      // ✅ OPTIONAL: persist for refresh
      sessionStorage.setItem("token", data.token);
    },
  });
}
