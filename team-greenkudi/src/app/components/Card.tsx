import { PropsWithChildren } from "react";
import MuiCard from "@mui/material/Card";
import { SxProps, Theme } from "@mui/material/styles";

interface CardProps extends PropsWithChildren {
  padding?: "sm" | "md" | "lg";
  variant?: "default" | "elevated" | "interactive";
  sx?: SxProps<Theme>;
  onClick?: () => void;
  className?: string;
}

const paddingMap = {
  sm: 2,
  md: 3,
  lg: 4,
};

export function Card({
  padding = "md",
  variant = "default",
  sx,
  children,
  onClick,
  className,
}: CardProps) {
  return (
    <MuiCard
      elevation={variant === "elevated" ? 4 : variant === "interactive" ? 2 : 1}
      onClick={onClick}
      className={className}
      sx={{
        p: paddingMap[padding],
        borderRadius: 3,
        transition: 'all 0.2s ease',
        cursor: variant === "interactive" ? 'pointer' : 'default',
        '&:hover': variant === "interactive" ? {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        } : {},
        ...sx,
      }}
    >
      {children}
    </MuiCard>
  );
}
