import { AppLauncherItem } from '../types';

export const DEFAULT_LAUNCHER_APPS: AppLauncherItem[] = [
  {
    id: 'app-youtube',
    name: 'YouTube',
    category: 'Web App',
    url: 'https://www.youtube.com',
    iconName: 'Youtube',
    color: 'from-red-500 to-rose-600',
    commandAliases: ['youtube', 'open youtube', 'play youtube', 'watch videos']
  },
  {
    id: 'app-google',
    name: 'Google Search',
    category: 'Web App',
    url: 'https://www.google.com',
    iconName: 'Search',
    color: 'from-blue-500 to-indigo-600',
    commandAliases: ['google', 'open google', 'google search', 'browser']
  },
  {
    id: 'app-github',
    name: 'GitHub',
    category: 'Productivity',
    url: 'https://github.com',
    iconName: 'Github',
    color: 'from-gray-700 to-gray-900',
    commandAliases: ['github', 'open github', 'my repositories', 'git']
  },
  {
    id: 'app-wikipedia',
    name: 'Wikipedia',
    category: 'Productivity',
    url: 'https://www.wikipedia.org',
    iconName: 'BookOpen',
    color: 'from-zinc-600 to-slate-800',
    commandAliases: ['wikipedia', 'open wikipedia', 'wiki']
  },
  {
    id: 'app-spotify',
    name: 'Spotify Web',
    category: 'Social',
    url: 'https://open.spotify.com',
    iconName: 'Music',
    color: 'from-emerald-500 to-green-600',
    commandAliases: ['spotify', 'open spotify', 'music app']
  },
  {
    id: 'app-gmail',
    name: 'Gmail',
    category: 'Productivity',
    url: 'https://mail.google.com',
    iconName: 'Mail',
    color: 'from-red-600 to-amber-600',
    commandAliases: ['gmail', 'open gmail', 'check mail', 'email']
  },
  {
    id: 'app-maps',
    name: 'Google Maps',
    category: 'Web App',
    url: 'https://maps.google.com',
    iconName: 'MapPin',
    color: 'from-teal-500 to-emerald-600',
    commandAliases: ['maps', 'open maps', 'google maps', 'directions']
  },
  {
    id: 'app-calculator',
    name: 'System Calculator',
    category: 'System Tool',
    url: 'https://www.google.com/search?q=calculator',
    iconName: 'Calculator',
    color: 'from-purple-500 to-indigo-600',
    commandAliases: ['calculator', 'open calculator', 'calc']
  }
];
