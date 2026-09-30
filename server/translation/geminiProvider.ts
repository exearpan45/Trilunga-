import { GoogleGenAI, Type } from '@google/genai';
import { ITranslationProvider, TranslateProviderOptions, TranslateProviderResult } from './provider.js';

export class GeminiTranslationProvider implements ITranslationProvider {
  name = 'Google Gemini 2.5 Flash';
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } else {
      console.warn('GEMINI_API_KEY not found in environment.');
    }
  }

  async translate(options: TranslateProviderOptions): Promise<TranslateProviderResult> {
    if (!this.ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Translation service is temporarily unconfigured. Please verify GEMINI_API_KEY.');
      }
      this.ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }

    const { text, sourceLang, targetLang, formality = 'default' } = options;

    const langNames: Record<string, string> = {
      en: 'English',
      hi: 'Hindi (हिंदी)',
      bn: 'Bengali (বাংলা)',
      auto: 'Auto Detect (English, Hindi, or Bengali)',
    };

    const targetName = langNames[targetLang] || targetLang;
    const sourceName = langNames[sourceLang] || sourceLang;

    const systemInstruction = `You are TriLingua's specialized neural translation engine, dedicated exclusively to English, Hindi, and Bengali.
Your task is to provide accurate, natural, fluent, and culturally appropriate translations between English, Hindi, and Bengali.

CRITICAL RULES:
1. Bengali Language Rules:
   - Use standard Bengali Unicode script (বাংলা).
   - Use the Bengali Dari (।) for declarative sentence endings instead of Latin period (.), except where question marks (?) or exclamation marks (!) are required.
   - Accurately render conjuncts (যুক্তাক্ষর) and vowel signs (কার).
   - Choose natural conversational or polite Bengali phrasing.

2. Hindi Language Rules:
   - Use standard Devanagari script (हिंदी).
   - Use the Purna Viram (।) for declarative sentence endings instead of Latin period (.), keeping question marks (?) and exclamation marks (!).
   - Maintain correct grammatical gender and verb agreements.
   - Default to polite/standard register ("आप" / respectful verb forms).

3. English Language Rules:
   - Use natural idiomatic English with proper punctuation, capitalisation, and contractions where appropriate.

4. Formatting Preservation:
   - Preserve all paragraph breaks, empty lines, bullet points, numbers, and quotation marks exactly.
   - Do NOT add extraneous notes, preamble, explanations, or quotes around the translation.

5. Transliteration:
   - If the target is Hindi or Bengali, provide a standard Latin phonetic romanization in the "transliteration" field (e.g. for "नमस्ते" -> "Namaste", for "কেমন আছেন?" -> "Kemon achen?").
   - If the target is English, the transliteration can be empty or omitted.

6. Auto-Detection:
   - If source is 'auto', detect whether the input text is primarily 'en' (English), 'hi' (Hindi), or 'bn' (Bengali).`;

    const prompt = `Translate the following text from ${sourceName} into ${targetName}.
Formality level: ${formality}.

Text to translate:
"""
${text}
"""`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const model of candidateModels) {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await this.ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.1,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  translatedText: {
                    type: Type.STRING,
                    description: 'The translated text in the target language script.',
                  },
                  detectedLang: {
                    type: Type.STRING,
                    description: "The detected source language code: 'en', 'hi', or 'bn'.",
                  },
                  transliteration: {
                    type: Type.STRING,
                    description: 'Phonetic romanization in Latin alphabet to assist pronunciation, if applicable.',
                  },
                },
                required: ['translatedText'],
              },
            },
          });

          let rawText = response.text?.trim() || '';
          if (rawText.startsWith('```json')) {
            rawText = rawText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (rawText.startsWith('```')) {
            rawText = rawText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }

          const parsed = JSON.parse(rawText || '{}');

          let detectedLang: 'en' | 'hi' | 'bn' | undefined = undefined;
          if (parsed.detectedLang === 'en' || parsed.detectedLang === 'hi' || parsed.detectedLang === 'bn') {
            detectedLang = parsed.detectedLang;
          }

          return {
            translatedText: parsed.translatedText || text,
            detectedLang,
            transliteration: parsed.transliteration || undefined,
            provider: `TriLingua Core (${model})`,
          };
        } catch (err: any) {
          lastError = err;
          // If error is 503 or 429, wait a brief moment and retry or try next model
          const isTransient = err?.status === 503 || err?.status === 429 || err?.message?.includes('high demand');
          if (isTransient) {
            await new Promise((r) => setTimeout(r, 400));
            continue; // retry this model once
          } else {
            break; // try next candidate model
          }
        }
      }
    }

    console.error('All Gemini translation attempts failed:', lastError);
    throw new Error("Translation couldn't be completed. Please try again.");
  }
}
