export const BOOKS = [
  {
    id: 'b1',
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    genres: ['fantasy', 'romance'],
    tags: ['magic', 'atmospheric', 'competition', 'slow-burn'],
    difficulty: 'beginner',
    pages: 387,
    year: 2011,
    summary: 'Two young illusionists are bound since childhood to compete in a magical duel staged across a mysterious black-and-white circus that only opens at night.',
    authorBio: 'American novelist known for lush, atmospheric prose and genre-blurring fantasy.',
  },
  {
    id: 'b2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genres: ['scifi'],
    tags: ['space', 'survival', 'humor', 'science'],
    difficulty: 'intermediate',
    pages: 476,
    year: 2021,
    summary: 'A lone astronaut wakes with no memory on a solo mission to save humanity from extinction, and must piece together the science and his past to succeed.',
    authorBio: 'American author and former software engineer, also known for The Martian.',
  },
  // ... 16 more books (Klara and the Sun, Atomic Habits, Sapiens, Gone Girl,
  // The Name of the Wind, Educated, Dune, The Seven Husbands of Evelyn Hugo,
  // Thinking Fast and Slow, Circe, The Silent Patient, A Short History of
  // Nearly Everything, The Left Hand of Darkness, Pachinko, Deep Work,
  // The Blade Itself — full list is in the zip)
];

export const ALL_GENRES = [
  { id: 'fiction', label: 'Fiction' },
  { id: 'scifi', label: 'Sci-Fi' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'nonfiction', label: 'Nonfiction' },
  { id: 'mystery', label: 'Mystery / Thriller' },
  { id: 'romance', label: 'Romance' },
  { id: 'history', label: 'History' },
  { id: 'selfhelp', label: 'Self-Help' },
];

export const ALL_INTERESTS = [
  'magic', 'space', 'psychology', 'mythology', 'productivity', 'science',
  'politics', 'family saga', 'identity', 'philosophical', 'twist',
  'coming-of-age', 'memoir', 'evolution',
];

export const DIFFICULTIES = [
  { id: 'beginner', name: 'Easy going', desc: 'Fast-paced, accessible' },
  { id: 'intermediate', name: 'Balanced', desc: 'Some density, rewarding' },
  { id: 'advanced', name: 'Challenging', desc: 'Dense or demanding' },
];