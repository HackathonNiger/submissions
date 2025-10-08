"use client";

import { useRef } from "react";
import { useInView, type MarginType } from "framer-motion";

export function useAnimateInView(options?: {
  once?: boolean;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, {
    once: options?.once ?? true,
    margin: (options?.margin as MarginType) ?? "-100px", // Cast string to MarginType
  });

  return { ref, isInView };
}
