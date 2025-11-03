"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  IconButton,
  Typography,
  LinearProgress,
  Chip,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface ReportWasteModalProps {
  open: boolean;
  onClose: () => void;
  position?: { lat: number; lng: number };
  onSubmit: (data: {
    lat: number;
    lng: number;
    note: string;
    photos: string[];
    category: string;
  }) => Promise<void>;
}

const wasteCategories = [
  { id: "plastic", label: "Plastic", icon: "🥤", color: "#3b82f6" },
  { id: "organic", label: "Organic", icon: "🍃", color: "#10b981" },
  { id: "electronic", label: "E-waste", icon: "⚡", color: "#f59e0b" },
  { id: "metal", label: "Metal", icon: "🔧", color: "#6366f1" },
  { id: "paper", label: "Paper", icon: "📄", color: "#8b5cf6" },
  { id: "mixed", label: "Mixed", icon: "♻️", color: "#64748b" },
];

export default function ReportWasteModal({
  open,
  onClose,
  position,
  onSubmit,
}: ReportWasteModalProps) {
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [category, setCategory] = useState("mixed");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newPhotos: string[] = [];

    Array.from(files).forEach((file, index) => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newPhotos.push(event.target.result as string);
          if (index === files.length - 1) {
            setPhotos((prev) => [...prev, ...newPhotos]);
            setUploading(false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleRemovePhoto = useCallback((index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async () => {
    if (!position) return;
    if (!note.trim()) {
      setError("Please add a description");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        lat: position.lat,
        lng: position.lng,
        note: note.trim(),
        photos,
        category,
      });
      setNote("");
      setPhotos([]);
      setCategory("mixed");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: "90vh",
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
              bgcolor: "var(--primary-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            📍
          </Box>
          <Typography variant="h6" fontWeight={700}>
            Report Waste Hotspot
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, p: 1.5, bgcolor: "var(--surface-elevated)", borderRadius: 2 }}>
          <LocationOnIcon sx={{ color: "var(--primary)", fontSize: 20 }} />
          <Typography variant="body2" color="text.secondary">
            {position ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}` : "Click on map to set location"}
          </Typography>
        </Box>

        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Waste Category
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
          {wasteCategories.map((cat) => (
            <Chip
              key={cat.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </Box>
              }
              onClick={() => setCategory(cat.id)}
              sx={{
                bgcolor: category === cat.id ? cat.color : "transparent",
                color: category === cat.id ? "white" : "text.primary",
                border: `1.5px solid ${category === cat.id ? cat.color : "var(--border)"}`,
                fontWeight: category === cat.id ? 600 : 400,
                transition: "all 0.2s",
                "&:hover": {
                  bgcolor: category === cat.id ? cat.color : "var(--surface-elevated)",
                },
              }}
            />
          ))}
        </Box>

        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Description
        </Typography>
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder="Describe the waste situation (e.g., pile of plastic bottles near the park entrance)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{ mb: 3 }}
        />

        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Photos (Optional)
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
          {photos.map((photo, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: 100,
                height: 100,
                borderRadius: 2,
                overflow: "hidden",
                border: "2px solid var(--border)",
              }}
            >
              <img
                src={photo}
                alt={`Upload ${index + 1}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={() => handleRemovePhoto(index)}
                sx={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}

          {photos.length < 4 && (
            <Button
              component="label"
              sx={{
                width: 100,
                height: 100,
                borderRadius: 2,
                border: "2px dashed var(--border)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                color: "text.secondary",
                "&:hover": { bgcolor: "var(--surface-elevated)" },
              }}
            >
              <AddPhotoAlternateIcon />
              <Typography variant="caption">Add Photo</Typography>
              <input
                type="file"
                hidden
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
              />
            </Button>
          )}
        </Box>

        {uploading && <LinearProgress sx={{ mb: 2 }} />}

        <Typography variant="caption" color="text.secondary">
          📸 You can upload up to 4 photos (max 5MB each)
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || uploading || !position}
        >
          {submitting ? "Submitting..." : "Submit Report"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
