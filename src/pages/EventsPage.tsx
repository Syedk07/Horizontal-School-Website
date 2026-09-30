import React, { useState } from 'react';
import { EventItem } from '../types';
import { Calendar, Clock, MapPin, Search, X, Check } from 'lucide-react';

interface EventsPageProps {
  events: EventItem[];
  loading: boolean;
  onRefresh: () => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, loading }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [rsvpSuccess, setRsvpSuccess] = useState<boolean>(false);

  const categories = ['All', 'Annual Day', 'Science Exhibition', 'Sports', 'Cultural', 'PTM', 'Workshop'];

  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenModal = (ev: EventItem) => {
    setActiveModalEvent(ev);
    setRsvpSuccess(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* 1. Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          School Calendar
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Events & Convocations
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          From scientific exhibitions to athletics galas and parent conferences, stay connected with key dates across the HORIZON academic year.
        </p>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-sm">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events or locations..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800"
          />
        </div>
      </div>

      {/* 3. Events Grid */}
      {loading ? (
        <div className="text-center py-20 text-stone-500 font-mono text-sm">
          Loading events from HORIZON server...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-xl p-8 space-y-3">
          <p className="text-stone-600 font-serif text-xl">No events match your selected criteria.</p>
          <button
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            className="text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
          >
            Clear Filters & View All
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleOpenModal(event)}
              className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="h-48 bg-stone-100 relative overflow-hidden">
                <img
                  src={event.image_url || '/assets/images/hero_school_campus_1790610519961.jpg'}
                  alt={event.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-xs px-2.5 py-1 rounded">
                  {event.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-800">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-900 transition-colors leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-1 text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Event Details Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 space-y-0">
            <div className="h-48 relative overflow-hidden bg-stone-900">
              <img
                src={activeModalEvent.image_url || '/assets/images/hero_school_campus_1790610519961.jpg'}
                alt={activeModalEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setActiveModalEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-stone-900/80 text-white hover:bg-stone-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 bg-stone-900/90 text-amber-300 text-xs px-2.5 py-1 rounded">
                {activeModalEvent.category}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                {activeModalEvent.title}
              </h2>

              <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200 text-xs text-stone-700">
                <div>
                  <span className="text-stone-400 block">Date</span>
                  <span className="font-semibold">{activeModalEvent.date}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Time</span>
                  <span className="font-semibold">{activeModalEvent.time}</span>
                </div>
                <div className="col-span-2 pt-2 border-t border-stone-200">
                  <span className="text-stone-400 block">Location</span>
                  <span className="font-semibold font-mono">{activeModalEvent.location}</span>
                </div>
              </div>

              <div className="text-xs text-stone-600 leading-relaxed max-h-40 overflow-y-auto">
                {activeModalEvent.description}
              </div>

              <div className="pt-2 flex items-center gap-3">
                {rsvpSuccess ? (
                  <div className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>RSVP Confirmed. Reminder added to student portal.</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setRsvpSuccess(true)}
                    className="flex-1 py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Confirm Attendance / RSVP
                  </button>
                )}
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

