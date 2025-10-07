import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import roleProjectSets from '../data/roleProjectSets';
import { ExpandProfile } from "./ExpandProfile";
import {
  CheckCircle2,
  Lock,
  Play,
  Award,
  Code,
  Zap,
  Brain,
  Badge,
  ArrowRight,
  Clock,
  Trophy,
  X,
  Star,
  Target,
  Monitor,
  ImageIcon,
  ChevronRight,
  Users,
  Briefcase,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

// Helper function to enhance level data with UI properties
const enhanceLevels = (data) => {
  data.beginner.icon = Code;
  data.beginner.color = 'from-emerald-500 to-teal-600';
  data.beginner.bgColor = 'bg-emerald-50';
  data.beginner.textColor = 'text-emerald-700';
  data.beginner.borderColor = 'border-emerald-200';

  data.intermediate.icon = Zap;
  data.intermediate.color = 'from-blue-500 to-indigo-600';
  data.intermediate.bgColor = 'bg-blue-50';
  data.intermediate.textColor = 'text-blue-700';
  data.intermediate.borderColor = 'border-blue-200';

  data.advanced.icon = Brain;
  data.advanced.color = 'from-purple-500 to-pink-600';
  data.advanced.bgColor = 'bg-purple-50';
  data.advanced.textColor = 'text-purple-700';
  data.advanced.borderColor = 'border-purple-200';

  return data;
};

export default function ProjectStage() {
  // Get role data
  const roleId = 'frontend-developer';
  const initialData = useMemo(() => {
    const rawData = roleProjectSets[roleId] || roleProjectSets['frontend-developer'];
    return enhanceLevels(JSON.parse(JSON.stringify(rawData)));
  }, [roleId]);

  // State management
  const [projectData, setProjectData] = useState(initialData);
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [currentView, setCurrentView] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectForWork, setSelectedProjectForWork] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  // AI Code Validation States
  const [userCode, setUserCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // API Configuration (same as Skillsnew.jsx)
  const API_BASE_URL = 'http://localhost:3001/api';

  // AI Code Validation Functions
  const validateCodeWithAI = async (code, project) => {
    setIsValidatingCode(true);
    setValidationResult(null);
    setValidationError(null);

    try {
      // Construct detailed validation prompt
      const validationPrompt = `You are an expert code reviewer and validator. Please analyze the following code submission for a ${project.difficulty} level project.

PROJECT DETAILS:
- Title: ${project.title}
- Description: ${project.description}
- Technologies Required: ${project.technologies.join(', ')}
- Learning Objectives: ${project.objectives?.join(', ') || 'Not specified'}

USER'S CODE SUBMISSION:
\`\`\`
${code}
\`\`\`

VALIDATION REQUIREMENTS:
Please provide a comprehensive code review and validation in JSON format with the following structure:

{
  "isValid": boolean,
  "score": number (0-100),
  "feedback": {
    "overall": "Overall assessment of the code",
    "strengths": ["Array of positive aspects"],
    "improvements": ["Array of areas for improvement"],
    "errors": ["Array of critical errors if any"],
    "suggestions": ["Array of helpful suggestions"]
  },
  "technicalAnalysis": {
    "correctness": "Assessment of code correctness",
    "bestPractices": "Assessment of coding best practices",
    "completeness": "Assessment of feature completeness",
    "codeQuality": "Assessment of code quality and structure"
  },
  "passed": boolean,
  "nextSteps": "Recommendations for next steps"
}

IMPORTANT VALIDATION CRITERIA:
1. Does the code meet the project requirements?
2. Are the required technologies used correctly?
3. Does it fulfill the learning objectives?
4. Is the code syntactically correct?
5. Does it follow best practices for the technologies used?
6. Is the code complete and functional?
7. Are there any security concerns or bugs?

Be thorough but constructive in your feedback. If the code passes basic requirements, mark it as valid even if there are minor improvements to suggest.`;

      // Make API call using the same pattern as Skillsnew.jsx
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: validationPrompt }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      let botResponse = '';
      
      // Parse response using the same pattern as Skillsnew.jsx
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
        botResponse = 'No validation response received from AI';
      }

      // Parse the AI validation response
      const validation = parseValidationResponse(botResponse);
      setValidationResult(validation);

    } catch (error) {
      console.error('Error validating code with AI:', error);
      
      // Try fallback endpoint
      try {
        const fallbackPrompt = `Review this code for a ${project.title} project. Code: ${code}. Please provide feedback on correctness and suggestions for improvement.`;
        
        const fallbackResponse = await fetch(`${API_BASE_URL}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ input_message: fallbackPrompt })
        });

        if (!fallbackResponse.ok) {
          throw new Error(`HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}`);
        }

        const fallbackData = await fallbackResponse.json();
        const fallbackText = fallbackData.value || fallbackData.response || fallbackData.output || 'Validation service unavailable';
        
        const validation = parseValidationResponse(fallbackText);
        setValidationResult(validation);

      } catch (fallbackError) {
        setValidationError(`Code validation failed: ${error.message}`);
      }
    } finally {
      setIsValidatingCode(false);
    }
  };

  // Parse AI validation response
  const parseValidationResponse = (aiResponse) => {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }

      // Fallback: Create basic validation from text response
      const isPositive = /good|correct|valid|well|excellent|great|pass/i.test(aiResponse);
      const hasErrors = /error|wrong|incorrect|fail|issue|problem/i.test(aiResponse);

      return {
        isValid: isPositive && !hasErrors,
        score: isPositive ? (hasErrors ? 65 : 85) : 45,
        feedback: {
          overall: aiResponse.substring(0, 200) + '...',
          strengths: isPositive ? ['Code shows good understanding'] : [],
          improvements: hasErrors ? ['Please review the feedback and make corrections'] : [],
          errors: hasErrors ? ['Some issues were identified in the code'] : [],
          suggestions: ['Continue practicing and refining your code']
        },
        technicalAnalysis: {
          correctness: isPositive ? 'Generally correct' : 'Needs improvement',
          bestPractices: 'Review recommended',
          completeness: 'Partial assessment',
          codeQuality: isPositive ? 'Acceptable' : 'Needs work'
        },
        passed: isPositive && !hasErrors,
        nextSteps: isPositive ? 'Great work! Continue to the next project.' : 'Please review the feedback and try again.'
      };
    } catch (error) {
      console.error('Error parsing validation response:', error);
      return {
        isValid: false,
        score: 0,
        feedback: {
          overall: 'Unable to validate code properly. Please check your code and try again.',
          strengths: [],
          improvements: ['Code validation encountered an error'],
          errors: ['Validation service error'],
          suggestions: ['Please try submitting again or check your code syntax']
        },
        technicalAnalysis: {
          correctness: 'Unable to assess',
          bestPractices: 'Unable to assess',
          completeness: 'Unable to assess',
          codeQuality: 'Unable to assess'
        },
        passed: false,
        nextSteps: 'Please try validating your code again.'
      };
    }
  };

  // Handle code testing
  const handleTestCode = () => {
    if (!userCode.trim()) {
      setValidationError('Please write some code before testing.');
      return;
    }
    validateCodeWithAI(userCode, selectedProjectForWork);
  };

  // Handle code submission and project completion
  const handleSubmitCode = () => {
    if (validationResult && validationResult.passed) {
      handleProjectComplete();
    } else {
      setValidationError('Please fix the issues in your code before submitting.');
    }
  };

  // Utility functions (keeping existing ones)
  const toggleProjectCompletion = (levelKey, projectId) => {
    setProjectData(prev => {
      const updatedLevel = { ...prev[levelKey] };
      updatedLevel.projects = updatedLevel.projects.map(p =>
        p.id === projectId ? { ...p, completed: !p.completed } : p
      );
      return {
        ...prev,
        [levelKey]: updatedLevel,
      };
    });
  };

  const getLevelProgress = (levelKey) => {
    const projects = projectData[levelKey]?.projects || [];
    const completed = projects.filter((p) => p.completed).length;
    const total = projects.length;
    const percentage = total === 0 ? 0 : (completed / total) * 100;
    return { completed, total, percentage };
  };

  const levelKeys = ['beginner', 'intermediate', 'advanced'];
  const overallCompleted = levelKeys.reduce((sum, key) => sum + getLevelProgress(key).completed, 0);
  const overallTotal = levelKeys.reduce((sum, key) => sum + getLevelProgress(key).total, 0);
  const overallPercentage = overallTotal === 0 ? 0 : (overallCompleted / overallTotal) * 100;

  const canAccessLevel = (level) => {
    if (level === 'beginner') return true;
    if (level === 'intermediate') {
      return getLevelProgress('beginner').percentage === 100;
    }
    if (level === 'advanced') {
      return getLevelProgress('intermediate').percentage === 100;
    }
    return false;
  };

  const isCurrentLevelComplete = () => {
    return getLevelProgress(currentLevel).percentage === 100;
  };

  const getNextLevel = () => {
    const currentIndex = levelKeys.indexOf(currentLevel);
    return currentIndex < levelKeys.length - 1 ? levelKeys[currentIndex + 1] : null;
  };

  // Event handlers
  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const handleStartProject = () => {
    if (selectedProject) {
      setSelectedProjectForWork(selectedProject);
      setCurrentView('workspace');
      setShowProjectModal(false);
      // Reset workspace state
      setUserCode('');
      setValidationResult(null);
      setValidationError(null);
    }
  };

  const handleProjectComplete = () => {
    if (selectedProjectForWork) {
      toggleProjectCompletion(currentLevel, selectedProjectForWork.id);
    }
    setCurrentView('projects');
    setSelectedProjectForWork(null);
    setUserCode('');
    setValidationResult(null);
    setValidationError(null);
  };

  const handleBackToProjects = () => {
    setCurrentView('projects');
    setSelectedProjectForWork(null);
    setUserCode('');
    setValidationResult(null);
    setValidationError(null);
  };

  // Component definitions
  const ProjectModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={() => setShowProjectModal(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject?.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Badge variant="outline" className="text-xs">
                  {selectedProject?.difficulty}
                </Badge>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedProject?.duration}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowProjectModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Project Description</h3>
              <p className="text-gray-600 leading-relaxed">{selectedProject?.description}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Learning Objectives</h3>
              <div className="space-y-2">
                {selectedProject?.objectives?.map((objective, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{objective}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject?.technologies?.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedProject?.hasVisual && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Expected Output</h3>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Monitor className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Project preview will be shown here</p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowProjectModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartProject}
                className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg hover:scale-105 cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Project
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const WorkspaceView = () => (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToProjects}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">{selectedProjectForWork.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {selectedProjectForWork.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {selectedProjectForWork.difficulty || 'Beginner'}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {validationResult && validationResult.passed && (
                <button
                  onClick={handleSubmitCode}
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Project
                </button>
              )}
              <button
                onClick={() => setValidationResult(null)}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Workspace Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Instructions */}
            <div className="bg-white/5 rounded-3xl p-6 border border-green-700">
              <h2 className="text-xl font-bold text-white mb-4">Project Instructions</h2>
              <div className="space-y-4">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Description</h3>
                  <p className="text-gray-300 text-sm">{selectedProjectForWork.description}</p>
                </div>
                
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Learning Objectives</h3>
                  <div className="space-y-2">
                    {selectedProjectForWork.objectives?.map((obj, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <Target className="w-4 h-4 text-green-400" />
                        {obj}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="font-semibold text-white mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProjectForWork.technologies?.map((tech, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-600/20 text-green-300 text-xs rounded border border-blue-600/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Code Editor Area */}
            <div className="bg-white/5 rounded-3xl border border-green-700 overflow-hidden">
              <div className="bg-gray-700/50 px-4 py-3 border-b border-gray-600">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300 font-medium">Code Editor</span>
                </div>
              </div>
              
              <div className="p-4">
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  placeholder="Start writing your code here..."
                  className="w-full h-96 bg-gray-900 text-gray-100 font-mono text-sm border border-gray-600 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
                />
              </div>

              <div className="bg-gray-700/50 px-4 py-3 border-t border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {isValidatingCode ? 'AI is validating your code...' : 'AI will validate your code when you test it'}
                  </span>
                  <button 
                    onClick={handleTestCode}
                    disabled={isValidatingCode || !userCode.trim()}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isValidatingCode ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Test Code
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Validation Results */}
          {(validationResult || validationError) && (
            <div className="mt-8">
              <div className="bg-white/5 rounded-3xl p-6 border border-green-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  🤖 AI Code Validation Results
                  {validationResult?.passed && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {validationResult && !validationResult.passed && <XCircle className="w-5 h-5 text-red-400" />}
                </h3>
                
                {validationError ? (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span className="font-semibold">Validation Error</span>
                    </div>
                    <p className="text-red-300 text-sm">{validationError}</p>
                  </div>
                ) : validationResult ? (
                  <div className="space-y-4">
                    {/* Score and Overall Status */}
                    <div className={`p-4 rounded-lg border ${
                      validationResult.passed 
                        ? 'bg-green-500/10 border-green-500/30' 
                        : 'bg-yellow-500/10 border-yellow-500/30'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-semibold ${
                          validationResult.passed ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {validationResult.passed ? '✅ Code Validation Passed!' : '⚠️ Code Needs Improvement'}
                        </span>
                        <span className="text-white font-bold text-lg">
                          Score: {validationResult.score}/100
                        </span>
                      </div>
                      <p className={`text-sm ${
                        validationResult.passed ? 'text-green-300' : 'text-yellow-300'
                      }`}>
                        {validationResult.feedback.overall}
                      </p>
                    </div>

                    {/* Detailed Feedback */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Strengths */}
                      {validationResult.feedback.strengths.length > 0 && (
                        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                          <h4 className="font-semibold text-green-400 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4" />
                            Strengths
                          </h4>
                          <ul className="space-y-1">
                            {validationResult.feedback.strengths.map((strength, index) => (
                              <li key={index} className="text-green-300 text-sm">• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Improvements */}
                      {validationResult.feedback.improvements.length > 0 && (
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            Areas for Improvement
                          </h4>
                          <ul className="space-y-1">
                            {validationResult.feedback.improvements.map((improvement, index) => (
                              <li key={index} className="text-blue-300 text-sm">• {improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Errors */}
                      {validationResult.feedback.errors.length > 0 && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                          <h4 className="font-semibold text-red-400 mb-2 flex items-center gap-2">
                            <XCircle className="w-4 h-4" />
                            Critical Issues
                          </h4>
                          <ul className="space-y-1">
                            {validationResult.feedback.errors.map((error, index) => (
                              <li key={index} className="text-red-300 text-sm">• {error}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Suggestions */}
                      {validationResult.feedback.suggestions.length > 0 && (
                        <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                          <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                            <Star className="w-4 h-4" />
                            Suggestions
                          </h4>
                          <ul className="space-y-1">
                            {validationResult.feedback.suggestions.map((suggestion, index) => (
                              <li key={index} className="text-purple-300 text-sm">• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Next Steps */}
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
                      <h4 className="font-semibold text-gray-300 mb-2">Next Steps</h4>
                      <p className="text-gray-400 text-sm">{validationResult.nextSteps}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Project Preview */}
          {selectedProjectForWork.hasVisual && (
            <div className="mt-8">
              <div className="bg-white/5 rounded-3xl p-6 border border-green-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Project Preview
                </h3>
                <div className="bg-gray-900 rounded-lg p-8 border border-gray-700">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Your project output will appear here when you run the code</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProjectsView = () => {
    const currentLevelData = projectData[currentLevel];
    const progress = getLevelProgress(currentLevel);
    const nextLevel = getNextLevel();

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="container mx-auto max-w-7xl">
          {/* Header with role info and overall progress */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Frontend Developer Projects
                </h1>
                <p className="text-gray-600">
                  Build real-world projects to master frontend development
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Overall Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${overallPercentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {overallCompleted}/{overallTotal}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <Trophy className="w-8 h-8 mx-auto text-yellow-500 mb-1" />
                  <p className="text-xs text-gray-600">
                    {Math.round(overallPercentage)}% Complete
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Level Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 p-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              {levelKeys.map((levelKey) => {
                const levelData = projectData[levelKey];
                const levelProgress = getLevelProgress(levelKey);
                const canAccess = canAccessLevel(levelKey);
                const IconComponent = levelData.icon;

                return (
                  <button
                    key={levelKey}
                    onClick={() => canAccess && setCurrentLevel(levelKey)}
                    disabled={!canAccess}
                    className={`
                      flex-1 min-w-[200px] p-4 rounded-xl font-medium transition-all duration-200
                      ${currentLevel === levelKey
                        ? `${levelData.bgColor} ${levelData.textColor} ${levelData.borderColor} border-2 shadow-md`
                        : canAccess
                        ? 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {canAccess ? (
                          <IconComponent className="w-5 h-5" />
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                        <span className="capitalize font-semibold">{levelKey}</span>
                      </div>
                      {levelProgress.percentage === 100 && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{levelProgress.completed}/{levelProgress.total} completed</span>
                        <span>{Math.round(levelProgress.percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`bg-gradient-to-r ${levelData.color} h-1.5 rounded-full transition-all duration-300`}
                          style={{ width: `${levelProgress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Level Content */}
          <div className="grid gap-8">
            {/* Level Header */}
            <div className={`${currentLevelData.bgColor} rounded-3xl p-8 border-2 ${currentLevelData.borderColor}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-gradient-to-r ${currentLevelData.color} rounded-2xl text-white`}>
                    <currentLevelData.icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold ${currentLevelData.textColor} capitalize`}>
                      {currentLevel} Level
                    </h2>
                    <p className={`${currentLevelData.textColor}/80`}>
                      {currentLevelData.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${currentLevelData.textColor}`}>
                    {progress.completed}/{progress.total}
                  </div>
                  <p className={`text-sm ${currentLevelData.textColor}/70`}>
                    Projects Completed
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={currentLevelData.textColor}>Progress</span>
                  <span className={currentLevelData.textColor}>
                    {Math.round(progress.percentage)}%
                  </span>
                </div>
                <div className="w-full bg-white/50 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${currentLevelData.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Level Completion Message */}
              {isCurrentLevelComplete() && nextLevel && (
                <div className="mt-6 p-4 bg-white/70 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-yellow-600" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Congratulations! Level Complete
                        </p>
                        <p className="text-sm text-gray-600">
                          You can now unlock the {nextLevel} level
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentLevel(nextLevel)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                      Unlock {nextLevel}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Projects Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentLevelData.projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {project.completed ? (
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 border-2 border-gray-300 rounded-full group-hover:border-blue-400 transition-colors" />
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-4 h-4" />
                        {project.duration}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Users className="w-4 h-4" />
                        {project.difficulty}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {project.technologies?.slice(0, 3).map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {project.completed ? 'Completed' : 'Start Project'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* No Projects Message */}
            {currentLevelData.projects.length === 0 && (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No projects available
                </h3>
                <p className="text-gray-500">
                  Projects for this level are coming soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Main render
  return (
    <div>
      <AnimatePresence mode="wait">
        {currentView === 'projects' && <ProjectsView />}
        {currentView === 'workspace' && <WorkspaceView />}
      </AnimatePresence>

      <AnimatePresence>
        {showProjectModal && selectedProject && <ProjectModal />}
      </AnimatePresence>

      <ExpandProfile />
    </div>
  );
}