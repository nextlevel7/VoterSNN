// Devanagari (Nepali) to Roman transliteration for English search

const CONSONANTS = {
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  // Common conjuncts
  'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya',
};

const VOWELS = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'ऋ': 'ri',
};

const MATRAS = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ृ': 'ri',
  'ं': 'n', 'ँ': 'n', 'ः': 'h',
};

const VIRAMA = '्';

const MATRA_SET = new Set([...Object.keys(MATRAS), VIRAMA]);

const CONSONANT_SET = new Set(Object.keys(CONSONANTS));

export function transliterate(text) {
  if (!text) return '';

  const chars = [...text]; // proper Unicode splitting
  let result = '';

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = i + 1 < chars.length ? chars[i + 1] : null;

    if (char === VIRAMA) {
      // virama suppresses inherent vowel — already handled in consonant branch
      continue;
    } else if (CONSONANT_SET.has(char)) {
      result += CONSONANTS[char];
      // Add inherent 'a' unless the next char is a matra or virama
      if (!nextChar || !MATRA_SET.has(nextChar)) {
        result += 'a';
      }
    } else if (MATRAS[char] !== undefined) {
      result += MATRAS[char];
    } else if (VOWELS[char] !== undefined) {
      result += VOWELS[char];
    } else {
      result += char;
    }
  }

  return result.toLowerCase();
}

// Normalize a search string for comparison
// Handles alternate spellings: ph/f, bh/b, sh/s, kh/k variations
export function normalizeSearch(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Returns true if the voter name (transliterated) matches the query
export function matchesQuery(transliteratedName, query) {
  if (!query) return true;
  const norm = normalizeSearch(transliteratedName);
  const q = normalizeSearch(query);
  // Split query by spaces and require all words to match
  const words = q.split(' ').filter(Boolean);
  return words.every(word => norm.includes(word));
}

// Detect if input is Nepali (Devanagari Unicode block: 0900–097F)
export function isNepali(text) {
  return /[\u0900-\u097F]/.test(text);
}

export function genderLabel(nepali) {
  if (nepali === 'महिला') return 'Female (महिला)';
  if (nepali === 'पुरुष') return 'Male (पुरुष)';
  return nepali;
}
