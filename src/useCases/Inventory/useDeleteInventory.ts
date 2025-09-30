import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { useToast } from "../../hooks/useToast";
import { api } from "../../lib/api";

export function useDeleteInventory() {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: response } = await api.delete(`/inventories/${id}`);

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });

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
