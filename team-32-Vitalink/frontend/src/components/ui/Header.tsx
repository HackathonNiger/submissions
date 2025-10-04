import React from "react";
import { motion } from "framer-motion";
import { IoCallOutline } from "react-icons/io5";

const Header: React.FC = () => {
  return (
    <div className="px-6 py-2 bg-transparent booder-b-2 border-gray-200 flex justify-between items-center ">
      <div className="">
        <h1 className="text-2xl font-bold text-gray-700">Patient Dashboard</h1>
        <p className="text-sm font-normal text-gray-500">
          Welcome back, John! Your health journey continues.
        </p>
      </div>
      <div className="">
        <motion.button className="p-1 bg-gray-100 border-1 border-blue-200 border-1 px-2 rounded-sm flex items-center gap-2 text-black text-left hover:bg-gray-100">
          <IoCallOutline />
          Contact Doctor
        </motion.button>
      </div>
    </div>
  );
};

export default Header;
