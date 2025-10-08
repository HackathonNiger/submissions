import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function StepProgress({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + 10;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-6 max-w-md w-full px-6">
        <span className="text-center text-black text-2xl font-bold font-montserrat">
          Checking Your Documents...
        </span>
        <span className="text-center text-black/60 text-base font-medium font-montserrat leading-snug">
          Making sure your documents are in order
        </span>
        <Progress value={progress} className="w-full" />
      </div>
    </div>
  );
}
