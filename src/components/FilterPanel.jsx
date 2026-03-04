import { useState } from 'react';

export default function FilterPanel({ gender, onGenderChange, ageMin, ageMax, onAgeMinChange, onAgeMaxChange, onReset, hasActiveFilters }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="filter-panel">
      <button
        className={`filter-toggle-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" />
        </svg>
        Filters
        {hasActiveFilters && <span style={{ color: 'var(--accent-red)', fontSize: '0.75rem' }}>●</span>}
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: 'auto' }}>
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className={`filter-collapsible${open ? ' is-open' : ''}`}>
        <div className="filter-group">
        <label className="filter-label">Gender</label>
        <div className="filter-radio-group">
          {[
            { value: '', label: 'All', short: 'All' },
            { value: 'पुरुष', label: '♂ Male', short: '♂' },
            { value: 'महिला', label: '♀ Female', short: '♀' },
          ].map(opt => (
            <button
              key={opt.value}
              className={`filter-radio-btn ${gender === opt.value ? 'active' : ''}`}
              onClick={() => onGenderChange(opt.value)}
            >
              <span className="filter-btn-full">{opt.label}</span>
              <span className="filter-btn-short">{opt.short}</span>
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
    </div>
  );
}
