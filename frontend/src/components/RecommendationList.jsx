import BookCard from './BookCard.jsx';

export default function RecommendationList({ books, loading, onOpen, emptyMessage = false }) {
  if (loading) {
    return (
      <div className="spinner-row">
        <span className="spinner" aria-hidden="true" />
        <span>Reading your shelf…</span>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-title">
          {emptyMessage ? 'No books found' : 'Nothing on the shelf yet'}
        </p>
        <p>
          {emptyMessage
            ? 'Try a different title, author, or genre.'
            : 'Pick at least one genre or interest to get personalized recommendations.'}
        </p>
      </div>
    );
  }

  return (
    <div className="shelf">
      {books.map((book) => <BookCard key={book.id} book={book} onOpen={onOpen} />)}
    </div>
  );
}