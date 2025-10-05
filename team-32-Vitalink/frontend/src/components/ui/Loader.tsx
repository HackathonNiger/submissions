import { cn } from "../../lib/utils";

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loader({ className, size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative animate-spin rounded-full border-4 border-gray-200 border-t-blue-600", sizeClasses[size])}>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 animate-pulse"></div>
      </div>
    </div>
  );
}

export function FullScreenLoader({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl", className)}>
      <div className="flex flex-col items-center gap-4">
        <Loader size="lg" />
      </div>
    </div>
  );
}
