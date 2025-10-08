// import Image from 'next/image'
import React from 'react'
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { FC } from "react";

interface FeatureCardProps {
    imageSrc: string;
    title: string;
    description: string;
  }
  
export const FeatureCard: FC<FeatureCardProps> = ({
    imageSrc,
    title,
    description,
}) => (
    <div className='w-full'>
        <div className="w-10/12 flex items-center space-x-4">
            <Image
                src={imageSrc}
                alt="icon"
                width={70}
                height={70}
                className="border p-2 rounded-full aspect-square object-cover bg-[#FAFAFA] "
            />
            <div className='space-y-1 md:space-y-0'>
                <h2 className="text-sm md:text-base lg:text-xl font-medium">{title}</h2>
                <p className="text-xs md:text-sm lg:text-base">{description}</p>
            </div>
        </div>

    </div>
);

export default function ByNumbers() {
  return (
    <div className="w-full px-10 mt-4 md:mt-8 lg:mt-16">
        
        <div className='mt-16 lg:mt-24'>
            <div>
                <div className='text-xl md:text-2xl lg:text-4xl font-semibold'>📊 By the Numbers</div>
                <div className='text-xs md:text-base lg:text-lg'>We exist to be your go to risk free crowdfunding platform</div>
            </div>
            <div className='space-y-2 md:flex justify-between mt-4'>
                <FeatureCard
                    imageSrc={"/images/cash-in-hand.png"}
                    title="+100,000 NGN"
                    description="raised for life-changing causes"
                />
                <FeatureCard
                    imageSrc={"/images/people.png"}
                    title="+10"
                    description="people impacted through education, healthcare & relief programs"
                />
                <FeatureCard
                    imageSrc={"/images/no-yelling.png"}
                    title="2"
                    description="verified campaigns successfully funded."
                />
            </div>
        </div>
        
    </div>


  )
}
