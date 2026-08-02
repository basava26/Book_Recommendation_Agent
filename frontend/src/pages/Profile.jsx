import PreferencesForm from '../components/PreferencesForm.jsx';
import ReadingHistoryInput from '../components/ReadingHistoryInput.jsx';

export default function Profile({ onSeeRecommendations }) {
  return (
    <div>
      <p className="section-eyebrow">Marginalia · 02</p>
      <h1 className="section-title">Build your reading profile.</h1>
      <p className="section-lede">
        Give the agent a few signals about your taste, then add some books you have already read.
      </p>
      <PreferencesForm />
      <ReadingHistoryInput />
      <button className="btn btn-primary" onClick={onSeeRecommendations}>
        See my recommendations →
      </button>
    </div>
  );
}