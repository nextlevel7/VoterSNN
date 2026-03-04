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

// Phonetic aliases for abbreviation matching
// e.g. "C" in K.C. → "सी" → transliterates to "si", but user types "c"
const ABBREV_ALIASES = {
  c: ['s', 'k', 'ch'],
  f: ['ph'],
  w: ['v'],
  z: ['s'],
};

function phoneticStartsWith(token, prefix) {
  const variants = [prefix, ...(ABBREV_ALIASES[prefix] || [])];
  return variants.some(v => token.startsWith(v));
}

// Checks if queryParts (e.g. ["k","c"]) match a consecutive window of nameTokens
function matchesAbbreviation(nameTokens, queryParts) {
  const len = queryParts.length;
  outer: for (let i = 0; i <= nameTokens.length - len; i++) {
    for (let j = 0; j < len; j++) {
      if (!phoneticStartsWith(nameTokens[i + j], queryParts[j])) continue outer;
    }
    return true;
  }
  return false;
}

// Returns true if the voter name (transliterated) matches the query
export function matchesQuery(transliteratedName, query) {
  if (!query) return true;
  const norm = normalizeSearch(transliteratedName);
  const q = normalizeSearch(query);
  // Split query by spaces and require all tokens to match
  const words = q.split(' ').filter(Boolean);
  return words.every(word => {
    // Normal substring match
    if (norm.includes(word)) return true;

    // Abbreviation match: "k.c" → each dot-part should prefix-match a name token
    // Tokenise the transliterated name by spaces AND dots
    if (word.includes('.')) {
      const queryParts = word.split('.').filter(Boolean);
      const nameTokens = norm.split(/[\s.]+/).filter(Boolean);
      return matchesAbbreviation(nameTokens, queryParts);
    }

    return false;
  });
}

// Relevance score for sorting (lower = better match)
// 0 → name starts with query
// 1 → a word in the name starts with query
// 2 → query appears anywhere (current filter already guarantees a match)
export function scoreQuery(transliteratedName, query) {
  if (!query) return 2;
  const norm = normalizeSearch(transliteratedName);
  const q = normalizeSearch(query);
  if (norm.startsWith(q)) return 0;
  const words = norm.split(/[\s.]+/).filter(Boolean);
  if (words.some(w => w.startsWith(q))) return 1;
  return 2;
}

export function scoreNepali(name, query) {
  if (!query) return 2;
  const q = query.trim();
  if (name.startsWith(q)) return 0;
  const words = name.split(/[\s.]+/).filter(Boolean);
  if (words.some(w => w.startsWith(q))) return 1;
  return 2;
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
