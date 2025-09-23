import { Establishment } from "./establishment";

export type Stock = {
  id: string;
  establishment_id: string;
  establishment: Establishment;
};
