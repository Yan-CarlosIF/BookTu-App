import { Book } from "./book";
import { Stock } from "./stock";

export type StockItem = {
  id: string;
  book: Book;
  stock: Stock;
  stock_id: string;
  book_id: string;
  quantity: number;
};
