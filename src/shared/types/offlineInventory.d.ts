import { OfflineInventoryBook } from "./offlineInventoryBook";

export type OfflineInventoryError = {
  id: string;
  type: "book" | "establishment";
};

export type OfflineInventory = {
  temporary_id: string;
  total_quantity: number;
  establishment_id: string;
  establishment: Establishment;
  status: "unprocessed";
  books: OfflineInventoryBook[];
  errors: OfflineInventoryError[];
};
