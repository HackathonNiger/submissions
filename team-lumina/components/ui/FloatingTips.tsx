import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";

interface FloatingTipsProps {
  tips: string[];
}

export const FloatingTips: React.FC<FloatingTipsProps> = ({ tips }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="fixed top-4 right-4 z-50 flex flex-col items-end"
      style={{ maxWidth: "90vw" }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Show personalized tips"
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 flex items-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <Info className="h-6 w-6" />
      </button>
      {open && (
        <div className="mt-2 w-80 max-w-xs sm:max-w-sm bg-white border border-blue-200 rounded-xl shadow-xl p-4 animate-fade-in flex flex-col gap-2">
          <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
            <Info className="h-5 w-5" /> Personalized Tips
          </h4>
          <ul className="space-y-2">
            {tips.length > 0 ? (
              tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-blue-900 flex gap-2 items-start">
                  <span className="mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">No tips available.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// Tailwind animation (add to your global CSS if not present):
// .animate-fade-in { animation: fadeIn 0.2s ease; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: none; } } 