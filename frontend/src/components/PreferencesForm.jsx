import { ALL_GENRES, ALL_INTERESTS, DIFFICULTIES } from '../context/data/books.js';
import { useUserPreferences } from '../context/UserPreferencesContext.jsx';

export default function PreferencesForm() {
  const { preferences, toggleGenre, toggleInterest, setDifficulty } = useUserPreferences();

  return (
    <div className="panel">
      <div className="field">
        <label className="field-label">Favorite genres</label>
        <div className="chip-grid">
          {ALL_GENRES.map((genre) => (
            <button
              key={genre.id}
              type="button"
              className={`chip genre-${genre.id} ${preferences.genres.includes(genre.id) ? 'selected' : ''}`}
              onClick={() => toggleGenre(genre.id)}
              aria-pressed={preferences.genres.includes(genre.id)}
            >
              {genre.label}
            </button>
          ))}
        </div>
        <p className="field-hint">Pick as many as apply — this carries the most weight.</p>
      </div>

      <div className="field">
        <label className="field-label">What draws you in</label>
        <div className="chip-grid">
          {ALL_INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              className={`chip ${preferences.interests.includes(interest) ? 'selected' : ''}`}
              onClick={() => toggleInterest(interest)}
              aria-pressed={preferences.interests.includes(interest)}
            >
              {interest}
            </button>
          ))}
        </div>
        <p className="field-hint">Themes and moods, not just categories.</p>
      </div>

      <div className="field" style={{ marginBottom: 0 }}>
        <label className="field-label">Preferred difficulty</label>
        <div className="select-row">
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`difficulty-option ${preferences.difficulty === d.id ? 'selected' : ''}`}
              onClick={() => setDifficulty(d.id)}
              aria-pressed={preferences.difficulty === d.id}
            >
              <span className="difficulty-name">{d.name}</span>
              <span className="difficulty-desc">{d.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}