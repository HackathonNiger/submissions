import React from "react";
import Image from "next/image";

// Template for steps
const steps = [
  {
    label: "Identity Information",
    title: "Personal Information",
    description:
      "Provide your basic identity details so we can verify who you are and ensure a secure experience for everyone on the platform.",
    image: "/kyc_sidenav.png",
  },
  {
    label: "Residential Address",
    title: "Residential Address",
    description:
      "Confirm your current residential address to help us comply with identity verification regulations.",
    image: "/kyc_sidenav.png",
  },
  {
    label: "Upload Identification Document",
    title: "Upload Identification Document",
    description:
      "Upload a valid ID document to complete your verification. This helps us protect your account and comply with regulatory standards.",
    image: "/kyc_sidenav.png",
  },
];

export default function KycStep({ currentStep }: { currentStep: number }) {
  const step = steps[currentStep];

  return (
    <div className="flex flex-col md:flex-row w-full bg-white min-h-screen">
      {/* Step content */}
      <main className="flex-1 flex flex-col px-6">
        <p className="text-sm  font-semibold mb-2">Step {currentStep + 1}</p>
        <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
        <p className="text-gray-600 mb-6 max-w-xl">{step.description}</p>

        {/* Progress Bars */}
        <div className="flex gap-2 mb-10 w-full max-w-sm">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-colors duration-500 ${
                idx <= currentStep ? "bg-blue-700" : "bg-gray-200"
              }`}
            ></div>
          ))}
        </div>

        {/* Step Illustration */}
        <div className="flex justify-center md:justify-start">
          <Image
            src={step.image}
            alt={step.title}
            width={400}
            height={300}
            className="object-contain"
          />
        </div>
      </main>
    </div>
  );
}
