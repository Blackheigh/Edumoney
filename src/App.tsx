import React, { useState } from 'react';
import {
  ShieldAlert,
  PiggyBank,
  BookOpen,
  Video,
  Wallet,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Lock,
} from 'lucide-react';
import { SupportedLanguage } from './types';
import { UI_STRINGS } from './data/translations';
import { Navbar } from './components/Navbar';
import { GlossarySection } from './components/GlossarySection';
import { BudgetingTools } from './components/BudgetingTools';
import { GuidesSection } from './components/GuidesSection';
import { TransactionTracker } from './components/TransactionTracker';
import { ScamDetector } from './components/ScamDetector';
import { PaisaMitraChat } from './components/PaisaMitraChat';

export default function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('hi');
  const [activeTab, setActiveTab] = useState<string>('glossary');

  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-[#1c241e] flex flex-col font-sans">
      {/* Universal Top Bar */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={setCurrentLang}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Aesthetic Non-Govt Hero Section (Clean, Spacious, Warm Lighting) */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-950 via-[#0a3826] to-[#072418] text-white shadow-sm border border-emerald-900/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Left Copy (7 cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-900/60 border border-emerald-700/50 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.heroBadge}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif tracking-tight text-white leading-tight text-balance">
                {t.heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>

              {/* Call-to-action buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('budgeting')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors flex items-center gap-2 shadow-xs whitespace-nowrap"
                >
                  <span>{t.ctaExploreTools}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('scam-shield')}
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>{t.ctaCheckScam}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 border-t border-emerald-900/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-stone-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.trustLanguages}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.trustConfidential}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t.trustAiDetector}</span>
                </span>
              </div>
            </div>

            {/* Right Visual Image (5 cols) */}
            <div className="lg:col-span-5 h-64 lg:h-full min-h-[300px] relative overflow-hidden bg-emerald-950">
              <img
                src="/src/assets/images/hero_finance_aspirations_1790939837452.jpg"
                alt="Aesthetic Indian family and entrepreneurs planning safe financial growth"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-90 hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-emerald-950 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </section>

        {/* Feature Navigation Highlights */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            {
              id: 'glossary',
              icon: BookOpen,
              title: t.featureGlossaryTitle,
              desc: t.featureGlossaryDesc,
              color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
            },
            {
              id: 'budgeting',
              icon: PiggyBank,
              title: t.featureBudgetingTitle,
              desc: t.featureBudgetingDesc,
              color: 'text-amber-800 bg-amber-50 border-amber-200',
            },
            {
              id: 'guides',
              icon: Video,
              title: t.featureGuidesTitle,
              desc: t.featureGuidesDesc,
              color: 'text-blue-700 bg-blue-50 border-blue-200',
            },
            {
              id: 'tracker',
              icon: Wallet,
              title: t.featureTrackerTitle,
              desc: t.featureTrackerDesc,
              color: 'text-teal-700 bg-teal-50 border-teal-200',
            },
            {
              id: 'scam-shield',
              icon: ShieldAlert,
              title: t.featureScamTitle,
              desc: t.featureScamDesc,
              color: 'text-rose-700 bg-rose-50 border-rose-200',
            },
            {
              id: 'chat',
              icon: Bot,
              title: t.featureChatTitle,
              desc: t.featureChatDesc,
              color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
            },
          ].map((feature) => {
            const isActive = activeTab === feature.id;
            const Icon = feature.icon;

            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => setActiveTab(feature.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-white border-emerald-700 ring-2 ring-emerald-700/20 shadow-xs'
                    : 'bg-white border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${feature.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold font-serif text-stone-900 leading-tight">
                  {feature.title}
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  {feature.desc}
                </div>
              </button>
            );
          })}
        </section>

        {/* Tab Content Display */}
        <section className="min-h-[500px]">
          {activeTab === 'glossary' && <GlossarySection currentLang={currentLang} />}
          {activeTab === 'budgeting' && <BudgetingTools currentLang={currentLang} />}
          {activeTab === 'guides' && <GuidesSection currentLang={currentLang} />}
          {activeTab === 'tracker' && <TransactionTracker currentLang={currentLang} />}
          {activeTab === 'scam-shield' && <ScamDetector currentLang={currentLang} />}
          {activeTab === 'chat' && <PaisaMitraChat currentLang={currentLang} />}
        </section>
      </main>

      {/* Clean, Non-Govt Editorial Footer */}
      <footer className="mt-16 bg-[#18211b] text-stone-400 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-stone-800">
            <div>
              <span className="text-xl font-bold font-serif text-white tracking-tight">
                {t.appTitle}
              </span>
              <p className="mt-1 text-xs text-stone-400 max-w-md">
                {t.appTagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <a
                href="tel:1930"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 hover:bg-rose-900/60 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.emergencyHelpline}</span>
              </a>
              <a
                href="https://rbi.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white transition-colors"
              >
                {t.rbiAwareness}
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white transition-colors"
              >
                cybercrime.gov.in
              </a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
            <p>
              {t.footerDedication}
            </p>
            <p className="text-stone-400">
              {t.footerPrivacyNote}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
