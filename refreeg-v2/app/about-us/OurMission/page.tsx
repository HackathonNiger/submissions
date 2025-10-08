import React from "react";
import HowDoWeAchieveThis from "./_components/HowDoWeAchieveThis";
import WhatDoWeFocusOn from "./_components/WhatDoWeFocusOn";
import Hero from "./_components/hero";
import Whyweexist from "./_components/whyweexist";
import CreateBetterFuture from "./_components/CreateBetterFuture";
import OurStory from "./_components/OurStory";
import OurMission from "./_components/OurMission";
import WhyRefreeg from "./_components/WhyRefreeg";
import TheFaces from "./_components/TheFaces";
export default function Mission() {
  return (
    <div className="w-full">
      <Hero />
      <Whyweexist />
      <div className="mt-16">
        <OurStory />
      </div>
      <OurMission />
      <WhyRefreeg />
      <TheFaces />
    </div>
  );
}
