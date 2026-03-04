export default function Header({ stats }) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-brand">
          <div className="header-emblem">
            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="19" cy="19" r="19" fill="white" fillOpacity="0.15"/>
              <circle cx="19" cy="19" r="17" stroke="white" strokeOpacity="0.4" strokeWidth="1.5" fill="none"/>
              <text x="19" y="25" textAnchor="middle" fill="white" fontSize="18" fontFamily="Arial">🗳️</text>
            </svg>
          </div>
          <div>
            <h1 className="header-title">Lalitpur Ward 25</h1>
            <p className="header-subtitle">ललितपुर महानगरपालिका · वडा नं. २५ · मतदाता नामावली</p>
          </div>
        </div>

        {stats && (
          <div className="header-stats">
            <div className="stat-chip">
              <span className="stat-chip-value">{stats.total.toLocaleString()}</span>
              <span className="stat-chip-label">Total Voters</span>
            </div>
            <div className="stat-chip male">
              <span className="stat-chip-value">{stats.male.toLocaleString()}</span>
              <span className="stat-chip-label">Male</span>
            </div>
            <div className="stat-chip female">
              <span className="stat-chip-value">{stats.female.toLocaleString()}</span>
              <span className="stat-chip-label">Female</span>
            </div>
            <div className="stat-chip avg">
              <span className="stat-chip-value">{stats.avgAge}</span>
              <span className="stat-chip-label">Avg Age</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
