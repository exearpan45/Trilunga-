import { HistoryItem } from '../types/translation';

const STORAGE_KEY = 'trilingua_translation_history_v1';
const MAX_HISTORY_ITEMS = 30;

export function getLocalHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load history from localStorage', err);
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem {
  const current = getLocalHistory();
  const newItem: HistoryItem = {
    ...item,
    id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  // Avoid consecutive exact duplicates
  const filtered = current.filter(
    (h) => !(h.sourceText === item.sourceText && h.sourceLang === item.sourceLang && h.targetLang === item.targetLang)
  );

  const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save translation history item', err);
  }

  return newItem;
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  const current = getLocalHistory();
  const updated = current.filter(h => h.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to remove history item', err);
  }
  return updated;
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear history', err);
  }
}
