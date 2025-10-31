import type { Metadata } from "next";
import { Card } from "../components/Card";
import { Box, Typography, Grid, Button, Chip, LinearProgress } from "@mui/material";

export const metadata: Metadata = {
  title: "Recycling & Energy Centers — GreenKudi",
  description: "Find recycling and waste-to-energy centers near you",
};

interface Center {
  id: string;
  name: string;
  type: "recycling" | "energy" | "hybrid";
  address: string;
  lat: number;
  lng: number;
  materials: string[];
  hours: string;
  status: "open" | "closed" | "busy";
  capacity: number;
  distance?: string;
  contact?: string;
}

const centers: Center[] = [
  {
    id: "c1",
    name: "Mainland Recycling Hub",
    type: "recycling",
    address: "15 Abiola Way, Yaba, Lagos State",
    lat: 6.5175,
    lng: 3.3784,
    materials: ["Plastic", "Metal", "Paper", "Glass"],
    hours: "Mon–Sat 8:00–18:00",
    status: "open",
    capacity: 75,
    distance: "2.3 km",
    contact: "+234 803 123 4567",
  },
  {
    id: "c2",
    name: "Eco Energy Transfer Station",
    type: "energy",
    address: "Plot 45, Admiralty Road, Lekki Phase 1, Lagos",
    lat: 6.4433,
    lng: 3.4683,
    materials: ["Organic", "Mixed Waste", "Biomass"],
    hours: "Daily 7:00–19:00",
    status: "busy",
    capacity: 40,
    distance: "5.7 km",
    contact: "+234 815 987 6543",
  },
  {
    id: "c3",
    name: "Victoria Island Green Center",
    type: "hybrid",
    address: "12B Adeola Odeku Street, Victoria Island, Lagos",
    lat: 6.4269,
    lng: 3.4215,
    materials: ["Electronics", "Batteries", "Hazardous"],
    hours: "Mon–Fri 9:00–17:00",
    status: "open",
    capacity: 90,
    distance: "8.1 km",
    contact: "+234 817 456 7890",
  },
];

function CenterCard({ center }: { center: Center }) {
  const statusColors = {
    open: { bgcolor: 'success.lighter', color: 'success.dark' },
    busy: { bgcolor: 'warning.lighter', color: 'warning.dark' }, 
    closed: { bgcolor: 'error.lighter', color: 'error.dark' },
  };

  const typeIcons = {
    recycling: "♻️",
    energy: "⚡",
    hybrid: "🔄",
  };

  const typeColors = {
    recycling: { bgcolor: '#EFF6FF', borderColor: '#BFDBFE' },
    energy: { bgcolor: '#FFFBEB', borderColor: '#FDE68A' },
    hybrid: { bgcolor: '#FAF5FF', borderColor: '#E9D5FF' },
  };

  const getCapacityColor = (capacity: number) => {
    if (capacity > 80) return '#ef4444';
    if (capacity > 60) return '#eab308';
    return 'var(--primary)';
  };

  return (
    <Card 
      variant="elevated" 
      padding="lg" 
      sx={{
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
        bgcolor: typeColors[center.type].bgcolor,
        border: `1px solid ${typeColors[center.type].borderColor}`,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 1.5, 
            bgcolor: 'var(--primary-50)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '1.5rem' 
          }}>
            {typeIcons[center.type]}
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.125rem' }}>
              {center.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              {center.type} Center
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
          <Chip
            label={center.status.charAt(0).toUpperCase() + center.status.slice(1)}
            size="small"
            sx={{ 
              ...statusColors[center.status],
              fontSize: '0.75rem',
              height: 24
            }}
          />
          {center.distance && (
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
              {center.distance}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>📍</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', flex: 1 }}>
            {center.address}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>🕒</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {center.hours}
          </Typography>
        </Box>

        {center.contact && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>📞</Typography>
            <Typography
              component="a"
              href={`tel:${center.contact}`}
              variant="body2"
              sx={{ color: 'var(--primary)', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
            >
              {center.contact}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--text-primary)', mb: 1 }}>
          Accepts:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {center.materials.map((material, i) => (
            <Chip
              key={i}
              label={material}
              size="small"
              sx={{ 
                bgcolor: 'var(--surface-elevated)', 
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                height: 24
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            Capacity
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {center.capacity}%
          </Typography>
        </Box>
        <Box sx={{ width: '100%', bgcolor: 'var(--surface-secondary)', borderRadius: 1, height: 8 }}>
          <Box 
            sx={{ 
              height: 8, 
              borderRadius: 1, 
              transition: 'all 0.3s',
              bgcolor: getCapacityColor(center.capacity),
              width: `${center.capacity}%`
            }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          href={`https://www.google.com/maps?q=${center.lat},${center.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ flex: 1 }}
        >
          📍 Directions
        </Button>
        <Button
          variant="outlined"
          href={`/map?lat=${center.lat}&lng=${center.lng}`}
        >
          🗺️ View Map
        </Button>
      </Box>
    </Card>
  );
}

export default function CentersPage() {
  const stats = [
    { label: "Active Centers", value: "24", icon: "🏢" },
    { label: "Materials Accepted", value: "12+", icon: "📦" },
    { label: "Avg Distance", value: "3.2km", icon: "📍" },
    { label: "Open Now", value: "18", icon: "🕒" },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Collection Centers
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          Find recycling and waste-to-energy centers near you
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <Card variant="default" padding="md" >
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  mx: 'auto', 
                  bgcolor: 'var(--primary-50)', 
                  borderRadius: 1.5, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.5rem', 
                  mb: 1.5 
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)', mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            Nearby Centers
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" size="small">📍 Near Me</Button>
            <Button variant="outlined" size="small">🔍 Filter</Button>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          {centers.map((center) => (
            <Grid key={center.id} size={{ xs: 12, lg: 6, xl: 4 }}>
              <CenterCard center={center} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Card variant="elevated" padding="lg"  sx={{ 
        background: 'linear-gradient(to right, var(--primary-50), #EFF6FF)', 
        border: '1px solid rgba(var(--primary-rgb), 0.2)' 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 1.5, 
            bgcolor: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography sx={{ color: 'white', fontSize: '1.25rem' }}>🎯</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
              Cannot Find a Center?
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 2 }}>
              Help us expand our network! Suggest a new location or partner with us to establish 
              collection points in underserved areas.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
              <Button variant="contained">📍 Suggest Location</Button>
              <Button variant="outlined">🤝 Partner With Us</Button>
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
