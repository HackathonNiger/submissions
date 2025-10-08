import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import Image from 'next/image';
import { Ul } from "@/components/typograpy";

export default function Hero() {
  return (
    <div className='px-10 w-full flex flex-col-reverse md:flex md:flex-row justify-between'>
        <div className='w-full lg:w-8/12'>
            <div className='w-full lg:w-5/6 mb-7'>
                <div className='text-xl md:text-2xl lg:text-4xl font-semibold pb-2 md:pb-2 lg:mb-1'>Our Story 🌍💙</div>
                <div className='text-sm md:text-base lg:text-lg'>
                    <span className='font-semibold'> 
                        A Vision for Change, A Platform for Impact 
                    </span><br />
                        RefreeG was born out of a simple yet powerful idea—to create a 
                        platform where giving is transparent, impactful, and accessible to 
                        all. In a world where millions struggle to access basic necessities, 
                        education, and opportunities, we saw a need for a crowdfunding 
                        solution that puts power back in the hands of the people. <br />
                        We believe that helping others should not be complicated. Yet, 
                        many people hesitate to donate because they fear their money 
                        won&apos;t reach the right hands. We asked ourselves:
                    <Ul>
                        <li className="pl-4 text-base">
                            What if every donation could be tracked?
                        </li>
                        <li className="pl-4 text-base">
                            What if giving was as easy as sending a message?
                        </li>
                        <li className="pl-4 text-base">
                            What if a single act of kindness could spark a movement?
                        </li>
                    </Ul>
                    So, we built RefreeG—a platform that connects people who care with causes that matter, powered by blockchain technology to ensure full transparency and accountability.
                </div>
            </div>
            <button className=" text-xs md:text-base flex items-center gap-x-2 text-white p-2 bg-[#0070E0] rounded">
                Crowdfund on Refreeg <FaArrowRight />
            </button>
        </div>
        <div className='hidden lg:block w-full md:w-4/12'>
            <Image 
                className='mx-auto md:ml-auto'
                src={"/mission.png"}
                width={550}
                height={500} 
                alt='mission.png' 
            />
        </div>
        
        <div></div>
    </div>
  )
}
