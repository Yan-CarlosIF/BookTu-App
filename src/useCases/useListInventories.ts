import { useInfiniteQuery } from "@tanstack/react-query";
import { Inventory } from "../shared/types/inventory";
import { api } from "../lib/api";

interface IResponse {
  data: Inventory[];
  total: number;
  page: number;
  lastPage: number;
}

export function useListInventories(sort?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: ["inventories", sort, search],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<IResponse>("/inventories", {
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
