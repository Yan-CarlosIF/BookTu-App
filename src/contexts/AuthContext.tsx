import { createContext, useState } from "react";
import {
  storageRemoveAuthToken,
  storageSetAuthToken,
} from "../storage/StorageAuthToken";

type AuthContextType = {
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  const login = async (token: string) => {
    await storageSetAuthToken(token);
    setToken(token);
  };

  const logout = async () => {
    await storageRemoveAuthToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
