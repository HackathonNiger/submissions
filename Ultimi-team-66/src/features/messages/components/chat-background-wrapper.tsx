// "use client";

// import { useEffect, useState } from "react";
// import { useTheme } from "next-themes";
// import Box from "@/components/ui/box";
// import { backgroundOptions } from "@/schema/message/backgroundOptions";



// export function ChatBackgroundWrapper({
//   children,
//   messageContainerRef,
//   mode = "image", // "image" or "color"
// }: {
//   children: React.ReactNode;
//   messageContainerRef: React.RefObject<HTMLDivElement | null>;
//   mode?: "image" | "color";
// }) {
//   const { theme } = useTheme();
//   const [currentBg, setCurrentBg] = useState<string | null>(null);

//   useEffect(() => {
//     if (mode !== "image") return;

//     const options = theme === "dark" ? backgroundOptions.dark : backgroundOptions.light;

//     const pickRandom = () => {
//       const img = options[Math.floor(Math.random() * options.length)];
//       setCurrentBg(img);
//     };

//     pickRandom(); // initial
//     const interval = setInterval(pickRandom, 60000);
//     return () => clearInterval(interval);
//   }, [theme, mode]);

//   return (
//     <Box
//       ref={messageContainerRef}
//       className={`flex-1 overflow-y-auto p-4 transition-colors duration-500 ${
//         mode === "color" ? (theme === "dark" ? "bg-gray-900" : "bg-gray-100") : ""
//       }`}
//       style={{
//         backgroundImage: mode === "image" && currentBg ? `url(${currentBg})` : "none",
//         backgroundSize: "cover",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       {children}
//     </Box>
//   );
// }





"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Box from "@/components/ui/box";
import { backgroundOptions } from "@/schema/message/backgroundOptions";

export function ChatBackgroundWrapper({
  children,
  messageContainerRef,
  mode: initialMode = "image", // default
}: {
  children: React.ReactNode;
  messageContainerRef: React.RefObject<HTMLDivElement | null>;
  mode?: "image" | "color";
}) {
  const { theme } = useTheme();
  const [mode, setMode] = useState<"image" | "color">(initialMode);
  const [currentBg, setCurrentBg] = useState<string | null>(null);

  // load saved mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("chat-bg-mode");
    if (saved === "color" || saved === "image") setMode(saved);
  }, []);

  // save mode when it changes
  useEffect(() => {
    localStorage.setItem("chat-bg-mode", mode);
  }, [mode]);

  // rotate backgrounds if in image mode
  useEffect(() => {
    if (mode !== "image") return;
    const options = theme === "dark" ? backgroundOptions.dark : backgroundOptions.light;

    const pickRandom = () => {
      const img = options[Math.floor(Math.random() * options.length)];
      setCurrentBg(img);
    };

    pickRandom(); // initial
    const interval = setInterval(pickRandom, 60000);
    return () => clearInterval(interval);
  }, [theme, mode]);

  return (
    <Box
      ref={messageContainerRef}
      className={`flex-1 overflow-y-auto p-4 transition-colors duration-500 relative ${
        mode === "color" ? (theme === "dark" ? "bg-gray-900" : "bg-gray-100") : ""
      }`}
      style={{
        backgroundImage: mode === "image" && currentBg ? `url(${currentBg})` : "none",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* option selector */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <button
          onClick={() => setMode("color")}
          className={`px-3 py-1 text-xs rounded ${
            mode === "color" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Color
        </button>
        <button
          onClick={() => setMode("image")}
          className={`px-3 py-1 text-xs rounded ${
            mode === "image" ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-700"
          }`}
        >
          Image
        </button>
      </div>

      {children}
    </Box>
  );
}
