export default function WhyRecommended({ reasons }) {
  if (!reasons || reasons.length === 0) {
    return (
      <div className="why-box">
        <p className="why-label">Why this one</p>
        <ul className="why-reasons"><li>A well-regarded pick to help widen your shelf</li></ul>
      </div>
    );
  }
  return (
    <div className="why-box">
      <p className="why-label">Why this one</p>
      <ul className="why-reasons">
        {reasons.map((reason, i) => <li key={i}>{reason}</li>)}
      </ul>
    </div>
  );
}