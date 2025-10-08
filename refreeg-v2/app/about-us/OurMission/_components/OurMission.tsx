import React from "react";
import Image from "next/image";

function OurMission() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-8">
          Our Mission
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="prose max-w-none text-md text-gray-700">
            <p>
              At RefreeG, we believe in the power of community-driven change.
              Our mission is simple yet powerful: to connect those who want to
              help with those who need it the most.
            </p>

            <p>
              To create a transparent and accountable crowdfunding platform. To
              foster socio-economic growth by supporting impactful causes.
            </p>

            <p>
              We exist to empower individuals, businesses, and communities by
              providing a trustworthy platform where funds are securely donated
              and effectively utilized for meaningful change.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md rounded overflow-hidden shadow-sm">
              <Image
                src="/mission.png"
                alt="Our mission"
                width={760}
                height={420}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OurMission;
