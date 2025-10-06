import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Circle,
  Flag,
  XCircle,
  Loader2,
  AlertCircle
} from "lucide-react";
import assessmentQuestions from "../data/assessmentQuestions";

export default function Test() {
  const navigate = useNavigate();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // AI API related states
  const [aiQuestions, setAiQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionError, setQuestionError] = useState(null);
  const [useAiQuestions, setUseAiQuestions] = useState(false);

  const API_BASE_URL = 'http://localhost:3001/api';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const course = urlParams.get("course") || "";
    const path = urlParams.get("path") || "";
    const role = urlParams.get("role") || "";
    const skill = urlParams.get("skill") || "";

    setSelectedCourse(course);
    setSelectedPath(path);
    setSelectedRole(role);
    setSelectedSkill(skill);

    // Auto-fetch AI questions if no predefined questions exist
    if (skill) {
      const predefinedQuestions = assessmentQuestions[skill];
      if (!predefinedQuestions || predefinedQuestions.length === 0) {
        fetchQuestionsForSkill(skill);
      }
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  // AI Question Generation Function
  const fetchQuestionsForSkill = async (skillName) => {
    setLoadingQuestions(true);
    setQuestionError(null);

    try {
      const message = `Generate 20 multiple-choice assessment questions for the skill: "${skillName}".

REQUIREMENTS:
1. Create exactly 20 questions that test practical knowledge and understanding
2. Each question should have exactly 4 options (A, B, C, D)
3. Questions should range from beginner to intermediate difficulty
4. Focus on real-world application and best practices
5. Include both conceptual and practical questions

FORMAT: Return ONLY a valid JSON array with this exact structure:
[
  {
    "id": 1,
    "question": "What is the correct way to declare a variable in JavaScript?",
    "options": [
      "var myVariable = 'hello';",
      "variable myVariable = 'hello';", 
      "declare myVariable = 'hello';",
      "myVariable := 'hello';"
    ],
    "correctAnswer": 0
  },
  {
    "id": 2,
    "question": "Which method is used to add an element to the end of an array?",
    "options": [
      "append()",
      "push()",
      "add()",
      "insert()"
    ],
    "correctAnswer": 1
  }
]

IMPORTANT: 
- correctAnswer should be the index (0-3) of the correct option
- Make questions specific to ${skillName}
- Ensure questions are clear and unambiguous
- Test different aspects of the skill
- Return ONLY the JSON array, no additional text`;

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

      const questions = parseQuestionsFromResponse(botResponse);
      
      if (questions.length > 0) {
        setAiQuestions(questions);
        setUseAiQuestions(true);
        console.log(`Generated ${questions.length} AI questions for ${skillName}`);
      } else {
        throw new Error('No valid questions generated');
      }

    } catch (error) {
      console.error(`Error fetching questions for ${skillName}:`, error);
      
      // Try fallback endpoint
      try {
        const message = `Create 20 multiple-choice questions about ${skillName}. Return as JSON array with id, question, options (array of 4), and correctAnswer (index 0-3).`;
        
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
        
        const questions = parseQuestionsFromResponse(fallbackResponse_text);
        if (questions.length > 0) {
          setAiQuestions(questions);
          setUseAiQuestions(true);
        } else {
          throw new Error('Fallback question generation failed');
        }

      } catch (fallbackError) {
        setQuestionError(`Failed to generate questions: ${error.message}`);
      }
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Function to parse AI response and extract questions
  const parseQuestionsFromResponse = (aiResponse) => {
    try {
      // Try to extract JSON array from the response
      const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed)) {
          // Validate question structure
          const validQuestions = parsed.filter(q => 
            q.id !== undefined && 
            q.question && 
            Array.isArray(q.options) && 
            q.options.length === 4 &&
            typeof q.correctAnswer === 'number' &&
            q.correctAnswer >= 0 && 
            q.correctAnswer <= 3
          );
          return validQuestions;
        }
      }

      // Fallback: Try to parse multiple JSON objects
      const questionMatches = aiResponse.match(/\{[^}]*"question"[^}]*\}/g);
      if (questionMatches) {
        const questions = [];
        questionMatches.forEach((match, index) => {
          try {
            const q = JSON.parse(match);
            if (q.question && q.options && q.correctAnswer !== undefined) {
              questions.push({
                id: index + 1,
                question: q.question,
                options: Array.isArray(q.options) ? q.options : [],
                correctAnswer: parseInt(q.correctAnswer) || 0
              });
            }
          } catch (e) {
            console.warn('Failed to parse individual question:', match);
          }
        });
        return questions;
      }

      return [];
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return [];
    }
  };

  // Choose which questions to use
  const sampleQuestions = useAiQuestions ? aiQuestions : 
    (selectedSkill && Array.isArray(assessmentQuestions[selectedSkill])
      ? assessmentQuestions[selectedSkill]
      : []);

  const currentQ = sampleQuestions[currentQuestion] || {};

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    if (isSubmitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const createPageUrl = (pageName) => {
    const pageRoutes = {
      SkillsPage: "/skills",
      CareerPathPage: "/career-path",
      JobRolePage: "/job-roles",
      Assessment: "/assessment",
      ResultPage: "/result",
      TestPage: "/test",
    };
    return pageRoutes[pageName] || "/";
  };

  const calculateScore = () => {
    if (sampleQuestions.length === 0) return 0;
    let correct = 0;
    sampleQuestions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / sampleQuestions.length) * 100);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const score = calculateScore();
    navigate(
      createPageUrl("ResultPage") +
        `?course=${encodeURIComponent(selectedCourse)}&path=${selectedPath}&role=${selectedRole}&skill=${selectedSkill}&score=${score}&useAi=${useAiQuestions}`
    );
  };

  const progress = sampleQuestions.length
    ? ((currentQuestion + 1) / sampleQuestions.length) * 100
    : 0;
  const answeredCount = Object.keys(answers).length;

  // Loading state for AI questions
  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-blue-300 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
              <h2 className="text-2xl font-bold text-blue-400">Generating Assessment Questions</h2>
            </div>
            <p className="text-zinc-300 mb-4">
              Our AI is creating personalized questions for "{selectedSkill}" skill...
            </p>
            <div className="bg-blue-500/20 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                🤖 Creating 20 tailored questions to test your knowledge
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (questionError) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <h2 className="text-2xl font-bold text-red-400">Question Generation Failed</h2>
            </div>
            <p className="text-zinc-300 mb-4">{questionError}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => fetchQuestionsForSkill(selectedSkill)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(-1)}
                className="border border-gray-400 text-gray-300 hover:bg-gray-800 px-6 py-3 rounded-xl"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Early empty state if required selection missing or no questions
  if (!selectedSkill || sampleQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-red-300 p-8 text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Cannot start assessment</h2>
            <p className="text-zinc-300 mb-4">
              { !selectedSkill
                ? `No skill selected. Please provide a valid skill in the query string.`
                : `Failed to load or generate questions for "${selectedSkill}".` }
            </p>
            <p className="text-sm text-zinc-300">
              Received parameters: course="{selectedCourse || 'none'}", path="{selectedPath || 'none'}", role="{selectedRole || 'none'}", skill="{selectedSkill || 'none'}".
            </p>
            <div className="mt-4">
              <button
                onClick={() => selectedSkill && fetchQuestionsForSkill(selectedSkill)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl mr-4"
                disabled={!selectedSkill}
              >
                Generate Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white backdrop-blur-xl rounded-2xl shadow-lg border border-green-100 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {selectedSkill} Assessment
                {useAiQuestions && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    🤖 AI Generated
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestion + 1} of {sampleQuestions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <Clock className="w-5 h-5" />
                <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
              </div>
              <div className="text-sm text-gray-600">
                {answeredCount}/{sampleQuestions.length} answered
              </div>
            </div>
          </div>
          <progress
            value={progress}
            className="w-full h-3 mt-4 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-orange-200 [&::-webkit-progress-value]:bg-green-600"
          />
        </div>

        <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 p-8 mb-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentQuestion + 1}</span>
              </div>
              <span className="text-sm text-green-500 font-medium">
                Question {currentQuestion + 1}
                {useAiQuestions && <span className="text-blue-500 ml-1">• AI Generated</span>}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-4 mb-8">
            {currentQ.options?.map((option, index) => {
              const isSelected = answers[currentQ.id] === index;
              const isCorrect = isSubmitted && currentQ.correctAnswer === index;
              const isWrong = isSubmitted && isSelected && currentQ.correctAnswer !== index;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQ.id, index)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                    isCorrect
                      ? "border-green-500 bg-green-100"
                      : isWrong
                      ? "border-red-500 bg-red-100"
                      : isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-green-300 hover:bg-green-25"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isCorrect
                          ? "border-green-500 bg-green-500"
                          : isWrong
                          ? "border-red-500 bg-red-500"
                          : isSelected
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {isCorrect && <CheckCircle className="w-4 h-4 text-white" />}
                      {isWrong && <XCircle className="w-4 h-4 text-white" />}
                      {!isCorrect && !isWrong && isSelected && (
                        <Circle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-900 font-medium">{option}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="border-gray-200 text-zinc-300 hover:bg-gray-50 px-6 py-3 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>

          <div className="flex gap-3">
            {currentQuestion < sampleQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="bg-green-500 flex hover:from-green-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl"
              >
                Next
                <ArrowRight className="w-4 mt-1.5 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold"
                disabled={answeredCount < sampleQuestions.length}
              >
                <Flag className="w-4 h-4 mr-2" />
                Submit Assessment
              </button>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Question Overview</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {sampleQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`aspect-square rounded-lg text-sm font-bold transition-all duration-200 ${
                  answers[sampleQuestions[index].id] !== undefined
                    ? "bg-green-500 text-white"
                    : index === currentQuestion
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}