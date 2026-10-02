import React, { useState } from 'react';
import { Play, Award, CheckCircle2, XCircle, Video, FileText, Sparkles } from 'lucide-react';
import { SupportedLanguage, GuideItem } from '../types';
import { GUIDES_DATA } from '../data/guidesData';
import { UI_STRINGS } from '../data/translations';

interface GuidesSectionProps {
  currentLang: SupportedLanguage;
}

export const GuidesSection: React.FC<GuidesSectionProps> = ({ currentLang }) => {
  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;
  const [selectedGuide, setSelectedGuide] = useState<GuideItem>(GUIDES_DATA[0]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  // Quiz state for selected guide
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState(false);

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    if (submittedQuiz) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    selectedGuide.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setSubmittedQuiz(false);
  };

  const switchGuide = (guide: GuideItem) => {
    setSelectedGuide(guide);
    setUserAnswers({});
    setSubmittedQuiz(false);
    setIsPlayingVideo(false);
  };

  const score = calculateScore();
  const totalQuestions = selectedGuide.quiz.length;
  const isPassed = submittedQuiz && score >= Math.ceil(totalQuestions * 0.7);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
          <Video className="w-3.5 h-3.5" />
          <span>{t.guidesHeaderTag}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
          {t.guidesTitle}
        </h2>
        <p className="mt-1 text-sm text-stone-600 max-w-2xl">
          {t.guidesSubtitle}
        </p>
      </div>

      {/* Guide Selector Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {GUIDES_DATA.map((guide) => {
          const isCurrent = guide.id === selectedGuide.id;
          const guideTitle = guide.title[currentLang] || guide.title.en;

          return (
            <button
              key={guide.id}
              type="button"
              onClick={() => switchGuide(guide)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isCurrent
                  ? 'bg-white border-emerald-700 ring-2 ring-emerald-700/20 shadow-xs'
                  : 'bg-white border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-2 text-[11px] text-stone-400 mb-1.5">
                <span className="capitalize">{guide.category}</span>
                <span aria-hidden="true">·</span>
                <span>{guide.readTimeMinutes} {t.readTimeLabel || 'min'}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{guide.videoDuration}</span>
              </div>
              <h4 className="text-sm font-bold font-serif text-stone-900 line-clamp-2 leading-snug">
                {guideTitle}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Main Guide Content Deck */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
        {/* Video / Interactive Banner Area */}
        <div className="bg-stone-900 text-white p-6 sm:p-8 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.interactiveLessonTag}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
              {selectedGuide.title[currentLang] || selectedGuide.title.en}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
              {selectedGuide.summary[currentLang] || selectedGuide.summary.en}
            </p>

            {/* Video Player Action */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isPlayingVideo ? t.hideVideoBtn : t.watchVideoBtn}</span>
              </button>
              <span className="text-xs text-stone-400 font-mono">
                {selectedGuide.videoDuration}
              </span>
            </div>
          </div>

          {/* Embedded Video Frame if toggled */}
          {isPlayingVideo && (
            <div className="mt-6 aspect-video max-w-3xl rounded-lg overflow-hidden border border-stone-700 bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${selectedGuide.youtubeId}?autoplay=1&rel=0`}
                title="Financial Educational Guide Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Key Rules Checklist */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>{t.keyRulesTag}</span>
            </div>
            <h4 className="text-lg font-bold font-serif text-stone-900 mb-4">
              {t.keyRulesTitle}
            </h4>

            <div className="space-y-3">
              {(
                selectedGuide.bulletPoints[currentLang] || selectedGuide.bulletPoints.en
              ).map((point, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-800"
                >
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center shrink-0 text-xs">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Micro-Quiz Section */}
          <div className="pt-6 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  {t.quizTag}
                </span>
                <h4 className="text-lg font-bold font-serif text-stone-900">
                  {t.quizTitle}
                </h4>
              </div>

              {submittedQuiz && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="text-xs text-stone-500 hover:text-stone-900 underline"
                >
                  {t.playAgain}
                </button>
              )}
            </div>

            <div className="space-y-6">
              {selectedGuide.quiz.map((q, qIndex) => {
                const questionText = q.question[currentLang] || q.question.en;
                const options = q.options[currentLang] || q.options.en;
                const explanation = q.explanation[currentLang] || q.explanation.en;
                const selectedOpt = userAnswers[qIndex];

                return (
                  <div
                    key={qIndex}
                    className="p-4 rounded-xl border border-stone-200 bg-white space-y-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono font-bold text-xs text-stone-400 mt-0.5">
                        Q{qIndex + 1}.
                      </span>
                      <p className="text-sm font-semibold text-stone-900 leading-snug">
                        {questionText}
                      </p>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {options.map((opt, optIndex) => {
                        const isChosen = selectedOpt === optIndex;
                        const isCorrect = q.correctIndex === optIndex;

                        let optStyle = 'border-stone-200 hover:bg-stone-50 text-stone-700';

                        if (submittedQuiz) {
                          if (isCorrect) {
                            optStyle = 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            optStyle = 'border-rose-500 bg-rose-50 text-rose-900 line-through';
                          } else {
                            optStyle = 'border-stone-100 text-stone-400 opacity-60';
                          }
                        } else if (isChosen) {
                          optStyle = 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-semibold ring-1 ring-emerald-700';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            disabled={submittedQuiz}
                            onClick={() => handleSelectAnswer(qIndex, optIndex)}
                            className={`p-3 rounded-lg border text-left text-xs transition-colors flex items-start gap-2 ${optStyle}`}
                          >
                            <span className="font-mono text-stone-400 shrink-0">
                              {String.fromCharCode(65 + optIndex)}.
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation when submitted */}
                    {submittedQuiz && (
                      <div className="mt-2 p-2.5 rounded bg-stone-50 text-xs text-stone-600 border border-stone-100 flex items-start gap-2">
                        {selectedOpt === q.correctIndex ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <p className="leading-relaxed">{explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Submit Bar */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500">
                {Object.keys(userAnswers).length} / {totalQuestions} {t.selectAnswersProgress}
              </div>

              {!submittedQuiz ? (
                <button
                  type="button"
                  disabled={Object.keys(userAnswers).length < totalQuestions}
                  onClick={() => setSubmittedQuiz(true)}
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  {t.checkResultsBtn}
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold font-mono">
                    {t.quizScoreLabel} {score}/{totalQuestions}
                  </div>
                  {isPassed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-semibold">
                      <Award className="w-4 h-4 text-emerald-700" />
                      <span>{t.badgeAwarded}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-700 font-medium">
                      {t.quizTryAgainAdvice}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
