import { BOOKS } from '../context/data/books.js';
import { genreLabel } from '../utils/formatters.js';

const DIFFICULTY_ORDER = ['beginner', 'intermediate', 'advanced'];

const WEIGHTS = {
  genreMatch: 3,
  interestMatch: 2,
  difficultyExact: 4,
  difficultyAdjacent: 1.5,
  sameAuthorAsLoved: 3.5,
  genreOverlapWithHistory: 1,
};

function scoreBook(book, { genres, interests, difficulty, history }) {
  let score = 0;
  const reasons = [];

  const matchedGenres = book.genres.filter((g) => genres.includes(g));
  if (matchedGenres.length > 0) {
    score += matchedGenres.length * WEIGHTS.genreMatch;
    reasons.push(`Matches your favorite genre${matchedGenres.length > 1 ? 's' : ''}: ${matchedGenres.map(genreLabel).join(', ')}`);
  }

  const matchedTags = book.tags.filter((t) => interests.includes(t));
  if (matchedTags.length > 0) {
    score += matchedTags.length * WEIGHTS.interestMatch;
    reasons.push(`Touches on interests you picked: ${matchedTags.join(', ')}`);
  }

  if (difficulty) {
    if (book.difficulty === difficulty) {
      score += WEIGHTS.difficultyExact;
      reasons.push(`Difficulty matches your preferred level`);
    } else {
      const dist = Math.abs(DIFFICULTY_ORDER.indexOf(book.difficulty) - DIFFICULTY_ORDER.indexOf(difficulty));
      if (dist === 1) {
        score += WEIGHTS.difficultyAdjacent;
        reasons.push(`A step away from your usual difficulty — a gentle stretch`);
      }
    }
  }

  const lovedAuthors = history.filter((h) => (h.rating ?? 0) >= 4).map((h) => h.author.toLowerCase());
  if (lovedAuthors.includes(book.author.toLowerCase())) {
    score += WEIGHTS.sameAuthorAsLoved;
    reasons.push(`By ${book.author}, an author you've rated highly before`);
  }

  const historyGenres = new Set(history.flatMap((h) => h.genres || []));
  const overlapWithHistory = book.genres.filter((g) => historyGenres.has(g));
  if (overlapWithHistory.length > 0 && matchedGenres.length === 0) {
    score += overlapWithHistory.length * WEIGHTS.genreOverlapWithHistory;
    reasons.push(`Similar to books you've already read and enjoyed`);
  }

  return { score, reasons };
}

export function getRecommendations(preferences, limit = 6) {
  const { history = [] } = preferences;
  const readTitles = new Set(history.map((h) => h.title.toLowerCase()));

  const scored = BOOKS.filter((book) => !readTitles.has(book.title.toLowerCase())).map((book) => {
    const { score, reasons } = scoreBook(book, preferences);
    return { ...book, score, reasons };
  });

  const withSignal = scored.filter((b) => b.score > 0);
  const pool = withSignal.length > 0 ? withSignal : scored;

  return pool
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((book) => ({ ...book, matchPercent: Math.min(99, Math.round(40 + book.score * 6)) }));
}