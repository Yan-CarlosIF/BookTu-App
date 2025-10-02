import "@/global.css";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

import { Loading } from "./src/components/Loading";
import { AuthProvider } from "./src/contexts/AuthContext";
import { NetInfoProvider } from "./src/contexts/NetInfoContext";
import { ToastProvider } from "./src/contexts/ToastContext";
import { queryClient } from "./src/lib/reactQuery";
import { Routes } from "./src/routes";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  return (
    <NetInfoProvider>
      <SafeAreaView className="flex-1">
        <GestureHandlerRootView>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <GluestackUIProvider mode="light">
                <ToastProvider>
                  <StatusBar
                    style="auto"
                    translucent
                    backgroundColor="transparent"
                  />
                  {fontsLoaded ? <Routes /> : <Loading />}
                </ToastProvider>
              </GluestackUIProvider>
            </AuthProvider>
          </QueryClientProvider>
        </GestureHandlerRootView>
      </SafeAreaView>
    </NetInfoProvider>
  );
}
