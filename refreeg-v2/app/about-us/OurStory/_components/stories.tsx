import { FC } from "react";
import Link from "next/link";
import { stories } from "@/lib/dummyData";
import { StoryDescription } from "./StoryDescription";

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




export function Stories() {


  return (
    <div className="px-10 mt-4 md:mt-8 lg:mt-16 mb-16">
      <div>
        {stories.map((story, index) => (
          <StoryDescription key={index} {...story} />
        ))}
      </div>
    </div>
  );
}

export default Stories;
