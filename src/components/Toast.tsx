// src/components/toast.tsx
import { useEffect } from "react";
import { Toaster, toast as hotToast, useToasterStore } from "react-hot-toast";

interface ToastProps {
  dark: boolean;
}

export const ToastProvider = ({ dark }: ToastProps) => {
  const { toasts } = useToasterStore();
  const TOAST_LIMIT = 7;

  useEffect(() => {
    toasts
      .filter((t) => t.visible) // Only check visible toasts
      .filter((_, i) => i >= TOAST_LIMIT) // Identify toasts exceeding the limit (newest are at index 0)
      .forEach((t) => hotToast.dismiss(t.id)); // Dismiss the excess (oldest)
  }, [toasts]);

  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        style: {
          background: dark ? "#1e293b" : "#ffffff", // slate-800 : white
          color: dark ? "#ffffff" : "#000000",
          border: dark ? "1px solid #334155" : "1px solid #e4e4e7", // slate-700 : zinc-200
        },
        success: {
          iconTheme: {
            primary: "#22c55e", // green-500
            secondary: "white",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", // red-500
            secondary: "white",
          },
        },
      }}
    />
  );
};

// Re-export toast so we can import everything from this file
export const toast = hotToast;