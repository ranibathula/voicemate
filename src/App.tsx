import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { MicOrb } from './components/MicOrb';
import { ChatHistory } from './components/ChatHistory';
import { WeatherWidget } from './components/WeatherWidget';
import { ReminderPanel } from './components/ReminderPanel';
import { NewsSection } from './components/NewsSection';
import { MusicPlayerPanel } from './components/MusicPlayerPanel';
import { LauncherPanel } from './components/LauncherPanel';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { AlarmModal } from './components/AlarmModal';

import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

import {
  ChatMessage,
  Reminder,
  WeatherData,
  NewsArticle,
  MusicTrack,
  AppLauncherItem,
  VoiceSettings,
  AssistantState,
} from './types';
import { DEFAULT_TRACKS } from './data/musicTracks';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('assistant');
  const [assistantState, setAssistantState] = useState<AssistantState>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initial Settings
  const [settings, setSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('voicemate_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      wakeWordEnabled: false,
      wakeWord: 'voice mate',
      selectedVoiceName: '',
      speechRate: 1.0,
      speechPitch: 1.0,
      speechVolume: 1.0,
      language: 'en-US',
      autoSpeakResponse: true,
      theme: 'dark-neon',
    };
  });

  useEffect(() => {
    localStorage.setItem('voicemate_settings', JSON.stringify(settings));
  }, [settings]);

  // Chat Stream Messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: "Hello! I'm VoiceMate, your AI voice assistant. How can I help you today? You can ask me about weather, set reminders, read news, open web apps, or play relaxation music.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Reminders & Alarms State
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem('voicemate_reminders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'rem-1',
        title: 'Review VoiceMate Architecture & OOP Code',
        time: '14:00',
        date: new Date().toISOString().split('T')[0],
        category: 'Work',
        completed: false,
        priority: 'high',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'rem-2',
        title: 'Hydration & Stretch Break',
        time: '16:30',
        date: new Date().toISOString().split('T')[0],
        category: 'Health',
        completed: false,
        priority: 'medium',
        createdAt: new Date().toISOString(),
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('voicemate_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Weather State
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // News State
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isNewsLoading, setIsNewsLoading] = useState(false);

  // Music State
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(DEFAULT_TRACKS[0]);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Speech Synthesis
  const { voices, speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis({
    rate: settings.speechRate,
    pitch: settings.speechPitch,
    volume: isMuted ? 0 : settings.speechVolume,
    voiceName: settings.selectedVoiceName,
    onEnd: () => {
      setAssistantState((prev) => (prev === 'speaking' ? 'idle' : prev));
    },
  });

  // Keep assistantState in sync with SpeechSynthesis
  useEffect(() => {
    if (isSpeaking) {
      setAssistantState('speaking');
    } else if (assistantState === 'speaking') {
      setAssistantState('idle');
    }
  }, [isSpeaking]);

  // Fetch Initial Weather
  const fetchWeather = useCallback(async (city: string = 'New York') => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setIsWeatherLoading(false);
    }
  }, []);

  // Fetch Initial News
  const fetchNews = useCallback(async (queryOrCategory: string = 'tech') => {
    setIsNewsLoading(true);
    try {
      const res = await fetch(`/api/news?query=${encodeURIComponent(queryOrCategory)}`);
      if (res.ok) {
        const data = await res.json();
        setNewsArticles(data);
      }
    } catch (err) {
      console.warn('News fetch error:', err);
    } finally {
      setIsNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather('New York');
    fetchNews('tech');
  }, [fetchWeather, fetchNews]);

  // Execute Core Voice Command & Intent Dispatcher
  const processVoiceCommand = useCallback(
    async (queryText: string) => {
      if (!queryText.trim()) return;

      const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: queryText,
        timestamp: userTime,
      };

      setMessages((prev) => [...prev, userMsg]);
      setAssistantState('processing');

      try {
        const res = await fetch('/api/assistant/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: queryText,
            language: settings.language,
            context: {
              remindersCount: reminders.length,
              isMusicPlaying,
            },
          }),
        });

        if (!res.ok) {
          throw new Error('Server process returned error');
        }

        const data = await res.json();
        const { intent, responseText, entities, actionData } = data;

        const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'assistant',
          text: responseText,
          timestamp: aiTime,
          intent,
          actionData,
        };

        setMessages((prev) => [...prev, aiMsg]);

        // Speak AI Response
        if (settings.autoSpeakResponse && !isMuted) {
          speak(responseText);
        } else {
          setAssistantState('idle');
        }

        // Execute Intent Actions
        if (intent === 'weather') {
          const targetCity = entities?.city || 'New York';
          fetchWeather(targetCity);
        } else if (intent === 'reminder') {
          const newRemTitle = entities?.reminderTitle || actionData?.title || queryText;
          const newRem: Reminder = {
            id: `rem-${Date.now()}`,
            title: newRemTitle,
            time: actionData?.time || '10:00',
            date: actionData?.date || new Date().toISOString().split('T')[0],
            category: actionData?.category || 'Personal',
            completed: false,
            triggered: false,
            priority: actionData?.priority || 'medium',
            createdAt: new Date().toISOString(),
          };
          setReminders((prev) => [newRem, ...prev]);
        } else if (intent === 'news') {
          if (actionData?.articles && Array.isArray(actionData.articles) && actionData.articles.length > 0) {
            setNewsArticles(actionData.articles);
          } else {
            const queryTopic = entities?.newsQuery || entities?.newsCategory || 'tech';
            fetchNews(queryTopic);
          }
        } else if (intent === 'play_music') {
          setIsMusicPlaying(true);
        } else if (intent === 'pause_music') {
          setIsMusicPlaying(false);
        } else if (intent === 'open_app') {
          const targetApp = entities?.appName || 'google';
          if (targetApp.includes('youtube')) window.open('https://www.youtube.com', '_blank');
          else if (targetApp.includes('github')) window.open('https://github.com', '_blank');
          else if (targetApp.includes('spotify')) window.open('https://open.spotify.com', '_blank');
          else if (targetApp.includes('maps')) window.open('https://maps.google.com', '_blank');
          else window.open(`https://www.google.com/search?q=${encodeURIComponent(targetApp)}`, '_blank');
        } else if (intent === 'python_architecture') {
          setActiveTab('python');
        }
      } catch (err) {
        console.error('Error processing command:', err);
        setAssistantState('error');
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I encountered an error processing your request. Please check your network connection and try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
        setTimeout(() => setAssistantState('idle'), 3000);
      }
    },
    [settings, isMuted, reminders.length, isMusicPlaying, speak, fetchWeather, fetchNews]
  );

  // Speech Recognition Hook
  const {
    isListening,
    interimTranscript,
    startListening,
    stopListening,
  } = useSpeechRecognition({
    onResult: (finalText) => {
      setAssistantState('processing');
      processVoiceCommand(finalText);
    },
    wakeWordEnabled: settings.wakeWordEnabled,
    wakeWord: settings.wakeWord,
    language: settings.language,
    onWakeWordDetected: () => {
      speak("Yes, I'm listening!");
    },
  });

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
      setAssistantState('idle');
    } else {
      stopSpeaking();
      startListening();
      setAssistantState('listening');
    }
  };

  // Keyboard Spacebar Shortcut for Mic Toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        handleToggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  // Active Alarm & Sound Trigger Engine
  const [activeAlarm, setActiveAlarm] = useState<Reminder | null>(null);
  const alarmIntervalRef = React.useRef<any>(null);

  const stopAlarmAudio = useCallback(() => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  }, []);

  const playAlarmBeep = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn('AudioContext alarm beep error:', e);
    }
  }, []);

  const startAlarmAudio = useCallback(() => {
    stopAlarmAudio();
    playAlarmBeep();
    alarmIntervalRef.current = setInterval(() => {
      playAlarmBeep();
    }, 1200);
  }, [stopAlarmAudio, playAlarmBeep]);

  // Convert time strings ("14:30", "02:30 PM", "10:00 AM", etc.) to total minutes from midnight
  const parseTimeToMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const clean = timeStr.trim().toLowerCase();
    const isPm = clean.includes('pm');
    const isAm = clean.includes('am');
    const numbers = clean.replace(/[^0-9:]/g, '').split(':');

    let hours = parseInt(numbers[0] || '0', 10);
    const minutes = parseInt(numbers[1] || '0', 10);

    if (isPm && hours < 12) hours += 12;
    if (isAm && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  // Real-time Alarm Monitor (checks due reminders every 2 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();

      reminders.forEach((r) => {
        if (!r.completed && !r.triggered) {
          const rDate = r.date || currentDateStr;
          const rMinutes = parseTimeToMinutes(r.time);

          if (rDate <= currentDateStr && currentTotalMinutes >= rMinutes) {
            setReminders((prev) =>
              prev.map((item) => (item.id === r.id ? { ...item, triggered: true } : item))
            );

            setActiveAlarm(r);
            startAlarmAudio();

            if (settings.autoSpeakResponse && !isMuted) {
              speak(`Reminder alert! ${r.title}`);
            }
          }
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [reminders, settings.autoSpeakResponse, isMuted, speak, startAlarmAudio]);

  const handleDismissAlarm = (id: string) => {
    stopAlarmAudio();
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed: true, triggered: true } : r))
    );
    setActiveAlarm(null);
  };

  const handleSnoozeAlarm = (id: string) => {
    stopAlarmAudio();
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);

    const targetDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const targetTime = `${hours}:${minutes}`;

    setReminders((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              date: targetDate,
              time: targetTime,
              triggered: false,
              completed: false,
            }
          : r
      )
    );
    setActiveAlarm(null);
  };

  return (
    <div className="min-h-screen bg-[#020204] text-[#e0e0e0] flex flex-col font-sans relative overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Background Atmosphere Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] -right-[5%] w-[500px] h-[500px] bg-purple-900/15 rounded-full blur-[100px]" />
      </div>

      {/* Top Desktop App Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        assistantState={assistantState}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
        remindersCount={reminders.filter((r) => !r.completed).length}
      />

      {/* Main Container Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        {/* Left Column: Voice Orb & Interactive Chat Stream */}
        <div className="lg:col-span-6 flex flex-col space-y-6">
          <MicOrb
            assistantState={assistantState}
            isListening={isListening}
            onToggleListening={handleToggleListening}
            interimTranscript={interimTranscript}
            wakeWordEnabled={settings.wakeWordEnabled}
            onToggleWakeWord={() =>
              setSettings((prev) => ({ ...prev, wakeWordEnabled: !prev.wakeWordEnabled }))
            }
            onSendDirectPrompt={processVoiceCommand}
          />

          <div className="flex-1 min-h-[380px]">
            <ChatHistory
              messages={messages}
              onReplayAudio={(text) => speak(text)}
              onClearHistory={() =>
                setMessages([
                  {
                    id: 'reset-msg',
                    sender: 'assistant',
                    text: 'Chat thread cleared. VoiceMate is ready for your next command.',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ])
              }
              onSelectQuickPrompt={processVoiceCommand}
              onTabChange={setActiveTab}
            />
          </div>
        </div>

        {/* Right Column: Tab View Panels */}
        <div className="lg:col-span-6 flex flex-col min-h-[500px]">
          {activeTab === 'assistant' && (
            <div className="grid grid-cols-1 gap-6 h-full">
              <WeatherWidget
                weather={weather}
                onSearchCity={fetchWeather}
                onAskWeatherVoice={(city) => processVoiceCommand(`What's the weather in ${city}?`)}
                isLoading={isWeatherLoading}
              />
              <ReminderPanel
                reminders={reminders}
                onAddReminder={(rem) =>
                  setReminders((prev) => [
                    {
                      ...rem,
                      id: `rem-${Date.now()}`,
                      createdAt: new Date().toISOString(),
                    },
                    ...prev,
                  ])
                }
                onToggleComplete={(id) =>
                  setReminders((prev) =>
                    prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
                  )
                }
                onDeleteReminder={(id) =>
                  setReminders((prev) => prev.filter((r) => r.id !== id))
                }
                onTestAlarmSound={playAlarmBeep}
              />
            </div>
          )}

          {activeTab === 'reminders' && (
            <ReminderPanel
              reminders={reminders}
              onAddReminder={(rem) =>
                setReminders((prev) => [
                  {
                    ...rem,
                    id: `rem-${Date.now()}`,
                    createdAt: new Date().toISOString(),
                  },
                  ...prev,
                ])
              }
              onToggleComplete={(id) =>
                setReminders((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
                )
              }
              onDeleteReminder={(id) =>
                setReminders((prev) => prev.filter((r) => r.id !== id))
              }
              onTestAlarmSound={playAlarmBeep}
            />
          )}

          {activeTab === 'weather' && (
            <WeatherWidget
              weather={weather}
              onSearchCity={fetchWeather}
              onAskWeatherVoice={(city) => processVoiceCommand(`What's the weather in ${city}?`)}
              isLoading={isWeatherLoading}
            />
          )}

          {activeTab === 'news' && (
            <NewsSection
              articles={newsArticles}
              onReadArticleAloud={(art) =>
                speak(`Headline: ${art.title}. Summary: ${art.summary}`)
              }
              isLoading={isNewsLoading}
              onRefreshCategory={fetchNews}
            />
          )}

          {activeTab === 'music' && (
            <MusicPlayerPanel
              currentTrack={currentTrack}
              isPlaying={isMusicPlaying}
              onTogglePlay={() => setIsMusicPlaying(!isMusicPlaying)}
              onSelectTrack={(trk) => {
                setCurrentTrack(trk);
                setIsMusicPlaying(true);
              }}
              onNextTrack={() => {
                const idx = DEFAULT_TRACKS.findIndex((t) => t.id === currentTrack.id);
                const nextIdx = (idx + 1) % DEFAULT_TRACKS.length;
                setCurrentTrack(DEFAULT_TRACKS[nextIdx]);
                setIsMusicPlaying(true);
              }}
              onPrevTrack={() => {
                const idx = DEFAULT_TRACKS.findIndex((t) => t.id === currentTrack.id);
                const prevIdx = (idx - 1 + DEFAULT_TRACKS.length) % DEFAULT_TRACKS.length;
                setCurrentTrack(DEFAULT_TRACKS[prevIdx]);
                setIsMusicPlaying(true);
              }}
            />
          )}

          {activeTab === 'launcher' && (
            <LauncherPanel
              onLaunchApp={(app) => {
                window.open(app.url, '_blank');
              }}
            />
          )}

          {activeTab === 'python' && <PythonCodeViewer />}
        </div>
      </main>

      {/* Active Alarm Trigger Popup Modal */}
      {activeAlarm && (
        <AlarmModal
          reminder={activeAlarm}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
          onStopSound={stopAlarmAudio}
        />
      )}

      {/* Voice & System Settings Modal */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSet) => setSettings((prev) => ({ ...prev, ...newSet }))}
        availableVoices={voices}
        onTestVoice={() =>
          speak("Hello! This is a test of VoiceMate's text to speech voice synthesis engine.")
        }
      />
    </div>
  );
}
