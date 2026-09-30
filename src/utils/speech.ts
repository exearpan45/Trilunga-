export interface SpeechOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getVoicesForLang(langCode: string): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  const searchLang = langCode.toLowerCase();

  return voices.filter(v => {
    const vLang = v.lang.toLowerCase();
    if (searchLang === 'en') return vLang.startsWith('en');
    if (searchLang === 'hi') return vLang.startsWith('hi');
    if (searchLang === 'bn') return vLang.startsWith('bn');
    return vLang.includes(searchLang);
  });
}

export function speakText(
  text: string,
  langCode: string,
  options?: SpeechOptions
): () => void {
  if (!isSpeechSupported()) {
    options?.onError?.(new Error('Text-to-speech is not supported in this browser.'));
    return () => {};
  }

  // Cancel any ongoing utterance
  window.speechSynthesis.cancel();

  if (!text.trim()) {
    options?.onEnd?.();
    return () => {};
  }

  // Chrome bug safeguard: SpeechSynthesis can pause if idle
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }

  const utterance = new SpeechSynthesisUtterance(text);

  // Map language codes to BCP 47
  if (langCode === 'en') {
    utterance.lang = 'en-US';
  } else if (langCode === 'hi') {
    utterance.lang = 'hi-IN';
  } else if (langCode === 'bn') {
    utterance.lang = 'bn-IN';
  } else {
    utterance.lang = langCode;
  }

  // Find preferred voice if available
  const matchingVoices = getVoicesForLang(langCode);
  if (matchingVoices.length > 0) {
    // Prefer native or local voices
    const preferred = matchingVoices.find(v => !v.localService) || matchingVoices[0];
    utterance.voice = preferred;
  }

  utterance.rate = 0.95; // Slightly slower for crisp Hindi & Bengali enunciation
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    options?.onStart?.();
  };

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (event) => {
    // Canceled is not a real error (user clicked stop or new translation)
    if (event.error !== 'canceled') {
      options?.onError?.(new Error(`Speech synthesis error: ${event.error}`));
    }
    options?.onEnd?.();
  };

  window.speechSynthesis.speak(utterance);

  // Return a cancel function
  return () => {
    window.speechSynthesis.cancel();
    options?.onEnd?.();
  };
}

export function stopSpeech(): void {
  if (isSpeechSupported()) {
    window.speechSynthesis.cancel();
  }
}
