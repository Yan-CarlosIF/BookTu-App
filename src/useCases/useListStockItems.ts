import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { StockItem } from "../shared/types/stockItem";

interface IResponse {
  data: StockItem[];
  total: number;
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
  });
}
