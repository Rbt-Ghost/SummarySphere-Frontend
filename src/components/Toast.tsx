// src/components/toast.tsx
import { Toaster, toast as hotToast } from "react-hot-toast";

interface ToastProps {
  dark: boolean;
}

export const ToastProvider = ({ dark }: ToastProps) => {
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