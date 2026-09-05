/**
 * Bengali Phonetic Transliteration Engine (Avro / Ridmik style)
 * Converts Roman English keystrokes to Bengali script with support for
 * vowels, consonants, kar-marks, conjuncts (যুক্তাক্ষর), ref, and ya-fala.
 */

// Common exact and high-frequency phonetic words for instant pristine conversion
export const COMMON_BENGALI_PHONETICS: Record<string, string> = {
  ami: 'আমি',
  tumi: 'তুমি',
  apni: 'আপনি',
  she: 'সে',
  tara: 'তারা',
  amra: 'আমরা',
  bangla: 'বাংলা',
  bangladesh: 'বাংলাদেশ',
  bristi: 'বৃষ্টি',
  brishti: 'বৃষ্টি',
  shurjo: 'সূর্য',
  surjo: 'সূর্য',
  chander: 'চাঁদ',
  chand: 'চাঁদ',
  akash: 'আকাশ',
  megh: 'মেঘ',
  nodi: 'নদী',
  sagor: 'সাগর',
  shagor: 'সাগর',
  jol: 'জল',
  pani: 'জল',
  ful: 'ফুল',
  phul: 'ফুল',
  gach: 'গাছ',
  fol: 'ফল',
  pata: 'পাতা',
  pakhi: 'পাখি',
  biral: 'বিড়াল',
  kukur: 'কুকুর',
  bagh: 'বাঘ',
  singho: 'সিংহ',
  hati: 'হাতি',
  macher: 'মাছ',
  mach: 'মাছ',
  bhat: 'ভাত',
  roti: 'রুটি',
  ruti: 'রুটি',
  khabar: 'খাবার',
  cha: 'চা',
  dudh: 'দুধ',
  boi: 'বই',
  kalam: 'কলম',
  kolom: 'কলম',
  kobi: 'কবি',
  kobita: 'কবিতা',
  gaan: 'গান',
  shur: 'সুর',
  sur: 'সুর',
  manush: 'মানুষ',
  shishu: 'শিশু',
  bondhu: 'বন্ধু',
  bhalobasha: 'ভালোবাসা',
  prem: 'প্রেম',
  anondo: 'আনন্দ',
  dukkho: 'দুঃখ',
  hasi: 'হাসি',
  kanna: 'কান্না',
  mon: 'মন',
  chokh: 'চোখ',
  kan: 'কান',
  nak: 'নাক',
  mukh: 'মুখ',
  haat: 'হাত',
  pa: 'পা',
  matha: 'মাথা',
  desh: 'দেশ',
  shohor: 'শহর',
  gram: 'গ্রাম',
  basha: 'বাসা',
  bari: 'বাড়ি',
  ghor: 'ঘর',
  doroja: 'দরজা',
  janala: 'জানালা',
  alo: 'আলো',
  andhar: 'আঁধার',
  din: 'দিন',
  raat: 'রাত',
  shokal: 'সকাল',
  bikal: 'বিকাল',
  shondha: 'সন্ধ্যা',
  shongsar: 'সংসার',
  pahar: 'পাহাড়',
  bon: 'বন',
  batash: 'বাতাস',
  hawa: 'হাওয়া',
  bidesh: 'বিদেশ',
  rasta: 'রাস্তা',
  gari: 'গাড়ি',
  nouka: 'নৌকা',
  jahaj: 'জাহাজ',
  shomoy: 'সময়',
  bochor: 'বছর',
  mas: 'মাস',
  sobuj: 'সবুজ',
  lal: 'লাল',
  nil: 'নীল',
  holud: 'হলুদ',
  kalo: 'কালো',
  shada: 'সাদা',
  gorom: 'গরম',
  thanda: 'ঠান্ডা',
  sheeth: 'শীত',
  shit: 'শীত',
  borsha: 'বর্ষা',
  shorot: 'শরৎ',
  bosonto: 'বসন্ত',
  chobi: 'ছবি',
  khata: 'খাতা',
  school: 'স্কুল',
  biddaloy: 'বিদ্যালয়',
  shikkhok: 'শিক্ষক',
  chhatro: 'ছাত্র',
  doctor: 'ডাক্তার',
  shasto: 'স্বাস্থ্য',
  osud: 'ওষুধ',
  oushodh: 'ঔষধ',
};

// Vowel signs (Kars) attached to consonants
const KAR_MAP: Record<string, string> = {
  aa: 'া',
  a: 'া',
  A: 'া',
  ee: 'ী',
  i: 'ি',
  I: 'ী',
  oo: 'ূ',
  u: 'ু',
  U: 'ূ',
  e: 'ে',
  E: 'ে',
  oi: 'ৈ',
  OI: 'ৈ',
  o: 'ো',
  O: 'ো',
  ou: 'ৌ',
  OU: 'ৌ',
  rri: 'ৃ',
};

