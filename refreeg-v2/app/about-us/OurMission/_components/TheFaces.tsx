import React from "react";
import Image from "next/image";
import { Button } from "@/components/button";
import Link from "next/link";

function TheFaces() {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          These are the faces behind RefreeG
        </h2>

        <p className="text-gray-600 text-sm md:text-base mb-6 max-w-2xl mx-auto">
          RefreeG is a cause-based platform that lets anyone start, support, or
          amplify meaningful initiatives — all for free, with full transparency
          and real impact.
        </p>

        <Link
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-8"
          href="/causes/create"
        >
          Start a cause
        </Link>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/team.jpg"
              alt="The RefreeG team"
              width={800}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default TheFaces;
