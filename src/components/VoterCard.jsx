import { genderLabel } from '../utils/transliterate';

export default function VoterCard({ voter, onClick }) {
  const isFemale = voter['लिङ्ग'] === 'महिला';

  return (
    <div className={`voter-card ${isFemale ? 'female' : 'male'}`} onClick={() => onClick(voter)}>
      <div className="voter-card-header">
        <div className="voter-avatar">
          <span>{isFemale ? '♀' : '♂'}</span>
        </div>
        <div className="voter-card-ids">
          <span className="voter-serial">#{voter['सि.नं.']}</span>
          <span className="voter-id-badge">{voter['मतदाता नं']}</span>
        </div>
      </div>

      <div className="voter-card-body">
        <h3 className="voter-name">{voter['मतदाताको नाम']}</h3>

        <div className="voter-meta">
          <span className={`voter-gender-tag ${isFemale ? 'female' : 'male'}`}>
            {genderLabel(voter['लिङ्ग'])}
          </span>
        </div>

        <p className="voter-detail-row">
          <span className="voter-detail-icon">👨‍👩‍👦</span>
          <span className="voter-detail-text truncate">{voter['पिता/माताको नाम']}</span>
        </p>
      </div>

      <div className="voter-card-footer">
        <button className="btn-view" onClick={() => onClick(voter)}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          View Details
        </button>
      </div>
    </div>
  );
}
