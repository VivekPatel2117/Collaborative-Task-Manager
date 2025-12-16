import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/auth.service";

export const useAuth = () => {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000, // cache for 5 mins
  });
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
  };
};
