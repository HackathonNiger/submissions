"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
  Chip,
  ImageList,
  ImageListItem,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import DeleteIcon from "@mui/icons-material/Delete";
import PhotoGalleryModal from "./PhotoGalleryModal";

interface HotspotDetailModalProps {
  open: boolean;
  onClose: () => void;
  hotspot?: {
    id: string;
    position: [number, number];
    note?: string;
    createdAt?: number;
    photos?: string[];
    category?: string;
  };
  onDelete?: (id: string) => void;
}

const wasteCategories = {
  plastic: { label: "Plastic", icon: "🥤", color: "#3b82f6" },
  organic: { label: "Organic", icon: "🍃", color: "#10b981" },
  electronic: { label: "E-waste", icon: "⚡", color: "#f59e0b" },
  metal: { label: "Metal", icon: "🔧", color: "#6366f1" },
  paper: { label: "Paper", icon: "📄", color: "#8b5cf6" },
  mixed: { label: "Mixed", icon: "♻️", color: "#64748b" },
};

export default function HotspotDetailModal({
  open,
  onClose,
  hotspot,
  onDelete,
}: HotspotDetailModalProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  if (!hotspot) return null;

  const categoryInfo = wasteCategories[hotspot.category as keyof typeof wasteCategories] || wasteCategories.mixed;
  const timeAgo = hotspot.createdAt
    ? Math.floor((Date.now() - hotspot.createdAt) / 1000 / 60)
    : 0;

  const formatTimeAgo = (minutes: number) => {
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            maxHeight: "90vh",
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: `${categoryInfo.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            {categoryInfo.icon}
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Waste Hotspot
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Chip
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.label}</span>
            </Box>
          }
          sx={{
            bgcolor: categoryInfo.color,
            color: "white",
            fontWeight: 600,
            mb: 2,
          }}
        />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
            <LocationOnIcon sx={{ color: "var(--primary)", fontSize: 20, mt: 0.25 }} />
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Location
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {hotspot.position[0].toFixed(6)}, {hotspot.position[1].toFixed(6)}
              </Typography>
            </Box>
          </Box>

          {hotspot.createdAt && (
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <AccessTimeIcon sx={{ color: "var(--primary)", fontSize: 20, mt: 0.25 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Reported
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {formatTimeAgo(timeAgo)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        {hotspot.note && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} mb={1}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {hotspot.note}
            </Typography>
          </>
        )}

        {hotspot.photos && hotspot.photos.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
              Photos ({hotspot.photos.length})
            </Typography>
            <ImageList cols={2} gap={8} sx={{ mt: 0 }}>
              {hotspot.photos.map((photo, index) => (
                <ImageListItem
                  key={index}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.9,
                      transform: "scale(1.02)",
                      transition: "all 0.2s",
                    },
                  }}
                  onClick={() => {
                    setGalleryIndex(index);
                    setGalleryOpen(true);
                  }}
                >
                  <img
                    src={photo}
                    alt={`Waste photo ${index + 1}`}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </>
        )}

        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: "var(--surface-elevated)",
            borderRadius: 2,
            border: "1px solid var(--border)",
          }}
        >
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            Impact Estimate
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Box>
              <Typography variant="h6" fontWeight={700} color="var(--primary)">
                +50
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Points earned
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography variant="h6" fontWeight={700} color="var(--primary)">
                ~15kg
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Est. waste
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        {onDelete && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => {
              onDelete(hotspot.id);
              onClose();
            }}
          >
            Delete
          </Button>
        )}
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
        <Button variant="contained">
          Get Directions
        </Button>
      </DialogActions>

      <PhotoGalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        photos={hotspot.photos || []}
        initialIndex={galleryIndex}
      />
    </Dialog>
  );
}
