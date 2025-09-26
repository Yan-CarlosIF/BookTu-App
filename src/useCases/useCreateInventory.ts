import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useToast } from "../hooks/useToast";
import { AxiosError } from "axios";
import { useNavigation } from "@react-navigation/native";
import { AppNavigatorRoutesProps } from "../routes/AppRoutes";

interface IRequest {
  establishment_id: string;
  total_quantity: number;
  inventoryBooks: { book_id?: string; quantity?: number }[];
}

export function useCreateInventory() {
  const { navigate } = useNavigation<AppNavigatorRoutesProps>();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: async (data: IRequest) => {
      const { data: response } = await api.post("/inventories", data);

      return response;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });

      toast.show({
        message: "Inventário criado com sucesso",
        variant: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate("inventories");
    },

    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error);
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Erro ao criar inventário";

      toast.show({
        message: status === 500 ? "Erro ao criar inventário" : message,
        variant: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });
}
