import type { Metadata } from "next";
import { Card } from "../components/Card";
import MapWrapper from "./MapWrapper";
import { Box, Typography, Grid, Button } from "@mui/material";

export const metadata: Metadata = {
  title: "Waste Hotspot Map — GreenKudi",
  description: "Report waste hotspots and view community reports on an interactive map",
};

export default function MapPage() {
  const stats = [
    { label: "Active Reports", value: "342", icon: "📍", color: "#dc2626" },
    { label: "Resolved", value: "1,847", icon: "✅", color: "#16a34a" },
    { label: "This Week", value: "+28", icon: "📈", color: "#2563eb" },
    { label: "Your Reports", value: "12", icon: "👤", color: "#9333ea" },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          Waste Hotspot Map
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400 }}>
          Report waste dumps and track community cleanup efforts
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
                  mb: 1.5,
                  color: stat.color
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: stat.color }}>
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

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: { xs: 'center', sm: 'flex-start' } }}>
        <Button variant="contained">📍 Report Hotspot</Button>
        <Button variant="outlined">🗺️ View All Reports</Button>
        <Button variant="outlined">📊 Analytics</Button>
        <Button variant="text">🔍 Search Location</Button>
      </Box>

      <Card variant="elevated"  sx={{ overflow: 'hidden', p: 0 }}>
        <Box sx={{ height: 600, position: 'relative' }}>
          <MapWrapper />
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="elevated" padding="lg"  sx={{ 
            background: 'linear-gradient(to bottom right, #EFF6FF, #ECFEFF)', 
            border: '1px solid #BFDBFE' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 1.5, 
                bgcolor: '#3b82f6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography sx={{ color: 'white', fontSize: '1.25rem' }}>📱</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e40af', mb: 1 }}>
                  Report via Mobile
                </Typography>
                <Typography variant="body2" sx={{ color: '#1d4ed8', mb: 2 }}>
                  Use our mobile app to quickly report waste hotspots with GPS location and photos.
                </Typography>
                <Button variant="contained" sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' } }}>
                  📲 Download App
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="elevated" padding="lg"  sx={{ 
            background: 'linear-gradient(to bottom right, #F0FDF4, #D1FAE5)', 
            border: '1px solid #86efac' 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: 1.5, 
                bgcolor: '#22c55e', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography sx={{ color: 'white', fontSize: '1.25rem' }}>👥</Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#166534', mb: 1 }}>
                  Community Validation
                </Typography>
                <Typography variant="body2" sx={{ color: '#15803d', mb: 2 }}>
                  Help verify reported hotspots and earn points for accurate community monitoring.
                </Typography>
                <Button variant="contained" sx={{ bgcolor: '#22c55e', '&:hover': { bgcolor: '#16a34a' } }}>
                  🔍 Start Validating
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
