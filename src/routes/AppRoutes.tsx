import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { Home } from "../screens/Home";
import { Books } from "../screens/Books";
import { BookDetails } from "../screens/BookDetails";
import { Stock } from "../screens/Stock";
import { Inventories } from "../screens/Inventories";

type AppRoutes = {
  home: undefined;
  books: undefined;
  bookDetails: {
    bookId: string;
  };
  stock: undefined;
  inventories: undefined;
};

export type AppNavigatorRoutesProps = NativeStackNavigationProp<AppRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AppRoutes>();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="home" component={Home} />
      <Screen name="books" component={Books} />
      <Screen name="bookDetails" component={BookDetails} />
      <Screen name="stock" component={Stock} />
      <Screen name="inventories" component={Inventories} />
    </Navigator>
  );
}
