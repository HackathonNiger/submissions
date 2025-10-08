"use client";

import { motion } from "framer-motion";

import { useAnimateInView } from "@/hooks/use-animate-In-view";

export default function AnimatedHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { ref, isInView } = useAnimateInView({
    once: true,
    margin: "-100px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`text-start mb-8 ${className}`}
    >
      {children}
    </motion.div>
  );
}
