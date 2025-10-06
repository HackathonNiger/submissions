import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpandProfile } from "./ExpandProfile";
import { 
  Monitor, 
  Shield, 
  Settings, 
  BarChart3, 
  ArrowRight,
  Users,
  Heart,
} from "lucide-react";
import jobRoles from "../data/RolesData";




export default function Roles() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "";
    const path = urlParams.get("path") || "";
    setSelectedCourse(course);
    setSelectedPath(path);

    if (path && Array.isArray(jobRoles[path]) && jobRoles[path].length > 0) {
      setRoles(jobRoles[path]);
    } else {
      setRoles([]); // explicit empty state
    }
  }, []);

  // Converts a page name to a valid route path
  const createPageUrl = (pageName) => {
    const pageRoutes = {
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      Assessment: "/assessment",
      ResultPage: "/result",
    };
    return pageRoutes[pageName] || "/";
  };

  const handleRoleSelect = (roleId) => {
    navigate(
      createPageUrl("SkillsPage") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${roleId}`
    );
  };

  const getPathName = (pathId) => {
    const pathNames = {
      fintech: "Financial Technology",
      banking: "Banking & Finance",
      "tech-companies": "Technology Companies",
      government: "Government & Public Sector",
      startups: "Startups & Innovation",
    };
    return pathNames[pathId] || pathId || "—";
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
            <ExpandProfile />
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Job Roles in{" "}
            <span className="bg-green-500 bg-clip-text text-transparent">
              {getPathName(selectedPath)}
            </span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Here are the specific job roles you can explore in the {getPathName(selectedPath)} sector. Each role has different requirements and growth opportunities.
          </p>
        </div>

        {/* Roles or Empty State */}
        {roles.length === 0 ? (
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 text-center mb-12">
            <p className="text-lg font-semibold text-red-400">No roles here.</p>
            <p className="text-sm text-zinc-300 mt-2">
              The selected path "{selectedPath || "none"}" {selectedCourse && `for course "${selectedCourse}" `}doesn&apos;t have any defined job roles yet.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 mb-12">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="group bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-green-100 p-8 cursor-pointer hover:shadow-2xl hover:scale-102 transition-all duration-300 hover:bg-white/20"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-1 bg-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IconComponent className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">{role.name}</h3>
                        <p className="text-sm text-zinc-300">{role.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-2xl p-4">
                      <p className="text-xs text-orange-500 font-medium mb-1">EXPERIENCE LEVEL</p>
                      <p className="text-sm font-bold text-gray-900">{role.level}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-4">
                      <p className="text-xs text-green-600 font-medium mb-1">SALARY RANGE</p>
                      <p className="text-sm font-bold text-gray-900">{role.avgSalary}</p>
                    </div>
                    <div className="bg-indigo-50 rounded-2xl p-4 col-span-2">
                      <p className="text-xs text-indigo-600 font-medium mb-1">MARKET DEMAND</p>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{role.demand}</p>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            role.demand === "Very High"
                              ? "bg-green-500"
                              : role.demand === "High"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Key Skills */}
                  <div>
                    <p className="text-xs text-zinc-300 font-medium mb-3">KEY SKILLS REQUIRED</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(role.skills) &&
                        role.skills.slice(0, 4).map((skill, index) => (
                          <span
                            key={index}
                            className="text-xs bg-green-500 text-black px-3 py-1 rounded-full border"
                          >
                            {skill}
                          </span>
                        ))}
                      {Array.isArray(role.skills) && role.skills.length > 4 && (
                        <span className="text-xs text-gray-500 px-3 py-1">
                          +{role.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-500">View Skills Roadmap</span>
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-green-500" />
                      </div>
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
            variant="outline"
            onClick={() =>
              navigate(
                createPageUrl("CareerPathPage") +
                  `?course=${encodeURIComponent(selectedCourse)}`
              )
            }
            className="border-green-200 cursor-pointer text-green-500 hover:bg-green-50 px-8 py-3 rounded-2xl"
          >
            ← Back to Career Paths
          </button>
        </div>
      </div>
    </div>
  );
}