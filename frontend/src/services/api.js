const API_URL = "http://127.0.0.1:8001";
const GENRE_IDS = { "self-help": "selfhelp" };
const BACKEND_GENRES = { selfhelp: "self-help" };
const READING_LEVELS = { beginner: "easy", intermediate: "medium", advanced: "hard" };

function normalizeBook(book) {
  const score = Number.isFinite(book.score) ? book.score : 0;

  return {
    ...book,
    author: book.authors?.[0] || "Unknown author",
    genres: (book.genres || []).map((genre) => GENRE_IDS[genre] || genre),
    pages: book.page_count || 0,
    summary: book.description,
    year: book.year || "",
    authorBio: book.authorBio || "",
    tags: book.tags || [],
    previewLink: book.preview_link || book.previewLink || "",
    infoLink: book.info_link || book.infoLink || "",
    matchPercent: book.score === undefined ? undefined : Math.min(99, Math.round(40 + score * 6)),
  };
}

export async function fetchRecommendations(preferences, limit = 6) {
  const response = await fetch(`${API_URL}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      favorite_genres: preferences.genres.map((genre) => BACKEND_GENRES[genre] || genre),
      interests: preferences.interests,
      reading_level: READING_LEVELS[preferences.difficulty] || preferences.difficulty,
      max_results: limit,
    }),
  });

  if (!response.ok) {
    throw new Error(`Recommendation request failed (${response.status})`);
  }

  const books = await response.json();
  return books.map(normalizeBook);
}

export async function searchBooks(query, limit = 10) {
  const response = await fetch(`${API_URL}/books/search?query=${encodeURIComponent(query)}&limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Book search failed (${response.status})`);
  }

  const books = await response.json();
  return books.map(normalizeBook);
}