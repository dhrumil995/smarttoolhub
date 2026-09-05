import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Pause, Square, Plus, Trash2, Download, 
  Calendar, DollarSign, FileSpreadsheet, RefreshCw, Check, Layers
} from 'lucide-react';

interface TimeLog {
  id: string;
  date: string;
  project: string;
  startTime: string;
  endTime: string;
  breakMins: number;
  hourlyRate: number;
  notes: string;
}

const INITIAL_LOGS: TimeLog[] = [
  { id: '1', date: '2026-07-27', project: 'Acme SaaS Overhaul', startTime: '09:00', endTime: '17:30', breakMins: 30, hourlyRate: 65, notes: 'Frontend dashboard optimization & state refactoring' },
  { id: '2', date: '2026-07-26', project: 'Apex Mobile App', startTime: '08:30', endTime: '18:00', breakMins: 45, hourlyRate: 65, notes: 'API authentication pipeline and test setup' },
  { id: '3', date: '2026-07-25', project: 'Internal R&D', startTime: '10:00', endTime: '16:00', breakMins: 30, hourlyRate: 50, notes: 'Dependency updates and CI build speedup' },
];

export function WorkTimeTracker() {
  const [logs, setLogs] = useState<TimeLog[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smarttoolhub_timelogs');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return INITIAL_LOGS;
  });

  // Stopwatch state
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [activeProject, setActiveProject] = useState('Default Project');

  // Manual Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [project, setProject] = useState('Client Project');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [breakMins, setBreakMins] = useState<number>(30);
  const [hourlyRate, setHourlyRate] = useState<number>(60);
  const [notes, setNotes] = useState('');

  // Local Storage Sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smarttoolhub_timelogs', JSON.stringify(logs));
    }
  }, [logs]);

  // Live Timer Interval
  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTimerDisplay = (sec: number) => {
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = sec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopAndSaveTimer = () => {
    if (seconds < 10) return;
    setTimerActive(false);

    const now = new Date();
    const hrsWorked = seconds / 3600;
    const newLog: TimeLog = {
      id: Date.now().toString(),
      date: now.toISOString().split('T')[0],
      project: activeProject,
      startTime: 'Live Session',
      endTime: 'Live Session',
      breakMins: 0,
      hourlyRate,
      notes: `Tracked with live timer (${(hrsWorked).toFixed(2)} hrs)`
    };

    setLogs([newLog, ...logs]);
    setSeconds(0);
  };

  // Helper to calculate total hours worked for an entry
  const calculateHours = (log: TimeLog) => {
    if (log.startTime === 'Live Session') {
      // derive from notes or default 0
      const match = log.notes.match(/\(([\d\.]+) hrs\)/);
      return match ? parseFloat(match[1]) : 0;
    }

    const [startH, startM] = log.startTime.split(':').map(Number);
    const [endH, endM] = log.endTime.split(':').map(Number);

    let startMinutes = startH * 60 + startM;
    let endMinutes = endH * 60 + endM;

    if (endMinutes < startMinutes) endMinutes += 24 * 60; // overnight check

    const netMinutes = Math.max(0, endMinutes - startMinutes - log.breakMins);
    return netMinutes / 60;
  };

  const handleAddManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: TimeLog = {
      id: Date.now().toString(),
      date,
      project,
      startTime,
      endTime,
      breakMins,
      hourlyRate,
      notes
    };
    setLogs([newLog, ...logs]);
    setNotes('');
  };

  const handleDeleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  // Metrics Calculations
  let totalHoursAll = 0;
  let totalEarningsAll = 0;
  let totalOvertimeHoursAll = 0;

  logs.forEach(log => {
    const hrs = calculateHours(log);
    const regularHrs = Math.min(8, hrs);
    const overtimeHrs = Math.max(0, hrs - 8);
    
    totalHoursAll += hrs;
    totalOvertimeHoursAll += overtimeHrs;
    totalEarningsAll += (regularHrs * log.hourlyRate) + (overtimeHrs * log.hourlyRate * 1.5);
  });

  const exportJSON = () => {
    if (logs.length === 0) return;
    const jsonContent = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timesheet_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Date', 'Project', 'Start Time', 'End Time', 'Break (mins)', 'Hours Worked', 'Hourly Rate ($)', 'Estimated Pay ($)', 'Notes'];
    const rows = logs.map(l => {
      const hrs = calculateHours(l);
      const regularHrs = Math.min(8, hrs);
      const overtimeHrs = Math.max(0, hrs - 8);
      const pay = (regularHrs * l.hourlyRate) + (overtimeHrs * l.hourlyRate * 1.5);
      return [
        l.date,
        `"${l.project}"`,
        l.startTime,
        l.endTime,
        l.breakMins,
        hrs.toFixed(2),
        l.hourlyRate,
        pay.toFixed(2),
        `"${l.notes.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `timesheet_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800/80 pb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
            <Clock size={12} className="text-blue-500" />
            Timesheet & Work Hours Tracker
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Work Time Tracker & Productivity Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Track live work hours, calculate overtime earnings, log client timesheets, and export JSON / CSV productivity summaries.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportJSON}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={14} />
            <span>Save as JSON</span>
          </button>

          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet size={14} />
            <span>Save as CSV</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Hours Logged</span>
          <div className="font-mono text-3xl font-extrabold text-slate-900 dark:text-white">
            {totalHoursAll.toFixed(2)} <span className="text-xs font-normal text-slate-400">hrs</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold">Includes {totalOvertimeHoursAll.toFixed(1)} OT Hours</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Gross Billable Earnings</span>
          <div className="font-mono text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
            ${totalEarningsAll.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-slate-400">Based on regular & 1.5x OT rates</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Logged Entries</span>
          <div className="font-mono text-3xl font-extrabold text-blue-600 dark:text-blue-400">
            {logs.length}
          </div>
          <span className="text-[10px] text-slate-400">Across active projects</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Live Stopwatch + Manual Log Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Live Stopwatch Module */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                <Clock size={14} /> Live Productivity Stopwatch
              </span>
              {timerActive && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold animate-pulse">
                  Timer Running
                </span>
              )}
            </div>

            <div className="text-center py-2">
              <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-widest">
                {formatTimerDisplay(seconds)}
              </div>
            </div>

            <div className="space-y-3">
              <input
                type="text"
                value={activeProject}
                onChange={(e) => setActiveProject(e.target.value)}
                placeholder="Active Project Name"
                className="w-full px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs font-medium text-white focus:outline-none"
              />

              <div className="flex items-center gap-2">
                {!timerActive ? (
                  <button
                    onClick={() => setTimerActive(true)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Play size={14} />
                    <span>Start Timer</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setTimerActive(false)}
                    className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Pause size={14} />
                    <span>Pause</span>
                  </button>
                )}

                <button
                  onClick={handleStopAndSaveTimer}
                  disabled={seconds < 5}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                >
                  <Square size={14} />
                  <span>Save Log</span>
                </button>
              </div>
            </div>
          </div>

          {/* Manual Entry Form */}
          <form onSubmit={handleAddManualLog} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Plus size={16} className="text-blue-500" />
              Manual Timesheet Entry
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Project / Client</label>
              <input
                type="text"
                required
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Client Name or Task"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Hourly Rate ($/hr)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Start Time</label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">End Time</label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Break (Mins)</label>
                <input
                  type="number"
                  min="0"
                  value={breakMins}
                  onChange={(e) => setBreakMins(Number(e.target.value))}
                  className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Notes / Work Summary</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Brief description of work done"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Log Timesheet Entry</span>
            </button>
          </form>
        </div>

        {/* Right Column: Timesheet Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                Logged Work Sessions
              </h3>
              <span className="text-xs font-mono text-slate-400">{logs.length} Entries</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Project</th>
                    <th className="py-3 px-4">Time / Break</th>
                    <th className="py-3 px-4 text-right">Hours</th>
                    <th className="py-3 px-4 text-right">Earnings</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                        No work sessions logged yet.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => {
                      const hrs = calculateHours(log);
                      const regHrs = Math.min(8, hrs);
                      const otHrs = Math.max(0, hrs - 8);
                      const pay = (regHrs * log.hourlyRate) + (otHrs * log.hourlyRate * 1.5);

                      return (
                        <tr key={log.id} className="text-xs hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                          <td className="py-3 px-4 font-mono text-slate-500">{log.date}</td>
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {log.project}
                            {log.notes && <span className="block font-normal text-[10px] text-slate-400">{log.notes}</span>}
                          </td>
                          <td className="py-3 px-4 text-[11px] text-slate-500 font-mono">
                            {log.startTime} - {log.endTime}
                            {log.breakMins > 0 && <span className="block text-[10px] text-slate-400">{log.breakMins}m break</span>}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                            {hrs.toFixed(2)}h
                            {otHrs > 0 && <span className="block text-[10px] text-amber-500 font-bold">+{otHrs.toFixed(1)}h OT</span>}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${pay.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                              title="Delete Session"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkTimeTracker;
