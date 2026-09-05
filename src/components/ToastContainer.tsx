import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, ServerOff, Route, X, AlertCircle } from 'lucide-react';
import { toast, ToastItem, ToastType } from '../utils/toast';

export const ToastContainer: React.FC = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsubscribe = toast.subscribe((newToasts) => {
      setItems(newToasts);
    });
    return unsubscribe;
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-md w-full px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {items.map((item) => (
          <ToastCard key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case '404_server':
      return {
        bgColor: 'bg-rose-950/90 dark:bg-rose-950/95 border-rose-600/50 text-rose-100',
        iconBg: 'bg-rose-600/20 text-rose-400',
        Icon: ServerOff,
        badge: 'SERVER 404',
        badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      };
    case '404_client':
      return {
        bgColor: 'bg-amber-950/90 dark:bg-amber-950/95 border-amber-600/50 text-amber-100',
        iconBg: 'bg-amber-600/20 text-amber-400',
        Icon: Route,
        badge: 'CLIENT ROUTE 404',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      };
    case 'error':
      return {
        bgColor: 'bg-red-900/90 dark:bg-red-950/95 border-red-600/50 text-red-100',
        iconBg: 'bg-red-600/20 text-red-400',
        Icon: AlertCircle,
        badge: 'ERROR',
        badgeBg: 'bg-red-500/20 text-red-300 border-red-500/30',
      };
    case 'warning':
      return {
        bgColor: 'bg-amber-900/90 dark:bg-amber-950/95 border-amber-600/50 text-amber-100',
        iconBg: 'bg-amber-600/20 text-amber-400',
        Icon: AlertTriangle,
        badge: 'WARNING',
        badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      };
    case 'success':
      return {
        bgColor: 'bg-emerald-950/90 dark:bg-emerald-950/95 border-emerald-600/50 text-emerald-100',
        iconBg: 'bg-emerald-600/20 text-emerald-400',
        Icon: CheckCircle2,
        badge: 'SUCCESS',
        badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      };
    case 'info':
    default:
      return {
        bgColor: 'bg-slate-900/90 dark:bg-slate-900/95 border-slate-700 text-slate-100',
        iconBg: 'bg-blue-600/20 text-blue-400',
        Icon: Info,
        badge: 'INFO',
        badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      };
  }
};

const ToastCard: React.FC<{ item: ToastItem }> = ({ item }) => {
  const config = getToastConfig(item.type);
  const Icon = config.Icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md ${config.bgColor}`}
    >
      <div className={`p-2 rounded-lg shrink-0 ${config.iconBg}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-xs tracking-wide">{item.title}</span>
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold border ${config.badgeBg}`}>
            {config.badge}
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed break-words">{item.message}</p>
      </div>

      <button
        onClick={() => toast.dismiss(item.id)}
        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
        title="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
