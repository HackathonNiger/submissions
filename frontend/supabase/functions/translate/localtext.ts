// supabase/functions/translate/index.ts (inside function)
export async function handler(req: Request) {
  const body = await req.json();
  const backendUrl = process.env.PY_BACKEND_URL || "http://127.0.0.1:8000/translate/";

  const payload = {
    api_key: process.env.SECRET_API_KEY,
    text: body.text,
    source: body.source || "en",
    target: body.target || "ha"
  };

  const r = await fetch(backendUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });

  const data = await r.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
