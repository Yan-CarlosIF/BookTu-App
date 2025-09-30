import { useQuery } from "@tanstack/react-query";

import { api } from "../../lib/api";
import { Inventory } from "../../shared/types/inventory";
import { InventoryBook } from "../../shared/types/inventoryBook";

type Response = Inventory & {
  books: InventoryBook[];
};

export function useGetInventory(inventoryId: string) {
  return useQuery({
    queryKey: ["inventoryBooks", inventoryId],
    queryFn: async () => {
      const { data } = await api.get<Response>(`inventories/${inventoryId}`);

      return data;
    },
    enabled: !!inventoryId,
  });
}
