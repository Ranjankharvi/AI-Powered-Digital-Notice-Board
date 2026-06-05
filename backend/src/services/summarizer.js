// src/services/summarizer.js

// ------------------------------
// Split text into sentences
// ------------------------------
function splitSentences(text) {
  return text
    .replace(/\n+/g, '. ')   // Convert line breaks to sentence breaks
    .split(/(?<=[.?!])\s+/)  // Split by punctuation followed by space
    .map(s => s.trim())
    .filter(s => s.length > 20); // Ignore very small lines
}

// ------------------------------
// Build word frequency map
// ------------------------------
function buildWordFreq(text) {
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/);

  const stopwords = new Set([
    'the','is','in','and','to','of','a','for','on','with','by',
    'this','that','are','as','be','or','an','from','at'
  ]);

  const freq = {};

  words.forEach(w => {
    if (!w || stopwords.has(w) || w.length < 3) return;
    freq[w] = (freq[w] || 0) + 1;
  });

  return freq;
}

// ------------------------------
// Score a sentence based on keyword frequency
// ------------------------------
function scoreSentence(sentence, wordFreq) {
  const words = sentence.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/);

  let score = 0;
  words.forEach(w => {
    if (wordFreq[w]) score += wordFreq[w];
  });

  return score;
}

// ------------------------------
// Main summarizer function
// ------------------------------
function summarizeText(text, maxSentences = 3) {
  const sentences = splitSentences(text);

  // If the text is small, return as is
  if (sentences.length <= maxSentences) {
    return {
      short: sentences.slice(0, 2).join(' '),
      bullets: sentences,
      highlights: sentences.slice(0, 3),
    };
  }

  const wordFreq = buildWordFreq(text);

  const scored = sentences.map(s => ({
    s,
    score: scoreSentence(s, wordFreq)
  }));

  // Sort by highest score
  scored.sort((a, b) => b.score - a.score);

  // Pick top N sentences but reorder in original order
  const top = scored
    .slice(0, maxSentences)
    .sort((a, b) => text.indexOf(a.s) - text.indexOf(b.s));

  const ordered = top.map(t => t.s);
  const short = ordered.slice(0, 2).join(' ');
  const bullets = ordered;
  const highlights = ordered.slice(0, 3).map((sentence) => sentence.replace(/\.$/, ''));

  return { short, bullets, highlights };
}

module.exports = { summarizeText };
