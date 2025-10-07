// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version, X-CSRF-Token',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
};

// Handle preflight OPTIONS requests
export async function OPTIONS(request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

// Proxy function for all HTTP methods
async function proxyRequest(request, method) {
  const { pathname, search } = new URL(request.url);
  const path = pathname.replace('/api/v1', '');
  const targetUrl = `https://gestpay.souktrainproperties.com/api/v1${path}${search}`;

  try {
    // Get request body if it exists
    let body = null;
    if (method !== 'GET' && method !== 'HEAD') {
      body = await request.text();
    }

    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': request.headers.get('Authorization') || '',
        'Accept': 'application/json',
      },
      body: body || undefined,
    });

    // Get response data
    const data = await response.text();
    
    // Return response with CORS headers
    return new Response(data, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...corsHeaders,
        'Content-Type': response.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(JSON.stringify({ error: 'Proxy request failed' }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });
  }
}

// Handle GET requests
export async function GET(request) {
  return proxyRequest(request, 'GET');
}

// Handle POST requests
export async function POST(request) {
  return proxyRequest(request, 'POST');
}

// Handle PUT requests
export async function PUT(request) {
  return proxyRequest(request, 'PUT');
}

// Handle DELETE requests
export async function DELETE(request) {
  return proxyRequest(request, 'DELETE');
}

// Handle PATCH requests
export async function PATCH(request) {
  return proxyRequest(request, 'PATCH');
}
