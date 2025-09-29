import { createContext, useRef, useState } from "react";
import { Toast } from "../components/Toast";

interface HandleShowConfig {
  message: string;
  duration?: number;
  variant: "success" | "error";
}

type ToastContextType = {
  show: (config: HandleShowConfig) => void;
  hide: () => void;
};

export const toastContext = createContext({} as ToastContextType);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Inventário criado com sucesso");
  const [variant, setVariant] = useState<"success" | "error">("success");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function handleClose() {
    setVisible(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  function handleShow({ message, duration = 3000, variant }: HandleShowConfig) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setVariant(variant);
    setMessage(message);
    setVisible(true);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = null;
    }, duration);
  }

  return (
    <toastContext.Provider value={{ show: handleShow, hide: handleClose }}>
      <Toast
        variant={variant}
        visible={visible}
        onClose={handleClose}
        message={message}
      />
      {children}
    </toastContext.Provider>
  );
}
