import React from "react";
import HowDoWeAchieveThis from "../OurMission/_components/HowDoWeAchieveThis";
import Hero from "./_components/hero";
import ByNumbers from "./_components/ByNumbers";
import ChangeLives from "./_components/ChangeLives";
import AdBanner from "@/components/AdBanner";

export default function Impact() {
  return (
    <div className="w-full">
      <Hero />
      <ByNumbers />
      <div className="lg:mt-16">
        <HowDoWeAchieveThis />
      </div>
      <ChangeLives />
    </div>
  );
}
