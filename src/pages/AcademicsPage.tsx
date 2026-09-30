import React, { useState } from 'react';
import { BookOpen, Code, Compass, Globe, Palette, Dumbbell, Atom, ChevronRight, CheckCircle2 } from 'lucide-react';

interface AcademicsPageProps {
  onNavigate: (tab: string) => void;
}

export const AcademicsPage: React.FC<AcademicsPageProps> = ({ onNavigate }) => {
  const [activeLevel, setActiveLevel] = useState<'primary' | 'middle' | 'secondary' | 'senior'>('senior');
  const [selectedDept, setSelectedDept] = useState<number>(0);

  const academicLevels = [
    {
      id: 'primary' as const,
      name: 'Primary School',
      grades: 'Grades 1–5 (Ages 6–11)',
      lead: 'Laying joyful, foundational roots for lifelong inquiry and numerical fluency.',
      description: 'Our Primary curriculum focuses on experiential discovery, foundational literacy in English and an additional world language, mathematical concepts taught through concrete manipulation, and natural science explorations.',
      subjects: ['English Language & Phonics', 'Foundational Mathematics', 'Exploratory Science', 'Environmental Studies', 'Visual Arts & Craft', 'Music & Movement', 'Physical Conditioning'],
      objectives: [
        'Master fluent reading comprehension and expressive narrative writing.',
        'Develop early number sense, spatial geometry, and problem-solving confidence.',
        'Foster curiosity through hands-on laboratory observation and nature study.',
        'Instill habits of kindness, collaborative play, and emotional resilience.',
      ],
    },
    {
      id: 'middle' as const,
      name: 'Middle School',
      grades: 'Grades 6–8 (Ages 11–14)',
      lead: 'Bridging foundational concepts with critical analytical thinking and experimentation.',
      description: 'Middle schoolers transition into departmentalized seminars. Students are challenged to synthesize historical arguments, conduct empirical science experiments, and begin algorithmic thinking in Python.',
      subjects: ['Integrated Algebra & Geometry', 'General Science (Physics, Chemistry, Biology)', 'World History & Civilizations', 'Language Arts & Rhetoric', 'Computational Thinking & Python Basics', 'Fine Arts & Ceramics', 'Physical Education'],
      objectives: [
        'Transition from concrete arithmetic to abstract algebraic argumentation.',
        'Execute controlled laboratory experiments following the scientific method.',
        'Formulate persuasive analytical essays using textual evidence.',
        'Develop collaborative team leadership and social-emotional maturity.',
      ],
    },
    {
      id: 'secondary' as const,
      name: 'Secondary School',
      grades: 'Grades 9–10 (Ages 14–16)',
      lead: 'Deepening academic rigor and mastering national and international board examinations.',
      description: 'A comprehensive curriculum designed to prepare scholars for competitive national standards. Students deepen their mastery of higher mathematics, physical sciences, world literature, and computer programming.',
      subjects: ['Advanced Mathematics (Coordinate Geometry & Trigonometry)', 'Physics with Laboratory Practicals', 'Chemistry & Molecular Biology', 'World Literature & Critical Theory', 'Global Economics & Civics', 'Computer Science Principles', 'Health & Sports Sciences'],
      objectives: [
        'Demonstrate mastery across rigorous national secondary examination standards.',
        'Conduct independent laboratory investigations with quantified error analysis.',
        'Engage in formal debate, public speaking, and philosophical ethics.',
        'Establish disciplined study habits and time management skills.',
      ],
    },
    {
      id: 'senior' as const,
      name: 'Senior Secondary School',
      grades: 'Grades 11–12 (Ages 16–18)',
      lead: 'Collegiate preparatory mastery across specialized STEM, Humanities, and Commerce pathways.',
      description: 'Our Senior Secondary program offers specialized tracks taught by doctoral and senior faculty. Students undertake collegiate-level research capstones, Advanced Placement courses, and university entrance portfolios.',
      subjects: ['Differential & Integral Calculus', 'AP Physics Mechanics & Electromagnetism', 'Organic Chemistry & Biochemistry', 'Data Structures & Algorithms in Python', 'Macroeconomics & Corporate Finance', 'Political Philosophy & International Law', 'Studio Art & Architectural Portfolio'],
      objectives: [
        'Produce a juried independent capstone paper or scientific investigation.',
        'Achieve superior scores in collegiate entrance and competitive merit scholarships.',
        'Gain mastery in professional software development and mathematical modeling.',
        'Lead student societies, publications, and community impact initiatives.',
      ],
    },
  ];

  const departments = [
    {
      name: 'Mathematics & Computational Thinking',
      icon: Compass,
      head: 'Prof. Sarah Jenkins, Ph.D.',
      description: 'From Euclidean geometry to multivariable calculus and discrete mathematics. We cultivate rigorous logical proof and computational problem-solving.',
      courses: ['Pure & Applied Mathematics', 'Probability & Inferential Statistics', 'Discrete Mathematics', 'Mathematical Modeling for Physics'],
    },
    {
      name: 'Experimental Sciences & Biotech',
      icon: Atom,
      head: 'Dr. Alistair Finch, Ph.D.',
      description: 'Hands-on investigations in purpose-built chemistry, biotechnology, and physics labs with laser optics, spectrophotometers, and sensor telemetry.',
      courses: ['Classical Mechanics & Thermodynamics', 'Organic & Inorganic Synthesis', 'Molecular Genetics & Bioengineering', 'Atmospheric Environmental Science'],
    },
    {
      name: 'Computer Science & Artificial Intelligence',
      icon: Code,
      head: 'David Chen, M.Sc.',
      description: 'Foundations of computer systems, object-oriented design in Python, algorithm complexity, autonomous robotics, and ethics of machine learning.',
      courses: ['Data Structures & Algorithms', 'Autonomous Robotics & Microcontrollers', 'Full-Stack Web Architectures', 'Applied Artificial Intelligence & Ethics'],
    },
    {
      name: 'Languages & World Literature',
      icon: BookOpen,
      head: 'Elena Rostova, M.A.',
      description: 'Engaging with canonical and contemporary global literatures, comparative rhetoric, creative prose, and advanced French, Spanish, and Mandarin.',
      courses: ['World Classics & Post-Colonial Literature', 'Critical Rhetoric & Debate', 'Advanced Spanish & Hispanic Culture', 'French Language & Francophone Studies'],
    },
    {
      name: 'Social Sciences & Global Affairs',
      icon: Globe,
      head: 'Dr. Kwame Mensah, Ph.D.',
      description: 'Exploring human institutions, diplomatic history, micro and macroeconomics, constitutional law, and sociological research methodologies.',
      courses: ['Global Geopolitics & Modern History', 'Macroeconomics & Public Policy', 'Introduction to Constitutional Law', 'Cultural Anthropology'],
    },
    {
      name: 'Fine Arts & Visual Design',
      icon: Palette,
      head: 'Amina Al-Mansoor, M.F.A.',
      description: 'Nurturing aesthetic discernment through studio painting, ceramic sculpture, darkroom and digital photography, and architectural drafting.',
      courses: ['Studio Painting & Color Theory', 'Ceramic Arts & 3D Form', 'Digital Typography & Graphic Design', 'Architectural Portfolio Studio'],
    },
    {
      name: 'Physical Education & Kinesiology',
      icon: Dumbbell,
      head: 'Marcus Bennett, B.S.',
      description: 'Comprehensive physical fitness, competitive team sportsmanship, biomechanics of movement, nutritional wellness, and lifelong athletic conditioning.',
      courses: ['Varsity Athletics Conditioning', 'Exercise Physiology & Biomechanics', 'Team Sports Strategy & Tactics', 'Sports Nutrition & Sports Medicine'],
    },
  ];

  const currentLevelData = academicLevels.find((l) => l.id === activeLevel) || academicLevels[3];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      
      {/* 1. Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
          Academics at HORIZON
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-stone-900 leading-tight">
          An Interdisciplinary Curriculum of Rigor and Discovery
        </h1>
        <p className="text-lg text-stone-600 leading-relaxed">
          From Primary foundations to collegiate-level Senior Secondary research, HORIZON crafts an unbroken continuum of intellectual challenge, moral maturity, and personal excellence.
        </p>
      </div>

      {/* 2. Academic Levels Segmented Section */}
      <section className="space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Educational Continuums
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Academic Levels
          </h2>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-stone-100 rounded-xl max-w-2xl border border-stone-200">
          {academicLevels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setActiveLevel(lvl.id)}
              className={`flex-1 min-w-[130px] py-2.5 px-4 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                activeLevel === lvl.id
                  ? 'bg-white text-stone-950 shadow-sm border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {lvl.name}
            </button>
          ))}
        </div>

        {/* Level Details Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-8 sm:p-10 shadow-sm space-y-8">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-serif text-3xl font-bold text-stone-900">
                {currentLevelData.name}
              </h3>
              <span className="text-xs font-mono bg-stone-100 text-stone-700 px-3 py-1 rounded">
                {currentLevelData.grades}
              </span>
            </div>
            <p className="text-base text-stone-700 font-medium leading-relaxed">
              {currentLevelData.lead}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed max-w-4xl">
              {currentLevelData.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-stone-200">
            {/* Core Subjects */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                Representative Subjects & Seminars
              </h4>
              <ul className="space-y-2 text-sm text-stone-700">
                {currentLevelData.subjects.map((subj, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0"></span>
                    <span>{subj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                Core Developmental Objectives
              </h4>
              <ul className="space-y-2 text-sm text-stone-700">
                {currentLevelData.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Academic Departments Directory */}
      <section className="space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
            Faculty & Disciplines
          </span>
          <h2 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            Academic Departments
          </h2>
          <p className="text-sm text-stone-600 max-w-2xl mt-2">
            Each academic discipline is led by accomplished scholars and pedagogical specialists who ensure curriculum depth and personalized mentorship.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Department List */}
          <div className="lg:col-span-5 space-y-2">
            {departments.map((dept, idx) => {
              const Icon = dept.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDept(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedDept === idx
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${selectedDept === idx ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-700'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-serif text-base font-bold leading-tight">
                        {dept.name}
                      </div>
                      <div className={`text-xs ${selectedDept === idx ? 'text-stone-300' : 'text-stone-500'}`}>
                        {dept.head}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedDept === idx ? 'text-amber-300' : 'text-stone-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Department Details Pane */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-6 sticky top-28">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold">
                Department Overview
              </span>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                {departments[selectedDept].name}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Department Chair: {departments[selectedDept].head}
              </p>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed">
              {departments[selectedDept].description}
            </p>

            <div className="space-y-3 pt-4 border-t border-stone-100">
              <h4 className="text-xs uppercase tracking-widest text-stone-500 font-semibold">
                Featured Courses & Modules
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {departments[selectedDept].courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-800"
                  >
                    {course}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-center text-xs text-stone-500">
              <span>Standard Laboratory & Seminar Capacity: 24 scholars</span>
              <button
                onClick={() => onNavigate('contact')}
                className="text-amber-800 font-semibold hover:underline cursor-pointer"
              >
                Inquire With Department Head →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Action Banner */}
      <div className="bg-stone-100 border border-stone-200 rounded-2xl p-8 text-center space-y-4">
        <h3 className="font-serif text-2xl font-bold text-stone-900">
          Interested in our academic programs?
        </h3>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          Admissions are now open for the 2026–2027 academic year across all grade cohorts. Submit an enquiry today.
        </p>
        <button
          onClick={() => onNavigate('admissions')}
          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
        >
          Begin Admission Process
        </button>
      </div>

    </div>
  );
};

