/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TranslatorCard } from './components/TranslatorCard';
import { WhyUseIt } from './components/WhyUseIt';
import { CommonPhrases } from './components/CommonPhrases';
import { RecentHistory } from './components/RecentHistory';
import { LanguagePairGuides } from './components/LanguagePairGuides';
import { EducationalSection } from './components/EducationalSection';
import { FAQSection } from './components/FAQSection';
import { PrivacyNotice } from './components/PrivacyNotice';
import { Footer } from './components/Footer';

import { LanguageCode, SourceLanguageCode, HistoryItem } from './types/translation';
import { getLocalHistory } from './utils/history';
import { LANGUAGE_PAIRS } from './config/languages';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('trilingua_theme');
      if (saved) return saved === 'dark';
      // Default to light mode (clean white/soft background as requested in PRD)
      return false;
    }
    return false;
  });

  const [currentSource, setCurrentSource] = useState<SourceLanguageCode>('en');
  const [currentTarget, setCurrentTarget] = useState<LanguageCode>('hi');
  const [currentText, setCurrentText] = useState<string>('');
  const [selectedPairSlug, setSelectedPairSlug] = useState<string>('english-to-hindi');

  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('trilingua_theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('trilingua_theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    setHistory(getLocalHistory());
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.replace(/^\//, '');
      const matchedPair = LANGUAGE_PAIRS.find((p) => p.slug === pathname);
      if (matchedPair) {
        setCurrentSource(matchedPair.source);
        setCurrentTarget(matchedPair.target);
        setSelectedPairSlug(matchedPair.slug);
      }
    }
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleNavigateToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectPair = (source: LanguageCode, target: LanguageCode, sampleText?: string) => {
    setCurrentSource(source);
    setCurrentTarget(target);
    if (sampleText !== undefined) {
      setCurrentText(sampleText);
    }
    const match = LANGUAGE_PAIRS.find((p) => p.source === source && p.target === target);
    if (match) {
      setSelectedPairSlug(match.slug);
      window.history.replaceState(null, '', `/${match.slug}`);
    }
    handleNavigateToSection('translator');
  };

  const handleSelectPhrase = (phraseText: string) => {
    setCurrentText(phraseText);
    handleNavigateToSection('translator');
  };

  const handleHistoryUpdated = (item: HistoryItem) => {
    setHistory((prev) => [item, ...prev.filter((h) => h.id !== item.id)].slice(0, 30));
  };

  const handleOpenHistoryItem = (item: HistoryItem) => {
    setCurrentSource(item.sourceLang);
    setCurrentTarget(item.targetLang);
    setCurrentText(item.sourceText);
    handleNavigateToSection('translator');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onNavigateToSection={handleNavigateToSection}
      />

      <main className="flex-1">
        {/* 1. Hero Section (PRD Section 41) */}
        <HeroSection
          onStartTranslating={() => handleNavigateToSection('translator')}
          onLearnMore={() => handleNavigateToSection('why-use-it')}
          onSelectPair={handleSelectPair}
        />

        {/* 2. Core Working Translator (PRD Section 41: placed directly below hero) */}
        <TranslatorCard
          initialSource={currentSource}
          initialTarget={currentTarget}
          initialText={currentText}
          onHistoryUpdated={handleHistoryUpdated}
        />

        {/* 3. Recent Translations (Hidden when empty per Section 16) */}
        <RecentHistory
          history={history}
          onHistoryChange={setHistory}
          onOpenHistoryItem={handleOpenHistoryItem}
        />

        {/* 4. Common Phrases (PRD Section 18) */}
        <CommonPhrases
          onSelectPhrase={handleSelectPhrase}
          targetLang={currentTarget}
        />

        {/* 5. Why Use It? & Common Use Cases (PRD Section 41) */}
        <div id="why-use-it">
          <WhyUseIt />
        </div>

        {/* 6. Translation Pair Guides & Dedicated SEO Landing Pages */}
        <LanguagePairGuides
          onSelectPair={handleSelectPair}
          selectedSlug={selectedPairSlug}
        />

        {/* 7. About the Languages (Educational Section) */}
        <EducationalSection
          onTestPhrase={(text, src, tgt) => handleSelectPair(src, tgt, text)}
        />

        {/* 8. Frequently Asked Questions (PRD Section 34) */}
        <FAQSection />

        {/* 9. Privacy Notice & Transparency (PRD Section 17) */}
        <PrivacyNotice />
      </main>

      {/* Footer with Creator Credit (PRD Section 42) */}
      <Footer
        onNavigateToSection={handleNavigateToSection}
        onSelectPair={handleSelectPair}
      />
    </div>
  );
}
