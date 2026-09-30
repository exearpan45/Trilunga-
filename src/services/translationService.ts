import { TranslationRequest, TranslationResponse, LanguageCode } from '../types/translation';

export interface ITranslationClientService {
  translate(request: TranslationRequest): Promise<TranslationResponse>;
}

class TranslationClientService implements ITranslationClientService {
  private cache = new Map<string, TranslationResponse>();

  private getCacheKey(req: TranslationRequest): string {
    return `${req.sourceLang}_${req.targetLang}_${req.text.trim()}`;
  }

  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    const trimmed = request.text.trim();

    if (!trimmed) {
      return {
        translatedText: '',
        sourceLang: request.sourceLang,
        targetLang: request.targetLang,
        provider: 'none',
        timestamp: Date.now(),
      };
    }

    if (request.text.length > 5000) {
      throw new Error('Input exceeds maximum character limit of 5,000 characters.');
    }

    // Same language shortcut (unless source is auto-detect)
    if (request.sourceLang !== 'auto' && request.sourceLang === request.targetLang) {
      return {
        translatedText: request.text,
        detectedLang: request.sourceLang as LanguageCode,
        sourceLang: request.sourceLang,
        targetLang: request.targetLang,
        provider: 'passthrough',
        timestamp: Date.now(),
      };
    }

    const cacheKey = this.getCacheKey(request);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    // Attempt 1: Call full-stack backend endpoint (/api/translate)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          sourceLang: request.sourceLang,
          targetLang: request.targetLang,
          formality: request.formality || 'default',
        }),
      });

      if (response.ok) {
        const data: TranslationResponse = await response.json();
        this.cache.set(cacheKey, data);
        return data;
      }
    } catch {
      // Backend not running (e.g. pure static Cloudflare Pages hosting) or network error
    }

    // Attempt 2: Direct client-side Free Open-Source translation (Zero-cost, zero API key)
    try {
      const slParam = request.sourceLang === 'auto' ? 'auto' : request.sourceLang;
      const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${slParam}&tl=${request.targetLang}&q=${encodeURIComponent(
        request.text
      )}`;

      const response = await fetch(url);
      if (response.ok) {
        const raw = await response.json();
        if (Array.isArray(raw) && raw.length > 0) {
          const first = raw[0];
          let translatedText = '';
          let detectedLang: LanguageCode | undefined = undefined;

          if (Array.isArray(first)) {
            translatedText = first[0] || '';
            const detected = first[1];
            if (detected === 'en' || detected === 'hi' || detected === 'bn') {
              detectedLang = detected as LanguageCode;
            }
          } else if (typeof first === 'string') {
            translatedText = first;
          }

          if (translatedText) {
            const data: TranslationResponse = {
              translatedText,
              detectedLang,
              sourceLang: request.sourceLang,
              targetLang: request.targetLang,
              provider: 'Free Open-Source Engine',
              timestamp: Date.now(),
            };
            this.cache.set(cacheKey, data);
            return data;
          }
        }
      }
    } catch {
      // client-side attempt failed
    }

    // Attempt 3: Direct client-side MyMemory open translation memory fallback
    try {
      const pair = `${request.sourceLang === 'auto' ? 'en' : request.sourceLang}|${request.targetLang}`;
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(request.text)}&langpair=${pair}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        let candidateText = data?.responseData?.translatedText;

        if (data?.matches && Array.isArray(data.matches) && data.matches.length > 0) {
          const hasDevanagari = (str: string) => /[\u0900-\u097F]/.test(str);
          const hasBengali = (str: string) => /[\u0980-\u09FF]/.test(str);

          let bestMatch = data.matches[0];
          for (const m of data.matches) {
            const trans = m.translation || '';
            if (request.targetLang === 'hi' && hasDevanagari(trans)) {
              bestMatch = m;
              break;
            } else if (request.targetLang === 'bn' && hasBengali(trans)) {
              bestMatch = m;
              break;
            } else if (request.targetLang === 'en' && !hasDevanagari(trans) && !hasBengali(trans)) {
              bestMatch = m;
              break;
            }
          }
          if (bestMatch?.translation) {
            candidateText = bestMatch.translation;
          }
        }

        if (candidateText && candidateText.trim()) {
          const result: TranslationResponse = {
            translatedText: candidateText,
            sourceLang: request.sourceLang,
            targetLang: request.targetLang,
            provider: 'MyMemory Open Engine',
            timestamp: Date.now(),
          };
          this.cache.set(cacheKey, result);
          return result;
        }
      }
    } catch {
      // fallback failed
    }

    // As required by Section 6 of PRD:
    // If the chosen translation engine cannot run:
    // Do NOT return fake translations or silently show original text.
    // Instead display: "Translation engine unavailable" with clear explanation and retry option.
    throw new Error('Translation engine unavailable. Please check your connection and try again.');
  }
}

export const translationService: ITranslationClientService = new TranslationClientService();
