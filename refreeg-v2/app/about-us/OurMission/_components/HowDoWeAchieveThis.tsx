import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import { blogs } from "@/lib/blog";

interface FeatureCardProps {
    imageSrc: string;
    title: string;
    description: string;
    linkHref: string;
  }
  
export const FeatureCard: FC<FeatureCardProps> = ({
    imageSrc,
    title,
    description,
    linkHref,
}) => (
    <Link href={linkHref}>
        <div className="flex w-[350px] flex-col space-y-2 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-slate-50 pb-5 hover:rounded-xl p-4 cursor-pointer">
          <Image
            src={imageSrc}
            alt="icon"
            width={350}
            height={350}
            className="mr-auto object-cover"
          />

          <h2 className="text-lg md:text-xl lg:text-2xl font-medium">{title}</h2>
          <p className="text-base md:text-lg">{description}</p>
          <div className="flex font-medium hover:text-blue-800 hover:underline transition duration-500 ease-in-out transform items-center">
              Read more
              <Image
              src={"/images/arrow-right.png"}
              alt="icon"
              width={25}
              height={25}
              />
          </div>
        </div>
    </Link>
);

export const HowDoWeAchieveThis: FC = () => {

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>?/gm, "");
  }
  
  return (
    <div className="w-full px-10 mt-4 md:mt-8 lg:mt-16">
      <div className="bg-white w-full z-10">
        <div className="text-xl md:text-2xl lg:text-4xl font-semibold w-full">
          How do we achieve this?
        </div>
        <div className="text-sm md:text-lg lg:text-xl">
          How we achieve transparent donations
        </div>
        <div className="w-full py-6 flex flex-col md:flex-row overflow-x-auto scrollbar-hide space-y-6 md:space-y-0 md:space-x-6">
        {blogs
          .filter(blog => [
            "blockchain-powered-transparency",
            "seamless-inclusive-giving",
            "community-first-approach",
            "empowering-local-changemakers"
          ].includes(blog.slug))
          .map(({ slug, title, img, content }) => (
            <FeatureCard
              key={slug}
              imageSrc={img}
              title={title}
              description={stripHtml(content).slice(0, 120) + "..."}
              linkHref={`${slug}`}
            />
        ))}
        </div>
      </div>
    </div>
  )
}
export default HowDoWeAchieveThis;