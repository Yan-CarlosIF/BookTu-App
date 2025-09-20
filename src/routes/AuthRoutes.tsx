import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
import { SingIn } from "../screens/SignIn";

type AuthRoutes = {
  SignIn: undefined;
  SignUp: undefined;
};

export type AuthNavigationProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="SignIn" component={SingIn} />
    </Navigator>
  );
}
