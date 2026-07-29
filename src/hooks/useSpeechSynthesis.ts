import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechSynthesisOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceName?: string;
  onEnd?: () => void;
}

export function useSpeechSynthesis({
  rate = 1,
  pitch = 1,
  volume = 1,
  voiceName = '',
  onEnd,
}: UseSpeechSynthesisOptions = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;

      const updateVoices = () => {
        const availableVoices = synthRef.current?.getVoices() || [];
        setVoices(availableVoices);
      };

      updateVoices();
      if (synthRef.current.onvoiceschanged !== undefined) {
        synthRef.current.onvoiceschanged = updateVoices;
      }
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!synthRef.current || !text) return;

      // Cancel any ongoing speech
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      if (voiceName) {
        const selectedVoice = voices.find((v) => v.name === voiceName);
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
      } else {
        // Find best default natural English voice if available
        const defaultVoice =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];
        if (defaultVoice) {
          utterance.voice = defaultVoice;
        }
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
        setIsPaused(false);
      };

      synthRef.current.speak(utterance);
    },
    [voices, rate, pitch, volume, voiceName, onEnd]
  );

  const stop = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!synthRef.current) return;
    synthRef.current.resume();
    setIsPaused(false);
  }, []);

  return {
    voices,
    isSpeaking,
    isPaused,
    speak,
    stop,
    pause,
    resume,
  };
}
