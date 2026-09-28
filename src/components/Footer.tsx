import React from 'react';
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenPortal }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-white block">
              HORIZONTAL
            </span>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Where Learning Moves Forward. A forward-thinking, university-preparatory institution cultivating intellectual rigor, disciplined inquiry, and ethical leadership since 1991.
            </p>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <div>Accredited by the International Council of Independent Schools</div>
              <div>Affiliated with National Advanced STEM & Humanities Board</div>
            </div>
          </div>

          {/* Column 2: Academics & Life */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-4">
              Academics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Primary School (1–5)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Middle School (6–8)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('academics')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Secondary & Senior (9–12)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('campus-life')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  STEM Robotics & AI Lab
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('campus-life')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Athletics & Kinesiology
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Admissions & Portals */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-4">
              Community & Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('admissions')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Admissions Process 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  School Calendar & Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('news')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Institutional News
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Campus Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPortal}
                  className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors cursor-pointer"
                >
                  <span>Student & Staff Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Campus */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-400 font-semibold mb-4">
              Campus Info
            </h4>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                <span>100 Horizon Boulevard, Centennial Quad, Cambridge Academic Corridor</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                <span>+1 (555) 749-3000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                <span>admissions@horizontal.edu</span>
              </div>
              <div className="text-xs text-stone-400 pt-1">
                Office Hours: Mon–Fri, 08:00 – 16:30
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div>
            © {new Date().getFullYear()} HORIZONTAL School. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Privacy Charter</span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Accessibility Policy</span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">Student Code of Honor</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
