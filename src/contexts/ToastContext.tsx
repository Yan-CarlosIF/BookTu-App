import { createContext, useState } from "react";
import { Toast } from "../components/Toast";

interface HandleShowConfig {
  message: string;
  duration?: number;
  variant: "success" | "error";
  isClosable?: boolean;
}

type ToastContextType = {
  show: (config: HandleShowConfig) => void;
  hide: () => void;
};

export const toastContext = createContext({} as ToastContextType);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<"success" | "error">("success");
  const [showCloseButton, setShowCloseButton] = useState(false);

  function handleClose() {
    setVisible(false);
  }

  function handleShow({
    message,
    duration = 3000,
    variant,
    isClosable: closeButton = false,
  }: HandleShowConfig) {
    setVariant(variant);
    setMessage(message);
    setShowCloseButton(closeButton);
    setVisible(true);

    setTimeout(() => {
      setVisible(false);
    }, duration);
  }

  return (
    <toastContext.Provider value={{ show: handleShow, hide: handleClose }}>
      <Toast
        variant={variant}
        visible={visible}
        onClose={handleClose}
        message={message}
        closeButton={showCloseButton}
      />
      {children}
    </toastContext.Provider>
  );
}
