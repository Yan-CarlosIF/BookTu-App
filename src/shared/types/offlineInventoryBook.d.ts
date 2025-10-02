import { Book } from "./book";

export type OfflineInventoryBook = {
  book_id: string;
  book: Book;
  quantity: number;
};
