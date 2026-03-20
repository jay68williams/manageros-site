/**
 * Manager OS — Knowledge Base API Proxy
 * Cloudflare Worker that proxies OpenAI API requests
 * 
 * SETUP:
 * 1. Create a Cloudflare account at https://dash.cloudflare.com
 * 2. Go to Workers & Pages → Create Worker
 * 3. Paste this code
 * 4. Go to Settings → Variables → Add: OPENAI_API_KEY = your OpenAI key
 * 5. Set the custom domain or use the *.workers.dev URL
 * 6. Update ALLOWED_ORIGINS below with your domain
 */

const ALLOWED_ORIGINS = [
  'https://manageros.co.uk',
  'https://www.manageros.co.uk',
  'http://localhost:8080',
  'http://127.0.0.1:8080'
];

// Rate limiting: max requests per IP per hour
const RATE_LIMIT = 20;
const rateLimitMap = new Map();

// System prompt — defines how the AI responds
const SYSTEM_PROMPT = `You are the Manager OS Knowledge Base AI Assistant. You help answer questions about Manager OS — a company that deploys AI-powered business automation solutions for UK businesses.

Key information about Manager OS:
- We deploy physical AI stations to UK businesses with local hardware, local AI, and full privacy
- Our solutions include: Voice Agent, Knowledge Base, Client Reporting, Meeting Assistant, Lead Generation, Recruitment, Data Operator, and Document Processing
- We are ICO registered and GDPR compliant
- Typical setup time is 2 weeks
- We focus on practical AI that saves time and money

When answering questions:
- Be helpful, professional, and concise
- If you don't know something specific about Manager OS, provide a general helpful answer and suggest the visitor book a call for specific details
- Keep responses under 200 words
- Use bullet points for lists
- Always end with a suggestion to book a demo call if relevant`;

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Check origin
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    // Rate limiting
    const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (isRateLimited(clientIP)) {
      return jsonResponse({ error: 'Rate limit exceeded. Please try again later.' }, 429, origin);
    }

    try {
      const { question, demo } = await request.json();

      if (!question || typeof question !== 'string' || question.trim().length === 0) {
        return jsonResponse({ error: 'Question is required' }, 400, origin);
      }

      if (question.length > 500) {
        return jsonResponse({ error: 'Question too long (max 500 characters)' }, 400, origin);
      }

      // Select system prompt based on demo type
      let systemPrompt = SYSTEM_PROMPT;
      if (demo === 'client-reporting') {
        systemPrompt = CLIENT_REPORTING_PROMPT;
      }

      // Call OpenAI
      const completion = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question.trim() }
          ],
          max_tokens: 400,
          temperature: 0.7
        })
      });

      if (!completion.ok) {
        const err = await completion.text();
        console.error('OpenAI error:', err);
        return jsonResponse({ error: 'AI service temporarily unavailable' }, 502, origin);
      }

      const data = await completion.json();
      const answer = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

      return jsonResponse({ answer, model: data.model }, 200, origin);

    } catch (err) {
      console.error('Worker error:', err);
      return jsonResponse({ error: 'Internal server error' }, 500, origin);
    }
  }
};

// --- Client Reporting system prompt ---
const CLIENT_REPORTING_PROMPT = `You are the Manager OS AI Report Analyst. You generate insightful business report summaries and analysis.

When given a topic or question about business metrics:
- Provide a concise executive summary
- Include 3-5 key insights with specific (simulated) numbers
- Suggest 2-3 actionable recommendations
- Format with bullet points and bold headers
- Keep responses under 250 words

Make the data sound realistic for a UK-based SME. Use GBP currency.`;

// --- Helpers ---
function isRateLimited(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter(t => now - t < windowMs);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  // Clean up old entries periodically
  if (rateLimitMap.size > 10000) {
    for (const [key, val] of rateLimitMap) {
      if (val.every(t => now - t > windowMs)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return timestamps.length > RATE_LIMIT;
}

function handleCORS(request) {
  const origin = request.headers.get('Origin') || '';
  const headers = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
  if (ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return new Response(null, { status: 204, headers });
}

function jsonResponse(data, status, origin) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return new Response(JSON.stringify(data), { status, headers });
}
