"use client";

import React, { useRef } from "react";
import { H2, P } from "../typograpy";
import YouTubeEmbed from "../YoutubeEmbed";
import { motion, useInView } from "framer-motion";
import { FaStairs } from "react-icons/fa6";

export default function HowitWorksYT() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#002D62] py-12 mt-12">
      {/* Pill */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="flex gap-2 items-center justify-center bg-[#0070E0] px-6 py-2 w-fit mx-auto rounded-full mb-6"
      >
        <FaStairs className="text-white" size={18} />
        <P className="text-white text-sm font-semibold">
          From Sign Up to Impact
        </P>
      </motion.div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        className="text-center mb-10"
      >
        <H2 className="text-white text-2xl sm:text-3xl font-semibold">
          How RefreeG Works
        </H2>
      </motion.div>

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        className="relative aspect-video w-full max-w-4xl mx-auto p-6"
      >
        <YouTubeEmbed
          videoId="lzAJXX99ew0"
          title="How Refreeg donations work"
          className="rounded-lg overflow-hidden"
        />
      </motion.div>
    </section>
  );
}
