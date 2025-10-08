import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { FC } from "react";

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
    <div className="flex min-w-[40%] flex-col space-y-2 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:bg-slate-50 pb-5 hover:rounded-xl p-4 cursor-pointer">
      <Image
        src={imageSrc}
        alt="icon"
        width={350}
        height={350}
        className="mr-auto"
      />
      <h2 className="text-xl md:text-2xl font-medium">{title}</h2>
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

export const WhyUseUs: FC = () => {
  return (
    <div className="w-full pr-10 pl-10 border-b">
      <div className="bg-white w-full mt-8 mb-12 px-4 z-10">
        <div className="text-2xl w-full md:text-4xl">
          Why you should use us!
        </div>
        <div className="text-lg md:text-xl">
          Reasons why your donation will be used right!
        </div>
        <div className="w-full py-6 flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
          <FeatureCard
            imageSrc={"/images/blockchain.png"}
            title="Blockchain Transparency"
            description="Track your donations in real-time using blockchain technology for complete transparency."
            linkHref="/blockchain-transparency" // Use query parameter
          />
          <FeatureCard
            imageSrc={"/images/vetted.png"}
            title="Vetted Causes"
            description="Every cause is carefully vetted to ensure your contributions make a genuine impact."
            linkHref="/vetted-causes" // Use query parameter
          />
          <FeatureCard
            imageSrc={"/images/easyDonation.png"}
            title="Easy Donation Process"
            description="Donate to causes with just a few clicks and track progress every step of the way."
            linkHref="/easy-donation-process" // Use query parameter
          />
          <FeatureCard
            imageSrc={"/images/globalAccess.png"}
            title="Global Access"
            description="Support causes from anywhere in the world with our secure, web-based platform."
            linkHref="/global-access" // Use query parameter
          />
        </div>
      </div>
    </div>
  );
};

export default WhyUseUs;
