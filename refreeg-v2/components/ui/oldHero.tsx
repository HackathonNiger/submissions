import HeroComponent from "@/components/heroComponent";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <section
      className="w-full md:px-[50px] px-[10px] py-[15px] md:py-[25px] md:flex justify-between relative min-h-[90vh] bg-background"
      id="home"
    >
      {/* african map  */}
      <Image
        src={"/map.svg"}
        alt="African Map"
        width={100}
        height={100}
        className="w-[600px] absolute left-1/2 md:top-0 top-24 transform -translate-x-1/2 dark:opacity-20"
      />

      <div className="md:px-0 px-[30px]">
        <HeroComponent img1={"/heropic1.png"} img2={"/heropic2.png"} />
      </div>
      {/* hero caption  */}
      <div className="md:pt-10 mt-12 md:mt-0 text-center">
        <p className="text-[12px] md:text-[14px] font-semibold text-center text-foreground">
          Building Africa's number 1 crowd funding platform.
        </p>
        <p className="text-[65px] md:text-[100px] font-bold md:font-semibold  text-[#10467c]">
          RefreeG
        </p>
        <p className="md:text-[20px] text-[16px] text-foreground font-medium">
          Your go to crowdfunding platform for building a new{" "}
          <br className="hidden md:block" /> Africa, one community at a time
        </p>

        <Link
          href={"/causes"}
          className="flex gap-[6px] py-[10px] px-[15px] rounded-[8px] text-brand text-[15px] items-center justify-center mx-auto relative z-30 
            md:mt-16 mt-8 font-semibold cursor-pointer bg-muted hover:bg-[#284678] hover:text-secondary-foreground transition"
        >
          Explore Causes
          <ArrowRight size={"18"} />
        </Link>
      </div>

      <div className="md:px-0 px-[30px] md:mt-0 mt-6">
        <HeroComponent img1={"/heropic3.png"} img2={"/heropic4.png"} />
      </div>
    </section>
  );
};

export default Hero;
