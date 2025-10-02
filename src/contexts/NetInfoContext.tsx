import NetInfo from "@react-native-community/netinfo";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Alert } from "react-native";

interface INetInfoContext {
  isConnected: boolean | null;
}

export const netInfoContext = createContext<INetInfoContext>({
  isConnected: null,
} as INetInfoContext);

export function NetInfoProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        Alert.alert(
          "Sem conexão com a internet",
          "Algumas funcionalidades podem ser desativadas.",
        );
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <netInfoContext.Provider value={{ isConnected }}>
      {children}
    </netInfoContext.Provider>
  );
}
