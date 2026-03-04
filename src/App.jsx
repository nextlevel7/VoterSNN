import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import VoterCard from './components/VoterCard';
import VoterModal from './components/VoterModal';
import Pagination from './components/Pagination';
import { transliterate, matchesQuery, isNepali, scoreQuery, scoreNepali } from './utils/transliterate';
import { loadEncryptedVoters } from './utils/crypto';

const PAGE_SIZE_DEFAULT = 24;

export default function App() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_DEFAULT);

  const [selectedVoter, setSelectedVoter] = useState(null);

  // Pre-computed transliterations for fast search
  const transliterations = useRef([]);

  // Fetch and decrypt voter data
  useEffect(() => {
    loadEncryptedVoters()
      .then(data => {
        setVoters(data);
        transliterations.current = data.map(v => transliterate(v['मतदाताको नाम']));
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load voter data. ' + err.message);
        setLoading(false);
      });
  }, []);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Stats
  const stats = useMemo(() => {
    if (!voters.length) return null;
    const male = voters.filter(v => v['लिङ्ग'] === 'पुरुष').length;
    const female = voters.filter(v => v['लिङ्ग'] === 'महिला').length;
    const ages = voters.map(v => Number(v['उमेर(वर्ष)'])).filter(a => !isNaN(a));
    const avgAge = ages.length ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0;
    return { total: voters.length, male, female, avgAge };
  }, [voters]);

  // Filtered voters
  const filteredVoters = useMemo(() => {
    if (!voters.length) return [];

    const nepaliInput = isNepali(debouncedSearch);
    const hasSearch = debouncedSearch.trim().length > 0;
    const minAge = ageMin !== '' ? Number(ageMin) : null;
    const maxAge = ageMax !== '' ? Number(ageMax) : null;

    // Show nothing until the user has typed something in the search field
    if (!hasSearch) return [];

    const matched = [];

    voters.forEach((voter, idx) => {
      // Search filter
      if (hasSearch) {
        if (nepaliInput) {
          if (!voter['मतदाताको नाम'].includes(debouncedSearch.trim())) return;
        } else {
          if (!matchesQuery(transliterations.current[idx], debouncedSearch)) return;
        }
      }

      // Gender filter
      if (genderFilter && voter['लिङ्ग'] !== genderFilter) return;

      // Age filter
      const age = Number(voter['उमेर(वर्ष)']);
      if (minAge !== null && age < minAge) return;
      if (maxAge !== null && age > maxAge) return;

      // Compute relevance score for sorting
      const score = hasSearch
        ? nepaliInput
          ? scoreNepali(voter['मतदाताको नाम'], debouncedSearch.trim())
          : scoreQuery(transliterations.current[idx], debouncedSearch)
        : 2;

      matched.push({ voter, score });
    });

    // Sort: starts-with first (score 0), then word-starts-with (score 1), then rest (score 2)
    matched.sort((a, b) => a.score - b.score);

    return matched.map(m => m.voter);
  }, [voters, debouncedSearch, genderFilter, ageMin, ageMax]);

  // Paginated slice
  const paginatedVoters = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVoters.slice(start, start + pageSize);
  }, [filteredVoters, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredVoters.length / pageSize);

  const handleSearchChange = useCallback((val) => {
    setSearchTerm(val);
  }, []);

  const handleGenderChange = useCallback((val) => {
    setGenderFilter(val);
    setCurrentPage(1);
  }, []);

  const handleAgeMinChange = useCallback((val) => {
    setAgeMin(val);
    setCurrentPage(1);
  }, []);

  const handleAgeMaxChange = useCallback((val) => {
    setAgeMax(val);
    setCurrentPage(1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearch('');
    setGenderFilter('');
    setAgeMin('');
    setAgeMax('');
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = genderFilter || ageMin || ageMax;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p className="loading-text">Loading voter data…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <span className="error-icon">⚠️</span>
        <h2>Failed to load data</h2>
        <p>{error}</p>
        <button className="btn-retry" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="app">
      <Header stats={stats} />

      <main className="main">
        <div className="controls-bar">
          <SearchBar
            value={searchTerm}
            onChange={handleSearchChange}
            resultCount={filteredVoters.length}
            totalCount={voters.length}
          />
          <FilterPanel
            gender={genderFilter}
            onGenderChange={handleGenderChange}
            ageMin={ageMin}
            ageMax={ageMax}
            onAgeMinChange={handleAgeMinChange}
            onAgeMaxChange={handleAgeMaxChange}
            onReset={handleReset}
            hasActiveFilters={hasActiveFilters}
          />
        </div>

        {filteredVoters.length === 0 ? (
          !debouncedSearch.trim() ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>Search to see voters</h3>
              <p>Type a name above to find voters</p>
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-icon">😶</span>
              <h3>No voters found</h3>
              <p>Try adjusting your search or filters</p>
              <button className="btn-reset-empty" onClick={handleReset}>Clear all filters</button>
            </div>
          )
        ) : (
          <>
            <div className="voter-grid">
              {paginatedVoters.map(voter => (
                <VoterCard
                  key={voter['मतदाता नं'] + voter['सि.नं.']}
                  voter={voter}
                  onClick={setSelectedVoter}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
              totalItems={filteredVoters.length}
            />
          </>
        )}
      </main>

      {selectedVoter && (
        <VoterModal
          voter={selectedVoter}
          onClose={() => setSelectedVoter(null)}
        />
      )}

      <footer className="footer">
        <p>Lalitpur Metropolitan City · Ward No. 25 · Voter Registry</p>
        <p className="footer-np">ललितपुर महानगरपालिका · वडा नं. २५ · मतदाता नामावली</p>
      </footer>
    </div>
  );
}
