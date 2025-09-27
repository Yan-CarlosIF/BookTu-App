import { Book } from "./book";
import { Inventory } from "./inventory";

export type InventoryBook = {
  id: string;
  inventory_id: string;
  inventory: Inventory;
  book_id: string;
  book: Book;
  quantity: number;
};
