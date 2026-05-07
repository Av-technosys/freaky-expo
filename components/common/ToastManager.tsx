import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import BeautifulToast, { ToastType } from './BeautifulToast';

interface ToastContextType {
  showToast: (toast: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<ToastType | null>(null);

  const showToast = (toast: ToastType) => {
    setCurrentToast(toast);
  };

  const hideToast = () => {
    setCurrentToast(null);
  };

  const toastContext = { showToast, hideToast };

  // Set global context when provider mounts
  useEffect(() => {
    setGlobalToastContext(toastContext);
    return () => {
      setGlobalToastContext(null as any);
    };
  }, []);

  return (
    <ToastContext.Provider value={toastContext}>
      {children}
      {currentToast && (
        <BeautifulToast
          toast={currentToast}
          onHide={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

// Create a global toast instance that can be used outside components
let globalToastContext: ToastContextType | null = null;

export const setGlobalToastContext = (context: ToastContextType) => {
  globalToastContext = context;
};

export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    if (globalToastContext) {
      globalToastContext.showToast({ type: 'success', title, message, duration });
    }
  },
  error: (title: string, message?: string, duration?: number) => {
    if (globalToastContext) {
      globalToastContext.showToast({ type: 'error', title, message, duration });
    }
  },
  warning: (title: string, message?: string, duration?: number) => {
    if (globalToastContext) {
      globalToastContext.showToast({ type: 'warning', title, message, duration });
    }
  },
  info: (title: string, message?: string, duration?: number) => {
    if (globalToastContext) {
      globalToastContext.showToast({ type: 'info', title, message, duration });
    }
  },
};
