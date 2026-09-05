import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from '../utils/toast';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'subscription' | 'announcement' | 'tool' | 'account';
  timestamp: string;
  read: boolean;
  link?: string;
  actionText?: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  autoPopupsEnabled: boolean;
  pushPermission: NotificationPermission | 'default';
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  toggleAutoPopups: () => void;
  requestPushPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: '🎉 Welcome to SmartToolHub!',
    message: 'Access 35+ free developer, AI, SEO, YouTube & image editing utilities in one spot.',
    type: 'system',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    read: false,
    link: 'home',
    actionText: 'Explore Tools'
  },
  {
    id: 'notif-2',
    title: '⚡ Try New AI Generators',
    message: 'Supercharge content creation with AI Content Writer and Image Generator.',
    type: 'tool',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    link: 'ai-content-generator',
    actionText: 'Try AI Tools'
  },
  {
    id: 'notif-3',
    title: '👑 Upgrade to Pro Plan',
    message: 'Get unlimited AI queries, ad-free experience, and priority processing.',
    type: 'subscription',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
    link: 'pricing',
    actionText: 'View Pricing'
  }
];

const SIMULATED_ACTIVITY_NOTIFS = [
  { title: '🔥 High Usage Alert', message: 'Over 1,200 QR Codes generated on SmartToolHub today!', type: 'tool' as const, link: 'qr-generator' },
  { title: '🎉 Pro Upgrade', message: 'A user from Mumbai just upgraded to Pro Plan!', type: 'subscription' as const, link: 'pricing' },
  { title: '✨ Tool Update', message: 'Enhanced performance for Image Resizer & Compressor.', type: 'system' as const, link: 'image-resizer' },
  { title: '🚀 New Blog Post Published', message: 'Read: "Top 10 AI Productivity Hacks for Developers in 2026"', type: 'announcement' as const, link: 'blog' },
  { title: '⚡ Fast Processing', message: 'PDF Compressor processed 500MB of documents in record speed.', type: 'tool' as const, link: 'pdf-compressor' }
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('sth_notifications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
    return DEFAULT_NOTIFICATIONS;
  });

  const [autoPopupsEnabled, setAutoPopupsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sth_auto_notifs_enabled') !== 'false';
  });

  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'default'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sth_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('sth_auto_notifs_enabled', autoPopupsEnabled ? 'true' : 'false');
  }, [autoPopupsEnabled]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
      const newNotif: NotificationItem = {
        ...item,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        read: false
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 49)]); // Keep up to 50

      // Native browser desktop push notification if granted
      if (pushPermission === 'granted' && typeof window !== 'undefined' && 'Notification' in window) {
        try {
          new window.Notification(item.title, {
            body: item.message,
            icon: '/favicon.ico'
          });
        } catch (e) {
          // ignore
        }
      }

      // Show temporary subtle toast if auto popups enabled
      if (autoPopupsEnabled) {
        toast.info(`${item.title}: ${item.message}`);
      }
    },
    [pushPermission, autoPopupsEnabled]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    toast.info('Notifications cleared');
  }, []);

  const toggleAutoPopups = useCallback(() => {
    setAutoPopupsEnabled((prev) => {
      const next = !prev;
      toast.info(next ? 'Automatic notification toasts enabled' : 'Automatic notification toasts paused');
      return next;
    });
  }, []);

  const requestPushPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await window.Notification.requestPermission();
        setPushPermission(res);
        if (res === 'granted') {
          toast.success('Browser push notifications enabled!');
          return true;
        } else if (res === 'denied') {
          toast.error('Browser push notifications blocked in browser settings');
          return false;
        }
      } catch (e) {
        console.error('Error requesting notification permission:', e);
      }
    } else {
      toast.error('Browser push notifications are not supported in this browser');
    }
    return false;
  }, []);

  // AUTOMATIC NOTIFICATIONS LOOP (Simulated periodic updates & Broadcast listener)
  useEffect(() => {
    if (!autoPopupsEnabled) return;

    // Trigger an automatic notification every 75 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * SIMULATED_ACTIVITY_NOTIFS.length);
      const activity = SIMULATED_ACTIVITY_NOTIFS[randomIndex];
      addNotification({
        title: activity.title,
        message: activity.message,
        type: activity.type,
        link: activity.link,
        actionText: 'View'
      });
    }, 75000);

    return () => clearInterval(interval);
  }, [autoPopupsEnabled, addNotification]);

  // Listen to admin announcements broadcasted via localStorage
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sth_admin_notice' && e.newValue) {
        const isActive = localStorage.getItem('sth_admin_notice_active') === 'true';
        if (isActive && e.newValue.trim()) {
          addNotification({
            title: '📢 System Announcement',
            message: e.newValue,
            type: 'announcement',
            link: 'home',
            actionText: 'View Announcement'
          });
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        autoPopupsEnabled,
        pushPermission,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        toggleAutoPopups,
        requestPushPermission
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
