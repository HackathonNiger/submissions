"use client";
import { Mail } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const GetMail = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="w-full">
      <form className="relative size-fit mt-2">
        <input
          type="email"
          name="email"
          className="bg-white rounded-3xl h-[45px] outline-none border-none placeholder:text-bold placeholder:font-medium 
          placeholder:text-[12px] text-[12px] pl-[50px] pr-[120px] flex items-center w-full"
          placeholder="Enter your Email"
        />

        <Mail className="text-bold size-4 absolute top-[15px] left-6" />
        <Button
          className="text-white font-medium flex items-center justify-center text-[12px] h-[80%] absolute top-1 right-2 px-5 rounded-3xl cursor-pointer"
          variant="default"
        >
          Subscribe
        </Button>
      </form>

      {message && (
        <div className="mt-2 bg-green-500 text-white p-2 rounded-md text-sm">
          {message}
        </div>
      )}
    </div>
  );
};

export default GetMail;
