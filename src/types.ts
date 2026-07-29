export type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export type IntentType = 
  | 'weather'
  | 'reminder'
  | 'news'
  | 'open_app'
  | 'web_search'
  | 'wikipedia'
  | 'play_music'
  | 'pause_music'
  | 'time_date'
  | 'smalltalk'
  | 'translate'
  | 'python_architecture'
  | 'general_qa';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: IntentType;
  actionData?: any;
  audioUrl?: string;
  isError?: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  time: string; // ISO string or HH:MM
  date: string; // YYYY-MM-DD
  category: 'Work' | 'Personal' | 'Health' | 'Alarm' | 'Meeting';
  completed: boolean;
  triggered?: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: 'tech' | 'ai' | 'science' | 'business' | 'world';
  url: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  category: 'Lofi' | 'Ambient' | 'Synthwave' | 'Piano' | 'Nature';
  duration: string;
  url: string;
  coverUrl: string;
}

export interface AppLauncherItem {
  id: string;
  name: string;
  category: 'Web App' | 'System Tool' | 'Social' | 'Productivity';
  url: string;
  iconName: string;
  color: string;
  commandAliases: string[];
}

export interface VoiceSettings {
  wakeWordEnabled: boolean;
  wakeWord: string;
  selectedVoiceName: string;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  language: string;
  autoSpeakResponse: boolean;
  theme: 'dark-neon' | 'dark-cyber' | 'dark-minimal';
}

export interface PythonFileItem {
  path: string;
  name: string;
  content: string;
  description: string;
  language: string;
}
