"use client";
import React from "react";

const InfinityLoader: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "24px",
        height: "12px",
        display: "inline-block",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "10px",
          height: "10px",
          border: "2px solid #3b82f6",
          borderRadius: "50%",
          animation: "infinityAnim 1.2s linear infinite",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          left: "12px",
          width: "10px",
          height: "10px",
          border: "2px solid #3b82f6",
          borderRadius: "50%",
          animation: "infinityAnim 1.2s linear infinite",
          animationDelay: "0.6s",
        }}
      ></div>
      <style>
        {`
        @keyframes infinityAnim {
          0% { transform: scale(1) translateX(0); opacity: 1; }
          50% { transform: scale(0.7) translateX(5px); opacity: 0.6; }
          100% { transform: scale(1) translateX(0); opacity: 1; }
        }
        `}
      </style>
    </div>
  );
};

export default InfinityLoader;
