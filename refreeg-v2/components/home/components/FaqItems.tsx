"use client";

import { motion } from "framer-motion";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useAnimateInView } from "@/hooks/use-animate-In-view";

export default function FAQItem({
  faq,
  index,
  isOpen,
  toggleItem,
}: {
  faq: any;
  index: number;
  isOpen: boolean;
  toggleItem: (value: string) => void;
}) {
  const { ref, isInView } = useAnimateInView({ once: true, margin: "-100px" });
  const Icon = faq.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        ease: [0.6, -0.05, 0.01, 0.99],
        duration: 0.6,
        delay: index * 0.05,
      }}
    >
      <AccordionItem
        value={`item-${index}`}
        className="border rounded-lg bg-gray-50"
      >
        <AccordionTrigger
          onClick={() => toggleItem(`item-${index}`)}
          className={cn(
            "flex justify-between items-center px-5 py-4 text-left font-medium text-sm md:text-lg transition-colors",
            isOpen ? "text-blue-700" : "text-gray-800"
          )}
        >
          <div className="flex items-center gap-3">
            <Icon
              className={cn(
                "w-5 h-5 transition-colors",
                isOpen ? "text-blue-700" : "text-gray-500"
              )}
            />
            {faq.question}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-5 pb-4 text-gray-600">
          {faq.answer}
        </AccordionContent>
      </AccordionItem>
    </motion.div>
  );
}
