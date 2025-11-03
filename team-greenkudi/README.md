## GreenKudi: Waste-to-Energy & Rewards Platform

Theme: Climate & Sustainability — Building for a Greener Future

### Problem
African cities generate thousands of tons of waste daily. Much ends up in waterways and open dumps, causing floods, emissions, and missed recycling opportunities. Participation is low due to limited incentives and mapping.

### Solution
GreenKudi engages citizens to report waste hotspots, navigate to recycling/energy centers, and earn redeemable points. Institutions get real-time dashboards for smarter logistics.

### Key Features
- Waste Hotspot Mapping
- Recycling & Energy Center Locator
- Gamified Rewards (airtime, mobile money, vouchers)
- Community & Government Dashboard

### Tech
- Next.js App Router, Tailwind v4
- Maps: OpenStreetMap via Leaflet
- Rewards integrations (future): MTN MoMo, Flutterwave, Paystack

## Getting Started

1) Install dependencies
```bash
npm install
```

2) Configure environment
Create `.env.local` from `.env.example` and set optional map tile URL.
```env
# public: map tiles & attribution
NEXT_PUBLIC_MAP_TILE_URL="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
NEXT_PUBLIC_MAP_ATTRIBUTION="&copy; OpenStreetMap contributors"
```

3) Run the dev server
```bash
npm run dev
```
Open `http://localhost:3000`.

## Routes
- `/` — Landing
- `/map` — Waste hotspot map (click map to add a report; persists in-memory only)
- `/centers` — Nearby recycling/energy centers (mock data)
- `/rewards` — Rewards and redemption (mock)
- `/dashboard` — Metrics overview (mock)

### Mock API
Hotspots are served via a simple in-memory API route for demo purposes:
- `GET /api/hotspots` returns current hotspots
- `POST /api/hotspots` with `{ lat, lng, note? }` adds a hotspot (non-persistent)

## Next Steps
- Image upload and AI verification
- Auth + user profiles
- Real data backend for hotspots and centers
- Mobile money integration for rewards
