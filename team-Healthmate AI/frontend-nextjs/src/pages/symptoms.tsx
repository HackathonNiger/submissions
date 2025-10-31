'use client';

import React, { useState } from 'react';
import { Search, Droplets, Activity, Clock, Heart, AlertTriangle, CheckCircle, ExternalLink, BookOpen } from '@/components/icons';
import { apiClient } from '@/lib/api';
import { HealthResponse } from '@/types';

// Function to format health response with styled citations
const formatHealthResponse = (response: string) => {
  console.log('Original response:', response);
  
  // Split on "For more information" patterns (more flexible)
  const parts = response.split(/(?=For more information[,:])/i);
  
  console.log('Split parts:', parts);
  
  return (
    <div className="space-y-4">
      {/* Main content */}
      <div className="whitespace-pre-wrap">
        {parts[0].trim()}
      </div>
      
      {/* Citations section */}
      {parts.length > 1 && (
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h6 className="font-semibold text-gray-800">Additional Resources</h6>
          </div>
          <div className="space-y-2">
            {parts.slice(1).map((citation, index) => {
              console.log('Processing citation:', citation);
              
              // Handle the new natural format: "For more information, consider visiting the CDC for respiratory health tips or the Mayo Clinic for guidelines on managing respiratory symptoms."
              const citationText = citation.trim();
              
              // Extract organization names and their purposes
              const organizations = [];
              
              // Look for common health organizations
              const orgPatterns = [
                { name: 'CDC', pattern: /CDC\s+for\s+([^.]+)/gi, baseUrl: 'https://www.cdc.gov' },
                { name: 'Mayo Clinic', pattern: /Mayo Clinic\s+for\s+([^.]+)/gi, baseUrl: 'https://www.mayoclinic.org' },
                { name: 'WHO', pattern: /WHO\s+for\s+([^.]+)/gi, baseUrl: 'https://www.who.int' },
                { name: 'WebMD', pattern: /WebMD\s+for\s+([^.]+)/gi, baseUrl: 'https://www.webmd.com' },
                { name: 'Healthline', pattern: /Healthline\s+for\s+([^.]+)/gi, baseUrl: 'https://www.healthline.com' },
                { name: 'MedlinePlus', pattern: /MedlinePlus\s+for\s+([^.]+)/gi, baseUrl: 'https://medlineplus.gov' }
              ];
              
              orgPatterns.forEach(org => {
                let match;
                const regex = new RegExp(org.pattern.source, org.pattern.flags);
                while ((match = regex.exec(citationText)) !== null) {
                  organizations.push({
                    name: org.name,
                    description: match[1] ? `${org.name} - ${match[1]}` : org.name,
                    url: org.baseUrl
                  });
                  if (!regex.global) break;
                }
              });
              
              // If no specific organizations found, create a generic resource box
              if (organizations.length === 0) {
                return (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-700">{citationText}</p>
                    </div>
                  </div>
                );
              }
              
              // Render each organization as a separate resource
              return (
                <div key={index} className="space-y-2">
                  {organizations.map((org, orgIndex) => (
                    <div key={orgIndex} className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      <ExternalLink className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <a 
                        href={org.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-700 hover:text-blue-800 text-sm font-medium hover:underline"
                      >
                        {org.description}
                      </a>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default function SymptomsPage() {
  const [symptomInput, setSymptomInput] = useState('');
  const [results, setResults] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkSymptoms = async () => {
    if (!symptomInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.analyzeHealth(symptomInput);
      setResults(response);
    } catch (error) {
      console.error('Error checking symptoms:', error);
      setResults({
        success: false,
        error: 'Failed to analyze symptoms. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = () => {
    setSymptomInput('');
    setResults(null);
  };

  const healthTips = [
    {
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      title: "Stay Hydrated",
      description: "Drink plenty of water throughout the day. Aim for 8 glasses to maintain proper bodily functions."
    },
    {
      icon: <Activity className="w-8 h-8 text-green-500" />,
      title: "Regular Exercise",
      description: "Get at least 30 minutes of moderate exercise daily to boost your immune system and overall health."
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-500" />,
      title: "Adequate Sleep",
      description: "Ensure 7-9 hours of quality sleep each night to help your body recover and maintain good health."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Mental Wellness",
      description: "Practice stress management techniques like meditation or deep breathing for better mental health."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center animate-pulse">
                <Search className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Symptom Checker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get instant AI-powered health insights by describing your symptoms. 
            <span className="text-green-600 font-medium"> Fast, accurate, and reliable.</span>
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-12 animate-fade-in-up hover:shadow-2xl transition-all duration-300">
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Describe Your Symptoms
              </label>
              <textarea
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Tell us how you feel... (e.g., 'I have had a persistent headache and mild fever for the past two days, along with some fatigue')"
                className="w-full h-40 p-6 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 resize-none text-gray-700 placeholder-gray-400 transition-all duration-200 shadow-sm"
                disabled={isLoading}
              />
              <div className="absolute bottom-4 right-4 text-sm text-gray-400">
                {symptomInput.length}/500
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={clearInput}
                className="px-6 py-3 text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                disabled={isLoading}
              >
                Clear All
              </button>
              <button
                onClick={checkSymptoms}
                disabled={!symptomInput.trim() || isLoading}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-xl hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Search className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Analyzing Your Symptoms...' : 'Analyze Symptoms'}</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="mt-8 animate-fade-in-up">
              {results.success ? (
                <div className="space-y-6">
                  {/* Language Detection */}
                  {results.detected_language && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Language detected: <span className="font-bold">{results.detected_language}</span>
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Symptoms and Duration Cards */}
                  {results.health_analysis && (
                    <div className="grid md:grid-cols-2 gap-6">
                      {results.health_analysis.symptoms.length > 0 && (
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <h4 className="font-bold text-red-900">Symptoms Identified</h4>
                          </div>
                          <div className="space-y-2">
                            {results.health_analysis.symptoms.map((symptom, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-red-800 font-medium">{symptom}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {results.health_analysis.time_expressions.length > 0 && (
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
                          <div className="flex items-center space-x-3 mb-4">
                            <Clock className="w-6 h-6 text-blue-600" />
                            <h4 className="font-bold text-blue-900">Duration & Timeline</h4>
                          </div>
                          <div className="space-y-2">
                            {results.health_analysis.time_expressions.map((time, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-blue-800 font-medium">{time}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* AI Assessment Card */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 hover:shadow-lg transition-all duration-200">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-green-900">AI Health Assessment</h4>
                        <p className="text-green-700 text-sm">Professional medical analysis</p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <div className="text-gray-700 leading-relaxed text-lg">
                        {formatHealthResponse(results.response)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Disclaimer */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="font-bold text-amber-900 mb-2">Important Medical Disclaimer</h5>
                        <p className="text-amber-800 text-sm leading-relaxed">
                          This AI assessment is for <strong>informational purposes only</strong> and should not replace professional medical advice. 
                          Always consult with a qualified healthcare professional for proper medical diagnosis, treatment, and personalized care.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">Analysis Failed</h4>
                      <p className="text-red-700">{results.error || 'Failed to analyze symptoms. Please try again.'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in-up hover:shadow-2xl transition-all duration-300">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-white animate-heartbeat" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Essential Health Tips
            </h2>
            <p className="text-gray-600">
              Simple daily practices for optimal wellness
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {healthTips.map((tip, index) => (
              <div 
                key={index} 
                className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all duration-200">
                    {tip.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}