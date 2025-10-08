import Image from "next/image";
import { FC } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react"; // Import the ChevronRight2 image
import { H3, P } from "@/components/typograpy";

interface StoryDescriptionProps {
  imageSrc: string;
  title: string;
  points: string[];
  linkHref: string;
}

export const StoryDescription: FC<StoryDescriptionProps> = ({ imageSrc, title, points, linkHref }) => (
  <div className="lg:flex text-left md:text-center lg:text-center mb-16 pb-10 border-b justify-between">
    <div className="self-center hidden lg:block">
      <Image src={imageSrc} alt={title} width={20} height={20} />
    </div>
    <H3 className="self-center text-left md:text-center lg:text-center font-medium w-full lg:w-3/12">
      {title}
    </H3>
    <div className="lg:w-7/12 w-full text-left">
      {points.map((point, index) => (
        <P key={index} className="text-blue-900 font-medium mt-8">
          {point.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </P>
      ))}
    </div>
    <div className="flex justify-center items-center mt-3">
      <Link href={linkHref} className="flex self-center underline text-blue-900 text-lg font-semibold">
        Get Started <ChevronRight />
      </Link>
    </div>
  </div>
);
