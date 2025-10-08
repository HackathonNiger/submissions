import React from "react";
import { FaUsers, FaShieldAlt, FaSmile } from "react-icons/fa";

function WhyRefreeg() {
  return (
    <div className=" text-white   md:p-12">
      <div className=" bg-[#00264C] p-8 rounded-lg max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
          <span>Be a Catalyst for Change — Start Here</span>
        </div>

        <h3 className="text-2xl md:text-3xl font-semibold mb-8">Why RefreeG</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="flex flex-col items-center text-center px-4">
            <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center mb-4">
              <FaUsers className="text-[#0b64d6] w-12 h-12" />
            </div>
            <h4 className="font-semibold mb-2">Global</h4>
            <p className="text-sm text-gray-200 max-w-xs">
              Support causes from anywhere in the world with our secure,
              web-based platform.
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center mb-4">
              <FaShieldAlt className="text-[#0b64d6] w-12 h-12" />
            </div>
            <h4 className="font-semibold mb-2">Safe</h4>
            <p className="text-sm text-gray-200 max-w-xs">
              Your donations are secured and verified on the blockchain,
              ensuring they reach the right cause.
            </p>
          </div>

          <div className="flex flex-col items-center text-center px-4">
            <div className="bg-white rounded-full w-28 h-28 flex items-center justify-center mb-4">
              <FaSmile className="text-[#0b64d6] w-12 h-12" />
            </div>
            <h4 className="font-semibold mb-2">Easy</h4>
            <p className="text-sm text-gray-200 max-w-xs">
              Donate to causes with just a few clicks and track progress every
              step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyRefreeg;
