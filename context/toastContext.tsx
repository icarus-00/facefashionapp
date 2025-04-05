import React, { createContext, useContext, useState } from "react";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from "@/components/ui/toast";

// Define the toast context
type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

// Create a provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast();

  const showToast = (message: string) => {
    const newId = Math.random();
    toast.show({
      id: newId.toString(),
      placement: "bottom",
      duration: 3000,
      render: ({ id }: { id: string }) => {
        const uniqueToastId = "toast-" + id;
        return (
          <Toast
            className="p-5"
            nativeID={uniqueToastId}
            action="success"
            variant="solid"
          >
            <ToastTitle>Notification</ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
}

// Hook to use the toast
export function useToastGlue() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastGlue must be used within a ToastProvider");
  }
  return context;
}

// Function to show toast directly
let _showToast: ((message: string) => void) | null = null;

export function ToastGlue(message: string): void {
  if (!_showToast) {
    console.warn(
      "ToastGlue: Toast provider not initialized. Make sure to wrap your app with ToastProvider."
    );
    return;
  }
  _showToast(message);
}

// Component to initialize the toast function
export function ToastInitializer() {
  const { showToast } = useToastGlue();

  React.useEffect(() => {
    _showToast = showToast;
    return () => {
      _showToast = null;
    };
  }, [showToast]);

  return null;
}
