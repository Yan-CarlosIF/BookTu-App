import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { StockItem } from "../shared/types/stockItem";

interface IResponse {
  data: StockItem[];
  total: number;
  totalUnits: number;
  page: number;
  lastPage: number;
}

export function useListStocksItems(sort?: string, search?: string) {
  return useInfiniteQuery({
    queryKey: ["stockItems", sort, search],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<IResponse>("/stocks", {
        params: { page: pageParam, establishmentId: sort, search },
      });

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.lastPage ? lastPage.page + 1 : undefined;
    },
    select: (data) => {
      const allItems = data.pages.flatMap((page) => page.data);
      const total = data.pages[0]?.totalUnits ?? 0;
      return {
        items: allItems,
        total,
        pageParams: data.pageParams,
      };
    },
  });
}
