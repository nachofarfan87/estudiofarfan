// src/pages/robots.txt.ts
import type { APIRoute } from 'astro';
import { absoluteUrl } from '../config/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const sitemap = absoluteUrl('/sitemap-index.xml');
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    'User-agent: GPTBot',
    'Allow: /',
    '',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    '',
    'User-agent: PerplexityBot',
    'Allow: /',
    '',
    'User-agent: ClaudeBot',
    'Allow: /',
    '',
    'User-agent: Google-Extended',
    'Allow: /',
    ...(sitemap ? ['', `Sitemap: ${sitemap}`] : []),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