// Independent vowels
const VOWEL_MAP: Record<string, string> = {
  aa: 'আ',
  a: 'অ',
  A: 'আ',
  ee: 'ঈ',
  i: 'ই',
  I: 'ঈ',
  oo: 'ঊ',
  u: 'উ',
  U: 'ঊ',
  e: 'এ',
  E: 'এ',
  oi: 'ঐ',
  OI: 'ঐ',
  o: 'ও',
  O: 'ও',
  ou: 'ঔ',
  OU: 'ঔ',
  rri: 'ঋ',
};

// Conjuncts / Compound consonants (longest match first)
const CONJUNCT_MAP: Record<string, string> = {
  kkh: 'ক্ষ',
  kkhy: 'ক্ষ্য',
  kkhm: 'ক্ষ্ম',
  jny: 'জ্ঞ',
  gny: 'জ্ঞ',
  shch: 'শ্চ',
  shchm: 'শ্চ',
  shk: 'ষ্ক',
  shT: 'ষ্ট',
  shTh: 'ষ্ঠ',
  shN: 'ষ্ণ',
  shp: 'ষ্প',
  shf: 'ষ্ফ',
  shm: 'ষ্ম',
  sk: 'স্ক',
  skh: 'স্খ',
  st: 'স্ত',
  sth: 'স্থ',
  sp: 'স্প',
  sph: 'স্ফ',
  sm: 'স্ম',
  sn: 'স্ন',
  sl: 'স্ল',
  nt: 'ন্ত',
  nth: 'ন্থ',
  nd: 'ন্দ',
  ndh: 'ন্ধ',
  nn: 'ন্ন',
  mp: 'ম্প',
  mph: 'ম্ফ',
  mb: 'ম্ব',
  mbh: 'ম্ভ',
  mm: 'ম্ম',
  ml: 'ম্ল',
  kt: 'ক্ত',
  bd: 'ব্দ',
  bdh: 'ব্ধ',
  bb: 'ব্ব',
  bl: 'ব্ল',
  ngk: 'ঙ্ক',
  ngkh: 'ঙ্খ',
  ngg: 'ঙ্গ',
  nggh: 'ঙ্ঘ',
  tt: 'ত্ত',
  tth: 'ত্থ',
  tn: 'ত্ন',
  tm: 'ত্ম',
  dd: 'দ্দ',
  ddh: 'দ্ধ',
  db: 'দ্ব',
  dm: 'দ্ম',
  cc: 'চ্চ',
  cch: 'চ্ছ',
  jj: 'জ্জ',
  jjh: 'জ্ঝ',
  TT: 'ট্ট',
  DD: 'ড্ড',
  tr: 'ত্র',
  pr: 'প্র',
  kr: 'ক্র',
  gr: 'গ্র',
  br: 'ব্র',
  dr: 'দ্র',
  mr: 'ম্র',
  sr: 'স্র',
  shr: 'শ্র',
  fr: 'ফ্র',
  trr: 'ত্র',
};

// Consonants mapping
const CONSONANT_MAP: Record<string, string> = {
  k: 'ক',
  kh: 'খ',
  K: 'খ',
  g: 'গ',
  gh: 'ঘ',
  G: 'ঘ',
  ng: 'ঙ',
  Ng: 'ঙ',
  c: 'চ',
  ch: 'চ',
  chh: 'ছ',
  Ch: 'ছ',
  j: 'জ',
  jh: 'ঝ',
  J: 'ঝ',
  ny: 'ঞ',
  T: 'ট',
  Th: 'ঠ',
  D: 'ড',
  Dh: 'ঢ',
  N: 'ণ',
  t: 'ত',
  th: 'থ',
  d: 'দ',
  dh: 'ধ',
  n: 'ন',
  p: 'প',
  P: 'প',
  ph: 'ফ',
  f: 'ফ',
  F: 'ফ',
  b: 'ব',
  B: 'ব',
  bh: 'ভ',
  v: 'ভ',
  V: 'ভ',
  m: 'ম',
  M: 'ম',
  z: 'য',
  Z: 'য',
  r: 'র',
  R: 'ড়',
  Rh: 'ঢ়',
  l: 'ল',
  L: 'ল',
  sh: 'শ',
  Sh: 'ষ',
  S: 'ষ',
  s: 'স',
  h: 'হ',
  H: 'হ',
  y: 'য়',
  Y: 'য়',
  w: 'ও',
  W: 'ও',
};

