import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExpandProfile } from "./ExpandProfile";
import { 
  Trophy, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  Award,
  Star,
  Target,
  TrendingUp,
  Lightbulb,
  BookOpen,
  Loader2
} from "lucide-react";

export default function Result() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [score, setScore] = useState(0);
  const [useAiQuestions, setUseAiQuestions] = useState(false);
  
  // AI Feedback States
  const [aiFeedback, setAiFeedback] = useState(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get('course') || "Computer Science";
    const path = urlParams.get('path') || "fintech";
    const role = urlParams.get('role') || "software-engineer";
    const skill = urlParams.get('skill') || "javascript";
    const scoreParam = parseInt(urlParams.get('score')) || 85;
    const useAi = urlParams.get('useAi') === 'true';
    
    setSelectedCourse(course);
    setSelectedPath(path);
    setSelectedRole(role);
    setSelectedSkill(skill);
    setScore(scoreParam);
    setUseAiQuestions(useAi);

    // Generate AI feedback for the assessment result
    generateAiFeedback(skill, scoreParam, useAi);
  }, []);

  // AI Feedback Generation Function
  const generateAiFeedback = async (skillName, userScore, wasAiGenerated) => {
    setLoadingFeedback(true);
    setFeedbackError(null);

    try {
      const assessmentType = wasAiGenerated ? "AI-generated" : "standard";
      const performanceLevel = userScore >= 90 ? "excellent" : 
                              userScore >= 75 ? "good" : 
                              userScore >= 60 ? "fair" : "needs improvement";

      const message = `Provide personalized feedback for a student who just completed a ${assessmentType} assessment on "${skillName}" and scored ${userScore}%.

CONTEXT:
- Skill assessed: ${skillName}
- Score achieved: ${userScore}%
- Performance level: ${performanceLevel}
- Pass threshold: 75%

GENERATE FEEDBACK WITH:

1. PERFORMANCE ANALYSIS (2-3 sentences):
   - Specific analysis of their ${userScore}% score
   - What this score indicates about their skill level

2. STRENGTHS (2-3 bullet points):
   - What they demonstrated well based on their score
   - Positive aspects to acknowledge

3. AREAS FOR IMPROVEMENT (2-3 bullet points if score < 90%):
   - Specific areas they should focus on
   - Skills/concepts that need more attention

4. NEXT STEPS (3-4 actionable recommendations):
   - Concrete actions to take based on their performance
   - Learning resources or practice suggestions
   - How to build on their current knowledge

5. MOTIVATION MESSAGE (1-2 sentences):
   - Encouraging message appropriate for their score level

FORMAT as JSON:
{
  "analysis": "Performance analysis text...",
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Area 1", "Area 2"], 
  "nextSteps": ["Step 1", "Step 2", "Step 3"],
  "motivation": "Motivational message..."
}

Make the feedback specific to ${skillName} and their ${userScore}% performance. Be encouraging but honest about areas needing work.`;

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

      const feedback = parseFeedbackFromResponse(botResponse);
      
      if (feedback) {
        setAiFeedback(feedback);
        console.log(`Generated AI feedback for ${skillName} with score ${userScore}%`);
      } else {
        throw new Error('Invalid feedback format received');
      }

    } catch (error) {
      console.error(`Error generating feedback for ${skillName}:`, error);
      
      // Try fallback endpoint
      try {
        const message = `Give feedback for ${skillName} assessment with ${userScore}% score. Include analysis, strengths, improvements needed, and next steps.`;
        
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
        const fallbackResponse_text = fallbackData.value || fallbackData.response || fallbackData.output || '';
        
        const feedback = parseFeedbackFromResponse(fallbackResponse_text);
        if (feedback) {
          setAiFeedback(feedback);
        } else {
          throw new Error('Fallback feedback generation failed');
        }

      } catch (fallbackError) {
        setFeedbackError(`Failed to generate feedback: ${error.message}`);
      }
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Function to parse AI response and extract feedback
  const parseFeedbackFromResponse = (aiResponse) => {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.analysis) {
          return parsed;
        }
      }

      // Fallback: Parse manually
      const analysisMatch = aiResponse.match(/analysis["\s:]*([^"]*)/i);
      const strengthsMatch = aiResponse.match(/strengths["\s:]*\[(.*?)\]/is);
const improvementsMatch = aiResponse.match(/improvements["\s:]*\[(.*?)\]/is);
      const nextStepsMatch = aiResponse.match(/nextSteps["\s:]*\[(.*?)\]/is);
      const motivationMatch = aiResponse.match(/motivation["\s:]*([^"]*)/i);

      if (analysisMatch) {
        return {
          analysis: analysisMatch[1].trim(),
          strengths: strengthsMatch ? JSON.parse(`[${strengthsMatch[1]}]`) : [],
          improvements: improvementsMatch ? JSON.parse(`[${improvementsMatch[1]}]`) : [],
          nextSteps: nextStepsMatch ? JSON.parse(`[${nextStepsMatch[1]}]`) : [],
          motivation: motivationMatch ? motivationMatch[1].trim() : ""
        };
      }

      return null;
    } catch (error) {
      console.error('Error parsing feedback:', error);
      return null;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleRetakeTest = () => {
    const testUrl = `/test?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}`;
    navigate(testUrl);
  };

  const handleContinueLearning = () => {
    navigate('/skills');
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBackground = (score) => {
    if (score >= 90) return "bg-green-100";
    if (score >= 75) return "bg-blue-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getPerformanceMessage = (score) => {
    if (score >= 90) return "Excellent Performance!";
    if (score >= 75) return "Good Performance!";
    if (score >= 60) return "Fair Performance";
    return "Needs Improvement";
  };

  const getPerformanceIcon = (score) => {
    if (score >= 90) return <Trophy className="w-8 h-8 text-yellow-500" />;
    if (score >= 75) return <Award className="w-8 h-8 text-blue-500" />;
    if (score >= 60) return <Target className="w-8 h-8 text-yellow-500" />;
    return <XCircle className="w-8 h-8 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Assessment Results</h1>
          <p className="text-zinc-300">
            Your performance on the {selectedSkill} assessment
            {useAiQuestions && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                🤖 AI Generated
              </span>
            )}
          </p>
        </div>

        {/* Score Card */}
        <div className={`bg-white rounded-3xl shadow-2xl p-8 mb-8 ${getScoreBackground(score)}`}>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {getPerformanceIcon(score)}
            </div>
            <h2 className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
              {score}%
            </h2>
            <h3 className={`text-2xl font-semibold mb-2 ${getScoreColor(score)}`}>
              {getPerformanceMessage(score)}
            </h3>
            <p className="text-gray-600 mb-6">
              {score >= 75 ? "Congratulations! You've passed the assessment." : "You'll need to retake the assessment to pass."}
            </p>
            
            {/* Progress Bar */}
            <div className="bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  score >= 90 ? "bg-green-500" :
                  score >= 75 ? "bg-blue-500" :
                  score >= 60 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">Passing score: 75%</p>
          </div>
        </div>

        {/* AI Feedback Section */}
        {loadingFeedback ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-300 p-8 mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
              <h3 className="text-xl font-bold text-blue-400">Generating Personalized Feedback</h3>
            </div>
            <p className="text-zinc-300 text-center">
              Our AI is analyzing your performance and preparing customized recommendations...
            </p>
          </div>
        ) : feedbackError ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-xl font-bold text-red-400">Feedback Generation Failed</h3>
            </div>
            <p className="text-zinc-300">{feedbackError}</p>
          </div>
        ) : aiFeedback ? (
          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-6 h-6 text-blue-500" />
              <h3 className="text-2xl font-bold text-gray-900">
                Personalized AI Feedback
              </h3>
            </div>

            {/* Performance Analysis */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Performance Analysis
              </h4>
              <p className="text-gray-700 leading-relaxed">{aiFeedback.analysis}</p>
            </div>

            {/* Strengths */}
            {aiFeedback.strengths && aiFeedback.strengths.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-green-500" />
                  Your Strengths
                </h4>
                <ul className="space-y-2">
                  {aiFeedback.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {aiFeedback.improvements && aiFeedback.improvements.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {aiFeedback.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {aiFeedback.nextSteps && aiFeedback.nextSteps.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Recommended Next Steps
                </h4>
                <ol className="space-y-3">
                  {aiFeedback.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Motivation Message */}
            {aiFeedback.motivation && (
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-blue-900 font-medium text-center italic">
                  "{aiFeedback.motivation}"
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetakeTest}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Assessment
          </button>
          
          <button
            onClick={handleContinueLearning}
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-semibold transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            Continue Learning
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <ExpandProfile />
          <p className="text-zinc-400 text-sm mt-4">
            Assessment completed on {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}