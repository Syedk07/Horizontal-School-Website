import React, { useState } from 'react';
import { User } from '../types';
import { Menu, X, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenPortal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const primaryNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'academics', label: 'Academics' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'campus-life', label: 'Campus Life' },
  ];

  const secondaryNavItems = [
    { id: 'events', label: 'Events' },
    { id: 'news', label: 'News' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 group-hover:text-amber-900 transition-colors">
                HORIZON
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600">
            {primaryNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`py-1 relative transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? 'text-stone-900 font-semibold'
                    : 'hover:text-stone-900'
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 rounded-full" />
                )}
              </button>
            ))}

            {/* Dropdown for More Links to prevent clutter */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1 py-1 hover:text-stone-900 cursor-pointer ${
                  secondaryNavItems.some(i => i.id === activeTab) ? 'text-stone-900 font-semibold' : ''
                }`}
              >
                <span>Institution</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${moreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreMenuOpen && (
                <div
                  className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 shadow-xl rounded-lg py-2 z-50"
                  onMouseLeave={() => setMoreMenuOpen(false)}
                >
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                        activeTab === item.id
                          ? 'bg-stone-50 text-amber-900 font-semibold'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: Primary Actions & User State */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPortal}
                  className="inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium text-stone-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  title="Open Portal Dashboard"
                >
                  <UserIcon className="w-3.5 h-3.5 text-amber-800" />
                  <span className="capitalize">{currentUser.role} Portal</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('admissions')}
                  className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-900 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Apply 2026
                </button>
                <button
                  onClick={onOpenPortal}
                  className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  Portal Login
                </button>
              </div>
            )}

            {/* Mobile hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-md focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-6 space-y-1 shadow-lg animate-fadeIn">
          {allNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium cursor-pointer transition-colors ${
                activeTab === item.id
                  ? 'bg-amber-100/70 text-amber-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-4 border-t border-stone-200">
            {currentUser ? (
              <div className="space-y-2">
                <div className="px-3 py-2 text-xs text-stone-500 font-mono">
                  Signed in as {currentUser.email} ({currentUser.role})
                </div>
                <button
                  onClick={() => {
                    onOpenPortal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-stone-900 text-white font-medium rounded-lg"
                >
                  Open {currentUser.role} Portal
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onOpenPortal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center px-4 py-2 bg-stone-900 text-white font-medium rounded-lg"
                >
                  Sign In to Campus Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

