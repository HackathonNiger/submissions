import { Link } from "react-router-dom";
import background from '../assets/background.jpg'; // Adjust path as needed

const HomePage = () => {
  return (
    // Full-page wrapper (transparent background to show background image)
    <div className="relative min-h-screen text-white overflow-hidden bg-transparent">

      {/* Full-screen background image */}
      <div
        className="fixed inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
        style={{
          backgroundImage:
            `url("${background}")`,
        }}
      >
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-gray-950/75 backdrop-blur-sm"></div>
      </div>

      {/* Gradient overlay (optional for elegant fade effect) */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/80 to-transparent z-10"></div>

      {/* Main content container */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">

        {/* Content card */}
        <div
          className="p-8 md:p-12 lg:p-16 text-center bg-white/95 text-gray-900 rounded-2xl shadow-2xl shadow-indigo-500/30
                     w-full max-w-lg md:max-w-xl lg:max-w-3xl transform transition-transform duration-500 ease-out scale-100"
        >

          {/* Branding icon */}
          <div className="mb-4 flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-indigo-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          {/* Title */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tighter text-gray-950"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Mapping Reimagined.
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto font-medium">
            Visualize, analyze, and <strong>share geographic data</strong> with a powerful,
            intuitive platform built for the modern world.
          </p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 justify-center">
            {/* Signup Button */}
            <Link
              to="/signup"
              className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white text-xl font-bold rounded-lg shadow-xl shadow-indigo-500/50 hover:bg-indigo-700 transition duration-300 ease-in-out transform hover:scale-[1.05]"
            >
              Start Mapping Free →
            </Link>

            {/* Login Button */}
            <Link
              to="/login"
              className="w-full md:w-auto px-10 py-4 text-indigo-600 text-lg font-semibold rounded-lg hover:text-indigo-800 transition duration-300 flex items-center justify-center"
            >
              I Already Have an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
