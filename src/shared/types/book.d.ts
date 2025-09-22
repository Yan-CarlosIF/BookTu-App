export type Book = {
  id: string;
  identifier: string;
  title: string;
  author: string;
  price: number;
  release_year: number;
  description?: string;
  categories: {
    id: string;
    name: string;
  }[];
};
