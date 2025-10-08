"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { faqs } from "@/lib/dummyData";
import { cn } from "@/lib/utils";
import FAQItem from "./components/FaqItems"; // New component for FAQ items
import { useAnimateInView } from "@/hooks/use-animate-In-view";

const categories = [
  { label: "General", value: "general" },
  { label: "Features", value: "features" },
  { label: "Resources", value: "resources" },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [showAll, setShowAll] = useState(false);
  const [openItems, setOpenItems] = useState<string[]>([]);

  const { ref: headingRef, isInView: headingInView } = useAnimateInView({
    once: true,
    margin: "-50px",
  });
  const { ref: categoryRef, isInView: categoryInView } = useAnimateInView({
    once: true,
    margin: "-50px",
  });

  const filteredFaqs =
    activeCategory === "general"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const displayedFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 5);

  const toggleItem = (value: string) => {
    setOpenItems((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  return (
    <div className="container px-6 py-16">
      {/* Heading */}
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-2xl md:text-4xl font-bold mb-2">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-lg">
          Got questions? We’ve got the answers you need to get started.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        ref={categoryRef}
        initial={{ opacity: 0, y: 10 }}
        animate={categoryInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex justify-center gap-3 mb-10"
      >
        {categories.map((cat) => (
          <Button
            key={cat.value}
            onClick={() => {
              setActiveCategory(cat.value);
              setShowAll(false);
              setOpenItems([]);
            }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
              activeCategory === cat.value
                ? "bg-[#003366] text-white border-[#003366]"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            )}
          >
            {cat.label}
          </Button>
        ))}
      </motion.div>

      {/* Accordion */}
      <Accordion type="multiple" className="flex flex-col gap-4">
        {displayedFaqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            index={index}
            isOpen={openItems.includes(`item-${index}`)}
            toggleItem={toggleItem}
          />
        ))}
      </Accordion>

      {/* Show More Button */}
      {filteredFaqs.length > 5 && (
        <div className="text-center mt-6">
          {!showAll ? (
            <Button
              onClick={() => setShowAll(true)}
              className="text-white"
              variant="secondary"
            >
              View More
            </Button>
          ) : (
            <Button
              onClick={() => setShowAll(false)}
              className="text-white"
              variant="secondary"
            >
              Show Less
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
