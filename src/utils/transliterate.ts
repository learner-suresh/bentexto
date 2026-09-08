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
  shasthya: 'স্বাস্থ্য',
  osud: 'ওষুধ',
  oushodh: 'ঔষধ',
  juktakkhor: 'যুক্তাক্ষর',
  juktoborno: 'যুক্তবর্ণ',
  jukto: 'যুক্ত',
  baky: 'বাক্য',
  bakya: 'বাক্য',
  shobdo: 'শব্দ',
  sobdo: 'শব্দ',
  shikka: 'শিক্ষা',
  shikkha: 'শিক্ষা',
  parikkha: 'পরীক্ষা',
  porikkha: 'পরীক্ষা',
  gyan: 'জ্ঞান',
  bijnan: 'বিজ্ঞান',
  biggan: 'বিজ্ঞান',
  prosno: 'প্রশ্ন',
  uttor: 'উত্তর',
  roshogolla: 'রসগোল্লা',
  mistee: 'মিষ্টি',
  mishti: 'মিষ্টি',
  sristi: 'সৃষ্টি',
  shristi: 'সৃষ্টি',
  drusti: 'দৃষ্টি',
  drishti: 'দৃষ্টি',
  rokt: 'রক্ত',
  rokto: 'রক্ত',
  shongram: 'সংগ্রাম',
  songram: 'সংগ্রাম',
  deshprem: 'দেশপ্রেম',
  shanto: 'শান্ত',
  shanti: 'শান্তি',
  klanto: 'ক্লান্ত',
  shanto2: 'শান্ত',
  bistar: 'বিস্তার',
  pustok: 'পুস্তক',
  kosto: 'কষ্ট',
  basto: 'ব্যস্ত',
  byasto: 'ব্যস্ত',
  dhonno: 'ধন্য',
  dhonnobad: 'ধন্যবাদ',
  dhonyobad: 'ধন্যবাদ',
  onnanno: 'অন্যান্য',
  onno: 'অন্য',
  jonmo: 'জন্ম',
  mrityu: 'মৃত্যু',
  amrita: 'অমৃত',
  omrito: 'অমৃত',
  // Vocalic R / Ri-kar (ঋ, ৃ) common vocabulary
  kri: 'কৃ',
  krri: 'কৃ',
  kripon: 'কৃপণ',
  kripa: 'কৃপা',
  krishi: 'কৃষি',
  krisi: 'কৃষি',
  krishok: 'কৃষক',
  krisok: 'কৃষক',
  krishna: 'কৃষ্ণ',
  krisna: 'কৃষ্ণ',
  krishti: 'কৃষ্টি',
  kristi: 'কৃষ্টি',
  krimi: 'কৃমি',
  kritrim: 'কৃত্রিম',
  krittim: 'কৃত্রিম',
  kriti: 'কৃতি',
  krito: 'কৃত',
  kritoggno: 'কৃতজ্ঞ',
  kritogno: 'কৃতজ্ঞ',
  kritoggo: 'কৃতজ্ঞ',
  kricchro: 'কৃচ্ছ্র',
  prokriti: 'প্রকৃতি',
  prokiti: 'প্রকৃতি',
  akriti: 'আকৃতি',
  songskriti: 'সংস্কৃতি',
  shongskriti: 'সংস্কৃতি',
  sukriti: 'সুকৃতি',
  bikriti: 'বিকৃতি',
  griho: 'গৃহ',
  grihini: 'গৃহিণী',
  grihostho: 'গৃহস্থ',
  ghrina: 'ঘৃণা',
  ghrit: 'ঘৃত',
  ghrito: 'ঘৃত',
  trishna: 'তৃষ্ণা',
  tripti: 'তৃপ্তি',
  trin: 'তৃণ',
  trino: 'তৃণ',
  tritiyo: 'তৃতীয়',
  drishyo: 'দৃশ্য',
  dridho: 'দৃঢ়',
  driro: 'দৃঢ়',
  drishtanto: 'দৃষ্টান্ত',
  dhriti: 'ধৃতি',
  nrityo: 'নৃত্য',
  nritto: 'নৃত্য',
  nripoti: 'নৃপতি',
  prithibi: 'পৃথিবী',
  pritibi: 'পৃথিবী',
  prishtho: 'পৃষ্ঠা',
  prishtha: 'পৃষ্ঠা',
  prithok: 'পৃথক',
  brikkho: 'বৃক্ষ',
  briddho: 'বৃদ্ধ',
  britta: 'বৃত্ত',
  brihot: 'বৃহৎ',
  briddhi: 'বৃদ্ধি',
  britha: 'বৃথা',
  mrito: 'মৃত',
  mrigo: 'মৃগ',
  mridu: 'মৃদু',
  srijon: 'সৃজন',
  shringo: 'শৃঙ্গ',
  shrigal: 'শৃগাল',
  hridoy: 'হৃদয়',
  hrid: 'হৃৎ',
  hridrog: 'হৃদরোগ',
  smriti: 'স্মৃতি',
  shmriti: 'স্মৃতি',
  bismriti: 'বিস্মৃতি',
  rishi: 'ঋষি',
  rin: 'ঋণ',
  ritu: 'ঋতু',
  rigbed: 'ঋগ্বেদ',
  // Foreign/borrowed ro-fala + i words
  kriket: 'ক্রিকেট',
  cricket: 'ক্রিকেট',
  krim: 'ক্রিম',
  cream: 'ক্রিম',
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
  ri: 'ৃ',
  RI: 'ৃ',
  Ri: 'ৃ',
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
  ri: 'ঋ',
  RI: 'ঋ',
  Ri: 'ঋ',
};

