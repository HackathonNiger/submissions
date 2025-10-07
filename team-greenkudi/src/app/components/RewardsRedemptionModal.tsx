"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface RedemptionOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  inputLabel?: string;
  inputPlaceholder?: string;
}

interface RewardsRedemptionModalProps {
  open: boolean;
  onClose: () => void;
  reward: {
    id: string;
    name: string;
    cost: number;
    icon: string;
  } | null;
  userPoints: number;
  onRedeem: (data: { rewardId: string; amount: number; destination: string }) => Promise<void>;
}

const redemptionOptions: Record<string, RedemptionOption[]> = {
  "t1": [
    { id: "mtn", name: "MTN", icon: "📱", description: "MTN Nigeria", inputLabel: "Phone Number", inputPlaceholder: "080XXXXXXXX" },
    { id: "glo", name: "Glo", icon: "📱", description: "Globacom", inputLabel: "Phone Number", inputPlaceholder: "080XXXXXXXX" },
    { id: "airtel", name: "Airtel", icon: "📱", description: "Airtel Nigeria", inputLabel: "Phone Number", inputPlaceholder: "080XXXXXXXX" },
    { id: "9mobile", name: "9mobile", icon: "📱", description: "9mobile", inputLabel: "Phone Number", inputPlaceholder: "080XXXXXXXX" },
  ],
  "t2": [
    { id: "bank", name: "Bank Transfer", icon: "🏦", description: "Direct to bank account", inputLabel: "Account Number", inputPlaceholder: "0123456789" },
    { id: "wallet", name: "Mobile Wallet", icon: "💳", description: "OPay, PalmPay, etc.", inputLabel: "Wallet Number", inputPlaceholder: "080XXXXXXXX" },
  ],
  "t3": [
    { id: "eco-shop", name: "Eco Shop", icon: "🛍️", description: "Get discount code", inputLabel: "Email Address", inputPlaceholder: "your@email.com" },
  ],
  "t4": [
    { id: "carbon", name: "Carbon Offset", icon: "🌱", description: "Certified credits", inputLabel: "Wallet Address (Optional)", inputPlaceholder: "0x..." },
  ],
};

export default function RewardsRedemptionModal({
  open,
  onClose,
  reward,
  userPoints,
  onRedeem,
}: RewardsRedemptionModalProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!reward) return null;

  const options = redemptionOptions[reward.id] || [];
  const currentOption = options.find((opt) => opt.id === selectedOption);
  const pointsToAmount = Math.floor(parseInt(amount || "0"));
  const canAfford = pointsToAmount > 0 && pointsToAmount <= userPoints;

  useEffect(() => {
    if (options.length === 1 && !selectedOption) {
      setSelectedOption(options[0].id);
    }
  }, [options, selectedOption]);

  const handleSubmit = async () => {
    if (!canAfford || !selectedOption || !destination) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await onRedeem({
        rewardId: reward.id,
        amount: pointsToAmount,
        destination,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        handleReset();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to redeem reward");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedOption("");
    setDestination("");
    setAmount("");
    setError("");
    setSuccess(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(handleReset, 300);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: "var(--primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            {reward.icon}
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Redeem {reward.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {reward.cost} points required
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {success ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                mx: "auto",
                mb: 2,
              }}
            >
              ✅
            </Box>
            <Typography variant="h6" fontWeight={700} mb={1}>
              Redemption Successful!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your reward will be processed within 24 hours
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Box
              sx={{
                p: 2,
                bgcolor: "var(--surface-elevated)",
                borderRadius: 2,
                border: "1px solid var(--border)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Your Balance
                </Typography>
                <Typography variant="body2" fontWeight={700} color="var(--primary)">
                  {userPoints.toLocaleString()} pts
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Required
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {reward.cost.toLocaleString()} pts
                </Typography>
              </Box>
            </Box>

            {options.length > 1 && (
              <FormControl>
                <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
                  Select Option
                </Typography>
                <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                  {options.map((option) => (
                    <Box
                      key={option.id}
                      sx={{
                        border: "1px solid var(--border)",
                        borderRadius: 2,
                        mb: 1,
                        overflow: "hidden",
                        transition: "all 0.2s",
                        ...(selectedOption === option.id && {
                          borderColor: "var(--primary)",
                          bgcolor: "var(--primary-50)",
                        }),
                      }}
                    >
                      <FormControlLabel
                        value={option.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
                            <Box sx={{ fontSize: "1.25rem" }}>{option.icon}</Box>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>
                                {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {option.description}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ m: 0, p: 1.5, width: "100%" }}
                      />
                    </Box>
                  ))}
                </RadioGroup>
              </FormControl>
            )}

            <TextField
              label="Amount (points)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Min: ${reward.cost}`}
              fullWidth
              slotProps={{
                htmlInput: {
                  min: reward.cost,
                  max: userPoints,
                },
              }}
              helperText={
                amount && !canAfford
                  ? "Insufficient points"
                  : `Equivalent: ₦${Math.floor(pointsToAmount / 10).toLocaleString()}`
              }
              error={!!amount && !canAfford}
            />

            {currentOption && (
              <TextField
                label={currentOption.inputLabel || "Destination"}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder={currentOption.inputPlaceholder || "Enter details"}
                fullWidth
                required
              />
            )}

            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        )}
      </DialogContent>

      {!success && (
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !canAfford || !selectedOption || !destination || !amount}
            startIcon={loading ? <CircularProgress size={16} /> : null}
          >
            {loading ? "Processing..." : "Confirm Redemption"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}
