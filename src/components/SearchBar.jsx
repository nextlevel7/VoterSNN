import { useRef } from 'react';
import { isNepali } from '../utils/transliterate';

export default function SearchBar({ value, onChange, resultCount, totalCount }) {
  const inputRef = useRef(null);
  const inputIsNepali = isNepali(value);

  function handleClear() {
    onChange('');
    inputRef.current?.focus();
  }

  return (
    <div className="search-wrapper">
      <div className="search-bar">
        <span className="search-icon">
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
        </span>

        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search by name in English or Nepali… (e.g. Ram, Shrestha, राम)"
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />

        {value && (
          <button className="search-clear" onClick={handleClear} aria-label="Clear search">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {value && (
          <span className={`search-mode-tag ${inputIsNepali ? 'nepali' : 'english'}`}>
            {inputIsNepali ? 'नेपाली' : 'English'}
          </span>
        )}
      </div>

      {value && (
        <p className="search-results-info">
          {resultCount === 0
            ? 'No voters found'
            : `Showing ${resultCount.toLocaleString()} of ${totalCount.toLocaleString()} voters`}
        </p>
      )}
    </div>
  );
}
