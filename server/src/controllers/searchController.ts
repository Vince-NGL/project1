import { Request, Response } from 'express';

const SERPAPI_URL = 'https://serpapi.com/search.json';
const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

interface SerpApiQuestion { question: string; snippet?: string }
interface SerpApiOrganic  { title: string; link: string; snippet?: string }
interface SerpApiRelated  { query: string }

export async function search(req: Request, res: Response) {
  const { q, gl = 'fr', hl = 'fr' } = req.body;

  if (!q || typeof q !== 'string' || q.trim() === '') {
    res.status(400).json({ error: 'Query is required' });
    return;
  }

  if (!SERPAPI_KEY) {
    res.status(500).json({ error: 'Search not configured' });
    return;
  }

  const params = new URLSearchParams({
    q: q.trim(),
    gl,
    hl,
    google_domain: gl === 'fr' ? 'google.fr' : 'google.com',
    engine: 'google',
    api_key: SERPAPI_KEY,
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${SERPAPI_URL}?${params}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      res.status(502).json({ error: 'Search service error' });
      return;
    }

    const data = await response.json() as {
      related_questions?: SerpApiQuestion[];
      organic_results?: SerpApiOrganic[];
      related_searches?: SerpApiRelated[];
    };

    res.json({
      peopleAlsoAsk: (data.related_questions ?? []).map(item => ({
        question: item.question,
        snippet: item.snippet ?? null,
      })),
      organic: (data.organic_results ?? []).slice(0, 5).map(item => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet ?? null,
      })),
      relatedSearches: (data.related_searches ?? []).map(item => item.query),
    });
  } catch (err) {
    clearTimeout(timeout);
    if (err instanceof Error && err.name === 'AbortError') {
      res.status(504).json({ error: 'Search service timed out' });
      return;
    }
    res.status(500).json({ error: 'Failed to reach search service' });
  }
}
