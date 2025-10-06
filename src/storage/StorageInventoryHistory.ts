import AsyncStorage from "@react-native-async-storage/async-storage";

import { Inventory } from "../shared/types/inventory";
import { INVENTORY_HISTORY_STORAGE } from "./StorageConfig";

export type InventoryHistory = Inventory & {
  date: string;
};

async function storageGetInventoryHistory() {
  const data = await AsyncStorage.getItem(INVENTORY_HISTORY_STORAGE);

  if (!data) return [];

  const inventoryHistory = JSON.parse(data) as InventoryHistory[];

  return inventoryHistory;
}

async function storageUpdateInventoryHistory(inventory: Inventory) {
  const inventories = await storageGetInventoryHistory();

  const inventoryIndex = inventories.findIndex((i) => i.id === inventory.id);
  const isInventoryInStorage = inventoryIndex !== -1;

  if (isInventoryInStorage) {
    inventories.splice(inventoryIndex, 1);
  } else if (inventories.length >= 3) {
    inventories.pop();
  }

  const inventoryHistory: InventoryHistory = {
    ...inventory,
    date: new Date().toISOString(),
  };

  inventories.unshift(inventoryHistory);

  const data = JSON.stringify(inventories);

  await AsyncStorage.setItem(INVENTORY_HISTORY_STORAGE, data);
}

async function storageRemoveInventoryHistory(id: string) {
  const data = await storageGetInventoryHistory();

  const inventoryIndex = data.findIndex((inventory) => inventory.id === id);

  console.log("inventário achado: ", inventoryIndex !== -1);

  if (inventoryIndex === -1) return;

  data.splice(inventoryIndex, 1);

  const inventoryHistory = JSON.stringify(data);

  await AsyncStorage.setItem(INVENTORY_HISTORY_STORAGE, inventoryHistory);
}

async function storageClearInventoryHistory() {
  await AsyncStorage.removeItem(INVENTORY_HISTORY_STORAGE);
}

export {
  storageGetInventoryHistory,
  storageUpdateInventoryHistory,
  storageClearInventoryHistory,
  storageRemoveInventoryHistory,
};
