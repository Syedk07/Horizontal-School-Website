import React, { useState } from 'react';
import { Trophy, Users, Palette, Cpu, Sparkles, Music, Globe, Flag, Compass } from 'lucide-react';

interface CampusLifePageProps {
  onNavigate: (tab: string) => void;
}

export const CampusLifePage: React.FC<CampusLifePageProps> = ({ onNavigate }) => {
  const [activeCategory, setActiveCategory] = useState<'sports' | 'clubs' | 'houses'>('sports');

  const sportsList = [
    {
      name: 'Athletics & Track & Field',
      facility: 'Centennial 400m All-Weather Synthetic Track',
      schedule: 'Mon, Wed, Fri 06:30 & 16:00',
      description: 'Sprints, middle distance, hurdles, long jump, and pole vault. Coached by Olympic certified athletic trainers.',
      image: '/assets/images/campus_sports_track_1790610573352.jpg',
    },
    {
      name: 'Varsity Soccer / Football',
      facility: 'Natural Bermuda Grass Championship Pitch',
      schedule: 'Tue, Thu, Sat 16:00',
      description: 'Boys and Girls varsity squads competing in regional prep leagues. State championship contenders for 4 consecutive years.',
      image: '/assets/images/campus_sports_track_1790610573352.jpg',
    },
    {
      name: 'Basketball',
      facility: 'Vance Fieldhouse Indoor Hardwood Courts',
      schedule: 'Mon–Thu 16:30',
      description: 'Junior Varsity and Varsity inter-scholastic competition with automated video review and shooting telemetry analytics.',
      image: '/assets/images/campus_sports_track_1790610573352.jpg',
    },
    {
      name: 'Cricket & Batting Cages',
      facility: 'North Oval Turf Wicket & Indoor Automated Nets',
      schedule: 'Wed & Sat 15:30',
      description: 'Tradition-rich cricket club playing two-day and T20 fixtures with international touring school squads.',
      image: '/assets/images/campus_sports_track_1790610573352.jpg',
    },
    {
      name: 'Badminton & Racquet Sports',
      facility: '4 BWF-Certified Indoor Courts',
      schedule: 'Mon, Wed, Fri 15:30',
      description: 'Singles and doubles ladder tournaments with focused agility training, tactical footwork, and reflex development.',
      image: '/assets/images/campus_sports_track_1790610573352.jpg',
    },
  ];

  const clubsList = [
    {
      name: 'Robotics & Autonomous Systems',
      category: 'STEM Innovation',
      advisor: 'David Chen, M.Sc.',
      desc: 'National finalists in autonomous mobile robotics. Students design, CNC mill, and code robots using Python, C++, and ROS.',
      image: '/assets/images/campus_robotics_lab_1790610559170.jpg',
      icon: Cpu,
    },
    {
      name: 'Algorithmic Coding & Cyber Club',
      category: 'Computing',
      advisor: 'Prof. Sarah Jenkins',
      desc: 'Competitive algorithmic problem solving on LeetCode/Codeforces, web development, cybersecurity penetration testing, and AI ethics.',
      image: '/assets/images/campus_robotics_lab_1790610559170.jpg',
      icon: Compass,
    },
    {
      name: 'Parliamentary Debate & Model UN',
      category: 'Rhetoric & Law',
      advisor: 'Elena Rostova, M.A.',
      desc: 'Extensive preparation for national Model UN assemblies, Oxford-style parliamentary debates, and policy drafting competitions.',
      image: '/assets/images/hero_school_campus_1790610519961.jpg',
      icon: Globe,
    },
    {
      name: 'Visual Arts & Ceramic Guild',
      category: 'Creative Arts',
      advisor: 'Amina Al-Mansoor, M.F.A.',
      desc: 'Oil painting on canvas, raku ceramics firing, printmaking, and architectural portfolio design for top design academies.',
      image: '/assets/images/school_art_studio_1790610590851.jpg',
      icon: Palette,
    },
    {
      name: 'Symphony Society & Chamber Choir',
      category: 'Music & Performance',
      advisor: 'Julian Thorne, B.Mus.',
      desc: 'Full 55-piece student orchestra performing baroque, classical, and contemporary film compositions at biannual gala concerts.',
      image: '/assets/images/school_art_studio_1790610590851.jpg',
      icon: Music,
    },
    {
      name: 'Empirical Science & Research Society',
      category: 'Natural Sciences',
      advisor: 'Dr. Alistair Finch',
      desc: 'Original student investigations in synthetic biology, environmental water quality telemetry, and astrophysics spectrometry.',
      image: '/assets/images/campus_robotics_lab_1790610559170.jpg',
      icon: Sparkles,
    },
  ];

  const houses = [
    {
      name: 'Orion House',
      motto: 'Ad Astra Per Aspera (Through Hardship to the Stars)',
      color: 'bg-blue-900',
      textColor: 'text-blue-900',
      badge: 'Eagle & Constellation',
      strengths: 'Physics, Astronomy, Cross-Country Athletics',
    },
    {
      name: 'Phoenix House',
      motto: 'Ex Cinere Resurgam (From the Ashes I Arise)',
      color: 'bg-amber-800',
      textColor: 'text-amber-800',
      badge: 'Rising Firebird',
      strengths: 'Leadership, Debate, Theatrical Arts',
    },
    {
      name: 'Athena House',
      motto: 'Sapientia Et Veritas (Wisdom and Truth)',
      color: 'bg-emerald-900',
      textColor: 'text-emerald-900',
      badge: 'Owl & Olive Branch',
      strengths: 'Mathematics, Robotics, Creative Writing',
    },
    {
      name: 'Solaris House',
      motto: 'Lux In Tenebris (Light in Darkness)',
      color: 'bg-stone-900',
      textColor: 'text-stone-900',
      badge: 'Radiant Sunburst',
      strengths: 'Social Stewardship, Visual Arts, Soccer',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Life on Campus
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Vibrant Culture Beyond the Classroom
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          At HORIZON, learning breathes through competition on the field, late afternoons in the robotics lab, chamber orchestral rehearsals, and lifelong camaraderie within our house system.
        </p>
      </div>

      {/* 2. Interactive Category Tabs */}
      <div className="flex gap-2 p-1.5 bg-stone-100 rounded-xl max-w-md border border-stone-200">
        <button
          onClick={() => setActiveCategory('sports')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeCategory === 'sports'
              ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Athletics & Sports
        </button>
        <button
          onClick={() => setActiveCategory('clubs')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeCategory === 'clubs'
              ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Clubs & Societies
        </button>
        <button
          onClick={() => setActiveCategory('houses')}
          className={`flex-1 py-2 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
            activeCategory === 'houses'
              ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          House System
        </button>
      </div>

      {/* 3. Sports Section */}
      {activeCategory === 'sports' && (
        <section className="space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Physical Rigor & Teamwork
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Varsity & Intramural Athletics
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-2">
              Our 64-acre campus houses premier sporting facilities that train athletes to cultivate endurance, tactical discipline, and grace in victory or defeat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sportsList.map((sport, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-44 bg-stone-100 relative overflow-hidden">
                  <img
                    src={sport.image}
                    alt={sport.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex items-end p-4">
                    <h3 className="font-serif text-xl font-bold text-white leading-tight">
                      {sport.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {sport.description}
                  </p>
                  <div className="pt-3 border-t border-stone-100 text-xs text-stone-500 space-y-1">
                    <div>🏟️ {sport.facility}</div>
                    <div className="font-mono text-stone-600">⏱️ {sport.schedule}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Clubs & Societies Section */}
      {activeCategory === 'clubs' && (
        <section className="space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Extracurricular Excellence
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              Student Clubs & Guilds
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-2">
              With more than 28 student-led societies, every scholar finds fertile ground to deepen passions, lead peers, and test original initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubsList.map((club, idx) => {
              const Icon = club.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 text-stone-900 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs text-amber-800 font-medium">{club.category}</span>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {club.name}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {club.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 text-xs text-stone-500 font-mono">
                    Faculty Advisor: {club.advisor}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. House System Section */}
      {activeCategory === 'houses' && (
        <section className="space-y-8 animate-fadeIn">
          <div>
            <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
              Camaraderie & Mentorship
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
              The Four Houses of HORIZON
            </h2>
            <p className="text-sm text-stone-600 max-w-2xl mt-2">
              Upon entry, every student is inducted into one of four historic Houses. Houses foster inter-grade mentorship, leadership elections, and spirited term-long cups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {houses.map((house, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-sm space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${house.color}`} />
                    <h3 className="font-serif text-2xl font-bold text-stone-900">
                      {house.name}
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-stone-500">{house.badge}</span>
                </div>

                <div className="text-xs italic font-serif text-amber-900">
                  "{house.motto}"
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  Scholars in {house.name} compete in academic quizzes, track meets, debating shields, and civic food drives.
                </p>

                <div className="pt-3 border-t border-stone-100 text-xs text-stone-500">
                  <span className="font-semibold text-stone-700">Tradition Strengths:</span> {house.strengths}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. Action Call */}
      <div className="bg-stone-900 text-white rounded-2xl p-8 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-white">
          Experience HORIZON Campus Life
        </h3>
        <p className="text-sm text-stone-300 max-w-xl mx-auto">
          Schedule a personalized walkthrough or attend our next Open House day to meet coaches, club presidents, and house captains.
        </p>
        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-2.5 bg-amber-700 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Book a Campus Tour
        </button>
      </div>

    </div>
  );
};

