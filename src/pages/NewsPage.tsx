import React, { useState } from 'react';
import { NewsItem } from '../types';
import { Calendar, User, ArrowRight, X, Share2, Check } from 'lucide-react';

interface NewsPageProps {
  news: NewsItem[];
  loading: boolean;
}

export const NewsPage: React.FC<NewsPageProps> = ({ news, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const categories = ['All', 'Achievement', 'Campus', 'Research', 'Community'];

  const filteredNews = news.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const handleShare = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Press & Chronicles
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          News from HORIZON
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Celebrating scholarly breakthroughs, campus developments, faculty publications, and student community contributions.
        </p>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`py-2 px-4 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. News Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-500 font-mono text-sm">
          Loading news articles...
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-xl p-8">
          <p className="text-stone-600 font-serif text-xl">No articles found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => setActiveArticle(item)}
              className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-52 bg-stone-100 relative overflow-hidden">
                  <img
                    src={item.image_url || '/assets/images/hero_school_campus_1790610519961.jpg'}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-xs px-2.5 py-1 rounded">
                    {item.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.author}</span>
                  </div>

                  <h2 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between text-xs font-semibold text-amber-800">
                <span>Read Full Chronicle</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 4. Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200">
            <div className="h-64 relative bg-stone-900">
              <img
                src={activeArticle.image_url || '/assets/images/hero_school_campus_1790610519961.jpg'}
                alt={activeArticle.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 bg-stone-900/90 text-amber-300 text-xs px-2.5 py-1 rounded">
                {activeArticle.category}
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeArticle.date}</span>
                    <span aria-hidden="true">·</span>
                    <User className="w-3.5 h-3.5" />
                    <span>{activeArticle.author}</span>
                  </div>
                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
                  </button>
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
                  {activeArticle.title}
                </h1>
              </div>

              <div className="p-4 bg-stone-50 border-l-4 border-amber-800 text-sm italic text-stone-700 leading-relaxed font-serif">
                {activeArticle.description}
              </div>

              <div className="text-sm text-stone-700 leading-relaxed space-y-4 whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                <div className="text-xs text-stone-500">
                  Published by HORIZON Office of Communications
                </div>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

