import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpandProfile } from "./ExpandProfile";
import { 
  Brain, 
  Clock, 
  Target, 
  ArrowRight,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function Assesment() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSelectedCourse(urlParams.get('course') || "Computer Science");
    setSelectedPath(urlParams.get('path') || "fintech");
    setSelectedRole(urlParams.get('role') || "software-engineer");
    setSelectedSkill(urlParams.get('skill') || "javascript");
  }, []);
const createPageUrl = (pageName) => {
  const pageRoutes = {
    SkillsPage: "/skills",          
    CareerPathPage: "/career-path",   
    JobRolePage: "/job-roles",       
    Assessment: "/assessment",       
    Result: "/result" ,          
     TestPage: "/test",            
  };

  return pageRoutes[pageName] || "/";
};

  const handleStartAssessment = () => {
    navigate(createPageUrl("TestPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}`);
  };

  const skillNames = {
    javascript: "JavaScript Fundamentals",
    react: "React Development", 
    nodejs: "Node.js Backend",
    databases: "Database Management",
    git: "Version Control (Git)",
    "network-security": "Network Security",
    "incident-response": "Incident Response",
    "risk-assessment": "Risk Assessment"
  };

  const skillName = skillNames[selectedSkill] || "Programming Skill";

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-12">
                <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
                <ExpandProfile />
            </div>
          
          <h1 className="text-5xl  font-bold text-white mb-6">
            Skill Assessment Ready! 🎯
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Great job marking <span className="font-semibold text-green-500">{skillName}</span> as completed! 
            Now let's test your knowledge to verify your understanding.
          </p>
        </div>

        {/* Assessment Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 p-8 md:p-12 mb-8">
          {/* Skill Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-3 rounded-2xl border border-purple-200">
              <div className="w-8 h-8 bg-green-500  rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold ">{skillName} Assessment</span>
            </div>
          </div>

          {/* Assessment Details */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">20 Questions</h3>
              <p className="text-sm text-gray-600">Multiple choice format</p>
            </div>

            <div className="text-center p-6 bg-green-50 rounded-2xl border border-green-200">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">30 Minutes</h3>
              <p className="text-sm text-gray-600">Recommended time limit</p>
            </div>

            <div className="text-center p-6 bg-purple-50 rounded-2xl border border-purple-200">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">75% to Pass</h3>
              <p className="text-sm text-gray-600">Minimum passing score</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-amber-900 mb-2">Assessment Guidelines</h4>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Answer all questions to the best of your ability</li>
                  <li>• You can review and change answers before submitting</li>
                  <li>• Passing score is 75% (15 out of 20 questions)</li>
                  <li>• You can retake the assessment if needed</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              variant="outline"
              onClick={() => navigate(createPageUrl("SkillsPage") + `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}`)}
              className="border-gray-200 text-zinc-300 cursor-pointer hover:text-black hover:bg-green-50 px-8 py-3 rounded-2xl"
            >
              ← Back to Skills
            </button>
            
            <button
              onClick={handleStartAssessment}
              size="lg"
              className="bg-green-500 flex cursor-pointer hover:from-green-700 hover:to-indigo-700 text-white px-15 py-4 text-lg font-semibold rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Start Assessment
              <ArrowRight className="w-5 h-5 ml-2 mt-1.5" />
            </button>
          </div>
        </div>

        {/* Confidence Boost */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-green-500 bg-purple-50 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">You've got this! Take your time and trust your knowledge.</span>
          </div>
        </div>
      </div>
    </div>
  );
}