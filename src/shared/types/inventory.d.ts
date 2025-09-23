import { Establishment } from "./establishment";

export type Inventory = {
  id: string;
  identifier: number;
  total_quantity: number;
  establishment_id: string;
  establishment: Establishment;
  status: "unprocessed" | "processed";
};
