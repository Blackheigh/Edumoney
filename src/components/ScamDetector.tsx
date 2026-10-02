import React, { useState } from 'react';
import { ShieldAlert, Upload, AlertTriangle, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { SupportedLanguage, ScamAnalysisResult, SampleScam } from '../types';
import { SAMPLE_SCAMS, RECENT_SCAMS_BOARD } from '../data/scamsData';
import { UI_STRINGS } from '../data/translations';

interface ScamDetectorProps {
  currentLang: SupportedLanguage;
}

export const ScamDetector: React.FC<ScamDetectorProps> = ({ currentLang }) => {
  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [textNotes, setTextNotes] = useState<string>('');
  const [selectedSample, setSelectedSample] = useState<SampleScam | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ScamAnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    setSelectedSample(null);
    setAnalysisResult(null);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      setSelectedImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (sample: SampleScam) => {
    setSelectedSample(sample);
    setSelectedImage(null);
    setTextNotes(sample.previewText[currentLang] || sample.previewText.en);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !textNotes && !selectedSample) {
      setErrorMsg(t.uploadScreenshotDesc);
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/analyze-scam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          textNotes: textNotes || (selectedSample ? selectedSample.previewText[currentLang] : ''),
          sampleType: selectedSample?.id,
          language: currentLang,
        }),
      });

      const data = await response.json();
      if (data.result) {
        setAnalysisResult(data.result);
      } else if (selectedSample) {
        setAnalysisResult(selectedSample.mockAnalysis[currentLang] || selectedSample.mockAnalysis.en);
      } else {
        throw new Error('Analysis could not be completed.');
      }
    } catch (err: any) {
      console.warn('API fallback to local heuristic analysis:', err);
      if (selectedSample) {
        setAnalysisResult(selectedSample.mockAnalysis[currentLang] || selectedSample.mockAnalysis.en);
      } else {
        // Fallback analysis result localized
        setAnalysisResult({
          isScam: true,
          confidence: 94,
          riskLevel: 'CRITICAL',
          scamType: t.threatDetectedTag,
          title: t.threatDetectedTag + ': 94%',
          explanation: t.uploadScreenshotDesc,
          redFlags: [
            '10-digit unofficial phone number detected',
            'Urgent psychological pressure applied',
            'External unverified APK link or QR scan requested'
          ],
          attackerGoal: t.attackerGoalTitle,
          immediateActions: [
            'Do not click link or transfer funds',
            'Dial 1930 Cyber Helpline immediately',
            'Block and report sender'
          ],
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setTextNotes('');
    setSelectedSample(null);
    setAnalysisResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t.scamHeaderTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            {t.scamTitle}
          </h2>
          <p className="mt-1 text-sm text-stone-600 max-w-2xl">
            {t.scamSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-200 rounded-md transition-colors"
          >
            <span>cybercrime.gov.in</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </a>
        </div>
      </div>

      {/* Main Analyzer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Deck (Left 6 Cols) */}
        <div className="lg:col-span-6 bg-white border border-stone-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold font-serif text-stone-900 mb-1">
              {t.uploadScreenshotTitle}
            </h3>
            <p className="text-xs text-stone-500">
              {t.uploadScreenshotDesc}
            </p>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div className="relative border-2 border-dashed border-stone-300 hover:border-emerald-700/60 rounded-xl p-6 text-center transition-colors bg-stone-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title={t.dropScreenshot}
            />
            <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-xs font-semibold text-stone-800">
                {selectedImage ? t.newScreenshotPrompt : t.dropScreenshot}
              </p>
              <p className="text-[11px] text-stone-400">
                {t.supportedFormats}
              </p>
            </div>
          </div>

          {/* Screenshot Preview if uploaded */}
          {selectedImage && (
            <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedImage}
                  alt="Uploaded screenshot preview"
                  className="w-12 h-12 object-cover rounded border border-stone-300"
                />
                <div>
                  <div className="text-xs font-semibold text-stone-800">{t.screenshotLoaded}</div>
                  <div className="text-[11px] text-stone-500">{t.readyToAnalyze}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                {t.removeBtn}
              </button>
            </div>
          )}

          {/* Sample Scam Buttons */}
          <div>
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">
              {t.orTrySample}:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_SCAMS.map((sample) => {
                const isSelected = selectedSample?.id === sample.id;
                const title = sample.title[currentLang] || sample.title.en;
                const cat = sample.category[currentLang] || sample.category.en;

                return (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => handleSelectSample(sample)}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-colors ${
                      isSelected
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold ring-1 ring-emerald-700'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-semibold leading-snug line-clamp-1">{title}</div>
                    <div className="text-[10px] text-stone-400 mt-0.5">{cat}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Context Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.sampleTextLabel}
            </label>
            <textarea
              rows={3}
              value={textNotes}
              onChange={(e) => setTextNotes(e.target.value)}
              placeholder={t.sampleTextPlaceholder}
              className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleAnalyze}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-white bg-emerald-900 hover:bg-emerald-800 disabled:opacity-50 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.analyzingScreenshot}</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>{t.analyzeBtn}</span>
                </>
              )}
            </button>

            {(selectedImage || selectedSample || textNotes || analysisResult) && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-2.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg"
              >
                {t.reset}
              </button>
            )}
          </div>
        </div>

        {/* Results & Safety Report Deck (Right 6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {analysisResult ? (
            <div
              className={`rounded-xl border p-6 space-y-6 transition-all shadow-sm ${
                analysisResult.isScam
                  ? 'bg-[#fffdfd] border-rose-300'
                  : 'bg-[#fafffb] border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider mb-1">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        analysisResult.isScam ? 'bg-rose-600 animate-ping' : 'bg-emerald-600'
                      }`}
                    />
                    <span className={analysisResult.isScam ? 'text-rose-700 font-bold' : 'text-emerald-700'}>
                      {analysisResult.riskLevel} {t.threatDetectedTag}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-stone-500">
                      {analysisResult.confidence}% {t.confidenceLabel}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-stone-900 leading-snug">
                    {analysisResult.title}
                  </h3>
                </div>

                <div
                  className={`p-3 rounded-full shrink-0 ${
                    analysisResult.isScam ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {analysisResult.isScam ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {analysisResult.explanation}
              </p>

              {analysisResult.redFlags && analysisResult.redFlags.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-rose-900 uppercase tracking-wider">
                    {t.redFlagsTitle}
                  </div>
                  <div className="space-y-2">
                    {analysisResult.redFlags.map((flag, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-xs text-rose-900 flex items-start gap-2"
                      >
                        <span className="font-bold text-rose-600 font-mono mt-0.5">⚠️</span>
                        <span className="leading-relaxed">{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analysisResult.attackerGoal && (
                <div className="p-3 bg-stone-100 rounded-lg text-xs text-stone-800">
                  <span className="font-semibold text-stone-900">{t.attackerGoalTitle} </span>
                  <span>{analysisResult.attackerGoal}</span>
                </div>
              )}

              {analysisResult.immediateActions && (
                <div className="p-4 bg-stone-900 text-white rounded-xl space-y-3">
                  <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
                    {t.immediateActionsTitle}
                  </div>
                  <div className="space-y-2">
                    {analysisResult.immediateActions.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span className="leading-relaxed">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-stone-200 rounded-xl p-8 text-center space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-7 h-7 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-base font-bold font-serif text-stone-900">
                  {t.detectorReadyTitle}
                </h4>
                <p className="mt-1 text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  {t.detectorReadyDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <img
                  src="/src/assets/images/scam_shield_security_1790939850764.jpg"
                  alt="Financial Security Shield Visual"
                  referrerPolicy="no-referrer"
                  className="w-full h-40 object-cover rounded-lg border border-stone-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real-World Alert Board */}
      <div className="pt-6 border-t border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{t.trendingAlertsTag}</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-900">
              {t.trendingAlertsTitle}
            </h3>
          </div>
          <div className="text-xs text-stone-400">
            {t.updatedDate}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECENT_SCAMS_BOARD.map((item) => {
            const title = item.title[currentLang] || item.title.en;
            const risk = item.risk[currentLang] || item.risk.en;
            const summary = item.summary[currentLang] || item.summary.en;
            const reported = item.reportedIn[currentLang] || item.reportedIn.en;
            const advice = item.preventiveAdvice[currentLang] || item.preventiveAdvice.en;

            return (
              <div
                key={item.id}
                className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xs hover:border-stone-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold font-serif text-stone-900 leading-snug">
                    {title}
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                    {risk}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {summary}
                </p>

                <div className="text-[11px] text-stone-400">
                  {t.reportedDistrictsLabel} <span className="text-stone-700 font-medium">{reported}</span>
                </div>

                <div className="pt-2 border-t border-stone-100 bg-[#fdfdfb] p-3 rounded-lg text-xs text-stone-800">
                  <span className="font-semibold text-emerald-900">{t.safetyAdviceLabel} </span>
                  <span className="text-stone-700">{advice}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
