import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Settings,
  X,
  Sparkles,
  Crown,
  Megaphone,
  Info,
  Clock,
  ChevronRight,
  Volume2,
  VolumeX,
  Smartphone,
  Send,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNotification, NotificationItem } from '../context/NotificationContext';
import { PageId } from '../types';

interface NotificationCenterProps {
  onNavigate: (pageId: PageId) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ onNavigate }) => {
  const {
    notifications,
    unreadCount,
    autoPopupsEnabled,
    pushPermission,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    toggleAutoPopups,
    requestPushPermission,
    addNotification
  } = useNotification();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system' | 'subscription'>('all');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'system') return n.type === 'system' || n.type === 'tool';
    if (activeTab === 'subscription') return n.type === 'subscription' || n.type === 'account';
    return true;
  });

  const formatTimeAgo = (isoString: string) => {
    try {
      const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'subscription':
      case 'account':
        return <Crown size={15} className="text-amber-500" />;
      case 'announcement':
        return <Megaphone size={15} className="text-purple-500" />;
      case 'tool':
        return <Sparkles size={15} className="text-blue-500" />;
      default:
        return <Info size={15} className="text-blue-500" />;
    }
  };

  const handleItemClick = (n: NotificationItem) => {
    if (!n.read) {
      markAsRead(n.id);
    }
    if (n.link) {
      onNavigate(n.link as PageId);
      setIsOpen(false);
    }
  };

  const handleSendTestNotification = () => {
    addNotification({
      title: '⚡ Test Notification',
      message: 'Automatic notification engine is working perfectly on SmartToolHub!',
      type: 'system',
      link: 'home',
      actionText: 'Great!'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Notifications Center"
        aria-label="Open notifications"
      >
        <Bell size={18} className={unreadCount > 0 ? 'animate-bounce' : ''} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-extrabold text-white shadow-xs animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg cursor-pointer"
                    title="Mark all as read"
                  >
                    <CheckCheck size={15} />
                  </button>
                )}

                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                  title="Notification Settings"
                >
                  <Settings size={15} />
                </button>

                {notifications.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg cursor-pointer"
                    title="Clear all"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 overflow-x-auto">
              {(
                [
                  { id: 'all', label: `All (${notifications.length})` },
                  { id: 'unread', label: `Unread (${unreadCount})` },
                  { id: 'system', label: 'Tools & AI' },
                  { id: 'subscription', label: 'Plans & Account' }
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 max-h-96">
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleItemClick(n)}
                    className={`p-3.5 transition-colors cursor-pointer flex items-start gap-3 relative group ${
                      !n.read
                        ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50 dark:hover:bg-blue-950/30'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    {/* Icon Container */}
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 flex-shrink-0 mt-0.5">
                      {getNotificationIcon(n.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4
                          className={`text-xs font-bold truncate ${
                            !n.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">
                          {formatTimeAgo(n.timestamp)}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>

                      {n.actionText && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                          <span>{n.actionText}</span>
                          <ChevronRight size={10} />
                        </span>
                      )}
                    </div>

                    {/* Unread Badge Indicator */}
                    {!n.read && (
                      <span className="absolute top-4 right-3 w-2 h-2 rounded-full bg-blue-600" />
                    )}

                    {/* Delete item button on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(n.id);
                      }}
                      className="absolute bottom-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove notification"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 px-4 text-slate-400 space-y-2">
                  <Bell size={28} className="mx-auto text-slate-300 dark:text-slate-700" />
                  <p className="text-xs font-medium">No notifications in this tab</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    autoPopupsEnabled ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span>Auto Notifications: {autoPopupsEnabled ? 'Active' : 'Paused'}</span>
              </span>

              <button
                onClick={() => setShowSettingsModal(true)}
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
              >
                Configure
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings size={18} className="text-blue-600" />
                  <span>Notification Settings</span>
                </h3>
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Auto Popups Toggle */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="space-y-0.5 max-w-[240px]">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block flex items-center gap-1.5">
                      {autoPopupsEnabled ? <Volume2 size={14} className="text-emerald-500" /> : <VolumeX size={14} className="text-slate-400" />}
                      <span>Automatic Activity Toasts</span>
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Show periodic live activity alerts & tool updates automatically.
                    </p>
                  </div>

                  <button
                    onClick={toggleAutoPopups}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                      autoPopupsEnabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoPopupsEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Browser Desktop Push Notification Permission */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Smartphone size={14} className="text-blue-500" />
                      <span>Browser Desktop Push Alerts</span>
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                        pushPermission === 'granted'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : pushPermission === 'denied'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-amber-500/10 text-amber-600'
                      }`}
                    >
                      {pushPermission}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Receive native OS desktop notifications even when you are browsing other tabs.
                  </p>

                  {pushPermission !== 'granted' && (
                    <button
                      onClick={requestPushPermission}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Enable Desktop Push Notifications
                    </button>
                  )}
                </div>

                {/* Test Notification Trigger */}
                <div className="pt-2 flex justify-between items-center">
                  <button
                    onClick={handleSendTestNotification}
                    className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-colors"
                  >
                    <Send size={13} />
                    <span>Send Test Notification</span>
                  </button>

                  <button
                    onClick={() => setShowSettingsModal(false)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
