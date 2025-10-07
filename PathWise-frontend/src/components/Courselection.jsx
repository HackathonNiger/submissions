

import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, BookOpen } from 'lucide-react'; 
import { ExpandProfile } from "./ExpandProfile";
import nav from '../assets/hamburger.svg';
import { useNavigate } from 'react-router-dom';
import notifi from '../assets/notifi.svg';
import profile from '../assets/profile.svg';

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
    <div className="min-h-screen text-white relative overflow-hidden" style={{ background: '#101727' }}>
      <div className="flex bg-white/10 p-5 justify-between items-center mb-12">
          <h1 className="text-2xl font-bold  text-green-400  ">PATHWISE AI</h1>
           <div className='flex gap-8'>
            <div  className="relative group cursor-pointer px-4 rounded-[10px] pt-1 overflow-hidden border-2 font-medium text-black text-LG border-green-500 bg-green-500 transition-transform duration-300 hover:scale-105"
              >
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                  PREMUIM
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
            <img src={notifi} alt="" className='w-6' />
            <img src={profile} alt="" className='w-10' />
          </div> 
          {/* <div className="text-green-400 text-xl">Hello, {firstname || "User"} <span className="fas fa-user text-white ml-2"></span></div> */}
      </div>
      {/* Green elliptical blur effect - top left */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '5%',
          width: '400px',
          height: '200px',
          background: '#01742B',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.4,
          zIndex: 1
        }}
      />

      {/* Another blur effect - bottom right */}
     

      <div className="pt-8 px-10 relative z-10">
        {/* Header */}
        

        {/* Welcome Section */}
        
        <div className="text-center mb-16">
          <h2 className="text-[3em] mont font-semibold mb-5 pt-0 text-green-400">
           Discover Your Future
          </h2>
            <p className="text-white text-lg w-[60%] mx-auto  mb-4 opacity-80">
              Let’s discover your perfect career path designed with clarity, powered by AI, and aligned with the future you’re meant to build
            </p>
             
        </div>

        {/* Search Section */}
        <div className='w-[75%]  mx-auto  backdrop-blur bg-white/5 border border-green-500 rounded-xl pt-10 pb-5 shadow-2xl px-6'>
          <p className="text-gray-300 text-center text-xl max-w-2xl mx-auto leading-relaxed mb-8">
             What course are you studying (or did you study)?
          </p>
          
          <div
            className="absolute pointer-events-none"
            style={{
              bottom: '-10%',
              right: '0%',
              width: '350px',
              height: '175px',
              background: '#01742B',
              borderRadius: '50%',
              filter: 'blur(70px)',
              opacity: 0.3,
              zIndex: 1
            }}
          />
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative" ref={dropdownRef}>
              <div 
                className="relative"
                style={{
                  background: 'rgba(19, 21, 27, 0.3)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '50px',
                  border: '1px solid rgba(1, 116, 43, 0.51)'
                }}
              >
                <Search className="absolute  left-6 top-1/2 transform -translate-y-1/2 text-green-400 w-6 h-6" />
                <input
                  type="text"
                  placeholder="Search for your course..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="pl-16  pr-16 py-6 text-lg rounded-full bg-transparent w-full text-white placeholder-gray-400 border-none outline-none"
                />
                <ChevronDown className="absolute right-6 top-1/2 transform -translate-y-1/2 text-green-400 w-6 h-6" />
              </div>

              {isDropdownOpen && (
                <div 
                  className="absolute border-4 border-red-500  w-full mt-4 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                  style={{
                    background: 'rgba(19, 21, 27, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(1, 116, 43, 0.3)'
                  }}
                >
                  {filteredCourses.map((course, index) => (
                    <button
                      key={index}
                      onClick={() => handleCourseSelect(course)}
                      className="w-full text-left px-6 py-4 hover:bg-green-500/20 first:rounded-t-2xl last:rounded-b-2xl transition-all duration-200 border-b border-gray-700/30 last:border-b-0 text-white"
                    >
                      <span className="font-medium">{course}</span>
                    </button>
                  ))}
                  {filteredCourses.length === 0 && (
                    <div className="px-6 py-4 text-gray-400 text-center">
                      No courses found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>
          
          </div>
        </div>
         {/* Selected Course Display */}
        {selectedCourse && (
          <div className="max-w-2xl mt-10 mx-auto mb-8">
            <div 
              className="rounded-2xl p-6"
              style={{
                background: 'rgba(1, 116, 43, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(1, 116, 43, 0.5)'
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(1, 116, 43, 0.3)' }}
                >
                  <BookOpen className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-green-300 font-medium mb-1">Selected Course</p>
                  <p className="text-xl font-bold text-white">{selectedCourse}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        {selectedCourse && (
          <div className='flex justify-center items-center mb-20'>
            <button
              onClick={handleContinue}
              className="px-12 py-4 bg-green-500 hover:bg-green-400 hover:scale-105 text-white rounded-full font-medium transition-all duration-200 text-lg"
            >
              Continue to Career Paths →
            </button>
          </div>
        )}
        {/* Popular Courses Section */}
        <div className="mb-20 mt-10">
          <h4 className="text-center text-green-400 text-2xl font-semibold mb-12">Popular Courses</h4>
          <div className="  grid grid-cols-3 gap-8 max-w-4xl  mx-auto">
            {[
              { name: "Computer Science", icon: "💻" },
              { name: "Law", icon: "⚖️" },
              { name: "Economics", icon: "📈" },
              { name: "Business Administration", icon: "💼" },
              { name: "Medicine", icon: "🩺" }
            ].map((course, index) => (
              <button
                key={index}
                onClick={() => handleCourseSelect(course.name)}
                className="group relative  overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(19, 21, 27, 0.6)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  border: '1px solid rgba(1, 116, 43, 0.3)',
                  padding: '2rem',
                  zIndex:'-10'
                }}
              >
                {/* Gradient border effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    borderRadius: '20px',
                    padding: '1px',
                    background: 'linear-gradient(to bottom, #01742B 0%, #019438 100%)',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude'
                  }}
                />
                
                <div className="text-center relative">
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <div className="text-white font-medium text-lg">{course.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
