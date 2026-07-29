import React, { useState } from 'react';
import {
  AppWindow,
  Search,
  ExternalLink,
  Plus,
  Cpu,
  HardDrive,
  Battery,
  Activity,
  Globe,
  Youtube,
  BookOpen,
  Music,
  Mail,
  MapPin,
  Calculator,
} from 'lucide-react';
import { DEFAULT_LAUNCHER_APPS } from '../data/appsList';
import { AppLauncherItem } from '../types';

interface LauncherPanelProps {
  onLaunchApp: (app: AppLauncherItem) => void;
}

export const LauncherPanel: React.FC<LauncherPanelProps> = ({ onLaunchApp }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [apps, setApps] = useState<AppLauncherItem[]>(DEFAULT_LAUNCHER_APPS);
  const [showAddForm, setShowAddForm] = useState(false);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Youtube':
        return <Youtube className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Music':
        return <Music className="w-5 h-5" />;
      case 'Mail':
        return <Mail className="w-5 h-5" />;
      case 'MapPin':
        return <MapPin className="w-5 h-5" />;
      case 'Calculator':
        return <Calculator className="w-5 h-5" />;
      default:
        return <Globe className="w-5 h-5" />;
    }
  };

  const handleAddCustomApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customUrl) return;

    let formattedUrl = customUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newApp: AppLauncherItem = {
      id: `app-${Date.now()}`,
      name: customName,
      category: 'Web App',
      url: formattedUrl,
      iconName: 'Globe',
      color: 'from-cyan-500 to-blue-600',
      commandAliases: [customName.toLowerCase(), `open ${customName.toLowerCase()}`],
    };

    setApps([newApp, ...apps]);
    setCustomName('');
    setCustomUrl('');
    setShowAddForm(false);
  };

  const filteredApps = apps.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#08080a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col h-full justify-between">
      <div>
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <AppWindow className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Application & Web Launcher</h3>
              <p className="text-[11px] text-gray-400">Launch desktop services via voice or click</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter apps..."
                className="bg-white/5 border border-white/10 text-xs text-gray-200 placeholder-gray-500 pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-blue-500/50"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center space-x-1 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Link</span>
            </button>
          </div>
        </div>

        {/* Add Link Form */}
        {showAddForm && (
          <form onSubmit={handleAddCustomApp} className="mb-6 p-4 bg-black/40 border border-white/10 rounded-xl space-y-3 backdrop-blur-md">
            <h4 className="text-xs font-semibold text-blue-400">Add New Quick Link</h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="Link Name..."
                className="bg-white/5 border border-white/10 text-xs text-gray-200 px-3 py-1.5 rounded-lg"
              />
              <input
                type="text"
                required
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="URL..."
                className="bg-white/5 border border-white/10 text-xs text-gray-200 px-3 py-1.5 rounded-lg"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1 bg-white/5 text-xs text-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button type="submit" className="px-3 py-1 bg-blue-600 text-xs text-white font-semibold rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.4)]">
                Save Link
              </button>
            </div>
          </form>
        )}

        {/* Grid View of Apps */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
          {filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onLaunchApp(app)}
              className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-xl transition-all flex flex-col items-center text-center group shadow-md"
            >
              <div
                className={`p-3 rounded-2xl bg-gradient-to-tr ${app.color} text-white shadow-lg mb-2 group-hover:scale-110 transition-transform`}
              >
                {getIcon(app.iconName)}
              </div>
              <h4 className="text-xs font-semibold text-gray-200 group-hover:text-blue-300 transition-colors">
                {app.name}
              </h4>
              <span className="text-[10px] text-gray-500 mt-0.5">{app.category}</span>
            </button>
          ))}
        </div>

        {/* System Telemetry Bar */}
        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold flex items-center justify-center space-x-1">
              <Cpu className="w-3 h-3 text-blue-400" />
              <span>CPU Load</span>
            </p>
            <p className="text-xs font-bold text-gray-200 font-mono mt-1">12%</p>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold flex items-center justify-center space-x-1">
              <HardDrive className="w-3 h-3 text-emerald-400" />
              <span>RAM</span>
            </p>
            <p className="text-xs font-bold text-gray-200 font-mono mt-1">2.4 / 16 GB</p>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold flex items-center justify-center space-x-1">
              <Battery className="w-3 h-3 text-amber-400" />
              <span>Battery</span>
            </p>
            <p className="text-xs font-bold text-gray-200 font-mono mt-1">98% Charging</p>
          </div>

          <div>
            <p className="text-[10px] text-gray-500 uppercase font-semibold flex items-center justify-center space-x-1">
              <Activity className="w-3 h-3 text-purple-400" />
              <span>AI Engine</span>
            </p>
            <p className="text-xs font-bold text-emerald-400 font-mono mt-1">Online</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[11px] text-gray-500">
          Try saying: <span className="text-blue-400 font-mono">"Open YouTube"</span> or <span className="text-blue-400 font-mono">"Open Google Maps"</span>
        </p>
      </div>
    </div>
  );
};
