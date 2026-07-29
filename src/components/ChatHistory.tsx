import React from 'react';
import {
  User,
  Bot,
  Volume2,
  Copy,
  Check,
  Trash2,
  Sparkles,
  Calendar,
  CloudSun,
  Newspaper,
  AppWindow,
  Music,
  Code,
  ExternalLink,
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatHistoryProps {
  messages: ChatMessage[];
  onReplayAudio: (text: string) => void;
  onClearHistory: () => void;
  onSelectQuickPrompt: (prompt: string) => void;
  onTabChange?: (tab: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  onReplayAudio,
  onClearHistory,
  onSelectQuickPrompt,
  onTabChange,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: "🌤️ What's the weather in Tokyo?", prompt: "What's the weather in Tokyo?" },
    { label: "⏰ Set a reminder for team sync in 15 mins", prompt: "Set a reminder for team sync in 15 minutes" },
    { label: "📰 Read latest AI & tech news", prompt: "Show me the latest tech and AI news" },
    { label: "🎵 Play chill ambient lofi music", prompt: "Play chill lofi music" },
    { label: "🚀 Launch YouTube & GitHub", prompt: "Open YouTube" },
    { label: "💻 Inspect Python Desktop Assistant Code", prompt: "Show Python source code architecture" },
  ];

  const renderActionBadge = (intent?: string, actionData?: any) => {
    if (!intent) return null;

    switch (intent) {
      case 'reminder':
        return (
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs">
            <Calendar className="w-3.5 h-3.5" />
            <span>Reminder Triggered: {actionData?.title || 'Task'}</span>
            {onTabChange && (
              <button
                onClick={() => onTabChange('reminders')}
                className="ml-2 underline text-amber-300 font-semibold hover:text-amber-200"
              >
                View
              </button>
            )}
          </div>
        );
      case 'weather':
        return (
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs">
            <CloudSun className="w-3.5 h-3.5" />
            <span>Weather Radar Updated</span>
            {onTabChange && (
              <button
                onClick={() => onTabChange('weather')}
                className="ml-2 underline text-cyan-300 font-semibold hover:text-cyan-200"
              >
                Forecast Panel
              </button>
            )}
          </div>
        );
      case 'news':
        return (
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs">
            <Newspaper className="w-3.5 h-3.5" />
            <span>News Feed Fetched</span>
            {onTabChange && (
              <button
                onClick={() => onTabChange('news')}
                className="ml-2 underline text-indigo-300 font-semibold hover:text-indigo-200"
              >
                News Hub
              </button>
            )}
          </div>
        );
      case 'play_music':
        return (
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs">
            <Music className="w-3.5 h-3.5" />
            <span>Audio Player Active</span>
            {onTabChange && (
              <button
                onClick={() => onTabChange('music')}
                className="ml-2 underline text-emerald-300 font-semibold hover:text-emerald-200"
              >
                Player View
              </button>
            )}
          </div>
        );
      case 'open_app':
        return (
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">
            <AppWindow className="w-3.5 h-3.5" />
            <span>Application Opened</span>
          </div>
        );
      case 'python_architecture':
        return (
          <div className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">
            <Code className="w-3.5 h-3.5" />
            <span>Python Desktop Architecture IDE</span>
            {onTabChange && (
              <button
                onClick={() => onTabChange('python')}
                className="ml-2 underline text-purple-300 font-semibold hover:text-purple-200"
              >
                Open IDE
              </button>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#08080a]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
      {/* Header Bar */}
      <div className="px-5 py-3.5 bg-black/30 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold text-gray-300 tracking-widest uppercase">Interaction Log</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
            {messages.length} messages
          </span>
        </div>

        {messages.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center space-x-1 text-xs text-gray-500 hover:text-rose-400 transition-colors"
            title="Clear Chat Thread"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Message List Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 mb-3 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <Sparkles className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-sm font-semibold text-gray-200 mb-1">VoiceMate AI Log</h4>
            <p className="text-xs text-gray-400 max-w-sm mb-6">
              Ask questions, set reminders, fetch weather forecasts, play music, or launch apps.
            </p>

            {/* Quick Suggestion Chips */}
            <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
              {quickPrompts.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectQuickPrompt(item.prompt)}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 text-xs text-gray-300 hover:text-blue-300 transition-all flex items-center justify-between group"
                >
                  <span>{item.label}</span>
                  <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%] ${isUser ? 'ml-auto' : 'mr-auto'}`}
              >
                <p className={`text-xs text-gray-500 mb-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
                  {isUser ? 'You' : 'VoiceMate'}
                </p>

                {/* Speech Content Bubble */}
                <div
                  className={`p-4 text-sm leading-relaxed backdrop-blur-md border ${
                    isUser
                      ? 'bg-blue-600/20 border-blue-500/30 rounded-2xl rounded-tr-none text-blue-100 shadow-lg'
                      : 'bg-white/10 border-white/10 rounded-2xl rounded-tl-none text-gray-200 shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Render Action Badge */}
                  {!isUser && renderActionBadge(msg.intent, msg.actionData)}

                  {/* Controls Footer */}
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400">
                    <span>{msg.timestamp}</span>
                    <div className="flex items-center space-x-2">
                      {!isUser && (
                        <button
                          onClick={() => onReplayAudio(msg.text)}
                          className="p-1 text-gray-400 hover:text-blue-300 hover:bg-white/10 rounded transition-colors"
                          title="Replay Audio"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
