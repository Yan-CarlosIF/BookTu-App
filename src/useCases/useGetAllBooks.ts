import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Book } from "../shared/types/book";

export function useGetAllBooks(search: string) {
  return useQuery({
    queryKey: ["books", search],
    queryFn: async () => {
      const { data } = await api.get<Book[]>("/books/all", {
        params: { search },
      });

      return data;
    },
    enabled: !!search,
  });
}
