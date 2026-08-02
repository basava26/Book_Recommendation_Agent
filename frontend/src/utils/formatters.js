import { ALL_GENRES } from '../context/data/books.js';

const AVG_WORDS_PER_PAGE = 275;
const DEFAULT_WPM = 250;

export function estimateReadingTime(pages, wpm = DEFAULT_WPM) {
  const totalWords = pages * AVG_WORDS_PER_PAGE;
  const totalMinutes = Math.round(totalWords / wpm);
  return formatMinutes(totalMinutes);
}

export function formatMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function genreLabel(genreId) {
  const found = ALL_GENRES.find((g) => g.id === genreId);
  return found ? found.label : genreId;
}

export function difficultyLabel(difficulty) {
  const map = { beginner: 'Easy going', intermediate: 'Balanced', advanced: 'Challenging' };
  return map[difficulty] || difficulty;
}