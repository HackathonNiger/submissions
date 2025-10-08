import React from "react";
import { FaArrowRight } from "react-icons/fa6";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="py-8 md:py-12 lg:py-16 px-4 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 md:space-y-6 text-center lg:text-left">
            {/* Badge with icon */}
            <div className="inline-flex items-center gap-3 bg-[#FAFAFA] rounded-full px-4 py-2 border border-gray-200 ">
              <div className="p-2">
                <Users2 className="w-6 h-6 text-gray-700" />
              </div>
              <span className="text-sm font-bold">Our Mission</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              RefreeG's Mission
            </h1>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed max-w-none lg:max-w-lg">
              At RefreeG, we believe in the power of community-driven change.
              Our mission is simple yet impactful: to connect those who want to
              help with those who need it the most. To create a transparent and
              accountable crowdfunding platform. To foster socio-economic growth
              by supporting impactful causes. We exist to empower individuals,
              businesses, and communities by providing a trustworthy platform
              where funds are securely donated and effectively utilized for
              meaningful change.
            </p>

            {/* CTA Button */}
            <Link
              href="/causes/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-2.5 md:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              Start a cause
            </Link>
          </div>

          {/* Right Content - Image */}
          <div className="relative order-first lg:order-last mt-4 lg:mt-0">
            <div className="relative ">
              <Image
                src="/refreeg-mission.png"
                alt="Peace sign representing unity and change"
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 1200px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
