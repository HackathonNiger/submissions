import React from "react";
import Image from "next/image";
import { FaStairs } from "react-icons/fa6";

function OurStory() {
  return (
    <section className=" text-white py-16 px-4">
      <div className="container mx-auto bg-[#0F2A4E] p-8 md:p-12 rounded-lg h-auto max-w-6xl">
        {/* Header: badge + title above both columns */}
        <div className="mb-12 flex flex-col items-center justify-center space-x-4">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
            <FaStairs className="w-6 h-6" />
            <span>A Vision for Change, A Platform for Impact</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mt-4">Our Story</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Story Content */}
            <div className="space-y-4 text-gray-300 leading-relaxed text-md">
              <p>
                RefreeG was born out of a simple yet powerful idea— to create a
                platform where giving is transparent, impactful, and accessible
                to all. In a world where millions struggle to access basic
                necessities, education, and opportunities, we saw a need for a
                revolutionary approach that puts the power back in the hands of
                the people.
              </p>

              <p>
                We believe that helping others should not be complicated. Yet
                many people hesitate to donate because they fear their money
                won't reach the right hands. We asked ourselves:
              </p>

              <ul className="space-y-2 pl-4 text-sm">
                <li>• What if every donation could be tracked?</li>
                <li>• What if giving was as easy as sending a message?</li>
                <li>
                  • What if a single act of kindness could spark a movement?
                </li>
              </ul>

              <p>
                So, we built RefreeG—a platform that connects people who care
                with causes that matter, powered by blockchain technology to
                ensure full transparency and accountability.
              </p>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-lg h-64 md:h-80 lg:h-96">
              <Image
                src="/crowdfunding.jpg"
                alt="Crowdfunding"
                fill
                className="object-contain w-full h-full"
                style={{ objectPosition: "center" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurStory;
