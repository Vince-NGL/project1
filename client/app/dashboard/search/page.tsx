'use client';

import { useState, useRef } from 'react';

interface SearchResult {
  peopleAlsoAsk: { question: string; snippet: string | null }[];
  organic: { title: string; link: string; snippet: string | null }[];
  relatedSearches: string[];
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [gl, setGl] = useState('fr');
  const [hl, setHl] = useState('fr');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: query, gl, hl }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Search failed');
        return;
      }

      setResults(await res.json());
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Could not reach the server');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
      <h1>Google Search</h1>
      <a href="/dashboard" style={{ fontSize: 13, color: '#666' }}>← Back to dashboard</a>

      <form onSubmit={handleSearch} style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Enter keyword..."
          style={{ flex: 1, minWidth: 200, padding: '8px 12px', fontSize: 15, border: '1px solid #ccc', borderRadius: 6 }}
        />
        <select value={gl} onChange={e => setGl(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="fr">France</option>
          <option value="us">USA</option>
          <option value="gb">UK</option>
          <option value="de">Germany</option>
        </select>
        <select value={hl} onChange={e => setHl(e.target.value)} style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc' }}>
          <option value="fr">Français</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          style={{ padding: '8px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 15 }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: 16 }}>{error}</p>}

      {results && (
        <div style={{ marginTop: 32 }}>
          {results.peopleAlsoAsk.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, color: '#444', marginBottom: 12 }}>People Also Ask</h2>
              {results.peopleAlsoAsk.map((item, i) => (
                <div key={i} style={{ padding: '12px 16px', background: '#f9f9f9', borderRadius: 8, marginBottom: 8, borderLeft: '3px solid #0070f3' }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>{item.question}</p>
                  {item.snippet && <p style={{ margin: '6px 0 0', fontSize: 13, color: '#555' }}>{item.snippet}</p>}
                </div>
              ))}
            </section>
          )}

          {results.organic.length > 0 && (
            <section style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 16, color: '#444', marginBottom: 12 }}>Top Results</h2>
              {results.organic.map((item, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: '#0070f3', textDecoration: 'none' }}>
                    {item.title}
                  </a>
                  {item.snippet && <p style={{ margin: '4px 0 0', fontSize: 13, color: '#555' }}>{item.snippet}</p>}
                </div>
              ))}
            </section>
          )}

          {results.relatedSearches.length > 0 && (
            <section>
              <h2 style={{ fontSize: 16, color: '#444', marginBottom: 12 }}>Related Searches</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {results.relatedSearches.map((s, i) => (
                  <span
                    key={i}
                    onClick={() => setQuery(s)}
                    style={{ padding: '6px 12px', background: '#eef', borderRadius: 20, fontSize: 13, cursor: 'pointer' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
