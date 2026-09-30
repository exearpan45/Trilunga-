import React, { useState } from 'react';
import { Languages, X } from 'lucide-react';

interface FooterProps {
  onNavigateToSection: (id: string) => void;
  onSelectPair: (source: 'en' | 'hi' | 'bn', target: 'en' | 'hi' | 'bn') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToSection, onSelectPair }) => {
  const [modalContent, setModalContent] = useState<{ title: string; body: string } | null>(null);

  const openPrivacyModal = () => {
    setModalContent({
      title: 'Privacy Policy',
      body: 'TriLingua operates on a zero-cost, privacy-first principle. No translation queries or histories are stored on our servers. When you translate text, it is processed via secure public open-source translation APIs solely to produce the requested translation. Your translation history remains strictly in your own browser local storage (localStorage) and never leaves your device.',
    });
  };

  const openTermsModal = () => {
    setModalContent({
      title: 'Terms of Service',
      body: 'TriLingua is provided free of charge for everyday communication, study, work, and personal use. Translations are generated via open-source machine translation algorithms. For critical legal, medical, or official documents, professional human review is strongly recommended.',
    });
  };

  const openContactModal = () => {
    setModalContent({
      title: 'Contact & Creator Info',
      body: 'TriLingua is designed and developed by Arpan Goswami as an open, accessible linguistic translation tool. For feedback, questions, or suggestions, please reach out via GitHub or project documentation.',
    });
  };

  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center text-white shadow-sm">
                <Languages className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                TriLingua
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Simple translation between English, Hindi and Bengali. Built for everyday conversations, study, work and seamless communication on a ₹0 budget.
            </p>
            <div className="mt-3 text-xs text-slate-400 dark:text-slate-500">
              Three languages. One simple translator.
            </div>
          </div>

          {/* All 6 Translation Pairs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Translation Pairs
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onSelectPair('en', 'hi')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  English → Hindi (अंग्रेज़ी से हिंदी)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPair('en', 'bn')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  English → Bengali (ইংরেজি থেকে বাংলা)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPair('hi', 'en')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  Hindi → English (हिंदी से अंग्रेज़ी)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPair('hi', 'bn')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  Hindi → Bengali (हिंदी से বাংলা)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPair('bn', 'en')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  Bengali → English (বাংলা থেকে ইংরেজি)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectPair('bn', 'hi')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer text-left"
                >
                  Bengali → Hindi (বাংলা থেকে हिंदी)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links & Legal per Section 42 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
              Navigation & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateToSection('translator')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Home / Translator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('phrases')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Common Phrases
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToSection('faq')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={openPrivacyModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={openTermsModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={openContactModal}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright attribution */}
        <div className="pt-6 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p className="font-semibold text-slate-700 dark:text-slate-300">
            © 2026 Copyright Arpan Goswami. All rights reserved.
          </p>
          <p className="text-slate-400 dark:text-slate-500">
            Three languages. One simple translator. Zero budget.
          </p>
        </div>
      </div>

      {/* Info Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              {modalContent.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {modalContent.body}
            </p>
            <div className="mt-5 text-right">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
