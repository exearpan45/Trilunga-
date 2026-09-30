import React, { useState } from 'react';
import { Sparkles, MessageCircle, GraduationCap, Compass } from 'lucide-react';
import { COMMON_PHRASES } from '../config/languages';
import { PhraseItem, LanguageCode } from '../types/translation';

interface CommonPhrasesProps {
  onSelectPhrase: (text: string) => void;
  targetLang: LanguageCode;
}

export const CommonPhrases: React.FC<CommonPhrasesProps> = ({
  onSelectPhrase,
  targetLang,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'everyday' | 'study' | 'travel'>('everyday');

  const filteredPhrases =
    activeTab === 'all'
      ? COMMON_PHRASES
      : COMMON_PHRASES.filter((p) => p.category === activeTab);

  return (
    <section id="phrases" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 scroll-mt-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Common Everyday Phrases</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Click any phrase to instantly insert and translate it.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('everyday')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'everyday'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Everyday</span>
          </button>
          <button
            onClick={() => setActiveTab('study')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'study'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Study & Work</span>
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'travel'
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Travel</span>
          </button>
        </div>
      </div>

      {/* Phrase Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPhrases.map((phrase) => {
          const previewTarget =
            targetLang === 'bn' ? phrase.textBn : targetLang === 'hi' ? phrase.textHi : phrase.textEn;

          return (
            <div
              key={phrase.id}
              onClick={() => onSelectPhrase(phrase.textEn)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-1">
                  <span className="uppercase tracking-wider">English</span>
                  <span className="opacity-0 group-hover:opacity-100 text-indigo-600 dark:text-indigo-400 transition-opacity">
                    Insert ↵
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {phrase.textEn}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="truncate">
                  {targetLang === 'bn' ? 'বাংলা:' : targetLang === 'hi' ? 'हिंदी:' : 'Target:'}{' '}
                  <span className={`font-medium ${targetLang === 'bn' ? 'font-bn' : targetLang === 'hi' ? 'font-hi' : ''}`}>
                    {previewTarget}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