export function transliterateEnglishToBengali(input: string): string {
  if (!input) return '';

  const lowerTrimmed = input.trim().toLowerCase();
  if (COMMON_BENGALI_PHONETICS[lowerTrimmed]) {
    return COMMON_BENGALI_PHONETICS[lowerTrimmed];
  }

  // If the user already typed Bengali characters, preserve them
  if (/[\u0980-\u09FF]/.test(input)) {
    return input;
  }

  const text = input;
  const len = text.length;
  let result = '';
  let i = 0;
  let lastWasConsonant = false;

  while (i < len) {
    const char = text[i];

    // Special signs
    if (char === ':') {
      result += 'ঃ';
      i++;
      lastWasConsonant = false;
      continue;
    }
    if (char === '^') {
      result += 'ঁ'; // Chandra-bindu
      i++;
      lastWasConsonant = false;
      continue;
    }

    // Check for ref: "r" followed by a consonant (and not a vowel)
    if (
      (char === 'r' || char === 'R') &&
      i + 1 < len &&
      !/[aeiouy]/i.test(text[i + 1])
    ) {
      // Find the following consonant
      let nextCons = '';
      let jump = 1;
      for (const clen of [3, 2, 1]) {
        const sub = text.substring(i + 1, i + 1 + clen);
        if (CONJUNCT_MAP[sub]) {
          nextCons = CONJUNCT_MAP[sub];
          jump = 1 + clen;
          break;
        }
        if (CONSONANT_MAP[sub]) {
          nextCons = CONSONANT_MAP[sub];
          jump = 1 + clen;
          break;
        }
      }
      if (nextCons) {
        result += 'র্' + nextCons;
        i += jump;
        lastWasConsonant = true;
        continue;
      }
    }

    // Check for Ya-fala: consonant followed by "y" and then a vowel or end
    if (
      lastWasConsonant &&
      (char === 'y' || char === 'Y') &&
      (i + 1 === len || /[aeiou]/i.test(text[i + 1]))
    ) {
      result += '্য';
      i++;
      lastWasConsonant = true;
      continue;
    }

    // Check for conjuncts (3, then 2 chars)
    let conjunctMatched = false;
    for (const cLen of [4, 3, 2]) {
      if (i + cLen <= len) {
        const chunk = text.substring(i, i + cLen);
        if (CONJUNCT_MAP[chunk]) {
          result += CONJUNCT_MAP[chunk];
          i += cLen;
          lastWasConsonant = true;
          conjunctMatched = true;
          break;
        }
      }
    }
    if (conjunctMatched) continue;

    // Check for vowels or kars (e.g. "aa", "ee", "oo", "oi", "ou", "rri", "a", "e", "i", "o", "u")
    let vowelMatched = false;
    for (const vLen of [3, 2, 1]) {
      if (i + vLen <= len) {
        const chunk = text.substring(i, i + vLen);
        if (lastWasConsonant) {
          if (KAR_MAP[chunk]) {
            // Note: in Bengali, 'o' after consonant is often inherent, but explicit 'o' can give 'ো'
            if (chunk === 'a' && text.substring(i, i + 2) !== 'aa') {
              // 'a' gives 'া'
              result += 'া';
            } else {
              result += KAR_MAP[chunk];
            }
            i += vLen;
            lastWasConsonant = false;
            vowelMatched = true;
            break;
          }
        } else {
          if (VOWEL_MAP[chunk]) {
            result += VOWEL_MAP[chunk];
            i += vLen;
            lastWasConsonant = false;
            vowelMatched = true;
            break;
          }
        }
      }
    }
    if (vowelMatched) continue;

    // Check for single or double consonants
    let consMatched = false;
    for (const cLen of [3, 2, 1]) {
      if (i + cLen <= len) {
        const chunk = text.substring(i, i + cLen);
        if (CONSONANT_MAP[chunk]) {
          result += CONSONANT_MAP[chunk];
          i += cLen;
          lastWasConsonant = true;
          consMatched = true;
          break;
        }
      }
    }
    if (consMatched) continue;

    // Default: pass through punctuation or unrecognized characters
    result += char;
    lastWasConsonant = false;
    i++;
  }

  return result;
}

export function getPhoneticSuggestions(input: string): string[] {
  if (!input || input.trim().length === 0) return [];
  const clean = input.trim().toLowerCase();
  const directTranslit = transliterateEnglishToBengali(input);

  const set = new Set<string>();
  if (directTranslit) set.add(directTranslit);

  // Match in common dictionary
  Object.keys(COMMON_BENGALI_PHONETICS).forEach((key) => {
    if (key.startsWith(clean) || clean.startsWith(key)) {
      set.add(COMMON_BENGALI_PHONETICS[key]);
    }
  });

  return Array.from(set).slice(0, 5);
}
