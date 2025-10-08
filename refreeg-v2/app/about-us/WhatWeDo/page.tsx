import React from "react";
import HowDoWeAchieveThis from "../OurMission/_components/HowDoWeAchieveThis";
import Hero from "./_components/hero";
import WhyChooseRefreeg from "./_components/WhyChooseRefreeg";
import MakeaDifference from "./_components/MakeaDifference";

export default function WhatWeDo() {
    return (
        <div className="w-full">
            <Hero />
            <WhyChooseRefreeg />
            <MakeaDifference />
            <HowDoWeAchieveThis />        
        </div>
    )
}