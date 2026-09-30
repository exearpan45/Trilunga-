import React from 'react';
import { BookOpen, Languages, PenTool, Globe } from 'lucide-react';

interface EducationalSectionProps {
  onTestPhrase: (text: string, source: 'en' | 'hi' | 'bn', target: 'en' | 'hi' | 'bn') => void;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({ onTestPhrase }) => {
  return (
    <section id="education" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About the Languages
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Learn about the history, scripts, grammar rules, and cultural context powering English, Hindi, and Bengali.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bengali Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bn font-bold text-lg mb-4">
              বা
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bengali (বাংলা)
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-medium border border-teal-200 dark:border-teal-800">
                300M+ Speakers
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Bengali is an Eastern Indo-Aryan language spoken across Bangladesh and Indian states like West Bengal, Tripura, and Assam. It possesses a celebrated literary tradition spanning Rabindranath Tagore and Kazi Nazrul Islam.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Script & Punctuation:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Written in Eastern Nagari (বাংলা লিপি). Declarative sentences conclude with the traditional Bengali Dari (।) rather than a Western full stop.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Gender Neutrality:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Unlike Hindi, Bengali verbs and third-person pronouns (সে, তিনি) do not change for grammatical gender, resulting in streamlined verb conjugation.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onTestPhrase('আমি বাংলায় কথা বলি।', 'bn', 'en')}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-700 dark:text-teal-300 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Test: "আমি বাংলায় কথা বলি।"</span>
              <span className="text-[10px] text-teal-600">Try ↵</span>
            </button>
          </div>
        </div>

        {/* Hindi Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-hi font-bold text-lg mb-4">
              हि
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Hindi (हिंदी)
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800">
                600M+ Speakers
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Hindi is the most widely spoken language in India, belonging to the Indo-Aryan branch. It has deep Sanskrit roots and significant Persian and Arabic lexical influences in modern conversational registers.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Script & Punctuation:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Devanagari script with a continuous horizontal headline (Shirorekha). Standard sentences end with the traditional Purna Viram (।).
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Honorific Registers:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Features three tiers of second-person address: "आप" (polite/formal), "तुम" (friendly/informal), and "तू" (intimate).
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onTestPhrase('मैं हिंदी बोलता हूँ।', 'hi', 'en')}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Test: "मैं हिंदी बोलता हूँ।"</span>
              <span className="text-[10px] text-indigo-600">Try ↵</span>
            </button>
          </div>
        </div>

        {/* English Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-lg mb-4">
              En
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                English
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium border border-sky-200 dark:border-sky-800">
                Global Lingua Franca
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              English is a West Germanic language that has become the world's primary auxiliary language for international commerce, academia, diplomacy, and the open web.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Word Order:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Fixed Subject-Verb-Object (SVO) order, in contrast to the Subject-Object-Verb (SOV) typical of Hindi and Bengali.
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">
                  Idiomatic Complexity:
                </span>
                <span className="text-slate-500 dark:text-slate-400">
                  Extensive reliance on phrasal verbs ("give up", "look forward to") and contractions which requiring contextual understanding.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onTestPhrase('Hello, how are you today?', 'en', 'hi')}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 transition-colors cursor-pointer text-left flex items-center justify-between"
            >
              <span>Test: "Hello, how are you today?"</span>
              <span className="text-[10px] text-sky-600">Try ↵</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
