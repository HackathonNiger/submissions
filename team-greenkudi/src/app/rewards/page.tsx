"use client";

import { useState } from "react";
import { Card } from "../components/Card";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import RewardsRedemptionModal from "../components/RewardsRedemptionModal";

export default function RewardsPage() {
  const [selectedReward, setSelectedReward] = useState<{ id: string; name: string; cost: number; icon: string } | null>(null);
  const [redemptionModalOpen, setRedemptionModalOpen] = useState(false);

  const points = 1247;

  const handleRedeem = async (data: { rewardId: string; amount: number; destination: string }) => {
    console.log("Redemption data:", data);
    setRedemptionModalOpen(false);
    setSelectedReward(null);
  };

  const tiers = [
    { 
      id: "t1", 
      name: "Airtime Top-up", 
      cost: 100, 
      icon: "📱", 
      description: "MTN, Glo, Airtel, 9mobile",
      popular: true 
    },
    { 
      id: "t2", 
      name: "Mobile Money", 
      cost: 300, 
      icon: "💳", 
      description: "Bank transfer or mobile wallet",
      popular: false 
    },
    { 
      id: "t3", 
      name: "Eco Shop Discount", 
      cost: 200, 
      icon: "🛍️", 
      description: "20% off sustainable products",
      popular: false 
    },
    { 
      id: "t4", 
      name: "Carbon Credits", 
      cost: 500, 
      icon: "🌱", 
      description: "Certified carbon offset tokens",
      popular: false 
    },
  ];

  const activities = [
    { icon: "📸", action: "Report waste hotspot with photo", points: "+20 pts" },
    { icon: "♻️", action: "Drop off recyclables at center", points: "+50 pts" },
    { icon: "✅", action: "Verify community report", points: "+10 pts" },
    { icon: "🏆", action: "Complete weekly challenge", points: "+100 pts" },
    { icon: "👥", action: "Refer a friend who reports", points: "+25 pts" },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box component="header">
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Rewards Center
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Earn points for environmental impact, redeem for real value
        </Typography>
      </Box>

      <Card variant="elevated" padding="lg" className="text-center bg-gradient-to-br from-[--primary] to-[--primary-dark] text-white">
        <Box sx={{ mb: 2 }}>
          <Box sx={{ 
            width: 64, 
            height: 64, 
            mx: 'auto', 
            bgcolor: 'rgba(255,255,255,0.2)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            mb: 2
          }}>
            <span style={{ fontSize: '1.875rem' }}>🎁</span>
          </Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', mb: 1 }}>
            Your Balance
          </Typography>
          <Typography sx={{ fontSize: '3rem', fontWeight: 700, mb: 1 }}>
            {points.toLocaleString()}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.125rem' }}>
            GreenKudi Points
          </Typography>
        </Box>
        
        <Grid container spacing={2} sx={{ pt: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <Grid size={{ xs: 4 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>12</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              Reports This Month
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>3.2kg</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              Recycled
            </Typography>
          </Grid>
          <Grid size={{ xs: 4 }}>
            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>4th</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)' }}>
              Community Rank
            </Typography>
          </Grid>
        </Grid>
      </Card>

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
          Redeem Rewards
        </Typography>
        <Grid container spacing={3}>
          {tiers.map((tier) => (
            <Grid key={tier.id} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Card 
                variant={tier.popular ? "elevated" : "default"} 
                padding="lg" 
                className="text-center relative"
              >
                {tier.popular && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: -12, 
                    left: '50%', 
                    transform: 'translateX(-50%)' 
                  }}>
                    <Chip 
                      label="Most Popular" 
                      size="small"
                      sx={{ 
                        bgcolor: 'var(--primary)', 
                        color: 'white',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                )}
                
                <Box sx={{ 
                  width: 48, 
                  height: 48, 
                  mx: 'auto', 
                  bgcolor: 'var(--primary-50)', 
                  borderRadius: 3, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  mb: 2
                }}>
                  {tier.icon}
                </Box>
                
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  {tier.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {tier.description}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography component="span" sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
                    {tier.cost}
                  </Typography>
                  <Typography component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary', ml: 0.5 }}>
                    pts
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained"
                  fullWidth
                  disabled={points < tier.cost}
                  sx={{ textTransform: 'none' }}
                  onClick={() => {
                    setSelectedReward({ id: tier.id, name: tier.name, cost: tier.cost, icon: tier.icon });
                    setRedemptionModalOpen(true);
                  }}
                >
                  {points < tier.cost ? 'Not Enough Points' : 'Redeem Now'}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Card variant="elevated" padding="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Box sx={{ 
            width: 32, 
            height: 32, 
            borderRadius: 2, 
            bgcolor: 'var(--primary-50)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            💰
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            How to Earn Points
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {activities.map((activity, i) => (
            <Grid key={i} size={{ xs: 12, sm: 6 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                p: 2, 
                borderRadius: 3, 
                bgcolor: 'var(--surface-elevated)',
                '&:hover': { bgcolor: 'var(--surface-secondary)' },
                transition: 'background-color 0.2s'
              }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'var(--primary-50)', 
                  borderRadius: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.125rem'
                }}>
                  {activity.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                    {activity.action}
                  </Typography>
                  <Typography sx={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem' }}>
                    {activity.points}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Card>

      <Card variant="elevated" padding="lg" className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Box sx={{ 
            width: 48, 
            height: 48, 
            borderRadius: 3, 
            background: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(219, 39, 119))',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <span style={{ color: 'white', fontSize: '1.25rem' }}>🏆</span>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '1.125rem', fontWeight: 700, color: 'rgb(107, 33, 168)', mb: 1 }}>
              Weekly Challenge
            </Typography>
            <Typography sx={{ color: 'rgb(126, 34, 206)', mb: 2 }}>
              Report 5 waste hotspots this week and earn a bonus 100 points!
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1, bgcolor: 'rgb(233, 213, 255)', borderRadius: 9999, height: 8 }}>
                <Box sx={{ 
                  background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(219, 39, 119))',
                  height: 8, 
                  borderRadius: 9999,
                  width: '60%'
                }} />
              </Box>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgb(107, 33, 168)' }}>
                3/5 completed
              </Typography>
            </Box>
            <Button 
              variant="contained"
              sx={{ 
                textTransform: 'none',
                background: 'linear-gradient(to right, rgb(168, 85, 247), rgb(219, 39, 119))',
                border: 0,
                '&:hover': {
                  background: 'linear-gradient(to right, rgb(147, 51, 234), rgb(190, 24, 93))'
                }
              }}
            >
              Continue Challenge
            </Button>
          </Box>
        </Box>
      </Card>

      <RewardsRedemptionModal
        open={redemptionModalOpen}
        onClose={() => {
          setRedemptionModalOpen(false);
          setSelectedReward(null);
        }}
        reward={selectedReward}
        userPoints={points}
        onRedeem={handleRedeem}
      />
    </Box>
  );
}
