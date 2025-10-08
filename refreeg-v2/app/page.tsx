import { FeaturedCauses } from "@/components/home/featured-causes";
import Hero from "@/components/home/hero";
import FAQ from "@/components/home/frequentlyAskedQuestions";
import AdBanner from "@/components/AdBanner";
import LaunchYourCauseInSeconds from "@/components/home/launchYourCauseInSeconds";
import { TrendingCauses } from "@/components/home/trendingNow";
import WhyItStandsOut from "@/components/home/whyitStandsOut";
import HowitWorksYT from "@/components/home/howitWorksYT";
import { FeaturedPetitions } from "@/components/home/featured-petitions";
import { UrgentCauses } from "@/components/home/urgentCauses";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen mt-16 ">
      <Hero />

      <div className="mx-8">
        <LaunchYourCauseInSeconds />
      </div>

      {/* Urgent Causes */}
      <div className="mx-8">
        <UrgentCauses />
      </div>

      <div className="">
        <WhyItStandsOut />
      </div>

      <div className="mx-8">
        <TrendingCauses />
      </div>

      {/* Featured Causes */}
      <div className="mx-8">
        <FeaturedCauses />
      </div>

      <div className="mx-8">
        <FeaturedPetitions />
      </div>

      <div className="">
        <HowitWorksYT />
      </div>

      <div className="md:mx-8">
        <FAQ />
      </div>
    </div>
  );
}
