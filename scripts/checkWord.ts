import { DAILY_WORDS, VOCABULARY } from '../src/data/words';

const query = process.argv.slice(2).join(' ').trim().toLowerCase();

if (!query) {
  console.log('\n🔍 Bentexto Word Checker');
  console.log('--------------------------------------------------');
  console.log('Usage:');
  console.log('  npm run check-word <word>');
  console.log('  npx tsx scripts/checkWord.ts <Bengali or English word>');
  console.log('\nExamples:');
  console.log('  npm run check-word নদী');
  console.log('  npm run check-word rain');
  console.log('  npm run check-word bristi');
  console.log('--------------------------------------------------');
  console.log(`Current Total: ${DAILY_WORDS.length} secret words, ${VOCABULARY.length} vocabulary words.\n`);
  process.exit(0);
}

console.log(`\n🔎 Searching for "${query}" in Bentexto dictionary...\n`);

// 1. Search in DAILY_WORDS (Secret Words)
const dailyMatches = DAILY_WORDS.filter(w => 
  w.word.toLowerCase() === query ||
  w.word.includes(query) ||
  w.translit.toLowerCase().includes(query) ||
  w.meaningEn.toLowerCase().includes(query) ||
  w.tags.some(tag => tag.toLowerCase().includes(query))
);

// 2. Search in VOCABULARY
const vocabMatches = VOCABULARY.filter(v => 
  v.word.toLowerCase() === query ||
  v.word.includes(query) ||
  v.translit.toLowerCase().includes(query) ||
  v.meaningEn.toLowerCase().includes(query) ||
  v.tags.some(tag => tag.toLowerCase().includes(query))
);

if (dailyMatches.length === 0 && vocabMatches.length === 0) {
  console.log(`❌ Word NOT found: "${query}" is NOT in the database yet.`);
  console.log('\n✨ You can add it! Here is the template to add to src/data/words.ts:');
  console.log('\n1. To add as a Secret Daily Word (DAILY_WORDS):');
  console.log(`{
  id: 'w-${query}',
  word: '${query}',
  translit: '${query}',
  meaningEn: 'English Meaning',
  category: 'প্রকৃতি ও পরিবেশ (Category)',
  tags: ['nature', 'life', 'daily'],
  hints: [
    'প্রথম ক্লু (First clue in Bengali and English)',
    'দ্বিতীয় ক্লু (Second clue)',
    'তৃতীয় ক্লু (Third clue)'
  ],
  difficulty: 'easy'
}`);

  console.log('\n2. To add to General Guessable Vocabulary (VOCABULARY):');
  console.log(`{
  word: '${query}',
  translit: '${query}',
  meaningEn: 'English Meaning',
  category: 'general',
  tags: ['tag1', 'tag2']
}\n`);
} else {
  if (dailyMatches.length > 0) {
    console.log(`✅ Found in DAILY_WORDS (Secret Challenge Words Pool): ${dailyMatches.length} match(es)`);
    dailyMatches.forEach((w, idx) => {
      console.log(`  ${idx + 1}. [${w.word}] (${w.translit}) - "${w.meaningEn}" | Category: ${w.category}`);
      console.log(`     Tags: ${w.tags.join(', ')}`);
    });
    console.log('');
  }

  if (vocabMatches.length > 0) {
    console.log(`✅ Found in VOCABULARY (Guessable Words Pool): ${vocabMatches.length} match(es)`);
    vocabMatches.forEach((v, idx) => {
      console.log(`  ${idx + 1}. [${v.word}] (${v.translit}) - "${v.meaningEn}" | Category: ${v.category}`);
      console.log(`     Tags: ${v.tags.join(', ')}`);
    });
    console.log('');
  }
}
