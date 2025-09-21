import { createContext, useEffect, useState } from "react";
import {
  storageGetAuthToken,
  storageRemoveAuthToken,
  storageSetAuthToken,
} from "../storage/StorageAuthToken";
import { api } from "../lib/api";

type AuthContextType = {
  token: string | null;
  signIn: (login: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  async function signIn(login: string, password: string) {
    const { data } = await api.post<{ token: string }>("/auth/session", {
      login,
      password,
    });

    api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

    await storageSetAuthToken(data.token);
    setToken(data.token);
  }

  async function signOut() {
    await storageRemoveAuthToken();
    setToken(null);
  }

  useEffect(() => {
    (async () => {
      const token = await storageGetAuthToken();
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setToken(token);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
