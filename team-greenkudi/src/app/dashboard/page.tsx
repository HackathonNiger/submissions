import type { Metadata } from "next";
import { Card } from "../components/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";

export const metadata: Metadata = {
  title: "Dashboard — GreenKudi",
};

function StatCard({ 
  label, 
  value, 
  trend, 
  icon 
}: { 
  label: string; 
  value: string; 
  trend: string;
  icon: string;
}) {
  return (
    <Card variant="elevated" padding="md">
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ 
          width: 40, 
          height: 40, 
          borderRadius: 3, 
          bgcolor: 'var(--primary-50)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <span style={{ fontSize: '1.125rem' }}>{icon}</span>
        </Box>
        <Chip 
          label={trend} 
          size="small"
          sx={{ 
            bgcolor: 'rgb(220, 252, 231)', 
            color: 'rgb(22, 163, 74)',
            fontSize: '0.75rem',
            height: 24
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </Card>
  );
}

export default function DashboardPage() {
  const stats = [
    { label: "Reported Hotspots", value: "1,248", trend: "+12%", icon: "🗺️" },
    { label: "Active Users", value: "5,320", trend: "+8%", icon: "👥" },
    { label: "Recycled (kg)", value: "12,450", trend: "+15%", icon: "♻️" },
    { label: "CO₂e Avoided (t)", value: "640", trend: "+22%", icon: "🌱" },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box component="header">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Analytics Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Real-time insights for community impact and city planning
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat) => (
          <Grid key={stat.label} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="elevated" padding="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: 2, 
                bgcolor: 'rgb(219, 234, 254)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                📊
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Activity Trends
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: 'var(--surface-elevated)' 
              }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Daily Reports
                </Typography>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>
                  47
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: 'var(--surface-elevated)' 
              }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Weekly Collection
                </Typography>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>
                  2.3t
                </Typography>
              </Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                p: 1.5, 
                borderRadius: 3, 
                bgcolor: 'var(--surface-elevated)' 
              }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Rewards Claimed
                </Typography>
                <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>
                  ₦12,400
                </Typography>
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="elevated" padding="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: 2, 
                bgcolor: 'rgb(254, 249, 195)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                🚀
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Quick Actions
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                📋 Generate Weekly Report
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                📍 Review Pending Hotspots
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                💰 Process Reward Payouts
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
              >
                📊 Export Analytics Data
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-[--primary-50] to-emerald-50 border-[--primary]/20">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 3, 
            bgcolor: 'var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <span style={{ color: 'white', fontSize: '1.25rem' }}>💡</span>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)', mb: 1 }}>
              Integration Opportunities
            </Typography>
            <Typography sx={{ color: 'text.secondary', mb: 2 }}>
              Connect with mobile money providers (MTN MoMo, Paystack) and municipal data systems 
              to automate rewards distribution and enhance routing efficiency.
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip 
                label="API Ready" 
                size="small"
                sx={{ bgcolor: 'rgb(219, 234, 254)', color: 'rgb(30, 64, 175)' }}
              />
              <Chip 
                label="Mobile Money" 
                size="small"
                sx={{ bgcolor: 'rgb(243, 232, 255)', color: 'rgb(107, 33, 168)' }}
              />
              <Chip 
                label="Municipality" 
                size="small"
                sx={{ bgcolor: 'rgb(220, 252, 231)', color: 'rgb(22, 101, 52)' }}
              />
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}