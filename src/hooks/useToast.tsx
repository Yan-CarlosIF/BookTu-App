import { useContext } from "react";
import { toastContext } from "../contexts/ToastContext";

export const useToast = () => useContext(toastContext);
