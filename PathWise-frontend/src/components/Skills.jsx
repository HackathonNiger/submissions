import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { ExpandProfile } from "./ExpandProfile";
import {
  BookOpen,
  ExternalLink,
  CheckCircle,
  Circle,
  ArrowRight,
  Clock,
  Trophy,
  Loader2,
  AlertCircle,
  Video,
  X,
} from "lucide-react";
import skillsData from "../data/SkillsData";

const normalizeRoleKey = (raw) => {
  if (!raw) return "";
  // convert "Frontend Engineer" or "frontendEngineer" to "frontend-engineer"
  return raw
    .toString()
    .trim()
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase to kebab-case
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/_+/g, "-") // underscores to hyphens
    .replace(/-+/g, "-"); // collapse multiple hyphens
};

export default function Skills() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("Computer Science");
  const [selectedPath, setSelectedPath] = useState("fintech");
  const [selectedRole, setSelectedRole] = useState("");
  const [skills, setSkills] = useState([]);
  const [completedSkills, setCompletedSkills] = useState(new Set());
    const [showVideo, setShowVideo] = useState(false);
  
  // AI API related states
  const [skillResources, setSkillResources] = useState({});
  const [loadingResources, setLoadingResources] = useState({});
  const [resourceErrors, setResourceErrors] = useState({});

  const API_BASE_URL = 'http://localhost:3001/api'; // Same as DeliveryAss.jsx and Skillsnew.jsx

  const pageRoutes = useMemo(
    () => ({
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      Assessment: "/assessment",
      ResultPage: "/result",
    }),
    []
  );
 // Extract YouTube video ID from url
  const getYouTubeId = (url) => {
    const urlObj = new URL(url);
    return urlObj.searchParams.get("v");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "Computer Science";
    const path = urlParams.get("path") || "fintech";
    const rawRole = urlParams.get("role") || "";

    setSelectedCourse(course);
    setSelectedPath(path);

    const normalized = normalizeRoleKey(rawRole);
    setSelectedRole(normalized);

    if (
      normalized &&
      skillsData[normalized] &&
      Array.isArray(skillsData[normalized].skills) &&
      skillsData[normalized].skills.length > 0
    ) {
      setSkills(skillsData[normalized].skills);
    } else {
      console.warn(`No skills found for role "${rawRole}" normalized as "${normalized}"`); // for debugging
      setSkills([]);
    }

    // load persisted completed skills for this role+path+course (optional)
    try {
      const key = `completedSkills:${course}:${path}:${normalized}`;
      const saved = sessionStorage.getItem(key);
      if (saved) {
        setCompletedSkills(new Set(JSON.parse(saved)));
      }
    } catch {}
  }, []);

  // persist completedSkills when it changes
  useEffect(() => {
    try {
      const key = `completedSkills:${selectedCourse}:${selectedPath}:${selectedRole}`;
      sessionStorage.setItem(key, JSON.stringify(Array.from(completedSkills)));
    } catch {}
  }, [completedSkills, selectedCourse, selectedPath, selectedRole]);

  // AI API Functions (adapted from Skillsnew.jsx)
  const fetchResourcesForSkill = async (skillId, skillName) => {
    setLoadingResources(prev => ({ ...prev, [skillId]: true }));
    setResourceErrors(prev => ({ ...prev, [skillId]: null }));

    try {
      // Construct the prompt for your AI agent
      const message = `Find REAL, EXISTING learning resources for the skill: "${skillName}". 

CRITICAL: Only provide URLs that you know actually exist. Do NOT generate fake or placeholder URLs.

Please provide exactly:
1. One high-quality online resource (course, article, or guide) with REAL title and REAL URL
2. One YouTube video tutorial with REAL title and REAL URL from an actual channel

If you're not certain about specific URLs, use well-known educational platforms like:
- For resources: MDN, W3Schools, freeCodeCamp, Khan Academy, Coursera, edX
- For videos: Channels like Traversy Media, Programming with Mosh, Academind, Net Ninja

Focus on practical, beginner-friendly resources that can help someone learn this specific skill. 
Format the response as JSON with this structure:
{
  "resource": {
    "title": "Actual Resource Title",
    "url": "https://actual-working-url.com",
    "type": "course/article/guide"
  },
  "video": {
    "title": "Actual Video Title", 
    "url": "https://youtube.com/watch?v=REAL_VIDEO_ID",
    "channel": "Real Channel Name"
  }
}

IMPORTANT: If you cannot provide real URLs, respond with null values instead of fake ones.`;

      // Use the same pattern as DeliveryAss.jsx
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      let botResponse = '';
      
      // Parse response using the same pattern as DeliveryAss.jsx
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        botResponse = data.choices[0].message.content;
      } else if (data.response) {
        botResponse = data.response;
      } else if (data.output) {
        botResponse = data.output;
      } else if (data.value) {
        botResponse = data.value;
      } else if (typeof data === 'string') {
        botResponse = data;
      } else {
        botResponse = 'No response content received from agent';
      }

      // Parse the AI response to extract resource information
      const resources = parseResourcesFromResponse(botResponse);
      
      // If AI resources are invalid, try fallback
      if ((!resources.resource || !resources.video) && !resources.resource?.url && !resources.video?.url) {
        const fallback = getFallbackResources(skillName);
        if (fallback) {
          console.log(`Using fallback resources for ${skillName}`);
          setSkillResources(prev => ({
            ...prev,
            [skillId]: fallback
          }));
          return;
        }
      }
      
      setSkillResources(prev => ({
        ...prev,
        [skillId]: resources
      }));

    } catch (error) {
      console.error(`Error fetching resources for ${skillName}:`, error);
      
      // Try fallback endpoint like DeliveryAss.jsx does
      try {
        const message = `Find learning resources for the skill: "${skillName}". Please provide one online resource and one YouTube video with titles and URLs.`;
        
        const fallbackResponse = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ input_message: message })
        });

        if (!fallbackResponse.ok) {
          throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
        }

        const fallbackData = await fallbackResponse.json();
        const fallbackResponse_text = fallbackData.value || fallbackData.response || fallbackData.output || 'Resource service unavailable';
        
        const resources = parseResourcesFromResponse(fallbackResponse_text);
        setSkillResources(prev => ({
          ...prev,
          [skillId]: resources
        }));

      } catch (fallbackError) {
        setResourceErrors(prev => ({
          ...prev,
          [skillId]: `Failed to fetch resources: ${error.message}`
        }));
      }
    } finally {
      setLoadingResources(prev => ({ ...prev, [skillId]: false }));
    }
  };

  // Fallback resources for common skills
  const getFallbackResources = (skillName) => {
    const fallbacks = {
      'javascript': {
        resource: { title: "JavaScript Guide - MDN", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", type: "guide" },
        video: { title: "JavaScript Tutorial for Beginners", url: "https://youtube.com/watch?v=W6NZfCO5SIk", channel: "Programming with Mosh" }
      },
      'html': {
        resource: { title: "HTML Tutorial - W3Schools", url: "https://www.w3schools.com/html/", type: "course" },
        video: { title: "HTML Full Course - Build a Website Tutorial", url: "https://youtube.com/watch?v=pQN-pnXPaVg", channel: "freeCodeCamp.org" }
      },
      'css': {
        resource: { title: "CSS Tutorial - W3Schools", url: "https://www.w3schools.com/css/", type: "course" },
        video: { title: "CSS Tutorial - Zero to Hero", url: "https://youtube.com/watch?v=1Rs2ND1ryYc", channel: "freeCodeCamp.org" }
      },
      'react': {
        resource: { title: "React Documentation", url: "https://react.dev/learn", type: "guide" },
        video: { title: "React Course - Beginner's Tutorial for React JavaScript Library", url: "https://youtube.com/watch?v=bMknfKXIFA8", channel: "freeCodeCamp.org" }
      }
    };

    const skillKey = skillName.toLowerCase().replace(/[^a-z]/g, '');
    for (const [key, resources] of Object.entries(fallbacks)) {
      if (skillKey.includes(key)) {
        return resources;
      }
    }
    return null;
  };

  // Function to validate YouTube URLs (basic check)
  const isValidYouTubeUrl = (url) => {
    if (!url) return false;
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  };

  // Function to validate general URLs
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Function to parse AI response and extract resource information
  const parseResourcesFromResponse = (aiResponse) => {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      // Fallback: Parse manually if JSON parsing fails
      const resourceMatch = aiResponse.match(/(?:resource|course|article|guide).*?title[:\s]*["']([^"']+)["'].*?url[:\s]*["']([^"']+)["']/is);
      const videoMatch = aiResponse.match(/(?:video|youtube).*?title[:\s]*["']([^"']+)["'].*?url[:\s]*["']([^"']+)["']/is);

      return {
        resource: resourceMatch && isValidUrl(resourceMatch[2]) ? {
          title: resourceMatch[1],
          url: resourceMatch[2],
          type: "resource"
        } : null,
        video: videoMatch && isValidYouTubeUrl(videoMatch[2]) ? {
          title: videoMatch[1],
          url: videoMatch[2],
          channel: "Unknown Channel"
        } : null
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return { resource: null, video: null };
    }
  };

  const toggleSkillCompletion = (skillId) => {
    setCompletedSkills((prev) => {
      const copy = new Set(prev);
      if (copy.has(skillId)) copy.delete(skillId);
      else copy.add(skillId);
      return copy;
    });
  };

  const createPageUrl = (pageName) => {
    return pageRoutes[pageName] || "/";
  };

  const handleTakeAssessment = (skillId) => {
    navigate(
      createPageUrl("Assessment") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${encodeURIComponent(
          selectedPath
        )}&role=${encodeURIComponent(selectedRole)}&skill=${encodeURIComponent(skillId)}`
    );
  };

  const handleFetchResources = (skillId, skillName) => {
    if (!skillResources[skillId] && !loadingResources[skillId]) {
      fetchResourcesForSkill(skillId, skillName);
    }
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const completionPercentage =
    skills.length > 0
      ? Math.round((completedSkills.size / skills.length) * 100)
      : 0;

  const roleData =
    selectedRole && skillsData[selectedRole]
      ? skillsData[selectedRole]
      : { roleName: selectedRole ? selectedRole.replace(/-/g, " ") : "Unknown Role" };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-12">
            <h1 className="text-2xl font-bold text-white">PATHWISE AI</h1>
            <ExpandProfile />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Skills for{" "}
            <span className="bg-green-500 bg-clip-text text-transparent">
              {roleData.roleName}
            </span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Master these essential skills to become job-ready. Track your progress and get AI-curated learning resources.
          </p>
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-green-100 p-8 mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Learning Progress</h3>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span className="font-bold text-white">
                  {completedSkills.size}/{skills.length} Skills
                </span>
              </div>
            </div>
            <progress
              value={completionPercentage}
              className="w-full h-4 rounded-lg overflow-hidden [&::-webkit-progress-bar]:bg-gray-200 [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-green-500 [&::-webkit-progress-value]:to-orange-500"
              max="100"
            />
            <p className="text-sm text-zinc-300">{Math.round(completionPercentage)}% Complete</p>
          </div>
        </div>

        {/* Skills List or Empty State */}
        {skills.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 text-center">
            <p className="text-lg font-semibold text-red-400">No skills under this.</p>
            <p className="text-sm text-zinc-300 mt-2">
              The selected role ({selectedRole || "none"}) doesn&apos;t have any defined skills yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
            {skills.map((skill) => {
              const isCompleted = completedSkills.has(skill.id);
              const resources = skillResources[skill.id];
              const isLoadingResources = loadingResources[skill.id];
              const resourceError = resourceErrors[skill.id];

              return (
                <div
                  key={skill.id}
                  className="bg-green-50 backdrop-blur-xl rounded-3xl shadow-xl border border-purple-100 p-8 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex items-start gap-6">
                    <button onClick={() => toggleSkillCompletion(skill.id)} className="mt-1 flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-7 h-7 text-green-500 hover:text-green-600 transition-colors" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-300 hover:text-orange-500 transition-colors" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{skill.name}</h3>
                          <p className="text-gray-600 mb-3">{skill.description}</p>

                          <div className="flex flex-wrap gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(
                                skill.difficulty
                              )}`}
                            >
                              {skill.difficulty}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {skill.timeEstimate}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3">
                          {isCompleted && (
                            <button
                              onClick={() => handleTakeAssessment(skill.id)}
                              size="sm"
                              className="bg-green-500 cursor-pointer hover:from-purple-700 hover:to-green-700 text-white px-6 py-2 rounded-xl"
                            >
                              Take Assessment
                            </button>
                          )}
                          <button
                            variant="outline"
                            size="sm"
                            className="border-orange-200 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-xl"
                            onClick={() => toggleSkillCompletion(skill.id)}
                          >
                            {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            🤖 AI-Curated Learning Resources
                          </h4>
                          {!resources && !isLoadingResources && !resourceError && (
                            <button
                              onClick={() => handleFetchResources(skill.id, skill.name)}
                              className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition-colors"
                            >
                              Get Resources
                            </button>
                          )}
                        </div>

                        {isLoadingResources ? (
                          <div className="flex justify-center items-center h-20 bg-white rounded-xl">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                              <p className="text-gray-600">Fetching personalized resources from AI...</p>
                            </div>
                          </div>
                        ) : resourceError ? (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                            <div className="flex items-center gap-2 text-sm text-red-600 mb-2">
                              <AlertCircle className="w-4 h-4" />
                              {resourceError}
                            </div>
                            <button
                              onClick={() => fetchResourcesForSkill(skill.id, skill.name)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Try again
                            </button>
                          </div>
                        ) : resources ? (
                          <div className="space-y-3">
                            {/* Online Resource */}
                            {resources.resource && (
                              <div 
                                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group cursor-pointer"
                                onClick={() => openExternalLink(resources.resource.url)}
                              >
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <div className="flex-1">
                                  <span className="text-sm font-medium text-blue-700 block">
                                    {resources.resource.title}
                                  </span>
                                  <span className="text-xs text-blue-500">
                                    {resources.resource.type?.toUpperCase() || 'RESOURCE'}
                                  </span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
                              </div>
                            )}

                            {/* YouTube Video */}
                              {resources.video && (
        <div
          className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors group cursor-pointer"
          onClick={() => setShowVideo(true)}
        >
          <Video className="w-4 h-4 text-red-500" />
          <div className="flex-1">
            <span className="text-sm font-medium text-red-700 block">
              {resources.video.title}
            </span>
            <span className="text-xs text-red-500">
              YOUTUBE VIDEO {resources.video.channel && `• ${resources.video.channel}`}
            </span>
          </div>
          <ExternalLink className="w-4 h-4 text-red-500 group-hover:text-red-700" />
        </div>
      )}

      {/* Popup Modal */}
      {showVideo && (
        <div className="fixed bottom-4 left-4 bg-white rounded-xl shadow-lg border p-2 w-80 z-50">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-black"
            onClick={() => setShowVideo(false)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Embedded YouTube Video */}
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${getYouTubeId(resources.video.url)}`}
              title={resources.video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
                             
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <p className="text-sm text-gray-500 text-center">
                              Click "Get Resources" to fetch AI-curated learning materials for this skill
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            variant="outline"
            onClick={() =>
              navigate(
                createPageUrl("JobRolePage") +
                  `?course=${encodeURIComponent(selectedCourse)}&path=${encodeURIComponent(selectedPath)}`
              )
            }
            className="border-green-200 text-green-500 hover:bg-green-50 px-8 py-3 rounded-2xl"
          >
            ← Back to Job Roles
          </button>

          {completionPercentage === 100 && (
            <button
              onClick={() =>
                navigate(
                  createPageUrl("ResultPage") +
                    `?course=${encodeURIComponent(selectedCourse)}&path=${encodeURIComponent(
                      selectedPath
                    )}&role=${encodeURIComponent(selectedRole)}`
                )
              }
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl flex items-center gap-2"
            >
              View Career Roadmap
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
        <SkillTracker skills={skills} completedSkills={completedSkills} />
      </div>
    </div>
  );
}

const SkillTracker = ({ skills, completedSkills }) => {
  const [showCongrats, setShowCongrats] = useState(false);
  const navigate = useNavigate();

  const completionPercentage =
    skills.length > 0
      ? Math.round((completedSkills.size / skills.length) * 100)
      : 0;

  useEffect(() => {
    if (completionPercentage === 100) {
      setShowCongrats(true);
    }
  }, [completionPercentage]);

  const handleClose = () => setShowCongrats(false);

  const handleContinue = () => {
    navigate('/project-page');
  };

  return (
    <div className="p-4">
      <p className="text-lg font-medium">Completion: {completionPercentage}%</p>

      <AnimatePresence>
        {showCongrats && (
          <motion.div
            className="fixed inset-0  backdrop-blur  flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white shadow-2xl rounded-lg items-center flex flex-col justify-center   text-center h-[25em] w-[37em]"
              initial={{ y: "-100vh", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-100vh", opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-6xl  font-bold text-green-500 mb-2">🎉Congratulations!</h2>
              <p className="text-gray-700 font-semibold text-2xl mb-4">You have completed all skills.</p>
             <div className="flex justify-between gap-30 pt-10">
              <button
                className="border-green-600 cursor-pointer border-2 bg-black text-white hover:scale-110 transform  hover:text-white px-4 py-3 rounded-2xl mr-2 transition"
                onClick={handleContinue}
              >
                Continue to Project Page
              </button>
              <button
                className=" border-2 cursor-pointer px-10 rounded-2xl text-sm "
                onClick={handleClose}
              >
                Close
              </button>
              </div> 
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};