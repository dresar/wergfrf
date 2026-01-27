export default async function handler(request, response) {
  const { endpoint } = request.query;

  if (!endpoint) {
    return response.status(400).json({ error: 'Endpoint parameter is required' });
  }

  // Ambil URL Backend dari Environment Variable
  const API_BASE_URL = process.env.VITE_API_URL || 'https://porto.apprentice.cyou/api';

  // Pastikan endpoint diawali dengan slash jika API_BASE_URL tidak diakhiri slash, atau sebaliknya.
  // Asumsi: API_BASE_URL tidak berakhiran slash, endpoint berawalan slash.
  // Clean up potential double slashes just in case.
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const targetUrl = `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const backendResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Tidak mengirim token di sini karena ini untuk public/static access
      },
    });

    if (!backendResponse.ok) {
      return response.status(backendResponse.status).json({ error: `Backend Error: ${backendResponse.statusText}` });
    }

    const data = await backendResponse.json();

    // Set Header Caching Agresif (1 Jam di CDN Vercel)
    response.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
    
    // Set CORS agar bisa diakses dari frontend
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    return response.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return response.status(500).json({ error: 'Internal Server Error' });
  }
}
