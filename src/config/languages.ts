import { Language, LanguageCode, LanguagePairInfo, PhraseItem } from '../types/translation';

export const SUPPORTED_LANGUAGES: Record<LanguageCode, Language> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    fontClass: 'font-en',
    speechCode: 'en-US',
    flagEmoji: '🇬🇧',
    sampleGreeting: 'Hello, how are you today?',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    fontClass: 'font-hi',
    speechCode: 'hi-IN',
    flagEmoji: '🇮🇳',
    sampleGreeting: 'नमस्ते, आप कैसे हैं?',
  },
  bn: {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    fontClass: 'font-bn',
    speechCode: 'bn-IN',
    flagEmoji: '🇮🇳',
    sampleGreeting: 'নমস্কার, আপনি কেমন আছেন?',
  },
};

export const LANGUAGE_LIST: Language[] = Object.values(SUPPORTED_LANGUAGES);

export const AUTO_DETECT_OPTION = {
  code: 'auto' as const,
  name: 'Detect Language',
  nativeName: 'Auto Detect',
  fontClass: 'font-en',
  speechCode: '',
  flagEmoji: '✨',
  sampleGreeting: '',
};

export const COMMON_PHRASES: PhraseItem[] = [
  // Everyday
  {
    id: 'p-hello',
    category: 'everyday',
    textEn: 'Hello',
    textHi: 'नमस्ते',
    textBn: 'নমস্কার',
  },
  {
    id: 'p-how-are-you',
    category: 'everyday',
    textEn: 'How are you?',
    textHi: 'आप कैसे हैं?',
    textBn: 'কেমন আছেন?',
  },
  {
    id: 'p-thank-you',
    category: 'everyday',
    textEn: 'Thank you',
    textHi: 'धन्यवाद',
    textBn: 'ধন্যবাদ',
  },
  {
    id: 'p-good-morning',
    category: 'everyday',
    textEn: 'Good morning',
    textHi: 'शुभ प्रभात',
    textBn: 'সুপ্রভাত',
  },
  {
    id: 'p-what-doing',
    category: 'everyday',
    textEn: 'What are you doing?',
    textHi: 'आप क्या कर रहे हैं?',
    textBn: 'আপনি কী করছেন?',
  },
  {
    id: 'p-see-later',
    category: 'everyday',
    textEn: 'See you later',
    textHi: 'फिर मिलेंगे',
    textBn: 'পরে দেখা হবে',
  },
  // Study & Work
  {
    id: 'p-answer',
    category: 'study',
    textEn: 'What is the answer?',
    textHi: 'उत्तर क्या है?',
    textBn: 'উত্তর কী?',
  },
  {
    id: 'p-dont-understand',
    category: 'study',
    textEn: "I don't understand.",
    textHi: 'मुझे समझ नहीं आया।',
    textBn: 'আমি বুঝতে পারছি না।',
  },
  {
    id: 'p-please-explain',
    category: 'study',
    textEn: 'Please explain this.',
    textHi: 'कृपया इसे समझाइए।',
    textBn: 'দয়া করে এটি ব্যাখ্যা করুন।',
  },
  {
    id: 'p-send-document',
    category: 'study',
    textEn: 'Please send the document.',
    textHi: 'कृपया दस्तावेज़ भेजें।',
    textBn: 'দয়া করে নথিটি পাঠান।',
  },
  // Travel & Directions
  {
    id: 'p-where-station',
    category: 'travel',
    textEn: 'Where is the train station?',
    textHi: 'रेलवे स्टेशन कहाँ है?',
    textBn: 'রেলওয়ে স্টেশন কোথায়?',
  },
  {
    id: 'p-how-much',
    category: 'travel',
    textEn: 'How much does this cost?',
    textHi: 'इसकी कीमत क्या है?',
    textBn: 'এটার দাম কত?',
  },
  {
    id: 'p-help-me',
    category: 'travel',
    textEn: 'Can you help me?',
    textHi: 'क्या आप मेरी मदद कर सकते हैं?',
    textBn: 'আপনি কি আমাকে সাহায্য করতে পারেন?',
  },
];

