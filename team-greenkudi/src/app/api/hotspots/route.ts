import { NextRequest } from "next/server";

interface Hotspot {
  id: string;
  lat: number;
  lng: number;
  note?: string;
  createdAt: number;
}

// In-memory store (ephemeral) - fine for demo
const hotspots: Hotspot[] = [
  { id: "1", lat: 6.5255, lng: 3.3679, note: "Community dump", createdAt: Date.now() - 100000 },
  { id: "2", lat: 6.5122, lng: 3.3928, note: "Plastic buildup", createdAt: Date.now() - 50000 },
];

export async function GET() {
  return Response.json({ hotspots });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (typeof body?.lat !== "number" || typeof body?.lng !== "number") {
      return new Response(JSON.stringify({ error: "lat and lng required" }), { status: 400 });
    }
    const hotspot: Hotspot = {
      id: String(Date.now()),
      lat: body.lat,
      lng: body.lng,
      note: typeof body.note === "string" ? body.note.slice(0, 140) : undefined,
      createdAt: Date.now(),
    };
    hotspots.push(hotspot);
    return new Response(JSON.stringify(hotspot), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400 });
  }
}
