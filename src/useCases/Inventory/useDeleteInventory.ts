import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { Inventory } from "@/src/shared/types/inventory";

import { useToast } from "../../hooks/useToast";
import { api } from "../../lib/api";

type InventoriesResponse = {
  data: Inventory[];
  total: number;
  page: number;
  lastPage: number;
};

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: response } = await api.delete(`/inventories/${id}`);

      return response;
    },

    onSuccess: (_, id) => {
      queryClient.setQueriesData<InfiniteData<InventoriesResponse>>(
        { queryKey: ["inventories"], exact: false }, // pega todos os caches que começam com "inventories"
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: page.data.filter((inventory) => inventory.id !== id),
            })),
          };
        },
      );

      toast.show({
        message: "Inventário excluído com sucesso",
        variant: "success",
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Erro ao excluir inventário";

      toast.show({
        message: status === 500 ? "Erro ao excluir inventário" : message,
        variant: "error",
        duration: 5000,
      });
    },
  });
}
