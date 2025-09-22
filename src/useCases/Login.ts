import { api } from "@/src/lib/api";
import { useMutation } from "@tanstack/react-query";

interface LoginSchema {
  login: string;
  password: string;
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (data: LoginSchema) => {
      const { token } = (
        await api.post<{ token: string }>("/auth/session", data)
      ).data;

      return token;
    },
  });
}