// Conjuncts / Compound consonants (longest match first)
export const CONJUNCT_MAP: Record<string, string> = {
  // 4-letter conjuncts
  kkhy: 'ক্ষ্য',
  kkhm: 'ক্ষ্ম',
  shchm: 'শ্ছ্ম',
  nggkh: 'ঙ্খ্য',

  // 3-letter conjuncts
  kkh: 'ক্ষ',
  ksh: 'ক্ষ',
  jny: 'জ্ঞ',
  gny: 'জ্ঞ',
  gya: 'জ্ঞ',
  shch: 'শ্চ',
  shk: 'ষ্ক',
  shT: 'ষ্ট',
  sht: 'ষ্ট',
  shTh: 'ষ্ঠ',
  shth: 'ষ্ঠ',
  shN: 'ষ্ণ',
  shp: 'ষ্প',
  shf: 'ষ্ফ',
  shm: 'ষ্ম',
  skh: 'স্খ',
  sth: 'স্থ',
  sph: 'স্ফ',
  nth: 'ন্থ',
  ndh: 'ন্ধ',
  mph: 'ম্ফ',
  mbh: 'ম্ভ',
  bdh: 'ব্ধ',
  bhd: 'ব্ধ',
  ngk: 'ঙ্ক',
  ngkh: 'ঙ্খ',
  ngg: 'ঙ্গ',
  nggh: 'ঙ্ঘ',
  tth: 'ত্থ',
  ddh: 'দ্ধ',
  cch: 'চ্ছ',
  jjh: 'জ্ঝ',
  shl: 'শ্ল',
  shn: 'শ্ন',
  shm2: 'শ্ম',
  shb: 'শ্ব',
  trr: 'ত্র',
  str: 'স্ত্র',
  spr: 'স্প্র',

  // 2-letter common conjuncts
  kt: 'ক্ত',
  kl: 'ক্ল',
  kw: 'ক্ব',
  ky: 'ক্য',
  kr: 'ক্র',
  gd: 'গ্দ',
  gdh: 'গ্ধ',
  gn: 'গ্ন',
  gb: 'গ্ব',
  gm: 'গ্ম',
  gl: 'গ্ল',
  gr: 'গ্র',
  ghn: 'ঘ্ন',
  ghr: 'ঘ্র',
  ch: 'চ',
  cc: 'চ্চ',
  cn: 'চ্ন',
  cb: 'চ্ব',
  cm: 'চ্ম',
  jj: 'জ্জ',
  jw: 'জ্ব',
  jb: 'জ্ব',
  jm: 'জ্ম',
  jr: 'জ্র',
  TT: 'ট্ট',
  DD: 'ড্ড',
  tt: 'ত্ত',
  tn: 'ত্ন',
  tm: 'ত্ম',
  tb: 'ত্ব',
  tw: 'ত্ব',
  ty: 'ত্য',
  tr: 'ত্র',
  tl: 'ত্ল',
  thb: 'থ্ব',
  dg: 'দ্গ',
  dgh: 'দ্ঘ',
  dd: 'দ্দ',
  db: 'দ্ব',
  dw: 'দ্ব',
  dm: 'দ্ম',
  dr: 'দ্র',
  dhn: 'ধ্ন',
  dhb: 'ধ্ব',
  dhw: 'ধ্ব',
  dhm: 'ধ্ম',
  dhr: 'ধ্র',
  nt: 'ন্ত',
  nd: 'ন্দ',
  nn: 'ন্ন',
  nb: 'ন্ব',
  nw: 'ন্ব',
  nm: 'ন্ম',
  ny: 'ন্য',
  nr: 'ন্র',
  nl: 'ন্ল',
  ns: 'ন্স',
  pt: 'প্ত',
  pn: 'প্ন',
  pp: 'প্প',
  pb: 'প্ব',
  pm: 'প্ম',
  pl: 'প্ল',
  pr: 'প্র',
  ps: 'প্স',
  fl: 'ফ্ল',
  fr: 'ফ্র',
  bd: 'ব্দ',
  bb: 'ব্ব',
  bj: 'ব্জ',
  br: 'ব্র',
  bl: 'ব্ল',
  bhn: 'ভ্ন',
  bhr: 'ভ্র',
  bhl: 'ভ্ল',
  mn: 'ম্ন',
  mp: 'ম্প',
  mb: 'ম্ব',
  mm: 'ম্ম',
  my: 'ম্য',
  mr: 'ম্র',
  ml: 'ম্ল',
  lk: 'ল্ক',
  lg: 'ল্গ',
  lT: 'ল্ট',
  lD: 'ল্ড',
  lp: 'ল্প',
  lb: 'ল্ব',
  lm: 'ল্ম',
  ll: 'ল্ল',
  st: 'স্ত',
  sk: 'স্ক',
  sp: 'স্প',
  sm: 'স্ম',
  sn: 'স্ন',
  sl: 'স্ল',
  sw: 'স্ব',
  sb: 'স্ব',
  sr: 'স্র',
  shr: 'শ্র',
  shw: 'শ্ব',
  shb2: 'শ্ব',
  hl: 'হ্ল',
  hn: 'হ্ন',
  hN: 'হ্ণ',
  hm: 'হ্ম',
  hy: 'হ্য',
  hr: 'হ্র',
  hw: 'হ্ব',
  hb: 'হ্ব',
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

  // If the input is purely Bengali characters and symbols, return as-is
  if (/^[\u0980-\u09FF\s\d\p{P}]+$/u.test(input)) {
    return input;
  }

  const text = input;
  const len = text.length;
  let result = '';
  let i = 0;
  let lastWasConsonant = false;

  while (i < len) {
    const char = text[i];

    // If already a Bengali character, keep it and update consonant flag
    if (/[\u0980-\u09FF]/.test(char)) {
      result += char;
      // Bengali consonants range: \u0995 to \u09B9
      lastWasConsonant = /[\u0995-\u09B9\u09DC-\u09DF\u09CE]/.test(char);
      i++;
      continue;
    }

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

    // Explicit hasant / conjunct joiner '+' or '`' (e.g. k+k -> ক্ক, k+h -> ক্হ, r+k -> র্ক)
    if ((char === '+' || char === '`') && lastWasConsonant) {
      // If followed by ri/rri, let it attach as ri-kar without broken hasant
      if (/^r?ri/i.test(text.substring(i + 1))) {
        i++;
        continue;
      }
      result += '্';
      i++;
      // Wait for next consonant
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
          // Special rule for Ri-kar (ঋ-কার 'ৃ'):
          // If chunk ends with 'r'/'R' (e.g. kr, gr, pr, br, dr, tr, sr, mr, hr, nr, ghr, bhr)
          // and the following character is 'i'/'I' or starts with 'ri'/'rri'
          // (e.g. 'kri' -> 'কৃ', 'krri' -> 'কৃ', 'drishti' -> 'দৃষ্টি', 'srishti' -> 'সৃষ্টি', 'hridoy' -> 'হৃদয়')
          // DO NOT consume as ro-fala 'ক্র'. Let the first consonant match (e.g. 'k' -> 'ক'),
          // and the subsequent 'ri' will match as ri-kar 'ৃ' to make 'কৃ'!
          const rest = text.substring(i + cLen);
          if (
            (chunk.endsWith('r') || chunk.endsWith('R')) &&
            (/^[iI]/.test(rest) || /^rri/i.test(rest))
          ) {
            continue;
          }

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

  // Exact & prefix matching in common dictionary first
  if (COMMON_BENGALI_PHONETICS[clean]) {
    set.add(COMMON_BENGALI_PHONETICS[clean]);
  }

  // Provide dual options for ri-kar (কৃ) vs ro-fala (ক্রি)
  if (directTranslit.includes('কৃ')) {
    set.add(directTranslit.replace(/কৃ/g, 'ক্রি'));
  } else if (directTranslit.includes('ক্রি')) {
    set.add(directTranslit.replace(/ক্রি/g, 'কৃ'));
  }

  // Dual options for initial Ri (ঋ vs রি)
  if (directTranslit.startsWith('ঋ')) {
    set.add('রি' + directTranslit.slice(1));
  } else if (directTranslit.startsWith('রি')) {
    set.add('ঋ' + directTranslit.slice(2));
  }

  // Match other common words
  Object.keys(COMMON_BENGALI_PHONETICS).forEach((key) => {
    if (key.startsWith(clean) || clean.startsWith(key)) {
      set.add(COMMON_BENGALI_PHONETICS[key]);
    }
  });

  return Array.from(set).slice(0, 5);
}
