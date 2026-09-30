export type LanguageCode = 'en' | 'hi' | 'bn';
export type SourceLanguageCode = LanguageCode | 'auto';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  fontClass: string;
  speechCode: string;
  flagEmoji: string;
  sampleGreeting: string;
}

export interface TranslationRequest {
  text: string;
  sourceLang: SourceLanguageCode;
  targetLang: LanguageCode;
  formality?: 'default' | 'formal' | 'informal';
}

export interface TranslationResponse {
  translatedText: string;
  detectedLang?: LanguageCode;
  sourceLang: SourceLanguageCode;
  targetLang: LanguageCode;
  transliteration?: string;
  provider: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: SourceLanguageCode;
  targetLang: LanguageCode;
  detectedLang?: LanguageCode;
  transliteration?: string;
  timestamp: number;
}

export interface PhraseItem {
  id: string;
  category: 'everyday' | 'study' | 'travel';
  textEn: string;
  textHi: string;
  textBn: string;
}

export interface LanguagePairInfo {
  slug: string;
  source: LanguageCode;
  target: LanguageCode;
  title: string;
  description: string;
  tips: string[];
  sampleSentences: {
    source: string;
    target: string;
    note: string;
  }[];
}
