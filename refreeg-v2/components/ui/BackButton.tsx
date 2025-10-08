"use client";

import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const BackButton = () => {
  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  return (
    <div className="mb-6">
      <Button variant="ghost" size="sm" onClick={handleBack}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  );
};

export default BackButton;
