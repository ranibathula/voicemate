import React, { useEffect, useState } from 'react';
import { Mic, MicOff, Sparkles, Volume2, Radio, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MicOrbProps {
  assistantState: 'idle' | 'listening' | 'processing' | 'speaking' | 'error';
  isListening: boolean;
  onToggleListening: () => void;
  interimTranscript?: string;
  wakeWordEnabled: boolean;
  onToggleWakeWord: () => void;
  onSendDirectPrompt?: (prompt: string) => void;
}

export const MicOrb: React.FC<MicOrbProps> = ({
  assistantState,
  isListening,
  onToggleListening,
  interimTranscript,
  wakeWordEnabled,
  onToggleWakeWord,
  onSendDirectPrompt,
}) => {
  const [typedInput, setTypedInput] = useState('');

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedInput.trim()) return;
    if (onSendDirectPrompt) {
      onSendDirectPrompt(typedInput.trim());
      setTypedInput('');
    }
  };

  const getOrbGlowColor = () => {
    switch (assistantState) {
      case 'listening':
        return 'from-emerald-500 via-teal-400 to-cyan-500 shadow-emerald-500/50';
      case 'processing':
        return 'from-cyan-400 via-blue-500 to-indigo-600 shadow-cyan-500/50';
      case 'speaking':
        return 'from-indigo-500 via-purple-500 to-pink-500 shadow-indigo-500/50';
      case 'error':
        return 'from-rose-600 via-red-500 to-orange-500 shadow-rose-500/50';
      default:
        return 'from-cyan-500/80 via-blue-600/80 to-indigo-700/80 shadow-cyan-500/20';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#08080a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden">
      {/* Background Ambient Atmosphere Aura */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />

      {/* Mode Controls Top Bar */}
      <div className="w-full flex items-center justify-between mb-6 z-10">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleWakeWord}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              wakeWordEnabled
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:text-gray-200 hover:bg-white/10'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${wakeWordEnabled ? 'text-blue-400 animate-pulse' : 'text-gray-500'}`} />
            <span>Wake-Word: 'Hey VoiceMate'</span>
          </button>
        </div>

        <div className="text-xs text-gray-400 flex items-center space-x-2 font-mono">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span>Latency: 42ms</span>
        </div>
      </div>

      {/* Orb Center Visualizer */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Outer Pulsing Wave Rings when active */}
        <AnimatePresence>
          {(isListening || assistantState === 'speaking' || assistantState === 'processing') && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-36 h-36 rounded-full bg-blue-500/20 blur-2xl"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: [1, 1.25, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute w-44 h-44 rounded-full border border-blue-400/30 opacity-40"
              />
            </>
          )}
        </AnimatePresence>

        {/* Main Microphone Button & Orb */}
        <button
          onClick={onToggleListening}
          className="relative z-20 w-32 h-32 rounded-full border-4 border-blue-500/40 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.3)] bg-black/40 backdrop-blur-md transition-all duration-300 transform active:scale-95 group"
        >
          <div className="w-24 h-24 rounded-full border-2 border-white/20 flex flex-col items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
            {assistantState === 'processing' ? (
              <Sparkles className="w-10 h-10 text-blue-400 animate-spin" />
            ) : assistantState === 'speaking' ? (
              <Volume2 className="w-10 h-10 text-purple-400 animate-pulse" />
            ) : isListening ? (
              <Mic className="w-10 h-10 text-blue-300 animate-bounce" />
            ) : (
              <MicOff className="w-10 h-10 text-gray-400 group-hover:text-blue-400 transition-colors" />
            )}
          </div>
        </button>
      </div>

      {/* Dynamic Equalizer Spectrum Bars */}
      <div className="flex items-center justify-center space-x-1.5 h-8 my-3 z-10">
        {[40, 75, 30, 90, 60, 100, 50, 85, 35, 70, 45, 95, 60].map((height, idx) => (
          <motion.div
            key={idx}
            animate={
              isListening || assistantState === 'speaking'
                ? { height: [`${Math.max(10, height * 0.2)}%`, `${height}%`, `${Math.max(10, height * 0.3)}%`] }
                : { height: '15%' }
            }
            transition={{
              duration: 0.4 + (idx % 3) * 0.1,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            className={`w-1 rounded-full ${
              isListening
                ? 'bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]'
                : assistantState === 'speaking'
                ? 'bg-gradient-to-t from-purple-500 to-blue-400'
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Interim Speech Transcript or Prompt Guidance */}
      <div className="w-full text-center min-h-[44px] flex items-center justify-center px-4 my-2 z-10">
        {interimTranscript ? (
          <p className="text-sm font-medium text-blue-300 italic bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/30 animate-pulse">
            "{interimTranscript}"
          </p>
        ) : isListening ? (
          <p className="text-xs text-blue-400 font-medium tracking-widest uppercase">
            LISTENING...
          </p>
        ) : assistantState === 'processing' ? (
          <p className="text-xs text-purple-400 font-medium tracking-wide">✨ Processing request...</p>
        ) : (
          <p className="text-xs text-gray-400">
            Click microphone orb or press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] text-gray-300 font-mono">Space</kbd> to speak
          </p>
        )}
      </div>

      {/* Direct Text Fallback Form */}
      <form onSubmit={handleTextSubmit} className="w-full max-w-lg mt-3 flex items-center space-x-2 z-10">
        <input
          type="text"
          value={typedInput}
          onChange={(e) => setTypedInput(e.target.value)}
          placeholder="Or type a command (e.g. 'Set a reminder for 10am' or 'Weather in Tokyo')..."
          className="flex-1 bg-white/5 text-xs text-gray-200 placeholder-gray-500 px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 transition-all"
        />
        <button
          type="submit"
          disabled={!typedInput.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center space-x-1"
        >
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
