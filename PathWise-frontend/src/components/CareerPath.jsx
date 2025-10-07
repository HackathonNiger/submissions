import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { ExpandProfile } from "./ExpandProfile";
import careerPaths from "../data/CareerpathData";

export default function CareerPathPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [paths, setPaths] = useState([]);

  // 🔑 handle unlock click
  const toggleUnlock = () => {
    setIsProModalOpen(true);
  };

  const closeModal = () => {
    setIsProModalOpen(false);
  };

  const createPageUrl = (pageName) => {
    const pageRoutes = {
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      CourseSelectionPage: "/course-selection",
    };
    return pageRoutes[pageName] || "/";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const course = urlParams.get("course") || "";
    setSelectedCourse(course);

    if (
      course &&
      Array.isArray(careerPaths[course]) &&
      careerPaths[course].length > 0
    ) {
      setPaths(careerPaths[course]);
    } else {
      setPaths([]);
    }
  }, [location.search]);

  const handlePathSelect = (pathId) => {
    navigate(
      createPageUrl("JobRolePage") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${pathId}`
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 relative">
      <div className="px-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
            <ExpandProfile />
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Career Paths for{" "}
            <span className="text-green-500">{selectedCourse || "—"}</span>
          </h1>
          <p className="text-lg text-zinc-300 py-2 max-w-3xl mx-auto leading-relaxed">
            Here are some exciting career paths
            {selectedCourse ? ` in Nigeria for ${selectedCourse} graduates` : ""}.
          </p>
        </div>

        {/* Career Path Cards */}
        {paths.length === 0 ? (
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 text-center mb-12">
            <p className="text-lg font-semibold text-red-400">
              No career paths here.
            </p>
            <p className="text-sm text-zinc-300 mt-2">
              The selected course "{selectedCourse || "none"}" doesn&apos;t have
              any defined career paths yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 m-10 mb-12">
            {paths.map((path) => {
              const IconComponent = path.icon;
              return (
                <div
                  key={path.id}
                  className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-green-500 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-white/20"
                >
                  {/* Icon and Header */}
                  <div className="flex gap-5">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mt-4">
                      {path.name}
                    </h3>
                  </div>
                  <p className="text-white text-sm leading-relaxed mb-4">
                    {path.description}
                  </p>

                  {/* Stats */}
                  <button
                    onClick={toggleUnlock}
                    className="cursor-pointer mb-6 text-orange-500 transition-all"
                  >
                    {isUnlocked ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                  {isUnlocked ? (
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">
                          Available Jobs
                        </span>
                        <span className="font-semibold text-orange-500">
                          {path.jobCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Salary Range</span>
                        <span className="font-semibold text-green-600">
                          {path.salaryRange}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Growth Rate</span>
                        <span className="font-semibold text-purple-600">
                          {path.growth}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="ml-2 text-sm text-orange-500 mt-5 italic">
                      Unlock this pro feature
                    </span>
                  )}

                  {/* Top Companies */}
                  <div className="mb-6">
                    <p className="text-xs text-white mb-2">TOP COMPANIES</p>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(path.companies) &&
                        path.companies.slice(0, 3).map((company, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full"
                          >
                            {company}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div
                    onClick={() => handlePathSelect(path.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <span className="text-sm font-medium text-green-500">
                      Explore Roles
                    </span>
                    <div className="border-2 p-3 rounded-full border-green-500">
                      <ArrowRight className="w-5 h-5 text-green-500 hover:scale-125 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate(createPageUrl("CourseSelectionPage"))}
            className="border-green-200 text-green-500 hover:bg-green-50 px-8 py-3 rounded-2xl"
          >
            ← Back to Course Selection
          </button>
        </div>
      </div>

      {/* 🔥 ONE GLOBAL MODAL */}
      {isProModalOpen && (
        <div className="fixed inset-0  flex items-center justify-center bg-black/70 backdrop-blur-md z-[9999]">
          <div className="bg-white rounded-2xl flex flex-col justify-center item-center p-8 h-[70%] w-[90%] max-w-lg text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🚀 Subscribe to Pro Feature for ₦2,000
            </h2>
            <p className="text-gray-700 text-base t mb-4">
              Unlock access to premium insights:
            </p>
            <ul className="text-left text-gray-600 mb-6 space-y-2">
              <li>• Real-life job metrics</li>
              <li>• Mentorship access</li>
              <li>• AI-guided skill learning paths</li>
              <li>• Career growth analysis</li>
            </ul>
            <div className="flex justify-center space-x-3">
              <button
                onClick={closeModal}
                className="px-5 py-2 bg-gray-300 rounded-lg text-gray-700 font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setIsUnlocked(true);
                  closeModal();
                }}
                className="px-5 py-2 bg-orange-500 text-white rounded-lg font-semibold"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
