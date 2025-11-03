import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import { Card } from "./components/Card";

export default function Home() {
  const stats = [
    { label: "Reports Submitted", value: "1,248", icon: "📊", change: "+12%" },
    { label: "Waste Collected", value: "12.4t", icon: "♻️", change: "+8%" },
    { label: "Active Communities", value: "23", icon: "🏘️", change: "+3%" },
    { label: "Rewards Earned", value: "₦85k", icon: "💰", change: "+15%" },
  ];

  const features = [
    {
      icon: "🗺️",
      title: "Smart Mapping",
      description: "AI-powered waste hotspot detection with real-time community reporting",
      action: "Start Mapping",
      href: "/map",
      color: "primary"
    },
    {
      icon: "♻️",
      title: "Recycling Centers",
      description: "Find nearest waste-to-energy facilities with live capacity updates",
      action: "Find Centers",
      href: "/centers",
      color: "info"
    },
    {
      icon: "🎁",
      title: "Earn Rewards",
      description: "Get points for reporting, recycling, and community participation",
      action: "View Rewards",
      href: "/rewards",
      color: "secondary"
    }
  ];

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ textAlign: 'center', py: { xs: 8, md: 12 }, px: 2 }}>
        <Box sx={{ mb: 4 }}>
          <Chip
            icon={<Box component="span" sx={{ width: 8, height: 8, bgcolor: 'primary.main', borderRadius: '50%', animation: 'pulse 2s infinite', ml: 1 }} />}
            label="Building cleaner African cities"
            sx={{ 
              bgcolor: 'primary.light', 
              color: 'primary.dark',
              fontWeight: 600,
              mb: 3
            }}
          />
        </Box>
        
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
            fontWeight: 800,
            mb: 3,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          GreenKudi
        </Typography>
        
        <Typography 
          variant="h5" 
          color="text.secondary" 
          sx={{ 
            mb: 5, 
            maxWidth: 800, 
            mx: 'auto',
            lineHeight: 1.6,
            fontSize: { xs: '1.1rem', md: '1.3rem' }
          }}
        >
          Transform waste into{' '}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
            opportunity
          </Box>{' '}
          through community mapping, gamified rewards, and data-driven insights.
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            component={Link}
            href="/map"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
          >
            🗺️ Report Waste Hotspot
          </Button>
          <Button
            component={Link}
            href="/centers"
            variant="outlined"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderRadius: 2 }}
          >
            ♻️ Find Centers
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Real Impact
          </Typography>
          <Typography color="text.secondary">
            Community-driven results across Nigeria
          </Typography>
        </Box>
        
        <Grid container spacing={3}>
          {stats.map((stat, i) => (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
              <Card variant="elevated" padding="md">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h2" sx={{ mb: 1 }}>{stat.icon}</Typography>
                  <Typography variant="h3" fontWeight={700} gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Chip 
                    label={`${stat.change} this month`} 
                    size="small" 
                    color="success"
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            How GreenKudi Works
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Three simple steps to start making a difference in your community
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, i) => (
            <Grid size={{ xs: 12, lg: 4 }} key={i}>
              <Card variant="interactive" padding="lg">
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      mx: 'auto',
                      mb: 3,
                      borderRadius: 3,
                      background: feature.color === 'primary' 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : feature.color === 'info'
                        ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                        : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '2.5rem',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h5" fontWeight={700} gutterBottom>
                    {feature.title}
                  </Typography>
                  
                  <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    {feature.description}
                  </Typography>
                  
                  <Button
                    component={Link}
                    href={feature.href}
                    variant="contained"
                    fullWidth
                    sx={{ borderRadius: 2 }}
                  >
                    {feature.action}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Card 
        padding="lg" 
        sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          border: '1px solid',
          borderColor: 'primary.light',
        }}
      >
        <Box sx={{ maxWidth: 900, mx: 'auto' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>🌍</Typography>
          <Typography variant="h3" color="primary.main" fontWeight={700} gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 5, lineHeight: 1.7 }}>
            We are building a movement that transforms waste management across Africa. 
            By combining technology, community action, and economic incentives, we empower 
            citizens to create cleaner, more sustainable cities while earning rewards for their participation.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    mb: 2,
                  }}
                >
                  🏗️
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Community Building
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unite neighborhoods for cleaner environments
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    mb: 2,
                  }}
                >
                  📊
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Data-Driven Solutions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smart insights for better city planning
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: 'primary.main',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    mb: 2,
                  }}
                >
                  💚
                </Box>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Sustainable Future
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Waste-to-energy for circular economy
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
}
