import React from 'react';
import { ShieldAlert, PhoneCall } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { UI_STRINGS } from '../data/translations';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onLanguageChange,
  activeTab,
  onTabChange,
}) => {
  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;

  const navItems = [
    { id: 'glossary', label: t.navGlossary },
    { id: 'budgeting', label: t.navBudgeting },
    { id: 'guides', label: t.navGuides },
    { id: 'tracker', label: t.navTracker },
    { id: 'scam-shield', label: t.navScamShield },
    { id: 'chat', label: t.navChat },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbfbf9]/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onTabChange('glossary')}
          className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-serif hover:text-emerald-800 transition-colors text-left shrink-0 focus:outline-none"
        >
          {t.appTitle}
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`py-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-emerald-900 border-b-2 border-emerald-700 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <LanguageSelector currentLang={currentLang} onLanguageChange={onLanguageChange} />

          <a
            href="tel:1930"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-md transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
            title="National Cyber Crime Reporting Helpline Number: 1930"
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span className="hidden sm:inline">1930 Cyber Helpline</span>
            <span className="sm:hidden">1930</span>
          </a>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center gap-1 overflow-x-auto px-4 py-2 bg-stone-50 border-t border-stone-200/80 scrollbar-none">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 bg-white/60 border border-stone-200/60'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
