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
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { Loading } from "./src/components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./src/contexts/AuthContext";
import { Routes } from "./src/routes";
import { ToastProvider } from "./src/contexts/ToastContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./src/lib/reactQuery";

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
    <SafeAreaView className="flex-1">
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
    </SafeAreaView>
  );
}
