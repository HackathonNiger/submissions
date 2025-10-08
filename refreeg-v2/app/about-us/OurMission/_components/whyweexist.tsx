// import Image from 'next/image'
import React from "react";
import Link from "next/link";
import { FC } from "react";
import { Rocket, HandshakeIcon, MegaphoneIcon } from "lucide-react";

interface FeatureCardProps {
  Icon: React.ElementType;
  title: string;
  description: string;
}

export const FeatureCard: FC<FeatureCardProps> = ({
  Icon,
  title,
  description,
}) => (
  <div className="w-full">
    <div className="p-3 bg-[#FAFAFA] rounded-full mb-4 inline-flex">
      <Icon className="text-blue-600" />
    </div>
    <div className="w-10/12 flex items-center space-x-4">
      <div className="space-y-1 md:space-y-0">
        <h2 className="text-sm md:text-base lg:text-xl font-semibold mb-4">
          {title}
        </h2>
        <p className="text-xs md:text-sm lg:text-base">{description}</p>
      </div>
    </div>
  </div>
);

export default function Whyweexist() {
  const features = [
    {
      Icon: Rocket,
      title: "Lack of Transparency",
      description:
        "RefreeG is dedicated to promoting transparency in fundraising. With our innovative approach, we ensure that every donation is tracked and reported, giving backers clear insight into where their money goes.",
    },
    {
      Icon: HandshakeIcon,
      title: "Limited Access",
      description:
        "RefreeG is dedicated to making a real grassroots impact. Unlike many other crowdfunding sites that overlook local initiatives, we prioritize empowering communities and amplifying their voices.",
    },
    {
      Icon: MegaphoneIcon,
      title: "Break Borders",
      description:
        "RefreeG understands the common struggle of donors wanting to know where their contributions go. With our transparent tools, we provide clear insights into the impact of every donation, making it easy for supporters to see how their funds are making a difference.",
    },
  ];

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-bold mb-2">Why do we exist?</h3>
          <p className="text-md text-gray-600 mb-6">
            We exist to be your go to risk free crowdfunding platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white border rounded-lg p-6 shadow-sm"
            >
              <FeatureCard
                Icon={f.Icon}
                title={f.title}
                description={f.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
