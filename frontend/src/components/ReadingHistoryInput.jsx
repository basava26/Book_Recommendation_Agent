import { useState } from 'react';
import { useUserPreferences } from '../context/UserPreferencesContext.jsx';
import { ALL_GENRES } from '../context/data/books.js';

const emptyDraft = { title: '', author: '', genre: ALL_GENRES[0].id, rating: 4 };

export default function ReadingHistoryInput() {
  const { preferences, addHistoryItem, removeHistoryItem } = useUserPreferences();
  const [draft, setDraft] = useState(emptyDraft);

  function handleAdd(e) {
    e.preventDefault();
    if (!draft.title.trim() || !draft.author.trim()) return;
    addHistoryItem({
      title: draft.title.trim(),
      author: draft.author.trim(),
      genres: [draft.genre],
      rating: Number(draft.rating),
    });
    setDraft(emptyDraft);
  }

  return (
    <div className="panel">
      <label className="field-label">Books you've already read</label>
      <p className="field-hint" style={{ marginTop: -4, marginBottom: 16 }}>
        Titles you rate 4–5 strongly influence future picks by the same author or genre.
      </p>

      {preferences.history.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          {preferences.history.map((item, index) => (
            <div className="history-row" key={`${item.title}-${index}`}>
              <div className="history-row-info">
                <div className="history-title">{item.title}</div>
                <div className="history-author">{item.author}</div>
              </div>
              <span className="history-rating">{'★'.repeat(item.rating)}</span>
              <button type="button" className="btn-ghost" onClick={() => removeHistoryItem(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleAdd}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 10, marginBottom: 10 }}>
          <input type="text" className="text-input" placeholder="Book title"
            value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
          <input type="text" className="text-input" placeholder="Author"
            value={draft.author} onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10 }}>
          <select className="text-input" value={draft.genre}
            onChange={(e) => setDraft({ ...draft, genre: e.target.value })}>
            {ALL_GENRES.map((g) => <option key={g.id} value={g.id}>{g.label}</option>)}
          </select>
          <select className="text-input" value={draft.rating}
            onChange={(e) => setDraft({ ...draft, rating: e.target.value })}>
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{'★'.repeat(r)} rating</option>)}
          </select>
          <button type="submit" className="btn btn-secondary">Add</button>
        </div>
      </form>
    </div>
  );
}