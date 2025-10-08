import { FC } from "react";
import Link from "next/link";
import { CauseDescription } from "@/components/causeDescription";
import { causes } from "@/lib/dummyData";

interface SectionHeaderProps {
  title: string;
  buttonLabel: string;
  buttonHref: string;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, buttonLabel, buttonHref }) => (
  <div className="lg:flex md:flex justify-between mb-3">
    <div className="text-blue-900 mb-2 text-lg md:text-2xl font-semibold">{title}</div>
    <div className="flex">
      <Link href={buttonHref} className="px-2 py-2 md:px-3 md:py-3 lg:px-4 lg:py-4 border-2 border-blue-900 rounded-lg text-blue-900 text-sm md:text-xl font-semibold">
        {buttonLabel}
      </Link>
    </div>
  </div>
);




export function CausesSupported() {


  return (
    <div className="px-10">
      <SectionHeader title="What kind of causes do we support?" buttonLabel="Join us today!" buttonHref="#" />
      <div className="w-11/12 lg:w-8/12 md:mx-auto lg:mx-auto text-base md:text-xl md:text-center lg:text-center mt-10 mb-10">
        At RefreeG, we support a wide range of causes that align with our mission to empower less privileged individuals in the community and foster socio-economic growth. Here are some of the key areas we focus on:
      </div>
      <div>
        {causes.map((cause, index) => (
          <CauseDescription key={index} {...cause} />
        ))}
      </div>
    </div>
  );
}

export default CausesSupported;
