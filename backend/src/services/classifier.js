// src/services/classifier.js

// Predefined keyword groups for each category
const CATEGORY_KEYWORDS = {
  academic: [
    'academic',
    'class',
    'lecture',
    'semester',
    'assignment',
    'project',
    'syllabus',
    'curriculum',
    'exam',
    'timetable',
  ],
  events: [
    'event',
    'seminar',
    'workshop',
    'orientation',
    'webinar',
    'conference',
    'competition',
    'cultural',
    'sports',
  ],
  placements: [
    'placement',
    'drive',
    'recruitment',
    'interview',
    'company',
    'hiring',
    'campus',
  ],
  others: [
    'holiday',
    'notice',
    'announcement',
    'general',
    'information',
  ],
};


// Score category based on keyword matches
function scoreCategory(text, keywords) {
  const lower = text.toLowerCase();
  let score = 0;
  keywords.forEach(keyword => {
    if (lower.includes(keyword)) score++;
  });
  return score;
}


// Main classify function
function classifyText(text) {
  if (!text) return 'others';

  let bestCategory = 'others';
  let bestScore = 0;

  for (const category in CATEGORY_KEYWORDS) {
    const score = scoreCategory(text, CATEGORY_KEYWORDS[category]);

    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

module.exports = { classifyText };
