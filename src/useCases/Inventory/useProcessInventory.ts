import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "@/src/hooks/useToast";
import { api } from "@/src/lib/api";
import { Inventory } from "@/src/shared/types/inventory";

interface InventoriesResponse {
  data: Inventory[];
  total: number;
  page: number;
  lastPage: number;
}

export function useProcessInventory() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (inventoryId: string) => {
      const { data } = await api.post(`inventories/process/${inventoryId}`);

      return data;
    },

    onSuccess: (_, inventoryId) => {
      queryClient.setQueriesData<InfiniteData<InventoriesResponse>>(
        { queryKey: ["inventories"], exact: false },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.map((inventory) => {
                if (inventory.id === inventoryId) {
                  return {
                    ...inventory,
                    status: "processed",
                  };
                }
                return inventory;
              }),
            })),
          };
        },
      );

      toast.show({
        message: "Inventário processado com sucesso",
        variant: "success",
        duration: 5000,
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const status = error.response?.status;
      const message =
        error.response?.data.message || "Erro ao processar inventário";

      toast.show({
        message: status === 500 ? "Erro ao processar inventário" : message,
        variant: "error",
        duration: 5000,
      });
    },
  });
}
