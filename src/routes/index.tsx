import { NavigationContainer } from "@react-navigation/native";
import { AppRoutes } from "./AppRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../hooks/useAuth";

export function Routes() {
  const { token } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NavigationContainer>
        {token ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </SafeAreaView>
  );
}
