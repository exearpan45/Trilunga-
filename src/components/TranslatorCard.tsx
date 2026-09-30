import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Share2,
  Download,
  X,
  ClipboardPaste,
  RotateCcw,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  LanguageCode,
  SourceLanguageCode,
  TranslationRequest,
  TranslationResponse,
  HistoryItem,
} from '../types/translation';
import { SUPPORTED_LANGUAGES, LANGUAGE_LIST, AUTO_DETECT_OPTION } from '../config/languages';
import { translationService } from '../services/translationService';
import { speakText, stopSpeech, isSpeechSupported } from '../utils/speech';
import { saveHistoryItem } from '../utils/history';

interface TranslatorCardProps {
  initialSource?: SourceLanguageCode;
  initialTarget?: LanguageCode;
  initialText?: string;
  onHistoryUpdated?: (item: HistoryItem) => void;
}

export const TranslatorCard: React.FC<TranslatorCardProps> = ({
  initialSource = 'en',
  initialTarget = 'hi',
  initialText = '',
  onHistoryUpdated,
}) => {
  const [sourceLang, setSourceLang] = useState<SourceLanguageCode>(initialSource);
  const [targetLang, setTargetLang] = useState<LanguageCode>(initialTarget);
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState('');
  const [detectedLang, setDetectedLang] = useState<LanguageCode | undefined>();

  // Auto-translate enabled by default (user types -> translation starts automatically)
  const [autoTranslate, setAutoTranslate] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);
  const [swapRotating, setSwapRotating] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestIdRef = useRef(0);
  const lastTranslatedTextRef = useRef('');

  // Sync props if changed from parent (e.g. clicking common phrase or pair link)
  useEffect(() => {
    if (initialSource) setSourceLang(initialSource);
    if (initialTarget) setTargetLang(initialTarget);
    if (initialText !== undefined) {
      setInputText(initialText);
    }
  }, [initialSource, initialTarget, initialText]);

  // Clean up any ongoing TTS on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Core translation execution
  const executeTranslation = useCallback(
    async (textToTranslate: string, sLang: SourceLanguageCode, tLang: LanguageCode) => {
      const trimmed = textToTranslate.trim();

      if (!trimmed) {
        setOutputText('');
        setDetectedLang(undefined);
        setErrorMessage(null);
        setIsCompleted(false);
        lastTranslatedTextRef.current = '';
        return;
      }

      const thisRequestId = ++requestIdRef.current;
      setIsLoading(true);
      setIsCompleted(false);
      setErrorMessage(null);
      stopSpeech();
      setIsSpeakingSource(false);
      setIsSpeakingTarget(false);

      const request: TranslationRequest = {
        text: trimmed,
        sourceLang: sLang,
        targetLang: tLang,
      };

      try {
        const response: TranslationResponse = await translationService.translate(request);

        // Only update state if this is still the newest request (avoids race conditions)
        if (thisRequestId === requestIdRef.current) {
          setOutputText(response.translatedText);
          setDetectedLang(response.detectedLang);
          setIsCompleted(true);
          lastTranslatedTextRef.current = trimmed;

          // Save to local device history
          if (response.translatedText && response.translatedText !== trimmed) {
            const saved = saveHistoryItem({
              sourceText: trimmed,
              translatedText: response.translatedText,
              sourceLang: sLang,
              targetLang: tLang,
              detectedLang: response.detectedLang,
            });
            onHistoryUpdated?.(saved);
          }
        }
      } catch (err: any) {
        if (thisRequestId === requestIdRef.current) {
          setErrorMessage(err.message || "Couldn't translate this text. Please try again.");
        }
      } finally {
        if (thisRequestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    [onHistoryUpdated]
  );

  // Live Auto-Translate as the user writes / changes input
  useEffect(() => {
    const trimmed = inputText.trim();

    if (!trimmed) {
      setOutputText('');
      setDetectedLang(undefined);
      setErrorMessage(null);
      setIsCompleted(false);
      return;
    }

    if (!autoTranslate) return;

    // Debounce 400ms: when user pauses typing, start translation automatically!
    const timer = setTimeout(() => {
      executeTranslation(inputText, sourceLang, targetLang);
    }, 400);

    return () => clearTimeout(timer);
  }, [inputText, sourceLang, targetLang, autoTranslate, executeTranslation]);

  const handleManualTranslate = () => {
    executeTranslation(inputText, sourceLang, targetLang);
  };

  const handleSwap = () => {
    setSwapRotating(true);
    setTimeout(() => setSwapRotating(false), 400);

    stopSpeech();
    setIsSpeakingSource(false);
    setIsSpeakingTarget(false);

    const effectiveSource = sourceLang === 'auto' ? (detectedLang || 'en') : sourceLang;
    const newTarget = effectiveSource;
    const newSource = targetLang;

    setSourceLang(newSource);
    setTargetLang(newTarget);

    if (outputText) {
      const swappedInput = outputText;
      setInputText(swappedInput);
      setOutputText(inputText);
      executeTranslation(swappedInput, newSource, newTarget);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setDetectedLang(undefined);
    setErrorMessage(null);
    setIsCompleted(false);
    lastTranslatedTextRef.current = '';
    stopSpeech();
    setIsSpeakingSource(false);
    setIsSpeakingTarget(false);
    inputRef.current?.focus();
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (clipText) {
        const truncated = clipText.slice(0, 5000);
        setInputText(truncated);
        executeTranslation(truncated, sourceLang, targetLang);
      }
    } catch (err) {
      console.warn('Could not read clipboard', err);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handleListenSource = () => {
    if (!inputText.trim()) return;
    if (isSpeakingSource) {
      stopSpeech();
      setIsSpeakingSource(false);
      return;
    }
    stopSpeech();
    setIsSpeakingTarget(false);
    const speechLang = sourceLang === 'auto' ? (detectedLang || 'en') : sourceLang;

    speakText(inputText, speechLang, {
      onStart: () => setIsSpeakingSource(true),
      onEnd: () => setIsSpeakingSource(false),
      onError: () => setIsSpeakingSource(false),
    });
  };

  const handleListenTarget = () => {
    if (!outputText.trim()) return;
    if (isSpeakingTarget) {
      stopSpeech();
      setIsSpeakingTarget(false);
      return;
    }
    stopSpeech();
    setIsSpeakingSource(false);

    speakText(outputText, targetLang, {
      onStart: () => setIsSpeakingTarget(true),
      onEnd: () => setIsSpeakingTarget(false),
      onError: () => setIsSpeakingTarget(false),
    });
  };

  const handleShare = async () => {
    if (!outputText) return;
    const shareData = {
      title: 'TriLingua Translation',
      text: `${inputText}\n\n→\n\n${outputText}`,
      url: window.location.href,
    };
    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      setShareNotice("Sharing isn't supported on this browser. Copied to clipboard instead!");
      handleCopy();
      setTimeout(() => setShareNotice(null), 3000);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    const sName = sourceLang === 'auto' ? 'Auto' : SUPPORTED_LANGUAGES[sourceLang]?.name;
    const tName = SUPPORTED_LANGUAGES[targetLang]?.name;
    const content = `TriLingua Translation\nFrom: ${sName}\nTo: ${tName}\n\nOriginal Text:\n${inputText}\n\nTranslated Text:\n${outputText}\n\nTriLingua — Three languages. One simple translator.\n© 2026 Copyright Arpan Goswami. All rights reserved.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translation.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleManualTranslate();
    }
  };

  const targetLangDetails = SUPPORTED_LANGUAGES[targetLang];
  const sourceLangDetails = sourceLang === 'auto' ? AUTO_DETECT_OPTION : SUPPORTED_LANGUAGES[sourceLang];

  return (
    <div id="translator" className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 scroll-mt-20">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
        {/* Top Header Bar: Language Selectors + Swap */}
        <div className="bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Source Language Selector */}
          <div className="w-full sm:w-5/12 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden sm:inline">
              From:
            </span>
            <div className="relative flex-1">
              <select
                aria-label="Source Language (From)"
                value={sourceLang}
                onChange={(e) => {
                  const val = e.target.value as SourceLanguageCode;
                  setSourceLang(val);
                  if (val !== 'auto' && val === targetLang) {
                    const others = (['en', 'hi', 'bn'] as LanguageCode[]).filter((l) => l !== val);
                    setTargetLang(others[0]);
                  }
                }}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer appearance-none shadow-sm"
              >
                <option value="auto">Auto Detect — স্বয়ংক্রিয় / स्वचालित</option>
                {LANGUAGE_LIST.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} — {lang.nativeName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {detectedLang && sourceLang === 'auto' && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Detected: {SUPPORTED_LANGUAGES[detectedLang]?.name}
              </span>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleSwap}
              aria-label="Swap languages"
              className={`p-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 shadow-sm transition-all cursor-pointer ${
                swapRotating ? 'rotate-180 duration-300' : 'duration-150'
              }`}
              title="Swap languages"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Target Language Selector */}
          <div className="w-full sm:w-5/12 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden sm:inline">
              To:
            </span>
            <div className="relative flex-1">
              <select
                aria-label="Target Language (To)"
                value={targetLang}
                onChange={(e) => {
                  const val = e.target.value as LanguageCode;
                  setTargetLang(val);
                  if (sourceLang !== 'auto' && sourceLang === val) {
                    const others = (['en', 'hi', 'bn'] as LanguageCode[]).filter((l) => l !== val);
                    setSourceLang(others[0]);
                  }
                }}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-semibold text-sm rounded-xl py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors cursor-pointer appearance-none shadow-sm"
              >
                {LANGUAGE_LIST.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name} — {lang.nativeName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Translation Panes: Desktop 2-column, Mobile stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 dark:divide-slate-800 min-h-[300px] sm:min-h-[340px]">
          {/* Input Pane */}
          <div className="p-4 sm:p-6 flex flex-col justify-between relative bg-white dark:bg-slate-900">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                    {sourceLangDetails.name} ({sourceLangDetails.nativeName})
                  </span>
                  {autoTranslate && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Translate
                    </span>
                  )}
                </div>

                {inputText && (
                  <button
                    onClick={handleClear}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-md transition-colors cursor-pointer"
                    title="Clear input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value.slice(0, 5000))}
                onKeyDown={handleKeyDown}
                placeholder="Start typing to translate automatically..."
                rows={7}
                className={`w-full flex-1 bg-transparent text-slate-900 dark:text-slate-100 text-base sm:text-lg resize-none focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600 leading-relaxed ${
                  sourceLang === 'bn' ? 'font-bn' : sourceLang === 'hi' ? 'font-hi' : 'font-en'
                }`}
              />
            </div>

            {/* Input Bottom Toolbar */}
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePaste}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Paste</span>
                </button>

                <button
                  onClick={handleListenSource}
                  disabled={!inputText.trim() || !isSpeechSupported()}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSpeakingSource
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 animate-pulse'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title={isSpeechSupported() ? 'Listen to source text' : 'Text-to-speech unavailable'}
                >
                  {isSpeakingSource ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isSpeakingSource ? 'Stop' : 'Listen'}</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {inputText.length} / 5000
                </span>
              </div>
            </div>
          </div>

          {/* Output Pane */}
          <div className="p-4 sm:p-6 flex flex-col justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  {targetLangDetails.name} ({targetLangDetails.nativeName})
                </span>
                {outputText && (
                  <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    Free Engine
                  </span>
                )}
              </div>

              {/* Translation Display */}
              <div className="flex-1 min-h-[140px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                    <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-medium animate-pulse">Translating as you type...</p>
                  </div>
                ) : outputText ? (
                  <div className="space-y-3">
                    <p
                      className={`text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap select-text ${
                        targetLang === 'bn' ? 'font-bn' : targetLang === 'hi' ? 'font-hi' : 'font-en'
                      }`}
                    >
                      {outputText}
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 dark:text-slate-600 text-base sm:text-lg select-none">
                    Translation will appear here in real time...
                  </p>
                )}
              </div>
            </div>

            {/* Output Bottom Toolbar */}
            <div className="pt-4 mt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                {/* Copy Button */}
                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Copy translated text"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                {/* Listen Button */}
                <button
                  onClick={handleListenTarget}
                  disabled={!outputText || !isSpeechSupported()}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                    isSpeakingTarget
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 animate-pulse'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                  title={isSpeechSupported() ? 'Listen to translation' : 'Speech synthesis not supported'}
                >
                  {isSpeakingTarget ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{isSpeakingTarget ? 'Stop' : 'Listen'}</span>
                </button>

                {/* Share Button */}
                <button
                  onClick={handleShare}
                  disabled={!outputText}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Share translation"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={!outputText}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Download as translation.txt"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>

              {outputText && (
                <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {outputText.length} chars
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Share Fallback Notice */}
        {shareNotice && (
          <div className="bg-sky-50 dark:bg-sky-950/60 border-t border-sky-200 dark:border-sky-900 px-4 sm:px-6 py-2.5 text-xs text-sky-800 dark:text-sky-300 flex items-center justify-between">
            <span>{shareNotice}</span>
            <button onClick={() => setShareNotice(null)} className="text-sky-600 hover:text-sky-800 p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error Handling Banner */}
        {errorMessage && (
          <div className="bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-900 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-sm text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleManualTranslate()}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry</span>
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
              >
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Primary Action Bar */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 order-2 sm:order-1">
            {/* Auto-translate Toggle */}
            <button
              onClick={() => setAutoTranslate(!autoTranslate)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                autoTranslate
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title="Toggle automatic translation as you type"
            >
              <Zap className={`w-3 h-3 ${autoTranslate ? 'text-emerald-500 fill-emerald-500' : 'text-slate-400'}`} />
              <span>Auto-translate: {autoTranslate ? 'On' : 'Off'}</span>
            </button>

            {isCompleted && !isLoading && (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium hidden md:inline-flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Translation complete</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
            {inputText && (
              <button
                onClick={handleClear}
                className="w-1/3 sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}

            <button
              onClick={handleManualTranslate}
              disabled={isLoading || !inputText.trim()}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold text-sm text-white shadow-md transition-all cursor-pointer ${
                isLoading || !inputText.trim()
                  ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60 shadow-none'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Translating...</span>
                </>
              ) : (
                <span>Translate</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
