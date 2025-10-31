'use client';

import React from 'react';
import Link from 'next/link';
import { Book, Globe, Users, Heart, ArrowRight } from '@/components/icons';
import { apiClient } from '@/lib/api';
import { config } from '@/lib/config';
import { AwarenessContent } from '@/types';

export default function AwarenessPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const [awarenessCards, setAwarenessCards] = React.useState<AwarenessContent[]>([]);
  const [originalCards, setOriginalCards] = React.useState<AwarenessContent[]>([]);
  const [categories, setCategories] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isTranslating, setIsTranslating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Language options
  const languages = {
    'en': 'English',
    'yo': 'Yoruba',
    'ha': 'Hausa',
    'ig': 'Igbo',
    'pcm': 'Pidgin'
  };

  // Fetch categories and initial content
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch categories
        const categoriesResponse = await apiClient.getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.categories);
        }
        
        // Fetch content for selected category
        let content = [];
        
        if (selectedCategory === 'All') {
          // Use the random awareness content endpoint for mixed categories
          try {
            const randomResponse = await apiClient.getRandomAwarenessContent(9);
            
            if (randomResponse.success && randomResponse.content) {
              content = randomResponse.content;
            } else {
              // Fallback to health facts
              const factsResponse = await apiClient.generateHealthFacts(undefined, 9);
              content = factsResponse.facts || [];
            }
          } catch (randomErr) {
            console.warn('Random content failed, using health facts:', randomErr);
            const factsResponse = await apiClient.generateHealthFacts(undefined, 9);
            content = factsResponse.facts || [];
          }
        } else {
          const contentResponse = await apiClient.getAwarenessContent(selectedCategory, 6);
          if (contentResponse.success) {
            content = contentResponse.content || [];
          }
        }
        
        // Normalize content structure
        const normalizedContent = content.map((item, index) => ({
          title: item.title || `Health Tip ${index + 1}`,
          content: item.content || item.description || 'Content not available',
          category: item.category || selectedCategory,
          color: item.color || '#FF9800',
          citations: item.citations || []
        }));
        
        if (normalizedContent.length > 0) {
          setOriginalCards(normalizedContent);
          
          // If language is English, use original content
          if (selectedLanguage === 'en') {
            setAwarenessCards(normalizedContent);
          } else {
            // Translate content to selected language
            await translateContent(normalizedContent);
          }
        }
      } catch (err) {
        console.error('Error fetching awareness data:', err);
        setError('Failed to load awareness content. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedCategory]);

  // Handle language change
  React.useEffect(() => {
    const handleLanguageChange = async () => {
      if (originalCards.length === 0) return;
      
      if (selectedLanguage === 'en') {
        setAwarenessCards(originalCards);
      } else {
        await translateContent(originalCards);
      }
    };

    handleLanguageChange();
  }, [selectedLanguage, originalCards]);

  // Translation function
  const translateContent = async (content: AwarenessContent[]) => {
    try {
      setIsTranslating(true);
      const response = await apiClient.translateAwarenessContent(content, selectedLanguage);
      if (response.success) {
        setAwarenessCards(response.translated_content);
      } else {
        setError('Failed to translate content. Showing original content.');
        setAwarenessCards(content);
      }
    } catch (err) {
      console.error('Translation error:', err);
      setError('Translation failed. Showing original content.');
      setAwarenessCards(content);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle category change
  const handleCategoryChange = async (category: string) => {
    if (category === selectedCategory) return;
    
    setSelectedCategory(category);
    try {
      setIsLoading(true);
      setError(null);
      let response;
      let content = [];
      
      console.log('Fetching content for category:', category);
      
      if (category === 'All') {
        // Use the random awareness content endpoint for mixed categories
        try {
          const randomResponse = await apiClient.getRandomAwarenessContent(9);
          console.log('Random content response:', randomResponse);
          
          if (randomResponse.success && randomResponse.content) {
            content = randomResponse.content;
          } else {
            // Fallback to health facts if random content fails
            response = await apiClient.generateHealthFacts(undefined, 9);
            content = response.facts || [];
          }
        } catch (randomErr) {
          console.warn('Random content failed, using health facts:', randomErr);
          response = await apiClient.generateHealthFacts(undefined, 9);
          content = response.facts || [];
        }
      } else {
        // Fetch specific category content
        response = await apiClient.getAwarenessContent(category, 6);
        console.log('Category content response:', response);
        
        if (response.success) {
          content = response.content || [];
        }
      }
      
      console.log('Final content to display:', content);
      
      // Ensure all content has the required structure
      const normalizedContent = content.map((item, index) => ({
        title: item.title || `Health Tip ${index + 1}`,
        content: item.content || item.description || 'Content not available',
        category: item.category || category,
        color: item.color || '#FF9800',
        citations: item.citations || []
      }));
      
      console.log('Normalized content:', normalizedContent);
      
      if (normalizedContent.length > 0) {
        setOriginalCards(normalizedContent);
        
        // Apply current language setting
        if (selectedLanguage === 'en') {
          setAwarenessCards(normalizedContent);
        } else {
          await translateContent(normalizedContent);
        }
      } else {
        setError(`No content available for ${category === 'All' ? 'mixed categories' : category}.`);
        setOriginalCards([]);
        setAwarenessCards([]);
      }
    } catch (err) {
      console.error('Error fetching category content:', err);
      setError('Failed to load content for this category.');
      setOriginalCards([]);
      setAwarenessCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Static fallback data
  const defaultCategories = ['Nutrition', 'Exercise', 'Mental Health', 'Sleep', 'Preventive Care'];

  // Category color mapping
  const getCategoryColor = (category: string) => {
    const colors = {
      'Nutrition': { bg: 'bg-green-500', light: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      'Exercise': { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'Mental Health': { bg: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
      'Sleep': { bg: 'bg-indigo-500', light: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
      'Preventive Care': { bg: 'bg-cyan-500', light: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
      'Common Illnesses': { bg: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
      'First Aid': { bg: 'bg-red-500', light: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      'Chronic Conditions': { bg: 'bg-brown-500', light: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
      'Women\'s Health': { bg: 'bg-pink-500', light: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
      'Men\'s Health': { bg: 'bg-blue-600', light: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      'Children\'s Health': { bg: 'bg-yellow-500', light: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
      'Elderly Care': { bg: 'bg-slate-500', light: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
      'Default': { bg: 'bg-gray-500', light: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' }
    };
    
    return colors[category] || colors['Default'];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Book className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Health Awareness</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expand your knowledge about health and wellness with our comprehensive educational resources
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-3 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <Globe className="w-5 h-5 text-gray-500 ml-3" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent border-none outline-none text-gray-700 font-medium px-2 py-2 cursor-pointer"
              disabled={isTranslating}
            >
              {Object.entries(languages).map(([code, name]) => (
                <option key={code} value={code}>
                  {name}
                </option>
              ))}
            </select>
            {isTranslating && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-3"></div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8 gap-3">
          {/* All Category Button */}
          <button
            onClick={() => handleCategoryChange('All')}
            className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === 'All'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-600 border border-gray-200'
            }`}
          >
            🌟 All Categories
          </button>
          
          {/* Individual Category Buttons */}
          {(categories.length > 0 ? categories : defaultCategories).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {(isLoading || isTranslating) && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">
              {isLoading ? 'Loading awareness content...' : 'Translating content...'}
            </p>
          </div>
        )}

        {/* Content Cards */}
        {!isLoading && !isTranslating && awarenessCards.length > 0 && (
          <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {awarenessCards.map((card, index) => {
              const categoryColors = getCategoryColor(card.category);
              return (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Colored Header */}
                  <div className={`${categoryColors.bg} h-2 w-full`}></div>
                  
                  {/* Card Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${categoryColors.light} ${categoryColors.text} ${categoryColors.border} border`}>
                        {card.category}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${categoryColors.bg} opacity-60`}></div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors leading-tight">
                      {card.title}
                    </h3>
                    
                    {/* Content */}
                    <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                      {card.content}
                    </p>
                    
                    {/* Sources */}
                    {card.citations && card.citations.length > 0 && (
                      <div className={`border-t ${categoryColors.border} pt-4`}>
                        <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center">
                          <Book className="w-4 h-4 mr-1" />
                          Reliable Sources:
                        </p>
                        <div className="space-y-2">
                          {card.citations.slice(0, 2).map((citation, citationIndex) => (
                            <a
                              key={citationIndex}
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`block text-xs ${categoryColors.text} hover:underline transition-colors duration-200 font-medium`}
                            >
                              • {citation.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom accent */}
                  <div className={`h-1 w-0 ${categoryColors.bg} group-hover:w-full transition-all duration-500`}></div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isTranslating && awarenessCards.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="mb-6">
              <Book className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Content Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {selectedCategory === 'All' 
                ? 'Unable to load health awareness content at the moment. Please try again later.'
                : `No awareness content available for ${selectedCategory} category.`
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Start your health journey today with our AI-powered health assistant. Get personalized advice and support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/chat"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-300"
            >
              Start Health Chat
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="/symptoms"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary border border-primary font-medium rounded-lg hover:bg-primary/5 transition-colors duration-300"
            >
              Check Symptoms
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice. 
            Always consult with a qualified healthcare provider for medical concerns.
          </p>
        </div>
      </div>
    </div>
  );
}