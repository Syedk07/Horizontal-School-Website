import React from 'react';
import { SchoolStats, Announcement, EventItem } from '../types';
import { ArrowRight, Calendar, Bell, Award, BookOpen, Compass, Shield, Users, Sparkles } from 'lucide-react';

interface HomePageProps {
  stats: SchoolStats | null;
  announcements: Announcement[];
  events: EventItem[];
  onNavigate: (tab: string) => void;
  onOpenPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  stats,
  announcements,
  events,
  onNavigate,
  onOpenPortal,
}) => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-stone-900 text-white min-h-[580px] lg:min-h-[640px] flex items-center">
        {/* Campus Background Image with dark editorial scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/hero_school_campus_1790610519961.jpg"
            alt="HORIZONTAL Campus Architectural Pavilion and Grounds"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-900/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>An Institution of Scholarly Excellence</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
              Where Learning Moves Forward.
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-normal">
              At HORIZONTAL, education is an intentional trajectory. Through rigorous scholarship, empirical discovery, and disciplined leadership, we cultivate discerning minds prepared to advance society.
            </p>

            {/* Real functional CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('academics')}
                className="px-6 py-3.5 text-sm font-semibold text-stone-950 bg-white hover:bg-stone-100 rounded-lg shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span>Explore HORIZONTAL</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('admissions')}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-600 rounded-lg shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Admissions 2026–27
              </button>

              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 text-sm font-medium text-stone-200 hover:text-white bg-stone-800/80 hover:bg-stone-800 border border-stone-700 rounded-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Contact Admissions
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Quick Information Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div
            onClick={() => onNavigate('admissions')}
            className="group p-6 bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                Admissions Open
              </h3>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                Accepting applications for Grades 1 through 12. Merit scholarships and guided campus tours available.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">
              <span>View Requirements & Apply</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('academics')}
            className="group p-6 bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-800 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                Academic Programs
              </h3>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                Comprehensive curriculum blending international baccalaureate standards with high-order STEM investigations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-stone-700 group-hover:translate-x-1 transition-transform">
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('campus-life')}
            className="group p-6 bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                Student Activities
              </h3>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                Over 28 competitive societies, from national-finalist robotics to chamber orchestra and varsity athletics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-stone-700 group-hover:translate-x-1 transition-transform">
              <span>Discover Campus Life</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          <div
            onClick={() => onNavigate('events')}
            className="group p-6 bg-white border border-stone-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-stone-900 group-hover:text-amber-900 transition-colors">
                Upcoming Events
              </h3>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">
                Founder's Day convocation, regional science symposia, and academic parent-teacher forums.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center text-xs font-semibold text-stone-700 group-hover:translate-x-1 transition-transform">
              <span>View School Calendar</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>
      </section>

      {/* 3. Institutional Key Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 bg-stone-100 border border-stone-200 rounded-2xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-stone-300">
            <div className="pt-4 sm:pt-0">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tabular-nums">
                {stats ? stats.students_count.toLocaleString() : '1,240'}+
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">
                Enrolled Scholars
              </div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tabular-nums">
                {stats?.student_teacher_ratio || '12:1'}
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">
                Student-Faculty Ratio
              </div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tabular-nums">
                {stats?.campus_acres || 64}
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">
                Acres of Green Campus
              </div>
            </div>
            <div className="pt-4 sm:pt-0 sm:pl-4">
              <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tabular-nums">
                {stats?.college_acceptance || '99.4%'}
              </div>
              <div className="text-xs uppercase tracking-widest text-stone-500 mt-2 font-medium">
                Collegiate Acceptance
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Educational Philosophy & Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
            Institutional Foundations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
            The Four Pillars of HORIZONTAL
          </h2>
          <p className="text-stone-600 mt-3 text-base leading-relaxed">
            Our pedagogical philosophy rests on the conviction that intellect without character is incomplete, and tradition must constantly dialogue with technological innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
            <Shield className="w-8 h-8 text-amber-800" />
            <h3 className="font-serif text-xl font-semibold text-stone-900">Academic Rigor</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Curricula designed to demand critical synthesis, rigorous mathematical proof, and thoughtful rhetorical argumentation.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
            <Users className="w-8 h-8 text-amber-800" />
            <h3 className="font-serif text-xl font-semibold text-stone-900">Character & Integrity</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Instilling an unshakeable ethical compass, active social responsibility, and deep respect for divergent viewpoints.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
            <Sparkles className="w-8 h-8 text-amber-800" />
            <h3 className="font-serif text-xl font-semibold text-stone-900">Modern Technology</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Early immersion in computational thinking, robotics prototyping, and empirical laboratory research methodologies.
            </p>
          </div>

          <div className="p-6 bg-white border border-stone-200 rounded-xl space-y-3">
            <Award className="w-8 h-8 text-amber-800" />
            <h3 className="font-serif text-xl font-semibold text-stone-900">Creative Expression</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Empowering students through fine arts, instrumental music, theatrical performance, and inter-scholastic debate.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Principal's Welcome Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-2xl overflow-hidden border border-stone-800 grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-5 h-80 lg:h-full relative min-h-[320px]">
            <img
              src="/assets/images/principal_portrait_1790610534155.jpg"
              alt="Dr. Marcus Vance, Head of School"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 space-y-6">
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Leadership Perspective
            </span>
            <blockquote className="font-serif text-2xl sm:text-3xl text-stone-100 italic leading-snug">
              "We do not educate students merely to pass tests, but to navigate an increasingly complex civilization with clarity, empathy, and intellectual purpose."
            </blockquote>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-white">Dr. Marcus Vance</div>
              <div className="text-xs text-stone-400">Head of School & Principal, Ph.D. Oxford, M.Ed. Harvard</div>
            </div>
            <div>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>Read the Principal's Full Address</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Live Announcements Section (from Python Flask DB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
              Notice Board
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Official Announcements
            </h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-sm font-semibold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>View All News & Notices</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="p-6 bg-white border border-stone-200 rounded-xl shadow-sm hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-medium text-amber-800">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-600 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Audience: {item.target_audience}</span>
                {item.is_pinned && (
                  <span className="text-amber-800 font-medium">★ Pinned</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Upcoming Events Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
              Calendar
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Events at HORIZONTAL
            </h2>
          </div>
          <button
            onClick={() => onNavigate('events')}
            className="text-sm font-semibold text-stone-700 hover:text-stone-900 inline-flex items-center gap-1 cursor-pointer self-start sm:self-auto"
          >
            <span>Full Event Calendar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={() => onNavigate('events')}
              className="group bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="h-44 bg-stone-100 relative overflow-hidden">
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

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-xs text-amber-800 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{event.date} · {event.time}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>
                <div className="pt-2 text-xs text-stone-500 font-mono">
                  📍 {event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-900 text-white rounded-2xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white max-w-2xl mx-auto">
            Ready to Begin Your Journey at HORIZONTAL?
          </h2>
          <p className="text-amber-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Discover a community dedicated to intellectual achievement and personal growth. Enrolment inquiries for the 2026–2027 academic term are now being reviewed.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => onNavigate('admissions')}
              className="px-6 py-3 bg-white text-stone-900 font-semibold text-sm rounded-lg hover:bg-stone-100 transition-colors cursor-pointer shadow-md"
            >
              Submit Admission Enquiry
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 bg-amber-800/80 hover:bg-amber-800 text-white border border-amber-700 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
            >
              Schedule Campus Visit
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
