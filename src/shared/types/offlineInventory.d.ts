export type OfflineInventory = {
  temporary_id: string;
  total_quantity: number;
  establishment_id: string;
  establishment: Establishment;
  status: "unprocessed";
  books: {
    book_id: string;
    book: Book;
    quantity: number;
  }[];
  errors: string[];
};
