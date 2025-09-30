import { useInfiniteQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";
import { Book } from "../../shared/types/book";

interface IResponse {
  books: Book[];
  total: number;
  page: number;
  lastPage: number;
}

export function useListBooks(sort?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: ["books", sort, search],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<IResponse>("/books", {
        params: { page: pageParam, sort, search },
      });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.lastPage ? lastPage.page + 1 : undefined;
    },
  });
}
