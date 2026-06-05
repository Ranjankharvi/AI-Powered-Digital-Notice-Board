const OpenAI = require('openai');
const { summarizeText } = require('./summarizer');
const { classifyText: fallbackClassifier } = require('./classifier');

let openaiClient;

function getClient() {
  if (openaiClient || !process.env.OPENAI_API_KEY) return openaiClient;
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return openaiClient;
}

async function generateAIContent(text) {
  const client = getClient();

  if (!client) {
    return summarizeText(text);
  }

  try {
    const prompt = `
You are helping to summarize university notices.
Return JSON with keys: short (string, <= 2 sentences), bullets (array of 3 concise bullet points), highlights (array of 3-5 key phrases).
Input:
${text}
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: prompt,
      response_format: { type: 'json_schema', json_schema: {
        name: 'notice_summary',
        schema: {
          type: 'object',
          properties: {
            short: { type: 'string' },
            bullets: {
              type: 'array',
              items: { type: 'string' },
            },
            highlights: {
              type: 'array',
              items: { type: 'string' },
            },
          },
          required: ['short', 'bullets', 'highlights'],
        },
      }},
    });

    const parsed = JSON.parse(response.output[0].content[0].text);
    return parsed;
  } catch (err) {
    console.warn('OpenAI summary failed, using heuristic fallback.', err.message);
    return summarizeText(text);
  }
}

async function categorizeNotice(text) {
  const client = getClient();

  if (!client) {
    return fallbackClassifier(text);
  }

  try {
    const prompt = `
Categorize the following notice as one of: academic, events, placements, others.
Return only the category word in lowercase.
Notice:
${text}
`;

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      input: prompt,
    });

    const raw = response.output[0].content[0].text.trim().toLowerCase();
    const allowed = ['academic', 'events', 'placements', 'others'];
    if (allowed.includes(raw)) return raw;
    return fallbackClassifier(text);
  } catch (err) {
    console.warn('OpenAI classification failed, using fallback.', err.message);
    return fallbackClassifier(text);
  }
}

module.exports = {
  generateAIContent,
  categorizeNotice,
};

