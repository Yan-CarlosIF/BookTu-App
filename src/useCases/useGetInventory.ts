import { useQuery } from "@tanstack/react-query";
import { InventoryBook } from "../shared/types/inventoryBook";
import { api } from "../lib/api";
import { Inventory } from "../shared/types/inventory";



export function useGetInventory(inventoryId: string) {
  return useQuery({
    queryKey: ["inventoryBooks", inventoryId],
    queryFn: async () => {
      const { data } = await api.get<IResponse>(`inventories/${inventoryId}`);

      return data;
    },
    enabled: !!inventoryId,
  });
}
