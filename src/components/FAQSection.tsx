import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'What languages does TriLingua support?',
    answer:
      'TriLingua supports English, Hindi (हिंदी), and Bengali (বাংলা) initially. All six translation directions (English ⇄ Hindi, English ⇄ Bengali, Hindi ⇄ Bengali) as well as automatic language detection are supported.',
  },
  {
    question: 'Can I translate Bengali to Hindi directly?',
    answer:
      'Yes! Direct translation between Bengali and Hindi is fully supported without requiring an intermediate English step, preserving the shared cultural and grammatical nuances between the two sister Indo-Aryan languages.',
  },
  {
    question: 'Is there a character limit on translations?',
    answer:
      'The initial interface supports up to 5,000 characters per translation request, which is plenty for conversational messages, study paragraphs, letters, and emails.',
  },
  {
    question: 'Do I need an account to use TriLingua?',
    answer:
      'No account or registration is required. You can start translating immediately when you visit the application.',
  },
  {
    question: 'Can I listen to the pronunciation of translations?',
    answer:
      'Yes. TriLingua integrates browser Text-to-Speech (TTS) to read aloud translations in natural accents whenever your device or browser supports the selected language.',
  },
  {
    question: 'Can I copy and download translations?',
    answer:
      'Yes. One-click copy with instant visual confirmation is built-in, as well as native device sharing via the Web Share API and one-click .txt file download.',
  },
  {
    question: 'How is my translation history stored?',
    answer:
      'Your translation history is saved exclusively on your local device (in your browser’s localStorage). No user translation history is uploaded or stored on central database servers, ensuring your texts stay private.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 scroll-mt-20">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/80 mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Everything you need to know about TriLingua's translation engine, character limits, and features.
        </p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
