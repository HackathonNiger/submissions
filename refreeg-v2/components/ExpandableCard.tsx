"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HoverEffect } from "@/components/ui/card-hover-effect";

// 1. Update interfaces to be generic for both causes and petitions
interface ExpandableCardItem {
  id: string;
  title: string;
  description: string;
  image: string | null;
  goal: number;
  raised?: number; // for causes
  signatures?: number; // for petitions
  category: string;
  sections?: { heading?: string; description?: string }[];
}

interface ExpandableCardProps {
  items: ExpandableCardItem[];
  type: "cause" | "petition";
}

export function ExpandableCard({ items, type }: ExpandableCardProps) {
  const [active, setActive] = useState<ExpandableCardItem | boolean | null>(
    null
  );
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(false);
    }
    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-10"
          />
        )}
      </AnimatePresence>

      {/* Expanded Card */}
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6 shadow-md"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white sm:rounded-3xl overflow-hidden shadow-2xl"
            >
              <motion.div layoutId={`image-${active.id}-${id}`}>
                <img
                  src={active.image || "/placeholder-cause.jpg"}
                  alt={active.title}
                  className="w-full h-80 object-cover object-top"
                />
              </motion.div>

              {/* 🔽 scrollable body with gradient mask */}
              <div className="relative flex-1 overflow-y-auto p-4 space-y-4">
                <motion.h3
                  layoutId={`title-${active.id}-${id}`}
                  className="font-bold text-neutral-800"
                >
                  {active.title}
                </motion.h3>
                {/* ✅ Show FULL description here */}
                {active.description && (
                  <motion.p className="text-neutral-600 whitespace-pre-line">
                    {active.description}
                  </motion.p>
                )}
                {/* Show all sections if present */}
                {active.sections && active.sections.length > 0 && (
                  <div className="space-y-4">
                    {active.sections.map((section, idx) => (
                      <div key={idx}>
                        {section.heading && (
                          <h4 className="font-semibold text-neutral-800 mb-1">
                            {section.heading}
                          </h4>
                        )}
                        {section.description && (
                          <p className="text-neutral-600 whitespace-pre-line">
                            {section.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {type === "cause"
                        ? `₦${(active.raised ?? 0).toLocaleString()}`
                        : `${active.signatures ?? 0} signatures`}
                    </span>
                    <span className="text-muted-foreground">
                      {type === "cause"
                        ? `of ₦${active.goal.toLocaleString()}`
                        : `of ${active.goal.toLocaleString()}`}
                    </span>
                  </div>
                  <Progress
                    value={
                      type === "cause"
                        ? ((active.raised ?? 0) / active.goal) * 100
                        : ((active.signatures ?? 0) / active.goal) * 100
                    }
                  />
                </div>

                {/* ✅ Gradient mask effect */}
                <div className="absolute bottom-14 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />

                {/* Sticky CTA */}
                <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm pt-4">
                  <Link
                    href={`/${type === "cause" ? "causes" : "petitions"}/${
                      active.id
                    }`}
                  >
                    <Button className="w-full shadow-md">
                      {type === "cause" ? "Donate Now" : "Sign Now"}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* Collapsed Cards */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          return (
            <motion.div
              layoutId={`card-${item.id}-${id}`}
              key={item.id}
              onClick={() => setActive(item)}
              className="cursor-pointer rounded-xl shadow-md hover:shadow-lg transition-shadow bg-white flex flex-col sm:h-[400px]"
              whileHover={{
                scale: 1.03,
                rotateX: -5,
                rotateY: 5,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* 📱 Mobile: list with image left + text right */}
              <div className="flex sm:hidden p-4 gap-4 items-center">
                <div className="flex-shrink-0">
                  <img
                    src={item.image || "/placeholder-cause.jpg"}
                    alt={item.title}
                    className="h-20 w-20 rounded-lg object-cover object-top"
                  />
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="font-medium text-neutral-800 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="space-y-2 mt-auto">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {type === "cause"
                          ? `₦${(item.raised ?? 0).toLocaleString()}`
                          : `${item.signatures ?? 0} signatures`}
                      </span>
                      <span className="text-muted-foreground">
                        {type === "cause"
                          ? `of ₦${item.goal.toLocaleString()}`
                          : `of ${item.goal.toLocaleString()}`}
                      </span>
                    </div>
                    <Progress
                      value={
                        type === "cause"
                          ? ((item.raised ?? 0) / item.goal) * 100
                          : ((item.signatures ?? 0) / item.goal) * 100
                      }
                    />
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(item);
                    }}
                    className="mt-1 h-8 px-3 text-xs"
                  >
                    {type === "cause" ? "Donate Now" : "Sign Now"}
                  </Button>
                </div>
              </div>

              {/* 💻 Tablet & Desktop: grid style */}
              <div className="hidden sm:flex flex-col p-4 gap-4 h-full">
                <img
                  src={item.image || "/placeholder-cause.jpg"}
                  alt={item.title}
                  className="h-48 w-full rounded-lg object-cover object-top"
                />
                <div className="mt-2 text-center">
                  <h3 className="font-medium text-neutral-800">{item.title}</h3>
                </div>
                <div className="space-y-2 mt-auto">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">
                      {type === "cause"
                        ? `₦${(item.raised ?? 0).toLocaleString()}`
                        : `${item.signatures ?? 0} signatures`}
                    </span>
                    <span className="text-muted-foreground">
                      {type === "cause"
                        ? `of ₦${item.goal.toLocaleString()}`
                        : `of ${item.goal.toLocaleString()}`}
                    </span>
                  </div>
                  <Progress
                    value={
                      type === "cause"
                        ? ((item.raised ?? 0) / item.goal) * 100
                        : ((item.signatures ?? 0) / item.goal) * 100
                    }
                  />
                </div>
                <Button className="w-full shadow-sm">
                  {type === "cause" ? "Donate Now" : "Sign Now"}
                </Button>
              </div>
            </motion.div>
          );
        })}
      </ul>
    </>
  );
}

const CloseIcon = () => (
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4 text-black"
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </motion.svg>
);
