import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, BookOpen } from 'lucide-react'; 
import { ExpandProfile } from "./ExpandProfile";
import { useNavigate } from 'react-router-dom';

const courses = [
  "Computer Science",
  "Software Engineering", 
  "Information Technology",
  "Law",
  "Economics",
  "Business Administration",
  "Accounting",
  "Finance",
  "Marketing",
  "Mass Communication",
  "Political Science",
  "International Relations",
  "Medicine",
  "Nursing",
  "Pharmacy",
  "Engineering (Civil)",
  "Engineering (Mechanical)",
  "Engineering (Electrical)",
  "Architecture",
  "Psychology",
  "Sociology",
  "English Language",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology"
];

export const Courselection = () => {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [firstname, setFirstname] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const getStoredFirstName = () => {
      // Try direct keys first
      let name = localStorage.getItem("firstName") || localStorage.getItem("firstname");
      if (name) return name;

      // Fallback to user object
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          return parsedUser.firstName || parsedUser.firstname || '';
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }
      }
      return '';
    };

    const rawName = getStoredFirstName();
    if (rawName) {
      const formatted =
        rawName.trim().charAt(0).toUpperCase() +
        rawName.trim().slice(1).toLowerCase();
      setFirstname(formatted);
    }
  }, []);

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedCourse) {
      navigate(`/career-path?course=${encodeURIComponent(selectedCourse)}`);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setSearchTerm(course);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="pt-10 px-10">
        <div>
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
            <ExpandProfile />
          </div>

          <div className="text-center mb-16">
            <div className='flex justify-center items-center ml-10'>
              <h2 className="text-[5rem] font-bold mb-2">
                Hello {firstname || "User"} <span className="inline-block animate-bounce">👋</span>
              </h2>
            </div>
            <p className="text-green-400 text-center text-[3rem] mb-6">Welcome to Pathwise AI !</p>
            <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
              Let's discover your perfect career path. First, tell us about your academic background. What course are you studying for
            </p>
          </div>

          <div className="bg-green-600 rounded-2xl p-8 max-w-4xl h-auto mx-auto shadow-2xl">
            <h3 className="text-[2em] font-semibold text-center mb-4">
              What course are you studying (or did you study)?
            </h3>
            <p className="text-center text-green-100 text-sm mb-6">
              Choose your field of study to get personalized career recommendations
            </p>

            {/* Custom Searchable Dropdown */}
            <div className="relative mb-6" ref={dropdownRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for your course..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="pl-12 pr-12 py-4 text-lg rounded-2xl border-2 border-purple-200 focus:border-purple-500 bg-white/50 w-full text-gray-900"
                />
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white rounded-2xl shadow-xl border border-purple-100 max-h-84 overflow-y-auto">
                  {filteredCourses.map((course, index) => (
                    <button
                      key={index}
                      onClick={() => handleCourseSelect(course)}
                      className="w-full text-left px-6 py-4 hover:bg-purple-50 first:rounded-t-2xl last:rounded-b-2xl transition-colors duration-200 border-b border-gray-100 last:border-b-0 text-gray-900"
                    >
                      <span className="font-medium">{course}</span>
                    </button>
                  ))}
                  {filteredCourses.length === 0 && (
                    <div className="px-6 py-4 text-gray-500 text-center">
                      No courses found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className='flex justify-center items-center'>
              <button
                onClick={handleContinue}
                disabled={!selectedCourse}
                className="w-[18em] bg-gray-900 hover:bg-gray-800 hover:scale-105 cursor-pointer delay-75 text-white py-5 px-8 rounded-full font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Continue to Career Paths</span>
                <span>→</span>
              </button>
            </div>

            {/* Selected Course Display */}
            {selectedCourse && (
              <div className="mt-8">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border-2 bg-black flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-black font-medium">Selected Course</p>
                      <p className="text-lg font-bold text-orange-500">{selectedCourse}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Popular Courses */}
        <div className="mt-20 mb-10">
          <h4 className="text-center text-white text-lg font-semibold mb-6">Popular Courses</h4>
          <div className="flex flex-wrap justify-center gap-3">
            {["Computer Science", "Law", "Economics", "Business Administration", "Medicine"].map((course) => (
              <button
                key={course}
                onClick={() => handleCourseSelect(course)}
                className="px-6 py-3 bg-white backdrop-blur-sm rounded-full border-2 border-green-200 cursor-pointer hover:bg-purple-50 hover:border-orange-300 transition-all duration-200 text-gray-700 font-medium"
              >
                {course}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};