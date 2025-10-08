"use client";

import React from "react";
import Image from "next/image";
import { H1, P } from "@/components/typograpy";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import { useAnimateInView } from "@/hooks/use-animate-In-view"; // your hook

const HERO_IMAGES = ["/hero1.png", "/hero2.jpg", "/hero3.png", "/hero4.png"];
const SLIDER_SPEED = 50;
const SLIDE_UP_DURATION = 0.6;
const IMAGE_GAP = 24;

const slideUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: SLIDE_UP_DURATION, delay },
});

const slideFrom = (x: number, delay = 0) => ({
  initial: { opacity: 0, x },
  animate: { opacity: 1, x: 0 },
  transition: { duration: SLIDE_UP_DURATION, delay },
});

const MobileSlider = () => {
  const { ref, isInView } = useAnimateInView({ once: true, margin: "-50px" });
  const sliderControls = useAnimation();
  const imageControls = HERO_IMAGES.map(() => useAnimation());

  if (isInView) {
    (async () => {
      // All images appear together
      await Promise.all(
        imageControls.map((c) =>
          c.start({
            opacity: 1,
            y: 0,
            transition: { duration: SLIDE_UP_DURATION, ease: "easeOut" },
          })
        )
      );

      // Slider movement for mobile
      const totalWidth = HERO_IMAGES.length * (200 + IMAGE_GAP);
      sliderControls.start({
        x: -totalWidth,
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: SLIDER_SPEED,
          ease: "linear",
        },
      });
    })();
  }

  return (
    <motion.div
      ref={ref}
      className="flex gap-6 w-max"
      animate={sliderControls}
      initial={{ x: 0 }}
    >
      {[...HERO_IMAGES, ...HERO_IMAGES, ...HERO_IMAGES].map((src, index) => (
        <motion.div
          key={index}
          className="flex-shrink-0 flex justify-center items-center w-[200px] h-[150px]"
          initial={{ opacity: 0, y: 40 }}
          animate={imageControls[index % HERO_IMAGES.length]}
        >
          <img
            src={src}
            alt={`Hero image ${index + 1}`}
            className="object-cover rounded-xl shadow-lg w-full h-full"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

const DesktopSlider = () => {
  const { ref, isInView } = useAnimateInView({ once: true, margin: "-50px" });
  const sliderControls = useAnimation();
  const imageControls = HERO_IMAGES.map(() => useAnimation());

  if (isInView) {
    (async () => {
      // Sequential appearance
      for (let control of imageControls) {
        await control.start({
          opacity: 1,
          y: 0,
          transition: { duration: SLIDE_UP_DURATION, ease: "easeOut" },
        });
      }

      // Slider movement for desktop
      const totalWidth = HERO_IMAGES.length * (325 + IMAGE_GAP);
      sliderControls.start({
        x: -totalWidth,
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: SLIDER_SPEED,
          ease: "linear",
        },
      });
    })();
  }

  return (
    <motion.div
      ref={ref}
      className="flex gap-6 w-max"
      animate={sliderControls}
      initial={{ x: 0 }}
    >
      {[...HERO_IMAGES, ...HERO_IMAGES, ...HERO_IMAGES].map((src, index) => (
        <motion.div
          key={index}
          className="flex-shrink-0 flex justify-center items-center w-[325px] h-[200px]"
          initial={{ opacity: 0, y: 40 }}
          animate={imageControls[index % HERO_IMAGES.length]}
        >
          <img
            src={src}
            alt={`Hero image ${index + 1}`}
            className="object-cover rounded-xl shadow-lg w-full h-full"
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

const Hero = () => {
  return (
    <section
      className="w-full bg-background flex flex-col items-center justify-center mb-10"
      id="home"
    >
      {/* TEXT */}
      <div className="flex flex-col gap-4 max-w-[925px] w-full justify-center items-center text-center">
        <motion.div
          className="flex gap-2 items-center py-2 px-3 bg-[#FAFAFA] border border-[#E8E8E8] rounded-3xl"
          {...slideUp(0.1)}
        >
          <Image src="/Users.svg" alt="Users icon" width={20} height={20} />
          <P>Join thousands already fundraising on RefreeG</P>
        </motion.div>
        <motion.div {...slideUp(0.2)}>
          <H1 className="font-bold">
            Empower Communities, Build a Better World
          </H1>
        </motion.div>
        <motion.div {...slideUp(0.3)}>
          <P className="font-light">
            Support causes that foster socioeconomic growth through transparent
            and secure crowdfunding
          </P>
        </motion.div>
        <div className="flex gap-4">
          <motion.div {...slideFrom(-20, 0.4)}>
            <Button
              asChild
              className="px-3.5 py-2 text-white"
              variant="secondary"
            >
              <Link href="/causes">Explore Causes</Link>
            </Button>
          </motion.div>
          <motion.div {...slideFrom(20, 0.4)}>
            <Button
              asChild
              className="px-3.5 py-2 bg-white text-[#003366] border border-[#003366] hover:bg-white hover:text-[#003366]"
            >
              <Link href="/dashboard/causes/create">
                <span className="flex items-center gap-2">
                  Join the change
                  <Image
                    src="/images/arrow-up-right 1.svg"
                    alt="Join the change"
                    width={20}
                    height={20}
                  />
                </span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* SLIDER */}
      <div className="relative w-full bg-white overflow-hidden py-12">
        <div className="relative z-10 w-full overflow-hidden">
          {/* Mobile version */}
          <div className="block md:hidden">
            <MobileSlider />
          </div>
          {/* Desktop version */}
          <div className="hidden md:block">
            <DesktopSlider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
