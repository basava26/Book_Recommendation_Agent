import WhyRecommended from './WhyRecommended.jsx';
import { estimateReadingTime, difficultyLabel } from '../utils/formatters.js';

export default function BookCard({ book, onOpen }) {
  const primaryGenre = book.genres[0];
  const readingTime = estimateReadingTime(book.pages);

  return (
    <article className={`book-card genre-${primaryGenre}`}>
      <div className="book-card-top">
        <div>
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author} · {book.year}</p>
        </div>
        {typeof book.matchPercent === 'number' && (
          <span className="match-badge">{book.matchPercent}% match</span>
        )}
      </div>

      <div className="book-meta-row">
        <span className="meta-tag">{difficultyLabel(book.difficulty)}</span>
        <span className="meta-tag">{readingTime} read</span>
        <span className="meta-tag">{book.pages} pages</span>
      </div>

      <p className="book-summary">{book.summary}</p>
      <WhyRecommended reasons={book.reasons} />

      <div className="book-footer">
        <p className="author-details">{book.authorBio}</p>
        <button type="button" className="btn btn-ghost" onClick={() => onOpen(book)}>
          Open book ↗
        </button>
      </div>
    </article>
  );
}