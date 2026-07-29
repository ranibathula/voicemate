import React, { useState } from 'react';
import { Newspaper, Volume2, ExternalLink, Sparkles, Search } from 'lucide-react';
import { NewsArticle } from '../types';

interface NewsSectionProps {
  articles: NewsArticle[];
  onReadArticleAloud: (article: NewsArticle) => void;
  isLoading: boolean;
  onRefreshCategory: (category: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({
  articles,
  onReadArticleAloud,
  isLoading,
  onRefreshCategory,
}) => {
  const [selectedCat, setSelectedCat] = useState('tech');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'Telangana', label: 'Telangana' },
    { id: 'India', label: 'India' },
    { id: 'tech', label: 'Tech & AI' },
    { id: 'business', label: 'Business' },
  ];

  const handleSelectCat = (catId: string) => {
    setSelectedCat(catId);
    setSearchQuery('');
    onRefreshCategory(catId);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSelectedCat('custom');
      onRefreshCategory(searchQuery.trim());
    }
  };

  return (
    <div className="p-6 bg-[#08080a]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex flex-col h-full justify-between">
      <div>
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.3)]">
              <Newspaper className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-100">Live AI News Feed</h3>
              <p className="text-[11px] text-gray-400">Curated global & local headlines</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topic or region..."
                className="bg-white/5 border border-white/10 text-xs text-gray-200 placeholder-gray-500 pl-8 pr-3 py-1 rounded-xl focus:outline-none focus:border-blue-500/50 w-36 sm:w-44"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-2" />
            </form>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleSelectCat(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCat === cat.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500 text-xs">
              <Sparkles className="w-6 h-6 mx-auto mb-2 text-blue-400 animate-spin" />
              <span>Fetching latest headlines...</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs">No articles found in this category.</div>
          ) : (
            articles.map((art) => (
              <div
                key={art.id}
                className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-500/40 rounded-xl transition-all flex flex-col md:flex-row gap-4"
              >
                {art.imageUrl && (
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-full md:w-32 h-24 object-cover rounded-lg shrink-0 border border-white/10"
                  />
                )}

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 text-[10px] text-gray-400 mb-1">
                      <span className="font-semibold text-blue-400">{art.source}</span>
                      <span>•</span>
                      <span>{art.publishedAt}</span>
                    </div>

                    <h4 className="text-xs font-semibold text-gray-100 hover:text-blue-300 transition-colors line-clamp-2">
                      {art.title}
                    </h4>

                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                    <button
                      onClick={() => onReadArticleAloud(art)}
                      className="flex items-center space-x-1.5 text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Read Aloud</span>
                    </button>

                    <a
                      href={art.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-[11px] text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      <span>Full Article</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 text-center">
        <p className="text-[11px] text-gray-500">
          Try saying: <span className="text-blue-400 font-mono">"Read me the latest news"</span>
        </p>
      </div>
    </div>
  );
};
