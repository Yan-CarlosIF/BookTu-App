import AsyncStorage from "@react-native-async-storage/async-storage";

import { Book } from "../shared/types/book";
import { Establishment } from "../shared/types/establishment";
import {
  BOOKS_STORAGE,
  ESTABLISHMENTS_STORAGE,
  REFETCH_TIMESTAMP,
} from "./StorageConfig";

async function storageGetRefetchTimestamp() {
  const data = await AsyncStorage.getItem(REFETCH_TIMESTAMP);

  if (!data) {
    const timestamp = Date.now();
    await storageSetRefetchTimestamp(timestamp);
    return timestamp;
  }

  return Number(data);
}

async function storageSetRefetchTimestamp(timestamp: number) {
  const data = String(timestamp);

  await AsyncStorage.setItem(REFETCH_TIMESTAMP, data);
}

async function storageSetBooks(books: Book[]) {
  const data = JSON.stringify(books);

  await AsyncStorage.setItem(BOOKS_STORAGE, data);
}

async function storageGetBooks(search?: string) {
  const data = await AsyncStorage.getItem(BOOKS_STORAGE);

  if (!data) return [];

  const books = JSON.parse(data) as Book[];

  if (!search) return books;

  return books.filter((book) =>
    book.title.toLowerCase().includes(search.toLowerCase()),
  );
}

async function storageSetEstablishments(establishments: Establishment[]) {
  const data = JSON.stringify(establishments);

  await AsyncStorage.setItem(ESTABLISHMENTS_STORAGE, data);
}

async function storageGetEstablishments(
  initialEstablishment: string | undefined,
  inventoryEstablishmentId?: string,
) {
  const data = await AsyncStorage.getItem(ESTABLISHMENTS_STORAGE);

  if (!data) return [];

  const establishmentsData = JSON.parse(data) as Establishment[];

  const establishments = establishmentsData.reduce(
    (obj, establishment) => {
      obj.push({
        label: establishment.name,
        value: establishment.id,
      });

      if (inventoryEstablishmentId === establishment.id) {
        initialEstablishment = establishment.id;
      }

      return obj;
    },
    [] as { label: string; value: string }[],
  );

  return establishments;
}

export {
  storageSetBooks,
  storageGetBooks,
  storageSetEstablishments,
  storageGetEstablishments,
  storageGetRefetchTimestamp,
  storageSetRefetchTimestamp,
};
