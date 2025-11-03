"use client";

import { useState } from "react";
import {
  Dialog,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface PhotoGalleryModalProps {
  open: boolean;
  onClose: () => void;
  photos: string[];
  initialIndex?: number;
}

export default function PhotoGalleryModal({
  open,
  onClose,
  photos,
  initialIndex = 0,
}: PhotoGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

  if (!photos || photos.length === 0) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: {
          bgcolor: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(10px)",
        },
      }}
      onKeyDown={handleKeyDown}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "white",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(4px)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.2)",
            },
            zIndex: 2,
          }}
        >
          <CloseIcon />
        </IconButton>

        {photos.length > 1 && (
          <>
            <IconButton
              onClick={handlePrevious}
              sx={{
                position: "absolute",
                left: 16,
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
                zIndex: 2,
              }}
            >
              <ChevronLeftIcon sx={{ fontSize: 32 }} />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                right: 16,
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(4px)",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
                zIndex: 2,
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 32 }} />
            </IconButton>
          </>
        )}

        <Box
          sx={{
            maxWidth: "90vw",
            maxHeight: "90vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1} of ${photos.length}`}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              userSelect: "none",
            }}
          />
        </Box>

        {photos.length > 1 && (
          <Box
            sx={{
              position: "absolute",
              bottom: 24,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              bgcolor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(4px)",
              borderRadius: 3,
              px: 2,
              py: 1,
            }}
          >
            <Box sx={{ color: "white", fontSize: "0.875rem", fontWeight: 500 }}>
              {currentIndex + 1} / {photos.length}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            position: "absolute",
            bottom: 24,
            display: "flex",
            gap: 1,
            zIndex: 1,
          }}
        >
          {photos.map((photo, idx) => (
            <Box
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              sx={{
                width: 60,
                height: 60,
                borderRadius: 1,
                overflow: "hidden",
                cursor: "pointer",
                border: idx === currentIndex ? "3px solid white" : "3px solid transparent",
                opacity: idx === currentIndex ? 1 : 0.6,
                transition: "all 0.2s",
                "&:hover": {
                  opacity: 1,
                  transform: "scale(1.05)",
                },
              }}
            >
              <img
                src={photo}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Dialog>
  );
}
