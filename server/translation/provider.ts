export interface TranslateProviderOptions {
  text: string;
  sourceLang: string; // 'en' | 'hi' | 'bn' | 'auto'
  targetLang: string; // 'en' | 'hi' | 'bn'
  formality?: 'default' | 'formal' | 'informal';
}

export interface TranslateProviderResult {
  translatedText: string;
  detectedLang?: 'en' | 'hi' | 'bn';
  transliteration?: string;
  provider: string;
}

export interface ITranslationProvider {
  name: string;
  translate(options: TranslateProviderOptions): Promise<TranslateProviderResult>;
}
