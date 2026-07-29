import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Radio,
  Sparkles,
} from 'lucide-react';
import { MusicTrack } from '../types';
import { DEFAULT_TRACKS } from '../data/musicTracks';

interface MusicPlayerPanelProps {
  currentTrack: MusicTrack;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSelectTrack: (track: MusicTrack) => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
}

export const MusicPlayerPanel: React.FC<MusicPlayerPanelProps> = ({
  currentTrack,
  isPlaying,
  onTogglePlay,
  onSelectTrack,
  onNextTrack,
  onPrevTrack,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn('Audio play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.duration) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration;
      setProgress(val);
    }
  };

  return (
    <div className="p-6 bg-[#08080a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col h-full justify-between">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onNextTrack}
      />

      <div>
        {/* Top Title */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-100">Ambient & Lofi Audio Player</h3>
            <p className="text-[11px] text-gray-400">Background soundscapes & focus music</p>
          </div>
        </div>

        {/* Current Active Track Card */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden mb-6 flex flex-col md:flex-row items-center gap-6 shadow-inner">
          <img
            src={currentTrack.coverUrl}
            alt={currentTrack.title}
            className="w-28 h-28 object-cover rounded-xl border border-white/10 shadow-xl shrink-0"
          />

          <div className="flex-1 w-full text-center md:text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20">
              {currentTrack.category}
            </span>
            <h4 className="text-base font-bold text-gray-100 my-1">{currentTrack.title}</h4>
            <p className="text-xs text-gray-400 mb-4">{currentTrack.artist}</p>

            {/* Timeline Progress Slider */}
            <div className="w-full space-y-1">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>0:00</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onPrevTrack}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={onTogglePlay}
                  className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>
                <button
                  onClick={onNextTrack}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Track Playlist Queue */}
        <div>
          <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Audio Library</h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {DEFAULT_TRACKS.map((trk) => {
              const isSelected = currentTrack.id === trk.id;
              return (
                <button
                  key={trk.id}
                  onClick={() => onSelectTrack(trk)}
                  className={`w-full p-3 rounded-xl border transition-all flex items-center justify-between text-left ${
                    isSelected
                      ? 'bg-blue-500/10 border-blue-500/40 text-blue-300'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img src={trk.coverUrl} alt={trk.title} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="text-xs font-semibold">{trk.title}</p>
                      <p className="text-[10px] text-gray-500">{trk.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-400">{trk.duration}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[11px] text-gray-500">
          Try saying: <span className="text-blue-400 font-mono">"Play music" or "Pause music"</span>
        </p>
      </div>
    </div>
  );
};
