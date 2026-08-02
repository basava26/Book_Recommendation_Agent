import { useEffect, useState } from 'react';
import { useUserPreferences } from '../context/UserPreferencesContext.jsx';
import { getRecommendations } from '../services/recommendationEngine.js';
import RecommendationList from '../components/RecommendationList.jsx';
import BookDetail from '../components/BookDetail.jsx';
import { fetchRecommendations, searchBooks } from '../services/api.js';

function Recommendations({ onEditProfile }) {
  const { preferences } = useUserPreferences();
  const [books, setBooks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState('');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setConnectionError('');

    fetchRecommendations(preferences)
      .then((results) => {
        if (!cancelled) {
          setRecommendations(results);
          setBooks(results);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBooks(getRecommendations(preferences));
          setConnectionError('Showing local recommendations while the backend is unavailable.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [preferences]);
  const normalizedQuery = submittedQuery.trim().toLowerCase();

  useEffect(() => {
    if (!normalizedQuery) {
      setBooks(recommendations);
      setConnectionError('');
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setConnectionError('');

    searchBooks(normalizedQuery)
      .then((results) => {
        if (!cancelled) {
          setBooks(results);
          setSelectedBook(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setBooks([]);
          setConnectionError('Book search is unavailable right now.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [normalizedQuery, recommendations]);

  const visibleBooks = books;

  useEffect(() => {
    if (selectedBook && !visibleBooks.some((book) => book.id === selectedBook.id)) {
      setSelectedBook(null);
    }
  }, [selectedBook, visibleBooks]);

  return (
    <div>
      <p className="section-eyebrow">Marginalia · 03</p>
      <h1 className="section-title">Your next good read.</h1>
      <p className="section-lede">
        These books are matched against the preferences and reading history on your profile.
      </p>

      <button type="button" className="btn btn-secondary" onClick={onEditProfile}>
        Edit profile
      </button>

      <form
        className="field"
        style={{ marginTop: '2rem' }}
        onSubmit={(event) => {
          event.preventDefault();
          setSubmittedQuery(query);
        }}
      >
        <label className="field-label" htmlFor="book-search">Search the book catalog</label>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            id="book-search"
            className="text-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter title and author"
            style={{ flex: '1 1 20rem' }}
          />
          <button type="submit" className="btn btn-primary" disabled={!query.trim() || loading}>
            Search
          </button>
          {submittedQuery && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setQuery('');
                setSubmittedQuery('');
                setSelectedBook(null);
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {connectionError && <p className="field-hint">{connectionError}</p>}
      <BookDetail book={selectedBook} onClose={() => setSelectedBook(null)} />
      <RecommendationList
        books={visibleBooks}
        loading={loading}
        onOpen={setSelectedBook}
        emptyMessage={Boolean(normalizedQuery) && !loading}
      />
    </div>
  );
}

export default Recommendations;