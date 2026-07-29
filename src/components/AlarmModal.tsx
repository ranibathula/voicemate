import React, { useEffect } from 'react';
import { Bell, Check, Clock, RotateCcw, Volume2, AlertTriangle } from 'lucide-react';
import { Reminder } from '../types';

interface AlarmModalProps {
  reminder: Reminder;
  onDismiss: (id: string) => void;
  onSnooze: (id: string) => void;
  onStopSound: () => void;
}

export const AlarmModal: React.FC<AlarmModalProps> = ({
  reminder,
  onDismiss,
  onSnooze,
  onStopSound,
}) => {
  useEffect(() => {
    // Request desktop notification if allowed
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`⏰ VoiceMate Reminder Alert!`, {
          body: `${reminder.title} (${reminder.time})`,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
    }
  }, [reminder]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Pulsing Alarm Card Container */}
      <div className="relative w-full max-w-md bg-[#0d0d12] border-2 border-rose-500/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(244,63,94,0.4)] overflow-hidden text-center space-y-5 animate-bounce-subtle">
        {/* Glow Effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Alarm Bell Animated Ring Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse">
          <Bell className="w-8 h-8 animate-spin-slow" />
        </div>

        <div>
          <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reminder Due Now!</span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-wide leading-tight px-2">
            {reminder.title}
          </h2>

          <div className="flex items-center justify-center space-x-3 text-xs text-gray-400 mt-2">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{reminder.time}</span>
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 font-medium text-gray-300">
              {reminder.category}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => onSnooze(reminder.id)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 text-gray-200 font-semibold rounded-xl text-xs transition-all border border-white/10"
          >
            <RotateCcw className="w-4 h-4 text-amber-400" />
            <span>Snooze (5m)</span>
          </button>

          <button
            onClick={() => onDismiss(reminder.id)}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          >
            <Check className="w-4 h-4" />
            <span>Mark Complete</span>
          </button>
        </div>

        <button
          onClick={onStopSound}
          className="text-[11px] text-gray-500 hover:text-gray-300 underline pt-1 transition-colors"
        >
          Silence Sound
        </button>
      </div>
    </div>
  );
};
