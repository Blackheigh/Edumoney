import React, { useState, useMemo } from 'react';
import { Search, Volume2, VolumeX, Bookmark, BookmarkCheck, Sparkles, AlertCircle, BookOpen } from 'lucide-react';
import { SupportedLanguage, TermCategory, GlossaryTerm } from '../types';
import { GLOSSARY_TERMS } from '../data/glossaryData';
import { UI_STRINGS } from '../data/translations';

interface GlossarySectionProps {
  currentLang: SupportedLanguage;
}

export const GlossarySection: React.FC<GlossarySectionProps> = ({ currentLang }) => {
  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TermCategory>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dhansetu_bookmarked_terms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('dhansetu_bookmarked_terms', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const handleReadAloud = (term: GlossaryTerm) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechId === term.id) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();

    const title = term.localizedTerm[currentLang] || term.term;
    const def = term.shortDefinition[currentLang] || term.shortDefinition.en;
    const analogy = term.desiAnalogy[currentLang] || term.desiAnalogy.en;
    const caution = term.cautionOrTip[currentLang] || term.cautionOrTip.en;

    const fullSpeechText = `${title}. ${def}. ${t.analogyTitle}: ${analogy}. ${t.cautionTitle}: ${caution}`;

    const utterance = new SpeechSynthesisUtterance(fullSpeechText);

    const langMap: Record<SupportedLanguage, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      gu: 'gu-IN',
    };
    utterance.lang = langMap[currentLang] || 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(term.id);
    window.speechSynthesis.speak(utterance);
  };

  const categories: { id: TermCategory; label: string }[] = [
    { id: 'all', label: t.categoryAll },
    { id: 'banking', label: t.categoryBanking },
    { id: 'savings_investment', label: t.categorySavings },
    { id: 'loans_debt', label: t.categoryLoans },
    { id: 'safety_scams', label: t.categorySafety },
    { id: 'govt_schemes', label: t.categoryGovt },
  ];

  const filteredTerms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return GLOSSARY_TERMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!q) return true;

      const termName = item.term.toLowerCase();
      const localName = (item.localizedTerm[currentLang] || '').toLowerCase();
      const definition = (item.shortDefinition[currentLang] || '').toLowerCase();
      const analogy = (item.desiAnalogy[currentLang] || '').toLowerCase();
      const tags = item.tags.join(' ').toLowerCase();

      return (
        termName.includes(q) ||
        localName.includes(q) ||
        definition.includes(q) ||
        analogy.includes(q) ||
        tags.includes(q)
      );
    });
  }, [searchQuery, selectedCategory, currentLang]);

  return (
    <div className="space-y-8">
      {/* Booklet Header & Intro */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.glossaryHeaderTag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
              {t.glossaryTitle}
            </h2>
            <p className="mt-1 text-sm text-stone-600 max-w-2xl">
              {t.glossarySubtitle}
            </p>
          </div>

          {/* Bookmarked Counter */}
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span>{t.savedTerms}</span>
            <span className="font-semibold text-stone-900 font-mono tabular-nums">{bookmarkedIds.length}</span>
            <span aria-hidden="true">·</span>
            <span>{t.totalTerms}</span>
            <span className="font-semibold text-stone-900 font-mono tabular-nums">{GLOSSARY_TERMS.length}</span>
          </div>
        </div>

        {/* Search Bar & Filter Controls */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 font-medium"
              >
                {t.clearSearch}
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-emerald-900 text-white shadow-xs font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70 hover:text-stone-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Terms */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed border-stone-200 rounded-xl p-8">
          <p className="text-stone-500 text-sm">
            "{searchQuery}" {t.noTermsFound}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-3 text-xs font-semibold text-emerald-800 hover:underline"
          >
            {t.seeAllTerms}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTerms.map((term) => {
            const isBookmarked = bookmarkedIds.includes(term.id);
            const isSpeaking = activeSpeechId === term.id;
            const localizedTitle = term.localizedTerm[currentLang] || term.term;
            const definition = term.shortDefinition[currentLang] || term.shortDefinition.en;
            const analogy = term.desiAnalogy[currentLang] || term.desiAnalogy.en;
            const caution = term.cautionOrTip[currentLang] || term.cautionOrTip.en;

            return (
              <article
                key={term.id}
                className="bg-white border border-stone-200/90 rounded-xl p-6 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-400 mb-1">
                        <span className="capitalize">{term.category.replace('_', ' & ')}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono text-[11px] text-stone-400">{term.term}</span>
                      </div>
                      <h3 className="text-lg font-bold font-serif text-stone-900 leading-snug">
                        {localizedTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleReadAloud(term)}
                        className={`p-2 rounded-md transition-colors ${
                          isSpeaking
                            ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 animate-pulse'
                            : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100'
                        }`}
                        title={isSpeaking ? t.stopAudio : t.readAloud}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-4 h-4 text-amber-700" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleBookmark(term.id)}
                        className={`p-2 rounded-md transition-colors ${
                          isBookmarked
                            ? 'text-emerald-700 bg-emerald-50'
                            : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
                        }`}
                        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this term'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-emerald-700" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-stone-700 leading-relaxed mb-4">
                    {definition}
                  </p>

                  <div className="bg-[#fcfaf6] border-l-3 border-amber-600/80 p-3.5 rounded-r-lg mb-4 text-xs text-stone-800">
                    <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>{t.analogyTitle}</span>
                    </div>
                    <p className="leading-relaxed text-stone-700">{analogy}</p>
                  </div>

                  <div className="bg-emerald-50/50 border-l-3 border-emerald-700 p-3 rounded-r-lg text-xs text-emerald-950">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-900 mb-1">
                      <AlertCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{t.cautionTitle}</span>
                    </div>
                    <p className="leading-relaxed text-emerald-900/90">{caution}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-400">
                  <span>{t.relatedTerms}</span>
                  {term.tags.map((tag, idx) => (
                    <span key={tag}>
                      {idx > 0 && <span className="mr-1 text-stone-300">·</span>}
                      <span className="text-stone-600 font-medium">{tag}</span>
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
