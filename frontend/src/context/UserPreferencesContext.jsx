import { createContext, useContext, useMemo, useState } from 'react';

const UserPreferencesContext = createContext(null);
const STORAGE_KEY = 'marginalia:preferences';

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return { genres: [], interests: [], difficulty: 'intermediate', history: [] };
}

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(loadInitial);

  function persist(next) {
    setPreferences(next);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (e) {}
  }

  function toggleGenre(genreId) {
    persist({
      ...preferences,
      genres: preferences.genres.includes(genreId)
        ? preferences.genres.filter((g) => g !== genreId)
        : [...preferences.genres, genreId],
    });
  }

  function toggleInterest(interest) {
    persist({
      ...preferences,
      interests: preferences.interests.includes(interest)
        ? preferences.interests.filter((i) => i !== interest)
        : [...preferences.interests, interest],
    });
  }

  function setDifficulty(difficulty) {
    persist({ ...preferences, difficulty });
  }

  function addHistoryItem(item) {
    persist({ ...preferences, history: [...preferences.history, item] });
  }

  function removeHistoryItem(index) {
    persist({ ...preferences, history: preferences.history.filter((_, i) => i !== index) });
  }

  const value = useMemo(() => ({
    preferences, toggleGenre, toggleInterest, setDifficulty, addHistoryItem, removeHistoryItem,
  }), [preferences]);

  return <UserPreferencesContext.Provider value={value}>{children}</UserPreferencesContext.Provider>;
}

export function useUserPreferences() {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  return ctx;
}