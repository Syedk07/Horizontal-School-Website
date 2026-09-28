import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface GalleryPageProps {
  gallery: GalleryItem[];
  loading: boolean;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ gallery, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const categories = ['All', 'Campus', 'Events', 'Sports', 'Classrooms', 'Activities', 'Students'];

  const filteredItems = gallery.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex === null) return;
    setActiveImageIndex((activeImageIndex + 1) % filteredItems.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Visual Archives
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Campus Life in Frames
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Glimpses into our scientific research bays, athletics grounds, creative studios, and centennial architecture.
        </p>
      </div>

      {/* 2. Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setActiveImageIndex(null);
            }}
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

      {/* 3. Image Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-500 font-mono text-sm">
          Loading gallery images...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-xl p-8">
          <p className="text-stone-600 font-serif text-xl">No photographs cataloged in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setActiveImageIndex(idx)}
              className="group relative bg-stone-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer aspect-4/3 border border-stone-200"
            >
              <img
                src={item.image_url}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
                <span className="text-xs text-amber-300 font-medium">{item.category}</span>
                <h3 className="font-serif text-lg font-bold leading-snug">{item.title}</h3>
                {item.caption && (
                  <p className="text-xs text-stone-300 mt-1 line-clamp-2">{item.caption}</p>
                )}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-stone-300 font-medium">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>View in High-Resolution Lightbox</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Fullscreen Lightbox Modal */}
      {activeImageIndex !== null && filteredItems[activeImageIndex] && (
        <div
          onClick={() => setActiveImageIndex(null)}
          className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-white max-w-6xl mx-auto w-full">
            <div className="space-y-0.5">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">
                {filteredItems[activeImageIndex].category} · {activeImageIndex + 1} of {filteredItems.length}
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold">
                {filteredItems[activeImageIndex].title}
              </h2>
            </div>
            <button
              onClick={() => setActiveImageIndex(null)}
              className="p-2 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image Viewer */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-4">
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <img
              src={filteredItems[activeImageIndex].image_url}
              alt={filteredItems[activeImageIndex].title}
              referrerPolicy="no-referrer"
              className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-stone-900/80 text-white hover:bg-stone-800 transition-colors cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div className="max-w-3xl mx-auto text-center text-stone-300 text-sm italic font-serif">
            {filteredItems[activeImageIndex].caption || 'Archival image from HORIZONTAL campus and academic records.'}
          </div>
        </div>
      )}

    </div>
  );
};
