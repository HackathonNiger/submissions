import React from 'react'
import Image from "next/image";
import { H2, P, Ol } from "@/components/typograpy";

export default function MakeaDifference() {
  return (
    <div className="w-full justify-center mt-16 pt-20 pb-12 lg:pb-20 px-10 mb-20 space-y-5 text-white bg-customBlueGray">
        <H2 className='font-semibold'>How We Make a Difference</H2>
        <Ol className="mb-16">
            <P>
            🤝 Crowdfunding for a Better Future <br />
                We provide a safe, secure, and transparent platform where 
                individuals, organizations, and communities can raise funds 
                for meaningful causes. Whether it’s for education, healthcare, 
                vocational training, disaster relief, or social impact projects, 
                RefreeG helps bring your vision to life. <br />
                📌 Raise funds with ease → Start a campaign in minutes <br /> 
                📌 Verified causes → Every fundraiser goes through a vetting 
                process <br /> 
                📌 Global reach → Connect with donors from anywhere in the world
            </P>
        </Ol>
        <div className="md:flex lg:flex mt-10 mb-10 text-base lg:text-2xl">
            <span className="mr-4">Want to be a part of us?</span>
            <span className="flex mr-1 md:font-semibold lg:font-semibold underline">
            <button className="flex hover:bg-[#434a52] px-1 rounded-xl">
                Join our Community!
                <Image
                src="/images/arrowRight.svg"
                alt="arrow right"
                height={15}
                width={15}
                />
            </button>
            </span>
        </div>
    </div>
  )
}
