import React from 'react';
import {
  Mic,
  Volume2,
  Settings,
  Terminal,
  Code,
  Calendar,
  CloudSun,
  Newspaper,
  Music,
  AppWindow,
  Cpu,
  Minus,
  Square,
  X,
  Sparkles,
} from 'lucide-react';
import { VoiceSettings } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  assistantState: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  settings: VoiceSettings;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  remindersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  assistantState,
  settings,
  onOpenSettings,
  isMuted,
  onToggleMute,
  remindersCount,
}) => {
  const getStatusBadge = () => {
    switch (assistantState) {
      case 'listening':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse">
            <span className="w-2 h-2 mr-1.5 rounded-full bg-emerald-400 animate-ping" />
            Listening...
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-3 h-3 mr-1 animate-spin" />
            Processing AI...
          </span>
        );
      case 'speaking':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Volume2 className="w-3 h-3 mr-1 animate-bounce" />
            Speaking
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            Microphone Error
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
            <span className="w-2 h-2 mr-1.5 rounded-full bg-cyan-500/80" />
            Ready
          </span>
        );
    }
  };

  const navTabs = [
    { id: 'assistant', label: 'Voice Workspace', icon: Mic },
    { id: 'reminders', label: 'Reminders', icon: Calendar, badge: remindersCount > 0 ? remindersCount : undefined },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'news', label: 'News Feed', icon: Newspaper },
    { id: 'music', label: 'Audio & Music', icon: Music },
    { id: 'launcher', label: 'App Launcher', icon: AppWindow },
    { id: 'python', label: 'Python Core', icon: Code },
  ];

  return (
    <header className="bg-[#08080a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40">
      {/* Title Bar Controls */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-white/5 text-xs text-gray-400 select-none">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              VoiceMate
            </h1>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-blue-400 font-mono">
            v2.5.0
          </span>
          <span className="text-gray-700">|</span>
          {getStatusBadge()}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded-lg border transition-all ${
              isMuted
                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                : 'text-gray-400 hover:text-white bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            title={isMuted ? 'Unmute Assistant' : 'Mute Assistant'}
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-1.5 text-gray-400 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
            title="VoiceMate Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1 pl-2 border-l border-white/10 text-gray-500">
            <span className="w-3 h-3 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer">
              <Minus className="w-2.5 h-2.5" />
            </span>
            <span className="w-3 h-3 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer">
              <Square className="w-2.5 h-2.5" />
            </span>
            <span className="w-3 h-3 rounded-full hover:bg-rose-900/50 hover:text-rose-400 flex items-center justify-center cursor-pointer">
              <X className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center overflow-x-auto px-6 py-2 space-x-1.5 scrollbar-none">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.2)]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500 text-white font-bold shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};