export const LANGUAGE_PAIRS: LanguagePairInfo[] = [
  {
    slug: 'english-to-hindi',
    source: 'en',
    target: 'hi',
    title: 'English to Hindi Translator',
    description: 'Accurate, natural translation from English into fluent Devanagari Hindi for conversations, office communication, and academics.',
    tips: [
      'Hindi follows Subject-Object-Verb (SOV) order, whereas English follows Subject-Verb-Object (SVO).',
      'Hindi distinguishes between honorific registers: "आप" (formal/respectful), "तुम" (informal), and "तू" (intimate).',
      'Hindi sentences end with a Purna Viram (।) instead of a Latin period (.).',
    ],
    sampleSentences: [
      {
        source: 'How are you today?',
        target: 'आज आप कैसे हैं?',
        note: 'Polite everyday greeting using formal "आप".',
      },
      {
        source: 'I am learning to speak Hindi.',
        target: 'मैं हिंदी बोलना सीख रहा हूँ।',
        note: 'Features Devanagari script and verb conjugation at the sentence end.',
      },
    ],
  },
  {
    slug: 'english-to-bengali',
    source: 'en',
    target: 'bn',
    title: 'English to Bengali Translator',
    description: 'Fast and culturally nuanced translation from English to Bangla script with Bengali punctuation and conjunct character preservation.',
    tips: [
      'Bengali is an Eastern Indo-Aryan language with gender-neutral third-person pronouns ("সে", "তিনি").',
      'Bengali statements end with the Dari punctuation mark (।) rather than a period.',
      'Rich in conjunct letters (যুক্তাক্ষর); font rendering handles complex vowel matras correctly.',
    ],
    sampleSentences: [
      {
        source: 'Where are you from?',
        target: 'আপনার বাড়ি কোথায়?',
        note: 'Classic formal conversational inquiry.',
      },
      {
        source: 'I love speaking Bengali.',
        target: 'আমি বাংলায় কথা বলতে ভালোবাসি।',
        note: 'First-person construction ending with standard Dari (।).',
      },
    ],
  },
  {
    slug: 'hindi-to-english',
    source: 'hi',
    target: 'en',
    title: 'Hindi to English Translator',
    description: 'Convert Hindi Devanagari sentences, idioms, and formal documents into clean, idiomatic English with proper grammatical tense alignment.',
    tips: [
      'Devanagari postpositions (को, में, से) are translated to English prepositions (to, in, from).',
      'Compounds and reflexive pronouns (खुद, अपने आप) are preserved with natural English phrasing.',
    ],
    sampleSentences: [
      {
        source: 'कल मौसम बहुत सुहावना था।',
        target: 'The weather was very pleasant yesterday.',
        note: 'Past tense construction translated naturally.',
      },
      {
        source: 'कृपया मुझे इस काम में मदद कीजिए।',
        target: 'Please help me with this task.',
        note: 'Polite request converted into polite English imperative.',
      },
    ],
  },
  {
    slug: 'hindi-to-bengali',
    source: 'hi',
    target: 'bn',
    title: 'Hindi to Bengali Translator',
    description: 'Direct translation between two major Indo-Aryan sisters—preserving shared Sanskrit vocabulary (Tatsama words) and regional idioms.',
    tips: [
      'Both Hindi and Bengali share extensive Sanskrit vocabulary, making translations exceptionally faithful in nuance.',
      'Bengali does not mark grammatical gender on verbs, simplifying gender agreement compared to Hindi.',
    ],
    sampleSentences: [
      {
        source: 'आपका बहुत-बहुत धन्यवाद।',
        target: 'আপনাকে অনেক অনেক ধন্যবাদ।',
        note: 'Heartfelt expression of gratitude using shared Tatsama roots.',
      },
      {
        source: 'हम कल शाम को मिलेंगे।',
        target: 'আমরা কাল সন্ধ্যায় দেখা করব।',
        note: 'Future tense plan translated into natural Bangla.',
      },
    ],
  },
  {
    slug: 'bengali-to-english',
    source: 'bn',
    target: 'en',
    title: 'Bengali to English Translator',
    description: 'Effortlessly turn Bangla literature, chat, emails, and news into smooth, readable English with contextual accuracy.',
    tips: [
      'Bengali postpositions like "থেকে" (from), "দিয়ে" (with), and "মধ্যে" (inside) map into standard English prepositions.',
      'Bengali honorifics ("আপনি", "তিনি") are rendered as polite English phrasing.',
    ],
    sampleSentences: [
      {
        source: 'আমি কাল সকালে পৌঁছে যাব।',
        target: 'I will arrive tomorrow morning.',
        note: 'Standard future intention translated cleanly.',
      },
      {
        source: 'এই বইটি পড়ে আমার খুব ভালো লেগেছে।',
        target: 'I really enjoyed reading this book.',
        note: 'Expressive emotional construction rendered idiomatically.',
      },
    ],
  },
  {
    slug: 'bengali-to-hindi',
    source: 'bn',
    target: 'hi',
    title: 'Bengali to Hindi Translator',
    description: 'Translate Bengali text directly into Hindi with natural gender agreement and culturally aligned phrase choices.',
    tips: [
      'When translating from Bengali to Hindi, the translator reconstructs gender agreement for Hindi verbs.',
      'Punctuation style (Purna Viram / Dari) is natively shared across both sister scripts.',
    ],
    sampleSentences: [
      {
        source: 'আপনার সাথে কথা বলে খুব আনন্দ হলো।',
        target: 'आपसे बात करके बहुत खुशी हुई।',
        note: 'Polite conversational closing phrase.',
      },
      {
        source: 'আমাদের একসাথে কাজ করতে হবে।',
        target: 'हमें मिलकर काम करना होगा।',
        note: 'Collaborative imperative translated directly.',
      },
    ],
  },
];
