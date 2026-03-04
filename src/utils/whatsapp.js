// Gender translation helper
export function genderLabel(nepali) {
  if (nepali === 'महिला') return 'Female (महिला)';
  if (nepali === 'पुरुष') return 'Male (पुरुष)';
  return nepali;
}

// Format voter details into a WhatsApp-ready message
export function buildWhatsAppMessage(voter) {
  const lines = [
    '🗳️ *Lalitpur Ward 25 – Voter Registry*',
    '━━━━━━━━━━━━━━━━━━━━',
    `📋 *Serial No:* ${voter['सि.नं.']}`,
    `🪪 *Voter ID:* ${voter['मतदाता नं']}`,
    `👤 *Name:* ${voter['मतदाताको नाम']}`,
    `🎂 *Age:* ${voter['उमेर(वर्ष)']} years`,
    `⚥ *Gender:* ${genderLabel(voter['लिङ्ग'])}`,
    `💑 *Spouse:* ${voter['पति/पत्नीको नाम'] || '-'}`,
    `👨‍👩‍👦 *Father/Mother:* ${voter['पिता/माताको नाम'] || '-'}`,
    '━━━━━━━━━━━━━━━━━━━━',
    '_Shared from Lalitpur Ward 25 Voter Registry_',
  ];
  return lines.join('\n');
}

// Opens WhatsApp with the pre-filled message
export function shareOnWhatsApp(voter, phoneNumber = '') {
  const message = buildWhatsAppMessage(voter);
  const encoded = encodeURIComponent(message);
  const base = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}`
    : 'https://wa.me/';
  window.open(`${base}?text=${encoded}`, '_blank', 'noopener,noreferrer');
}
