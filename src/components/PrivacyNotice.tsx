import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const PrivacyNotice: React.FC = () => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-start gap-3.5 text-xs text-slate-600 dark:text-slate-300">
        <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1 leading-relaxed">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Quality & Privacy Transparency</span>
            <Info className="w-3.5 h-3.5 text-indigo-500 inline" />
          </p>
          <p>
            TriLingua uses modern <strong>AI-assisted neural machine translation</strong> to convert text between English, Hindi, and Bengali. While high in fluency, automated translation can occasionally produce minor imperfections—please review important official, legal, or medical documents carefully.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            <strong>Privacy Guarantee:</strong> Submitted text is securely transmitted via TLS encryption to process your request and is not stored on our databases. Your translation history remains strictly local on your device.
          </p>
        </div>
      </div>
    </section>
  );
};
