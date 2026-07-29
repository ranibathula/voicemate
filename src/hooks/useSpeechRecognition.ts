import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onWakeWordDetected?: () => void;
  wakeWord?: string;
  wakeWordEnabled?: boolean;
  language?: string;
}

export function useSpeechRecognition({
  onResult,
  onWakeWordDetected,
  wakeWord = 'voice mate',
  wakeWordEnabled = false,
  language = 'en-US',
}: UseSpeechRecognitionOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [hasSupport, setHasSupport] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSupport(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: any) => {
        let currentInterim = '';
        let finalResult = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const resultText = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalResult += resultText;
          } else {
            currentInterim += resultText;
          }
        }

        setInterimTranscript(currentInterim);

        if (finalResult) {
          const cleanFinal = finalResult.trim();
          setTranscript(cleanFinal);

          // Check wake word if enabled
          if (wakeWordEnabled && cleanFinal.toLowerCase().includes(wakeWord.toLowerCase())) {
            if (onWakeWordDetected) {
              onWakeWordDetected();
            }
          }

          if (onResult) {
            onResult(cleanFinal);
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setError(event.error);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch (err: any) {
      console.error('Failed to instantiate SpeechRecognition:', err);
      setHasSupport(false);
    }
  }, [language, wakeWordEnabled, wakeWord, onResult, onWakeWordDetected]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      setTranscript('');
      setInterimTranscript('');
      setError(null);
      recognitionRef.current.start();
    } catch (err) {
      // If already started, stop and restart
      try {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current.start(), 150);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error(err);
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    hasSupport,
    error,
    startListening,
    stopListening,
  };
}
