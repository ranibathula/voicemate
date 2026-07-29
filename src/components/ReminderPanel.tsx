import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Bell,
  AlertCircle,
  Tag,
  Volume2,
} from 'lucide-react';
import { Reminder } from '../types';

interface ReminderPanelProps {
  reminders: Reminder[];
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  onTestAlarmSound: () => void;
}

export const ReminderPanel: React.FC<ReminderPanelProps> = ({
  reminders,
  onAddReminder,
  onToggleComplete,
  onDeleteReminder,
  onTestAlarmSound,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('10:00');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<Reminder['category']>('Personal');
  const [priority, setPriority] = useState<Reminder['priority']>('medium');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      time,
      date,
      category,
      completed: false,
      priority,
    });

    setTitle('');
    setShowAddForm(false);
  };

  const filteredReminders = reminders.filter((r) => {
    if (filter === 'pending') return !r.completed;
    if (filter === 'completed') return r.completed;
    return true;
  });

  const getPriorityBadge = (p: Reminder['priority']) => {
    switch (p) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400">Low</span>;
    }
  };

  return (
    <div className="p-6 bg-[#08080a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col h-full justify-between">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Reminders & Alarm Schedule</h3>
              <p className="text-[11px] text-gray-400">Voice-triggered task management</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onTestAlarmSound}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-blue-400 transition-colors border border-white/10"
              title="Test Alarm Sound"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_0_12px_rgba(59,130,246,0.4)]"
            >
              <Plus className="w-4 h-4" />
              <span>New Alarm</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 mb-4">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-xs capitalize transition-colors ${
                filter === f
                  ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Create Reminder Form Modal/Box */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-black/40 border border-white/10 rounded-xl space-y-3 backdrop-blur-md">
            <h4 className="text-xs font-semibold text-blue-400 flex items-center space-x-1">
              <Bell className="w-3.5 h-3.5" />
              <span>Set New Reminder / Alarm</span>
            </h4>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task / Reminder title..."
              className="w-full bg-white/5 border border-white/10 text-xs text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500/50"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs text-gray-200 px-2 py-1.5 rounded-lg"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-400">Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 text-xs text-gray-200 px-2 py-1.5 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400">Category</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 text-xs text-gray-200 px-2 py-1.5 rounded-lg"
                >
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Health">Health</option>
                  <option value="Alarm">Alarm</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-gray-400">Priority</label>
                <select
                  value={priority}
                  onChange={(e: any) => setPriority(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 text-xs text-gray-200 px-2 py-1.5 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.4)]"
              >
                Save Reminder
              </button>
            </div>
          </form>
        )}

        {/* Reminders Stream */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40 text-blue-400" />
              <span>No reminders found. Use voice command "Set a reminder for..." or click New Alarm.</span>
            </div>
          ) : (
            filteredReminders.map((rem) => (
              <div
                key={rem.id}
                className={`p-3.5 rounded-xl border-l-4 border-blue-500 border-y border-r border-white/5 transition-all flex items-center justify-between ${
                  rem.completed
                    ? 'bg-white/2 opacity-50'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => onToggleComplete(rem.id)}
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    {rem.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-500 hover:text-blue-400" />
                    )}
                  </button>

                  <div>
                    <h5 className={`text-xs font-semibold ${rem.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                      {rem.title}
                    </h5>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 mt-1">
                      <span className="flex items-center space-x-1 font-mono text-blue-300">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span>{rem.time}</span>
                      </span>
                      <span>•</span>
                      <span>{rem.date}</span>
                      <span>•</span>
                      <span className="text-gray-300 font-medium px-1.5 py-0.2 rounded bg-white/5">{rem.category}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {getPriorityBadge(rem.priority)}
                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[11px] text-gray-500">
          Try saying: <span className="text-blue-400 font-mono">"Remind me to call John at 5 PM"</span>
        </p>
      </div>
    </div>
  );
};
