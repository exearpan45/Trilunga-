import React, { useState } from 'react';
import { ArrowRightLeft, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { LANGUAGE_PAIRS, SUPPORTED_LANGUAGES } from '../config/languages';
import { LanguageCode } from '../types/translation';

interface LanguagePairGuidesProps {
  onSelectPair: (source: LanguageCode, target: LanguageCode, sampleText?: string) => void;
  selectedSlug?: string;
}

export const LanguagePairGuides: React.FC<LanguagePairGuidesProps> = ({
  onSelectPair,
  selectedSlug,
}) => {
  const [activeSlug, setActiveSlug] = useState<string>(selectedSlug || LANGUAGE_PAIRS[0].slug);

  const activePair = LANGUAGE_PAIRS.find((p) => p.slug === activeSlug) || LANGUAGE_PAIRS[0];
  const sourceLang = SUPPORTED_LANGUAGES[activePair.source];
  const targetLang = SUPPORTED_LANGUAGES[activePair.target];

  return (
    <section id="pairs" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Translation Pair Guides
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          In-depth linguistic guidelines, grammatical notes, and real sample sentences for all 6 supported language directions.
        </p>
      </div>

      {/* Language Pair Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {LANGUAGE_PAIRS.map((pair) => {
          const s = SUPPORTED_LANGUAGES[pair.source];
          const t = SUPPORTED_LANGUAGES[pair.target];
          const isActive = pair.slug === activeSlug;

          return (
            <button
              key={pair.slug}
              onClick={() => {
                setActiveSlug(pair.slug);
                // Also update URL hash/path if desirable
                window.history.replaceState(null, '', `/${pair.slug}`);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
              }`}
            >
              <span>{s.name}</span>
              <span className="text-slate-300 dark:text-slate-500">→</span>
              <span>{t.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Guide Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              <span>{sourceLang.name} ({sourceLang.nativeName})</span>
              <span>→</span>
              <span>{targetLang.name} ({targetLang.nativeName})</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {activePair.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              {activePair.description}
            </p>
          </div>

          <button
            onClick={() => onSelectPair(activePair.source, activePair.target)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>Load in Translator</span>
          </button>
        </div>

        {/* Linguistic Tips */}
        <div className="mt-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Linguistic Nuances & Structure</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activePair.tips.map((tip, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Sample Sentences with One-Click Insertion */}
        <div className="mt-8">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Try Verified Sample Sentences</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activePair.sampleSentences.map((sample, idx) => (
              <div
                key={idx}
                onClick={() => onSelectPair(activePair.source, activePair.target, sample.source)}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>INPUT ({sourceLang.name})</span>
                    <span className="text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Try this ↵
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {sample.source}
                  </p>
                  <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    {sample.target}
                  </p>
                </div>
                <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Note: {sample.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
