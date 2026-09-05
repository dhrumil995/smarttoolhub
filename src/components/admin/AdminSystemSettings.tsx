import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  Database,
  Megaphone,
  RefreshCw,
  Save,
  Download,
  CheckCircle2,
  AlertCircle,
  HardDrive
} from 'lucide-react';
import { toast } from '../../utils/toast';

interface SystemStatus {
  status: string;
  uptimeSeconds: number;
  usersCount: number;
  paymentsCount: number;
  subsCount: number;
  databaseStorage: {
    usersFileBytes: number;
    paymentsFileBytes: number;
    subsFileBytes: number;
    totalBytes: number;
  };
  environment: string;
  timestamp: string;
}

export const AdminSystemSettings: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  // Broadcast Notice state (stored in localStorage for global banner)
  const [bannerNotice, setBannerNotice] = useState(() => {
    return localStorage.getItem('sth_admin_notice') || '';
  });
  const [isBannerEnabled, setIsBannerEnabled] = useState(() => {
    return localStorage.getItem('sth_admin_notice_active') === 'true';
  });

  const fetchSystemInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/system/status');
      if (res.ok) {
        const data = await res.json();
        setSystemInfo(data);
      } else {
        toast.error('Failed to load system diagnostics');
      }
    } catch (e) {
      toast.error('Error contacting system status API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemInfo();
  }, []);

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sth_admin_notice', bannerNotice);
    localStorage.setItem('sth_admin_notice_active', isBannerEnabled ? 'true' : 'false');
    // Dispatch custom storage event so Header / App can update immediately
    window.dispatchEvent(new Event('storage'));
    toast.success('Site broadcast notification updated!');
  };

  const formatUptime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* System Diagnostics Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
              <Server className="text-blue-600 dark:text-blue-400" size={22} />
              <span>System Health & Storage Diagnostics</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time server uptime, database disk footprint, and system state monitors.
            </p>
          </div>

          <button
            onClick={fetchSystemInfo}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl cursor-pointer"
            title="Refresh System Status"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* System Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Server Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <strong className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {systemInfo?.status || 'Operational'}
              </strong>
            </div>
            <p className="text-[10px] text-slate-400">Environment: {systemInfo?.environment || 'Production'}</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Process Uptime</span>
            <strong className="text-base font-bold text-slate-900 dark:text-white font-mono block">
              {systemInfo ? formatUptime(systemInfo.uptimeSeconds) : 'N/A'}
            </strong>
            <p className="text-[10px] text-slate-400">Continuous execution</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">JSON DB Total Storage</span>
            <strong className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono block">
              {systemInfo?.databaseStorage?.totalBytes ? formatBytes(systemInfo.databaseStorage.totalBytes) : '0 Bytes'}
            </strong>
            <p className="text-[10px] text-slate-400">Persisted accounts & transactions</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Database Files Breakdown</span>
            <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-0.5 font-mono">
              <div>Users: {systemInfo?.databaseStorage?.usersFileBytes ? formatBytes(systemInfo.databaseStorage.usersFileBytes) : '0 Bytes'}</div>
              <div>Orders: {systemInfo?.databaseStorage?.paymentsFileBytes ? formatBytes(systemInfo.databaseStorage.paymentsFileBytes) : '0 Bytes'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcast Notice Banner Settings */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Megaphone size={20} className="text-amber-500" />
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">Global Announcement Banner</h3>
            <p className="text-xs text-slate-500">
              Display a site-wide broadcast message to all users on top of the screen (e.g. maintenance, deals, updates).
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveBanner} className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enableBanner"
              checked={isBannerEnabled}
              onChange={(e) => setIsBannerEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded cursor-pointer"
            />
            <label htmlFor="enableBanner" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
              Enable Announcement Banner Site-wide
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Banner Notice Message</label>
            <textarea
              rows={2}
              value={bannerNotice}
              onChange={(e) => setBannerNotice(e.target.value)}
              placeholder="e.g. 🎉 Special Offer: Upgrade to Pro Plan today and get 20% off with instant activation!"
              className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
            >
              <Save size={14} />
              <span>Save Broadcast Banner</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
