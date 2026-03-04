export default function FilterPanel({ gender, onGenderChange, ageMin, ageMax, onAgeMinChange, onAgeMaxChange, onReset, hasActiveFilters }) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <label className="filter-label">Gender</label>
        <div className="filter-radio-group">
          {[
            { value: '', label: 'All' },
            { value: 'पुरुष', label: '♂ Male' },
            { value: 'महिला', label: '♀ Female' },
          ].map(opt => (
            <button
              key={opt.value}
              className={`filter-radio-btn ${gender === opt.value ? 'active' : ''}`}
              onClick={() => onGenderChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <label className="filter-label">Age Range</label>
        <div className="age-range-inputs">
          <input
            type="number"
            className="age-input"
            placeholder="Min"
            min="0"
            max="120"
            value={ageMin}
            onChange={e => onAgeMinChange(e.target.value)}
          />
          <span className="age-range-sep">–</span>
          <input
            type="number"
            className="age-input"
            placeholder="Max"
            min="0"
            max="120"
            value={ageMax}
            onChange={e => onAgeMaxChange(e.target.value)}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button className="filter-reset-btn" onClick={onReset}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Reset Filters
        </button>
      )}
    </div>
  );
}
