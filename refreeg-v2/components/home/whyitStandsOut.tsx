"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FaBoltLightning } from "react-icons/fa6";
import { FaUsers, FaCheckSquare, FaSmile } from "react-icons/fa";
import { H2, H3, P } from "../typograpy";
import { useAnimateInView } from "@/hooks/use-animate-In-view";

const features = [
  {
    icon: <FaUsers size={70} className="text-[#0070E0]" />,
    title: "Global",
    description:
      "Support causes from anywhere in the world with our secure, web-based platform.",
  },
  {
    icon: <FaCheckSquare size={70} className="text-[#0070E0]" />,
    title: "Safe",
    description:
      "Your donations are secured and verified on the blockchain, ensuring they reach the right cause.",
  },
  {
    icon: <FaSmile size={70} className="text-[#0070E0]" />,
    title: "Easy",
    description:
      "Donate to causes with just a few clicks and track progress every step of the way.",
  },
];

export default function WhyItStandsOut() {
  const { ref, isInView } = useAnimateInView({
    once: true,
    margin: "-100px",
  });

  return (
    <section className="w-full bg-[#002D62] mt-12 py-20 px-4">
      {/* Pill */}
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex gap-2 items-center justify-center bg-[#0070E0] px-6 py-2 w-fit mx-auto rounded-full mb-6"
      >
        <FaBoltLightning className="text-white" size={18} />
        <P className="text-white text-sm font-semibold">
          Be a Catalyst for Change — Start Here
        </P>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <H2 className="text-white font-bold text-center mb-16">
          Why RefreeG Stands Out
        </H2>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        {features.map((feature, idx) => {
          const itemRef = useRef(null);
          const itemInView = useInView(itemRef, {
            once: true,
            margin: "-100px",
          });

          return (
            <motion.div
              ref={itemRef}
              key={idx}
              className="flex flex-col items-center text-center px-4"
              initial={{ opacity: 0, y: 40 }}
              animate={itemInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease: "easeOut", delay: idx * 0.2 }}
            >
              <div className="w-48 h-48 rounded-full bg-white flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <H3 className="text-white font-bold mb-2">{feature.title}</H3>
              <P className="text-white max-w-xs">{feature.description}</P>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
