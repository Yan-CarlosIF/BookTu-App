import { useQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";
import { Book } from "../../shared/types/book";

export function useGetBook(bookId: string) {
  return useQuery({
    queryKey: ["book", bookId],
    queryFn: async () => {
      const { data } = await api.get<Book>(`books/${bookId}`);

      return data;
    },
  });
}
