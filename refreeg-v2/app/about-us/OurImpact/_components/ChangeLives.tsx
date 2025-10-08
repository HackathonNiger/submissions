import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

export default function ChangeLives() {
  return (
    <div className='w-full md:w-5/6 lg:w-1/2 px-10 mt-4 md:mt-8 lg:mt-12 lg:mb-16'>
        <div className='text-xl md:text-2xl lg:text-4xl font-semibold w-full'>💙 Your Support Changes Lives</div>
        <div className='mt-2 text-base'>
            At RefreeG, every donation counts, every cause matters, and every action leads to real impact. Whether you’re donating, starting a campaign, or simply spreading the word, you are helping reshape the future of giving.
        </div>
        <div className='mt-8 text-base'>✨ Want to be part of the movement?</div>
        <div className='flex space-x-2 mt-4'>
            <button className='flex items-center gap-x-1 text-white p-3 font-medium bg-[#0070E0] rounded-sm'>
                Start a cause <FaArrowRight />
            </button>
            <button className='flex items-center gap-x-1 p-3 font-medium rounded-sm'>Explore causes <FiArrowUpRight /></button>
        </div>
    </div>
  )
}
