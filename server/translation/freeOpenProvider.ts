import { ITranslationProvider, TranslateProviderOptions, TranslateProviderResult } from './provider.js';

export class FreeOpenSourceTranslationProvider implements ITranslationProvider {
  name = 'Free Open-Source Engine (Zero-Cost)';

  async translate(options: TranslateProviderOptions): Promise<TranslateProviderResult> {
    const { text, sourceLang, targetLang } = options;

    if (!text || !text.trim()) {
      return {
        translatedText: '',
        detectedLang: undefined,
        provider: this.name,
      };
    }

    let lastError: Error | null = null;

    // Strategy 1: Free Public Open-Source Chrome Extension Endpoint (No key, fast, accurate)
    try {
      const slParam = sourceLang === 'auto' ? 'auto' : sourceLang;
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${slParam}&tl=${targetLang}&q=${encodeURIComponent(
        text
      )}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: '*/*',
        },
        signal: AbortSignal.timeout(7000),
      });

      if (response.ok) {
        const raw = await response.json();
        // Format is either ["translated text"] or [["translated text", "detected_lang"]]
        if (Array.isArray(raw) && raw.length > 0) {
          const first = raw[0];
          let translatedText = '';
          let detectedLang: 'en' | 'hi' | 'bn' | undefined = undefined;

          if (Array.isArray(first)) {
            translatedText = first[0] || '';
            const detected = first[1];
            if (detected === 'en' || detected === 'hi' || detected === 'bn') {
              detectedLang = detected;
            }
          } else if (typeof first === 'string') {
            translatedText = first;
          }

          if (translatedText) {
            return {
              translatedText,
              detectedLang,
              provider: 'Free Public Open-Source Engine',
            };
          }
        }
      }
    } catch (err: any) {
      console.warn('Strategy 1 (Public Client Endpoint) failed, trying MyMemory fallback...', err?.message);
      lastError = err;
    }

    // Strategy 2: MyMemory Free Translation Memory (100% Free, Zero Key, Human + MT)
    try {
      const pair = `${sourceLang === 'auto' ? 'en' : sourceLang}|${targetLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${pair}`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const data = await response.json();
        let candidateText = data?.responseData?.translatedText;

        // If candidate matches exist, pick highest quality match with valid target script
        if (data?.matches && Array.isArray(data.matches) && data.matches.length > 0) {
          const hasDevanagari = (str: string) => /[\u0900-\u097F]/.test(str);
          const hasBengali = (str: string) => /[\u0980-\u09FF]/.test(str);

          let bestMatch = data.matches[0];
          for (const m of data.matches) {
            const trans = m.translation || '';
            if (targetLang === 'hi' && hasDevanagari(trans)) {
              bestMatch = m;
              break;
            } else if (targetLang === 'bn' && hasBengali(trans)) {
              bestMatch = m;
              break;
            } else if (targetLang === 'en' && !hasDevanagari(trans) && !hasBengali(trans)) {
              bestMatch = m;
              break;
            }
          }
          if (bestMatch?.translation) {
            candidateText = bestMatch.translation;
          }
        }

        if (candidateText && candidateText.trim()) {
          return {
            translatedText: candidateText,
            detectedLang: undefined,
            provider: 'MyMemory Open Translation Memory',
          };
        }
      }
    } catch (err: any) {
      console.warn('Strategy 2 (MyMemory) failed:', err?.message);
      lastError = err;
    }

    console.error('All zero-cost free translation engines failed:', lastError);
    throw new Error('Translation engine unavailable. Please try again later.');
  }
}
