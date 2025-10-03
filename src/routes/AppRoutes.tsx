import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";

import { BookDetails } from "../screens/BookDetails";
import { Books } from "../screens/Books";
import { Home } from "../screens/Home";
import { Inventories } from "../screens/Inventories";
import { InventoryActions } from "../screens/InventoryActions";
import { InventoryDetailScreen } from "../screens/InventoryDetails";
import { Stock } from "../screens/Stock";
import { Inventory } from "../shared/types/inventory";
import { OfflineInventory } from "../shared/types/offlineInventory";

type AppRoutesType = {
  home: undefined;
  books: undefined;
  bookDetails: {
    bookId: string;
  };
  stock: undefined;
  inventories: undefined;
  inventoryDetails: {
    inventory: Inventory | OfflineInventory;
    isOffline: boolean;
  };
  inventoryActions: {
    inventoryId?: string;
    inventory?: Inventory;
    offlineInventory?: OfflineInventory;
  };
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutesType>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutesType>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="books" component={Books} />
      <Screen name="bookDetails" component={BookDetails} />
      <Screen name="stock" component={Stock} />
      <Screen name="inventories" component={Inventories} />
      <Screen name="inventoryDetails" component={InventoryDetailScreen} />
      <Screen name="inventoryActions" component={InventoryActions} />
    </Navigator>
  );
}
