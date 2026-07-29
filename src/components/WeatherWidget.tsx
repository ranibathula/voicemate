import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Search,
  MapPin,
  RefreshCw,
  Volume2,
} from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData | null;
  onSearchCity: (city: string) => void;
  onAskWeatherVoice: (city: string) => void;
  isLoading: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  onSearchCity,
  onAskWeatherVoice,
  isLoading,
}) => {
  const [inputCity, setInputCity] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCity.trim()) return;
    onSearchCity(inputCity.trim());
  };

  const getWeatherIcon = (iconName: string) => {
    if (iconName === 'CloudRain' || iconName.includes('rain')) return <CloudRain className="w-12 h-12 text-blue-400" />;
    if (iconName === 'Sun' || iconName.includes('sun') || iconName.includes('clear')) return <Sun className="w-12 h-12 text-amber-400" />;
    return <CloudSun className="w-12 h-12 text-cyan-400" />;
  };

  return (
    <div className="p-6 bg-[#08080a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col h-full justify-between">
      <div>
        {/* Top Search Bar & Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Live Weather Radar</h3>
              <p className="text-[11px] text-gray-400">Real-time climate telemetry</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={inputCity}
                onChange={(e) => setInputCity(e.target.value)}
                placeholder="Search City..."
                className="bg-white/5 border border-white/10 text-xs text-gray-200 placeholder-gray-500 pl-8 pr-3 py-1.5 rounded-xl focus:outline-none focus:border-blue-500/50"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-[0_0_10px_rgba(59,130,246,0.4)]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </form>
        </div>

        {/* Current Weather Focus */}
        {weather ? (
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 relative overflow-hidden mb-6 shadow-inner">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center space-x-2 text-gray-400 text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-medium text-gray-200">{weather.city}, {weather.country}</span>
                </div>
                <div className="text-5xl font-light text-white tracking-tight my-2">
                  {weather.temp}°<span className="text-2xl text-blue-400">F</span>
                </div>
                <p className="text-sm font-medium text-blue-300">{weather.condition}</p>
                <p className="text-xs text-gray-400 mt-1">
                  High: <span className="text-gray-200 font-semibold">{weather.high}°</span> / Low: <span className="text-gray-200 font-semibold">{weather.low}°</span>
                </p>
              </div>

              <div className="flex flex-col items-end">
                {getWeatherIcon(weather.icon)}
                <button
                  onClick={() => onAskWeatherVoice(weather.city)}
                  className="mt-4 flex items-center space-x-1.5 px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-xl text-xs transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]"
                >
                  <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Read Aloud</span>
                </button>
              </div>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-3 bg-black/30 p-3 rounded-xl border border-white/5">
                <Droplets className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Humidity</p>
                  <p className="text-xs font-bold text-gray-200">{weather.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 bg-black/30 p-3 rounded-xl border border-white/5">
                <Wind className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Wind Speed</p>
                  <p className="text-xs font-bold text-gray-200">{weather.windSpeed} mph</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-gray-500">Loading weather telemetry...</div>
        )}

        {/* 5-Day Forecast Grid */}
        {weather && weather.forecast && (
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">5-Day Climate Forecast</h4>
            <div className="grid grid-cols-5 gap-2">
              {weather.forecast.map((fc, i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl text-center flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-400 mb-1">{fc.day}</span>
                  <CloudSun className="w-5 h-5 text-blue-400 my-1" />
                  <span className="text-sm font-semibold text-gray-200">{fc.temp}°</span>
                  <span className="text-[10px] text-gray-500 truncate max-w-[50px]">{fc.condition}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[11px] text-gray-500">
          Try saying: <span className="text-blue-400 font-mono">"What's the weather in Sydney?"</span>
        </p>
      </div>
    </div>
  );
};
