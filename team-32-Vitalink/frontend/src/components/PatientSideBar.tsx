import React from "react";
import { FaHeartbeat } from "react-icons/fa";
import { TbActivityHeartbeat, TbLayoutDashboard } from "react-icons/tb";
import { BsChatHeart } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { IoExitOutline } from "react-icons/io5";

import { motion } from "framer-motion";

import { NavLink } from "react-router-dom";

const PatientSideBar: React.FC = () => {
  return (
    <div className="grid h-full grid-rows-[.6fr_5fr_1.1fr] bg-red border-r-2 border-gray-200">
      {/* Logo */}
      <div className="flex items-center px-4 space-x-2 border-b-[1px] border-gray-200">
        <FaHeartbeat className="w-8 h-8 text-red-400" />
        <span className="text-2xl font-bold text-foreground">vitaLink</span>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-4 p-4">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 py-2 pl-3 text-xl text-black transition-all duration-300 bg-blue-200 border-l-4 border-blue-800 rounded-r-md"
        >
          <TbLayoutDashboard />
          <span className="font-normal">Dashboard</span>
        </NavLink>
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-xl text-black"
        >
          <TbActivityHeartbeat />
          <span className="font-normal">Vitals</span>
        </NavLink>
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-xl text-black"
        >
          <BsChatHeart />
          <span className="font-normal">Chat</span>
        </NavLink>
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-xl text-black"
        >
          <CiSettings />
          <span className="font-normal">Settings</span>
        </NavLink>
        {/* <NavLink
          to="/dashboard"
          className="flex items-center gap-2 text-xl text-black"
        >
          <TbLayoutDashboard />
          <span className="font-normal">Dashboard</span>
        </NavLink> */}
      </div>

      {/* User */}
      <div className="p-4 border-t-2 border-gray-200 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center text-2xl font-bold text-white bg-blue-600 rounded-full w-12 h-12">
            JD
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-medium">John Dillon</p>
            <p className="text-xs font-light">City General Hospital</p>
          </div>
        </div>
        <div className="">
          <motion.button className="p-1 bg-transparent border-none px-2 rounded-sm flex items-center gap-2 text-black text-left hover:bg-gray-100">
            <IoExitOutline />
            Logout
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default PatientSideBar;
