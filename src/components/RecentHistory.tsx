import React, { useState } from 'react';
import { History, Copy, Trash2, ArrowRight, Check, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types/translation';
import { SUPPORTED_LANGUAGES } from '../config/languages';
import { deleteHistoryItem, clearAllHistory } from '../utils/history';

interface RecentHistoryProps {
  history: HistoryItem[];
  onHistoryChange: (updated: HistoryItem[]) => void;
  onOpenHistoryItem: (item: HistoryItem) => void;
}

export const RecentHistory: React.FC<RecentHistoryProps> = ({
  history,
  onHistoryChange,
  onOpenHistoryItem,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Keep hidden when empty, strictly obeying PRD Section 16!
  if (!history || history.length === 0) {
    return null;
  }

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDelete = (id: string) => {
    const updated = deleteHistoryItem(id);
    onHistoryChange(updated);
  };

  const handleClearAll = () => {
    clearAllHistory();
    onHistoryChange([]);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Translations
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Saved locally on your device only • Private & offline
              </p>
            </div>
          </div>

          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-3">
          {history.slice(0, 5).map((item) => {
            const sName =
              item.sourceLang === 'auto'
                ? item.detectedLang
                  ? SUPPORTED_LANGUAGES[item.detectedLang]?.name
                  : 'Auto'
                : SUPPORTED_LANGUAGES[item.sourceLang]?.name;
            const tName = SUPPORTED_LANGUAGES[item.targetLang]?.name;

            return (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div
                  onClick={() => onOpenHistoryItem(item)}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600/80 flex items-center gap-1">
                      <span>{sName}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                      <span>{tName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-1 truncate">
                      {item.sourceText}
                    </p>
                    <p className="text-slate-900 dark:text-slate-100 font-medium line-clamp-1 truncate">
                      {item.translatedText}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center">
                  <button
                    onClick={() => onOpenHistoryItem(item)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Open in translator"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleCopy(item.id, item.translatedText)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Copy translation"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
