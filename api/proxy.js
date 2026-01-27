export default async function handler(req, res) {
  const { path, purge } = req.query;
  const API_BASE_URL = process.env.API_BASE_URL || 'https://porto.apprentice.cyou/api';

  if (!path) {
    return res.status(400).json({ error: 'Path parameter is required' });
  }

  // Construct target URL
  // path should be something like "/projects/"
  // Ensure we don't have double slashes if path starts with / and base ends with /
  const baseUrl = API_BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const targetUrl = `${baseUrl}${cleanPath}`;

  try {
    const headers = { ...req.headers };
    // Remove headers that might cause issues
    delete headers.host;
    delete headers['content-length'];
    // Forward the original forwarded-for if needed, or Vercel handles it.

    const fetchOptions = {
      method: req.method,
      headers: headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    // Set Cache-Control
    if (purge === 'true') {
      // If purge is requested, fetch fresh data (already done) and don't cache this response
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    } else {
      // Cache for 1 hour, allow stale while revalidating
      res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    }

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
