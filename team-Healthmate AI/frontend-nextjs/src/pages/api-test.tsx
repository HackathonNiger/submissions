'use client';

import React, { useState, useEffect } from 'react';
import { config } from '@/lib/config';

export default function ApiTestPage() {
  const [results, setResults] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Log the configuration
    console.log('API Base URL:', config.apiBaseUrl);
    console.log('Window location:', typeof window !== 'undefined' ? window.location.href : 'SSR');
  }, []);

  const testHealthEndpoint = async () => {
    setIsLoading(true);
    try {
      const url = `${config.apiBaseUrl}/api/health`;
      console.log('Testing URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        health: { success: true, data, status: response.status }
      }));
    } catch (error) {
      console.error('Health endpoint error:', error);
      setResults(prev => ({
        ...prev,
        health: { success: false, error: error.message }
      }));
    }
    setIsLoading(false);
  };

  const testAwarenessCategories = async () => {
    setIsLoading(true);
    try {
      const url = `${config.apiBaseUrl}/api/health/awareness/categories`;
      console.log('Testing URL:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        categories: { success: true, data, status: response.status }
      }));
    } catch (error) {
      console.error('Categories endpoint error:', error);
      setResults(prev => ({
        ...prev,
        categories: { success: false, error: error.message }
      }));
    }
    setIsLoading(false);
  };

  const testSymptomAnalysis = async () => {
    setIsLoading(true);
    try {
      const url = `${config.apiBaseUrl}/api/health/analyze`;
      console.log('Testing URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'I have a headache',
          language: 'en'
        })
      });
      
      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        symptoms: { success: true, data, status: response.status }
      }));
    } catch (error) {
      console.error('Symptoms endpoint error:', error);
      setResults(prev => ({
        ...prev,
        symptoms: { success: false, error: error.message }
      }));
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Connection Test</h1>
        
        {/* Config Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">Configuration</h2>
          <p><strong>API Base URL:</strong> {config.apiBaseUrl}</p>
          <p><strong>Triage API URL:</strong> {config.triageApiUrl}</p>
          <p><strong>Current Location:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}</p>
        </div>

        {/* Test Buttons */}
        <div className="space-y-4 mb-8">
          <button
            onClick={testHealthEndpoint}
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Health Endpoint
          </button>
          
          <button
            onClick={testAwarenessCategories}
            disabled={isLoading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-4"
          >
            Test Awareness Categories
          </button>
          
          <button
            onClick={testSymptomAnalysis}
            disabled={isLoading}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50 ml-4"
          >
            Test Symptom Analysis
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {Object.entries(results).map(([key, result]: [string, any]) => (
            <div key={key} className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 capitalize">
                {key} Test Result
              </h3>
              
              {result.success ? (
                <div>
                  <p className="text-green-600 font-medium mb-2">✅ Success (Status: {result.status})</p>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ) : (
                <div>
                  <p className="text-red-600 font-medium mb-2">❌ Failed</p>
                  <p className="text-red-500">{result.error}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}