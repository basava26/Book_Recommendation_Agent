export default function Home({ onGetStarted }) {
  return (
    <div>
      <p className="section-eyebrow">Marginalia · 01</p>
      <h1 className="section-title" style={{ fontSize: '2.6rem', maxWidth: '18ch' }}>
        Recommendations built from your <em style={{ fontStyle: 'italic', color: 'var(--brass)' }}>actual</em> shelf.
      </h1>
      <p className="section-lede" style={{ fontSize: '1.02rem' }}>
        Tell the agent what you like, what you've already read, and how much of a challenge
        you want next. It scores every book in the catalog against those signals and shows
        its work — no black box, no random picks.
      </p>

      <div className="panel" style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 200px' }}>
          <p className="section-eyebrow" style={{ marginBottom: 6 }}>Step 1</p>
          <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>Set your taste</p>
          <p style={{ margin: '4px 0 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Genres, interests, and the difficulty you actually want to read right now.
          </p>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p className="section-eyebrow" style={{ marginBottom: 6 }}>Step 2</p>
          <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>Log your history</p>
          <p style={{ margin: '4px 0 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Rate a few past reads — loved authors and genres carry extra weight.
          </p>
        </div>
        <div style={{ flex: '1 1 200px' }}>
          <p className="section-eyebrow" style={{ marginBottom: 6 }}>Step 3</p>
          <p style={{ margin: 0, color: 'var(--text)', fontWeight: 600 }}>Get your shelf</p>
          <p style={{ margin: '4px 0 0', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Every pick explains itself: which signal matched, and how strongly.
          </p>
        </div>
      </div>

      <button className="btn btn-primary" style={{ marginTop: 28 }} onClick={onGetStarted}>
        Build my profile →
      </button>
    </div>
  );
}