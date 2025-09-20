import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { AppRoutes } from "./AppRoutes";
import { AuthRoutes } from "./AuthRoutes";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../contexts/AuthContext";

export function Routes() {
  const { token } = useContext(AuthContext);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <NavigationContainer>
        {token ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </SafeAreaView>
  );
}
