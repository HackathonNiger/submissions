"use client";
import { H2, P } from "../typograpy";
import { FaRocket, FaBullhorn, FaHandshake } from "react-icons/fa";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnimateInView } from "@/hooks/use-animate-In-view";
import type { Variants } from "framer-motion";

const cards = [
  {
    icon: FaRocket,
    title: "Kickstart Instantly",
    description:
      "Launch your campaign in less than a minute with our intuitive setup. No delays, no complexities—just a fast, focused way to start raising funds when it matters most.",
    iconAlt: "Rocket icon",
  },
  {
    icon: FaBullhorn,
    title: "Amplify Voice",
    description:
      "RefreeG helps your campaign go beyond your circle. Share across social platforms, messaging apps, and more—giving your story the volume it deserves to reach real supporters.",
    iconAlt: "Bullhorn icon",
  },
  {
    icon: FaHandshake,
    title: "Break Borders",
    description:
      "Distance and currency won’t limit your impact. With cross-border payment support and region-friendly tools, RefreeG lets you raise funds from anyone, anywhere in the world.",
    iconAlt: "Globe icon",
  },
];

export default function LaunchYourCauseInSeconds() {
  const { ref, isInView } = useAnimateInView({ once: true, margin: "-100px" });
  const isMobile = useIsMobile();

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const textVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2 + 0.3,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  const MotionH2 = motion(H2);
  const MotionP = motion(P);

  return (
    <section className="w-full py-16 bg-white" ref={ref}>
      <div>
        {/* Heading */}
        <motion.div
          className="text-start mb-8"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <MotionH2
            className="text-black text-4xl font-bold font-['Montserrat'] leading-[48px] mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          >
            Launch Your Cause in Seconds
          </MotionH2>

          <MotionP
            className="text-lg text-gray-500"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          >
            Start your campaign in moments. RefreeG gives you the tools to
            create, manage, and share your mission without missing a beat.
          </MotionP>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                className="flex flex-col w-full h-full items-start border rounded-lg p-6 bg-white shadow-sm"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={cardVariants}
                custom={idx}
              >
                <Icon
                  className="text-2xl text-blue-700 mb-6"
                  aria-label={card.iconAlt}
                />
                <motion.h3
                  className="font-bold text-lg mb-1"
                  variants={textVariants}
                  custom={idx}
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  className="text-gray-500 text-start"
                  variants={textVariants}
                  custom={idx}
                >
                  {card.description}
                </motion.p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
