function getPreviewUrl(book) {
  if (book.previewLink) return book.previewLink;
  if (book.infoLink) return book.infoLink;

  const query = encodeURIComponent(`${book.title} ${book.author}`);
  return `https://books.google.com/books?q=${query}`;
}

export default function BookDetail({ book, onClose }) {
  if (!book) return null;

  return (
    <section className={`book-detail genre-${book.genres[0] || 'fiction'}`} aria-labelledby="book-detail-title">
      <div className="book-detail-header">
        <div>
          <p className="section-eyebrow">Now reading</p>
          <h2 id="book-detail-title" className="book-detail-title">{book.title}</h2>
          <p className="book-author">by {book.author}{book.year ? ` · ${book.year}` : ''}</p>
        </div>
        <button type="button" className="btn btn-secondary book-detail-close" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="book-detail-meta book-meta-row">
        {book.pages > 0 && <span className="meta-tag">{book.pages} pages</span>}
        {book.difficulty && <span className="meta-tag">{book.difficulty}</span>}
        {book.source && <span className="meta-tag">{book.source === 'google_books' ? 'Google Books' : 'Marginalia catalog'}</span>}
      </div>

      <div className="book-detail-content">
        <div>
          <p className="why-label">About this book</p>
          <p className="book-detail-summary">{book.summary || 'No description is available for this title yet.'}</p>
        </div>
        <div className="book-detail-author">
          <p className="why-label">About the author</p>
          <p>{book.authorBio || 'Author details are available on the book preview page.'}</p>
        </div>
      </div>

      <div className="book-detail-actions">
        <a className="btn btn-primary" href={getPreviewUrl(book)} target="_blank" rel="noreferrer">
          Open preview pages ↗
        </a>
        <span className="field-hint">Preview availability depends on the publisher.</span>
      </div>
    </section>
  );
}
