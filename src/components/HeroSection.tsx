import React from 'react';
import { ArrowDown, Sparkles, ShieldCheck, Volume2, History } from 'lucide-react';
import { LanguageCode } from '../types/translation';

interface HeroSectionProps {
  onStartTranslating: () => void;
  onLearnMore: () => void;
  onSelectPair: (source: LanguageCode, target: LanguageCode) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartTranslating,
  onLearnMore,
  onSelectPair,
}) => {
  return (
    <section className="pt-8 pb-6 sm:pt-12 sm:pb-8 text-center max-w-4xl mx-auto px-4 sm:px-6">
      {/* Subtle Pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/80 mb-5">
        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
        <span>Dedicated to 3 Key Languages • All 6 Directions</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
        Translate{' '}
        <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-600 bg-clip-text text-transparent">
          English, Hindi & Bengali.
        </span>
      </h1>

      {/* Supporting Text */}
      <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
        A simple, fast translator built for everyday conversations, study, work and communication.
      </p>

      {/* Action Buttons */}
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        <button
          onClick={onStartTranslating}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all cursor-pointer"
        >
          <span>Start Translating</span>
          <ArrowDown className="w-4 h-4" />
        </button>
        <button
          onClick={onLearnMore}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all cursor-pointer"
        >
          <span>Learn More</span>
        </button>
      </div>

      {/* Quick Pair Chips */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
        <span className="text-slate-400 dark:text-slate-500 mr-1">Quick switch:</span>
        <button
          onClick={() => onSelectPair('en', 'hi')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
        >
          English → हिंदी
        </button>
        <button
          onClick={() => onSelectPair('en', 'bn')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
        >
          English → বাংলা
        </button>
        <button
          onClick={() => onSelectPair('hi', 'bn')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
        >
          हिंदी → বাংলা
        </button>
        <button
          onClick={() => onSelectPair('bn', 'en')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-slate-700/80 transition-colors cursor-pointer"
        >
          বাংলা → English
        </button>
      </div>

      {/* Feature Badges */}
      <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>6 Translation Pairs</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
          <span>Voice Playback</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <History className="w-3.5 h-3.5 text-sky-500" />
          <span>Private Local History</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
          <span>No Account Required</span>
        </div>
      </div>
    </section>
  );
};
