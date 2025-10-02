import React from "react";
import { useMoveBack } from "../hooks/useMoveBack";

const PageNotFound: React.FC = () => {
  const moveBack = useMoveBack();

  return (
    <main className="h-screen w-[100%] bg-gray-50 flex items-center justify-center p-12">
      <div className="bg-white border border-gray-200 p-12 max-w-4xl w-full text-center shadow-sm rounded-2xl">
        <h1 className="text-[2rem] font-bold text-black mb-8">
          The page you are looking for could not be found 😢
        </h1>
        <button
          onClick={moveBack}
          className="px-6 py-3 text-lg font-medium bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
        >
          &larr; Go back
        </button>
      </div>
    </main>
  );
};

export default PageNotFound;
