import { useInfiniteQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";
import { Inventory } from "../../shared/types/inventory";

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
        params: { page: pageParam, establishmentId: sort, search },
      });

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.lastPage ? lastPage.page + 1 : undefined;
    },
  });
}
