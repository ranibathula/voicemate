import React from 'react';
import {
  X,
  Volume2,
  Radio,
  Globe,
  Sliders,
  Check,
  Bot,
  Terminal,
} from 'lucide-react';
import { VoiceSettings } from '../types';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onUpdateSettings: (newSettings: Partial<VoiceSettings>) => void;
  availableVoices: SpeechSynthesisVoice[];
  onTestVoice: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  availableVoices,
  onTestVoice,
}) => {
  if (!isOpen) return null;

  const languages = [
    { code: 'en-US', label: 'English (US)' },
    { code: 'en-GB', label: 'English (UK)' },
    { code: 'es-ES', label: 'Spanish (Español)' },
    { code: 'fr-FR', label: 'French (Français)' },
    { code: 'de-DE', label: 'German (Deutsch)' },
    { code: 'ja-JP', label: 'Japanese (日本語)' },
    { code: 'hi-IN', label: 'Hindi (हिंदी)' },
    { code: 'zh-CN', label: 'Chinese (中文)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg bg-[#08080a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-gray-100">VoiceMate AI Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-100 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-white/10">
          {/* Wake Word Config */}
          <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-semibold text-gray-200">Wake-Word Engine</span>
              </div>
              <input
                type="checkbox"
                checked={settings.wakeWordEnabled}
                onChange={(e) => onUpdateSettings({ wakeWordEnabled: e.target.checked })}
                className="w-4 h-4 rounded bg-black/40 border-white/10 text-blue-500 focus:ring-blue-500"
              />
            </div>
            <p className="text-[11px] text-gray-400">
              When enabled, VoiceMate continuously listens for the wake phrase.
            </p>
            <input
              type="text"
              value={settings.wakeWord}
              onChange={(e) => onUpdateSettings({ wakeWord: e.target.value })}
              placeholder="Wake word (e.g. voice mate)..."
              className="w-full bg-black/40 border border-white/10 text-xs text-gray-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500/50"
            />
          </div>

          {/* Voice Synthesis Selector */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-gray-200 flex items-center space-x-1.5">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span>Synthesized Text-to-Speech Voice</span>
            </label>
            <select
              value={settings.selectedVoiceName}
              onChange={(e) => onUpdateSettings({ selectedVoiceName: e.target.value })}
              className="w-full bg-black/40 border border-white/10 text-xs text-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500/50"
            >
              <option value="">Default System Natural Voice</option>
              {availableVoices.map((v, i) => (
                <option key={i} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Rate & Pitch Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Speech Speed</span>
                <span className="font-mono text-blue-400">{settings.speechRate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => onUpdateSettings({ speechRate: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-300 mb-1">
                <span>Pitch</span>
                <span className="font-mono text-blue-400">{settings.speechPitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={settings.speechPitch}
                onChange={(e) => onUpdateSettings({ speechPitch: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-200 flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Recognition & Response Language</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onUpdateSettings({ language: lang.code })}
                  className={`p-2 rounded-xl text-xs text-left border transition-all ${
                    settings.language === lang.code
                      ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 font-semibold shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto Speak Toggle */}
          <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
            <span className="text-xs font-medium text-gray-200">Automatically speak AI answers</span>
            <input
              type="checkbox"
              checked={settings.autoSpeakResponse}
              onChange={(e) => onUpdateSettings({ autoSpeakResponse: e.target.checked })}
              className="w-4 h-4 rounded bg-black/40 border-white/10 text-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onTestVoice}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Test Voice Synthesis</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
