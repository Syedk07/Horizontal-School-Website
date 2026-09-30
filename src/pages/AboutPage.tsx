import React from 'react';
import { Shield, Sparkles, Award, Heart, Lightbulb, Users, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const coreValues = [
    {
      title: 'Integrity',
      icon: Shield,
      desc: 'Upholding intellectual honesty, ethical action, and moral accountability in all scientific and humanistic inquiries.',
    },
    {
      title: 'Curiosity',
      icon: Sparkles,
      desc: 'Nurturing relentless inquisitive wonder that challenges established dogmas and pursues empirical truth.',
    },
    {
      title: 'Excellence',
      icon: Award,
      desc: 'Striving for highest personal mastery in academics, arts, character development, and physical conditioning.',
    },
    {
      title: 'Responsibility',
      icon: Heart,
      desc: 'Recognizing our shared duty to community stewardship, ecological preservation, and civic leadership.',
    },
    {
      title: 'Creativity',
      icon: Lightbulb,
      desc: 'Synthesizing novel solutions across disparate disciplines, from computational algorithms to expressive visual arts.',
    },
    {
      title: 'Collaboration',
      icon: Users,
      desc: 'Valuing collective intelligence, mutual respect, and cross-cultural discourse over isolated competition.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          About HORIZON
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          Educating the Mind, Grounding the Spirit
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          Founded in 1991, HORIZON has grown into one of the country's most distinctive preparatory institutions, balancing time-honored scholarly discipline with forward-looking scientific exploration.
        </p>
      </div>

      {/* 2. Our Story Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Our Heritage & Milestones
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Thirty-Five Years of Intellectual Momentum
          </h2>
          <div className="space-y-4 text-stone-600 leading-relaxed text-sm sm:text-base">
            <p>
              HORIZON began in 1991 with forty scholars and five dedicated faculty members united by a revolutionary vision: to replace passive memorization with active inquiry, mathematical proof, and original creative discourse.
            </p>
            <p>
              Over three and a half decades, our campus has expanded to 64 acres encompassing dedicated laboratories for robotics, genomics, fine arts studios, and an Olympic-caliber athletics complex. Yet our core principle has never wavered: education is not a static vessel to be filled, but an intellectual trajectory moving steadily forward.
            </p>
            <p>
              Today, our alumni hold faculty chairs at leading global universities, pioneer renewable energy ventures, and lead humanitarian initiatives around the globe.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-stone-200">
            <div>
              <div className="font-serif text-3xl font-bold text-stone-900">1991</div>
              <div className="text-xs text-stone-500 uppercase mt-1">Foundation Year</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-stone-900">14,200+</div>
              <div className="text-xs text-stone-500 uppercase mt-1">Global Alumni</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-stone-900">100%</div>
              <div className="text-xs text-stone-500 uppercase mt-1">Faculty Mentorship</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200">
            <img
              src="/assets/images/hero_school_campus_1790610519961.jpg"
              alt="HORIZON Centennial Quad"
              referrerPolicy="no-referrer"
              className="w-full h-80 lg:h-96 object-cover"
            />
            <div className="p-4 bg-stone-100 text-xs text-stone-600 font-serif italic">
              Centennial Academic Pavilion, designed with sustainable geothermal climate control.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Vision & Mission Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 sm:p-10 bg-amber-950 text-white rounded-2xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
            Institutional Horizon
          </span>
          <h3 className="font-serif text-3xl font-bold text-white">Our Vision</h3>
          <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
            To be an exemplary community of lifelong learning where inquisitive students become courageous leaders, ethical researchers, and empathetic citizens capable of shaping an equitable global future.
          </p>
          <ul className="space-y-2 text-sm text-stone-300 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Fostering universal intellectual humility and deep curiosity.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Equipping scholars for high-order computational problem solving.</span>
            </li>
          </ul>
        </div>

        <div className="p-8 sm:p-10 bg-stone-900 text-white rounded-2xl space-y-4">
          <span className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
            Everyday Commitment
          </span>
          <h3 className="font-serif text-3xl font-bold text-white">Our Mission</h3>
          <p className="text-stone-300 leading-relaxed text-sm sm:text-base">
            HORIZON provides an inclusive, intellectually stimulating educational environment that empowers every student to cultivate disciplined thinking, moral purpose, artistic appreciation, and physical resilience.
          </p>
          <ul className="space-y-2 text-sm text-stone-300 pt-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Individualized student trajectories tailored to innate potential.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Experiential laboratory investigations from Grade 1 through 12.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
            The Moral Compass
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Our Six Core Values
          </h2>
          <p className="text-sm text-stone-600">
            The fundamental ethical tenets that govern every classroom discussion, laboratory experiment, athletic contest, and institutional policy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white border border-stone-200 rounded-xl space-y-3 hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  {val.title}
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. Principal's Message & Profile */}
      <section className="bg-stone-100 border border-stone-200 rounded-2xl p-8 sm:p-12 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl overflow-hidden border border-stone-300 shadow-sm">
              <img
                src="/assets/images/principal_portrait_1790610534155.jpg"
                alt="Dr. Marcus Vance"
                referrerPolicy="no-referrer"
                className="w-full h-80 object-cover object-top"
              />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-2xl font-bold text-stone-900">Dr. Marcus Vance</h3>
              <p className="text-xs uppercase tracking-wider text-amber-900 font-semibold">Head of School & Principal</p>
              <p className="text-xs text-stone-500 font-mono">Ph.D. in Comparative Education (Oxford) · M.Ed. (Harvard)</p>
            </div>
            <div className="pt-2 text-xs text-stone-600 space-y-1">
              <div>Office: Executive Wing, Room 101</div>
              <div>Direct: principal@HORIZON.edu</div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-stone-700 leading-relaxed text-sm sm:text-base">
            <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
              Principal's Message
            </span>
            <h2 className="font-serif text-3xl font-bold text-stone-900">
              Fostering Thinkers Who Shape the Century
            </h2>
            <p>
              Welcome to HORIZON. As you explore these pages, you will discover an institution alive with intellectual energy, warm collegiality, and purpose.
            </p>
            <p>
              When parents ask me what makes HORIZON different from other preparatory academies, my answer is simple: We teach students not what to think, but how to think. We refuse to treat education as an algorithmic checklist. Instead, we invite young people to engage with complex primary texts, formulate testable scientific hypotheses, defend arguments civilly, and discover their distinct individual voices.
            </p>
            <p>
              Our faculty are scholars, researchers, and dedicated mentors who see in every student an extraordinary capacity for transformation. Whether in our state-of-the-art robotics pavilion, our art studios, or our athletics fields, HORIZON provides the fertile ground where intellectual ambition meets humane values.
            </p>
            <p>
              I warmly invite you to visit our campus, observe our seminars in session, and experience firsthand what makes our community so extraordinary.
            </p>
            <div className="pt-4 font-serif text-lg italic text-stone-900">
              — Dr. Marcus Vance, Head of School
            </div>
          </div>
        </div>
      </section>

      {/* 6. Action Call */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('admissions')}
          className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
        >
          Explore Admissions at HORIZON
        </button>
      </div>

    </div>
  );
};

