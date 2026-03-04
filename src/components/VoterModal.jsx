import { useEffect } from 'react';
import { genderLabel } from '../utils/transliterate';

export default function VoterModal({ voter, onClose }) {
  const isFemale = voter['लिङ्ग'] === 'महिला';

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const details = [
    {
      icon: '📋',
      label: 'Serial Number',
      labelNp: 'सि.नं.',
      value: voter['सि.नं.'],
    },
    {
      icon: '🪪',
      label: 'Voter ID',
      labelNp: 'मतदाता नं',
      value: voter['मतदाता नं'],
    },
    {
      icon: '🎂',
      label: 'Age',
      labelNp: 'उमेर',
      value: `${voter['उमेर(वर्ष)']} years`,
    },
    {
      icon: '⚥',
      label: 'Gender',
      labelNp: 'लिङ्ग',
      value: genderLabel(voter['लिङ्ग']),
    },
    {
      icon: '💑',
      label: 'Spouse',
      labelNp: 'पति/पत्नी',
      value: voter['पति/पत्नीको नाम'] || '-',
    },
    {
      icon: '👨‍👩‍👦',
      label: 'Father / Mother',
      labelNp: 'पिता/माता',
      value: voter['पिता/माताको नाम'] || '-',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={`modal-header ${isFemale ? 'female' : 'male'}`}>
          <div className="modal-avatar">
            <span>{isFemale ? '♀' : '♂'}</span>
          </div>
          <div className="modal-header-info">
            <h2 className="modal-name">{voter['मतदाताको नाम']}</h2>
            <p className="modal-sub">
              <span className={`modal-gender-badge ${isFemale ? 'female' : 'male'}`}>
                {genderLabel(voter['लिङ्ग'])}
              </span>
              <span className="modal-id-text">ID: {voter['मतदाता नं']}</span>
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-details-grid">
            {details.map(d => (
              <div className="modal-detail-item" key={d.label}>
                <span className="modal-detail-icon">{d.icon}</span>
                <div className="modal-detail-content">
                  <span className="modal-detail-label">{d.label}</span>
                  <span className="modal-detail-value">{d.value}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-close-modal" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
