import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "@/src/hooks/useToast";
import { api } from "@/src/lib/api";

interface IRequest {
  establishment_id: string;
  total_quantity: number;
  inventoryBooks: { book_id: string; quantity: number }[];
}

export type SyncInventoryResponse = {
  errors: {
    id: string;
    type: "book" | "establishment";
  }[];
  wasCreated: boolean;
  message: string;
};

export function useSyncOfflineInventories() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async ({
      establishment_id,
      inventoryBooks,
      total_quantity,
    }: IRequest) => {
      try {
        const { data } = await api.post<SyncInventoryResponse>(
          "/inventories/sync",
          { establishment_id, inventoryBooks, total_quantity },
        );

        return data;
      } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
          return error.response.data as SyncInventoryResponse;
        }

        throw error;
      }
    },

    onSuccess: (data) => {
      if (data.wasCreated) {
        queryClient.invalidateQueries({ queryKey: ["inventories"] });

        toast.show({
          message: "Inventários sincronizados com sucesso",
          variant: "success",
          duration: 3000,
        });
      }
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const status = error.response?.status;
      const message =
        error.response?.data.message || "Erro ao sincronizar inventários";

      toast.show({
        message: status === 500 ? "Erro ao sincronizar inventários" : message,
        variant: "error",
        duration: 3000,
      });
    },
  });
}
