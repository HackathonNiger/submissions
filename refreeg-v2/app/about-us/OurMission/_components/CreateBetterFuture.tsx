import React from 'react'
import { FaArrowRight } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

export default function CreateBetterFuture() {
  return (
    <div className='w-full md:w-5/6 lg:w-1/2 px-10 mt-4 md:mt-8 lg:mt-12 mb-16'>
        <div className='text-xl md:text-2xl lg:text-4xl font-semibold w-full'>Join Us in Creating a Better Future 🌱</div>
        <div className='mt-2 text-base'>
            RefreeG is more than just a crowdfunding platform—it’s a movement for real change. Whether you’re looking to start a cause, donate, or spread awareness, your action can help change lives.
        </div>
        <div className='mt-8 text-base'>✨ Together, we can make generosity work smarter, not harder.</div>
        <div className='flex space-x-2 mt-4'>
            <button className='flex items-center gap-x-1 text-white p-3 font-medium bg-[#0070E0] rounded-sm'>
                Start a cause <FaArrowRight />
            </button>
            <button className='flex items-center gap-x-1 p-3 font-medium rounded-sm'>Explore causes <FiArrowUpRight /></button>
        </div>
    </div>
  )
}
