"use client";

import { motion } from "framer-motion";
import { useAnimateInView } from "@/hooks/use-animate-In-view";

export default function AnimatedCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { ref, isInView } = useAnimateInView({ once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        ease: [0.6, -0.05, 0.01, 0.99],
        duration: 0.8,
      }}
      whileHover={{ scale: 1.04, zIndex: 5 }}
      className="h-full overflow-visible" // ensure scaling isn't clipped
    >
      {children}
    </motion.div>
  );
}
