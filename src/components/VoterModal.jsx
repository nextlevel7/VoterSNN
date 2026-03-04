import { useEffect, useState } from 'react';
import { shareOnWhatsApp, genderLabel } from '../utils/whatsapp';

export default function VoterModal({ voter, onClose }) {
  const [phone, setPhone] = useState('');
  const [copied, setCopied] = useState(false);
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

  function handleShare() {
    shareOnWhatsApp(voter, phone);
  }

  function handleCopyText() {
    const text = [
      `Serial No: ${voter['सि.नं.']}`,
      `Voter ID: ${voter['मतदाता नं']}`,
      `Name: ${voter['मतदाताको नाम']}`,
      `Age: ${voter['उमेर(वर्ष)']} years`,
      `Gender: ${genderLabel(voter['लिङ्ग'])}`,
      `Spouse: ${voter['पति/पत्नीको नाम'] || '-'}`,
      `Father/Mother: ${voter['पिता/माताको नाम'] || '-'}`,
    ].join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

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

          {/* WhatsApp section */}
          <div className="modal-whatsapp-section">
            <h3 className="whatsapp-section-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Share via WhatsApp
            </h3>

            <div className="whatsapp-input-row">
              <input
                type="tel"
                className="whatsapp-phone-input"
                placeholder="Phone number (optional, e.g. 9779800000000)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <button className="btn-whatsapp-send" onClick={handleShare}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {phone ? 'Send to Number' : 'Open WhatsApp'}
              </button>
            </div>
            <p className="whatsapp-hint">
              Leave number blank to open WhatsApp chat picker, or enter a specific number.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-copy" onClick={handleCopyText}>
            {copied ? (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#2e7d32" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                </svg>
                Copy Details
              </>
            )}
          </button>
          <button className="btn-close-modal" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
