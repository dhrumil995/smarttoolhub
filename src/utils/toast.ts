// Event-driven toast notification manager

export type ToastType = 'info' | 'success' | 'warning' | 'error' | '404_server' | '404_client';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  duration?: number; // ms
  timestamp: number;
}

type ToastListener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners: Set<ToastListener> = new Set();

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export const toast = {
  subscribe(listener: ToastListener) {
    listeners.add(listener);
    listener([...toasts]);
    return () => {
      listeners.delete(listener);
    };
  },

  show(item: Omit<ToastItem, 'id' | 'timestamp'>) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastItem = {
      ...item,
      id,
      timestamp: Date.now(),
      duration: item.duration ?? 6000,
    };
    // Keep max 5 toasts visible
    toasts = [newToast, ...toasts.slice(0, 4)];
    notify();

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        toast.dismiss(id);
      }, newToast.duration);
    }
    return id;
  },

  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },

  clear() {
    toasts = [];
    notify();
  },

  success(message: string, title: string = 'Success') {
    return toast.show({ type: 'success', title, message });
  },

  error(message: string, title: string = 'Error') {
    return toast.show({ type: 'error', title, message });
  },

  warning(message: string, title: string = 'Warning') {
    return toast.show({ type: 'warning', title, message });
  },

  info(message: string, title: string = 'Notice') {
    return toast.show({ type: 'info', title, message });
  },

  server404(endpoint: string, message?: string) {
    return toast.show({
      type: '404_server',
      title: 'Server Endpoint Not Found (HTTP 404)',
      message: message || `The requested backend API endpoint "${endpoint}" does not exist on the server.`,
      duration: 8000,
    });
  },

  client404(endpoint: string, message?: string) {
    return toast.show({
      type: '404_client',
      title: 'Client-Side Route Misconfiguration (404)',
      message: message || `The request to "${endpoint}" was intercepted as a client-side route or returned HTML instead of API JSON.`,
      duration: 8000,
    });
  },
};
