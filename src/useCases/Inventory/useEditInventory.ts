import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "../../hooks/useToast";
import { api } from "../../lib/api";

interface IRequest {
  id: string;
  establishment_id: string;
  inventoryBooks: { book_id?: string; quantity?: number }[];
}

export function useEditInventory() {
  const toast = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, establishment_id, inventoryBooks }: IRequest) => {
      const { data: response } = await api.put(`/inventories/${id}`, {
        establishment_id,
        inventoryBooks: [...inventoryBooks],
      });

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });

      toast.show({
        message: "Inventário editado com sucesso",
        variant: "success",
        duration: 3000,
      });
    },

    onError: (error: AxiosError<{ message: string }>) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Erro ao editar inventário";

      toast.show({
        message: status === 500 ? "Erro ao editar inventário" : message,
        variant: "error",
        duration: 3000,
      });
    },
  });
}
