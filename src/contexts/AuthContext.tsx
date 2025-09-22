import { createContext, useEffect, useState } from "react";
import {
  storageGetAuthToken,
  storageRemoveAuthToken,
  storageSetAuthToken,
} from "../storage/StorageAuthToken";
import { api } from "../lib/api";
import { useSignIn } from "../useCases/Login";

type AuthContextType = {
  token: string | null;
  signIn: (login: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const { mutateAsync: SignIn, isPending } = useSignIn();

  async function signIn(login: string, password: string) {
    const token = await SignIn({ login, password });

    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    await storageSetAuthToken(token);
    setToken(token);
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

  useEffect(() => {
    const unsubscribe = api.registerInterceptTokenManager(signOut);

    return () => unsubscribe();
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{ token, signIn, signOut, isLoading: isPending }}
    >
      {children}
    </AuthContext.Provider>
  );
}
