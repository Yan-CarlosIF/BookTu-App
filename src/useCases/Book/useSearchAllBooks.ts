import { useQuery } from "@tanstack/react-query";

import { useNetInfo } from "@/src/hooks/useNetInfo";

import { api } from "../../lib/api";
import { Book } from "../../shared/types/book";

export function useSearchAllBooks(search: string) {
  const { isConnected } = useNetInfo();

  const hasConnectionWithInternet = isConnected ?? false;

  const isEnabled = !!search && hasConnectionWithInternet;

  return useQuery({
    queryKey: ["books", search],
    queryFn: async () => {
      const { data } = await api.get<Book[]>("/books/all", {
        params: { search },
      });

      return data;
    },
    enabled: isEnabled,
  });
}
