import React, { useState } from 'react';
import {
  Flame,
  CheckCircle2,
  Plus,
  Trash2,
  Trophy,
  Calendar,
  BarChart2,
  Download,
  Check,
  Target,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';

interface Habit {
  id: string;
  name: string;
  category: string;
  streak: number;
  bestStreak: number;
  completedDays: string[]; // ISO string YYYY-MM-DD
  color: string;
}

export default function HabitStreakTracker() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: '1',
      name: 'Drink 2L Water',
      category: 'Health',
      streak: 5,
      bestStreak: 12,
      completedDays: [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() - 86400000).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
      ],
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'Read 20 Pages',
      category: 'Mindset',
      streak: 3,
      bestStreak: 8,
      completedDays: [
        new Date().toISOString().split('T')[0],
        new Date(Date.now() - 86400000).toISOString().split('T')[0],
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      ],
      color: 'bg-emerald-500'
    },
    {
      id: '3',
      name: '30 Min Workout',
      category: 'Fitness',
      streak: 1,
      bestStreak: 15,
      completedDays: [
        new Date().toISOString().split('T')[0]
      ],
      color: 'bg-orange-500'
    }
  ]);

  const [newHabitName, setNewHabitName] = useState<string>('');
  const [newHabitCategory, setNewHabitCategory] = useState<string>('Health');

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to get past 7 days YYYY-MM-DD strings
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const toggleHabitDay = (habitId: string, dayStr: string) => {
    setHabits(prev =>
      prev.map(h => {
        if (h.id !== habitId) return h;

        const isCompleted = h.completedDays.includes(dayStr);
        const updatedDays = isCompleted
          ? h.completedDays.filter(d => d !== dayStr)
          : [...h.completedDays, dayStr];

        // Recalculate streak simple heuristic
        let streak = 0;
        let checkDate = new Date();
        while (true) {
          const dateString = checkDate.toISOString().split('T')[0];
          if (updatedDays.includes(dateString)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }

        return {
          ...h,
          completedDays: updatedDays,
          streak,
          bestStreak: Math.max(h.bestStreak, streak)
        };
      })
    );
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const colors = ['bg-indigo-500', 'bg-rose-500', 'bg-amber-500', 'bg-teal-500', 'bg-purple-500'];
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      category: newHabitCategory,
      streak: 0,
      bestStreak: 0,
      completedDays: [],
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const handleExportCSV = () => {
    const headers = ['Habit Name', 'Category', 'Current Streak', 'Best Streak', 'Total Completed Days'];
    const rows = habits.map(h => [
      `"${h.name}"`,
      h.category,
      h.streak,
      h.bestStreak,
      h.completedDays.length
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'habit_streak_tracker.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCompletedToday = habits.filter(h => h.completedDays.includes(todayStr)).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 text-orange-100 px-3 py-1 rounded-full text-xs font-semibold mb-3 backdrop-blur-sm">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              Gamified Habit Streak Tracker
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Habit Streak Tracker</h1>
            <p className="text-orange-100 mt-1 text-sm sm:text-base max-w-xl">
              Build unbreakable habits, keep your daily momentum going, and visually track streaks with heatmaps.
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-white text-orange-900 hover:bg-orange-50 px-4 py-2 rounded-xl text-sm font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Completed Today</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center gap-2">
            {totalCompletedToday} / {habits.length}
            {totalCompletedToday === habits.length && habits.length > 0 && (
              <span className="text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">100%!</span>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Active Habits</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {habits.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">Longest Active Streak</span>
          <div className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
            <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
            {Math.max(0, ...habits.map(h => h.streak))} Days
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 font-medium">All-Time Record</span>
          <div className="text-2xl font-black text-amber-500 mt-1 flex items-center gap-1">
            <Trophy className="w-5 h-5" />
            {Math.max(0, ...habits.map(h => h.bestStreak))} Days
          </div>
        </div>
      </div>

      {/* Add Habit Form */}
      <form onSubmit={handleAddHabit} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Enter a new daily habit (e.g. Read 15 mins)..."
          className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-orange-500 focus:outline-none"
        />

        <select
          value={newHabitCategory}
          onChange={(e) => setNewHabitCategory(e.target.value)}
          className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
        >
          <option value="Health">Health</option>
          <option value="Fitness">Fitness</option>
          <option value="Mindset">Mindset</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>

        <button
          type="submit"
          disabled={!newHabitName.trim()}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Habit
        </button>
      </form>

      {/* Habit List Table / Card Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" /> Daily Habit Tracker (7-Day View)
          </h2>
          <span className="text-xs text-slate-500">Click any day circle to toggle completion</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {habits.map((habit) => (
            <div key={habit.id} className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-10 rounded-full ${habit.color}`} />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {habit.name}
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full font-medium">
                      {habit.category}
                    </span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-orange-600 dark:text-orange-400">
                      <Flame className="w-3.5 h-3.5 fill-orange-500" /> {habit.streak} day streak
                    </span>
                    <span>Best: {habit.bestStreak}d</span>
                  </div>
                </div>
              </div>

              {/* 7 Day Checklist */}
              <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end">
                {last7Days.map((dayStr) => {
                  const isToday = dayStr === todayStr;
                  const isDone = habit.completedDays.includes(dayStr);
                  const dayObj = new Date(dayStr + 'T00:00:00');
                  const dayName = dayObj.toLocaleDateString('en-US', { weekday: 'narrow' });

                  return (
                    <button
                      key={dayStr}
                      onClick={() => toggleHabitDay(habit.id, dayStr)}
                      className={`flex flex-col items-center gap-1 p-1 rounded-xl transition ${
                        isToday ? 'bg-orange-50 dark:bg-orange-950/40' : ''
                      }`}
                    >
                      <span className={`text-[10px] font-bold ${isToday ? 'text-orange-600 dark:text-orange-400' : 'text-slate-400'}`}>
                        {dayName}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isDone
                            ? 'bg-orange-600 text-white shadow-xs scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : dayObj.getDate()}
                      </div>
                    </button>
                  );
                })}

                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition ml-2"
                  title="Delete Habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {habits.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">
              No habits created yet. Add your first habit above to begin tracking!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
