import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Establishment } from "../shared/types/establishment";

export function useGetAllEstablishments() {
  return useQuery({
    queryKey: ["establishments"],
    queryFn: async () => {
      const { data } = await api.get<Establishment[]>("/establishments/all");

      return data;
    },
  });
}
