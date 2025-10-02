import AsyncStorage from "@react-native-async-storage/async-storage";

import { Book } from "../shared/types/book";
import { OfflineInventory } from "../shared/types/offlineInventory";
import { storageGetEstablishment } from "./StorageBooksAndEstablishments";
import { OFFLINE_INVENTORIES_STORAGE } from "./StorageConfig";

type CreateOfflineInventorySchema = {
  total_quantity: number;
  establishment_id: string;
  books: {
    book_id: string;
    book: Book;
    quantity: number;
  }[];
};

async function storageGetOfflineInventories() {
  const data = await AsyncStorage.getItem(OFFLINE_INVENTORIES_STORAGE);

  if (!data) return [];

  const inventories = JSON.parse(data) as OfflineInventory[];

  return inventories;
}

async function storageSetOfflineInventories({
  books,
  establishment_id,
  total_quantity,
}: CreateOfflineInventorySchema) {
  const inventories = await storageGetOfflineInventories();

  const establishment = await storageGetEstablishment(establishment_id);

  const newInventory: OfflineInventory = {
    temporary_id: Date.now().toString(),
    books: books.map((book) => ({
      book_id: book.book_id,
      book: book.book,
      quantity: book.quantity,
    })),
    status: "unprocessed",
    establishment,
    establishment_id,
    total_quantity,
    errors: [],
  };

  const newInventories = [...inventories, newInventory];

  await AsyncStorage.setItem(
    OFFLINE_INVENTORIES_STORAGE,
    JSON.stringify(newInventories),
  );
}

async function storageClearOfflineInventories() {
  await AsyncStorage.removeItem(OFFLINE_INVENTORIES_STORAGE);
}

async function storageRemoveOfflineInventory(id: string) {
  const inventories = await storageGetOfflineInventories();

  const newInventories = inventories.filter(
    (inventory) => inventory.temporary_id !== id,
  );

  await AsyncStorage.setItem(
    OFFLINE_INVENTORIES_STORAGE,
    JSON.stringify(newInventories),
  );
}

export {
  storageGetOfflineInventories,
  storageSetOfflineInventories,
  storageClearOfflineInventories,
  storageRemoveOfflineInventory,
};
