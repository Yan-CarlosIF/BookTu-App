import { useInfiniteQuery } from "@tanstack/react-query";

import { api } from "@/src/lib/api";
import { InventoryBook } from "@/src/shared/types/inventoryBook";

interface IResponse {
  books: InventoryBook[];
  total: number;
  page: number;
  lastPage: number;
}

export function useListInventoryBooks(inventoryId?: string) {
  return useInfiniteQuery({
    queryKey: ["inventoryBooks", inventoryId],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<IResponse>(`inventories/${inventoryId}`, {
        params: { page: pageParam },
      });

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.lastPage ? lastPage.page + 1 : undefined;
    },
    select: (data) => {
      const allItems = data.pages.flatMap((page) => page.books);
      const total = data.pages.flatMap((page) => page.books).length;
      return {
        items: allItems,
        total,
        pageParams: data.pageParams,
      };
    },
    enabled: !!inventoryId,
  });
}
