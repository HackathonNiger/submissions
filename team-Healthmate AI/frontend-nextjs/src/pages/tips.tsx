'use client';

import React from 'react';
import { Lightbulb, RefreshCw, Heart, Droplets, Zap, Clock } from '@/components/icons';

export default function TipsPage() {
  const [currentTipIndex, setCurrentTipIndex] = React.useState(0);

  const dailyTips = [
    {
      category: 'Hydration',
      icon: Droplets,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tip: 'Drink at least 8 glasses of water daily to stay properly hydrated.',
      details: 'Proper hydration helps regulate body temperature, transport nutrients, and maintain healthy skin.'
    },
    {
      category: 'Exercise',
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      tip: 'Take a 10-minute walk after meals to aid digestion.',
      details: 'Light exercise after eating helps regulate blood sugar levels and improves digestion.'
    },
    {
      category: 'Sleep',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tip: 'Maintain a consistent sleep schedule, even on weekends.',
      details: 'Regular sleep patterns help regulate your internal clock and improve sleep quality.'
    },
    {
      category: 'Nutrition',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      tip: 'Include colorful fruits and vegetables in every meal.',
      details: 'Different colored fruits and vegetables provide various vitamins, minerals, and antioxidants.'
    },
    {
      category: 'Mental Health',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      tip: 'Practice deep breathing for 5 minutes when feeling stressed.',
      details: 'Deep breathing activates the parasympathetic nervous system, helping reduce stress and anxiety.'
    }
  ];

  const weeklyTips = [
    {
      day: 'Monday',
      title: 'Meal Prep Monday',
      tip: 'Prepare healthy meals for the week ahead',
      icon: Heart
    },
    {
      day: 'Tuesday',
      title: 'Hydration Check',
      tip: 'Monitor your water intake throughout the day',
      icon: Droplets
    },
    {
      day: 'Wednesday',
      title: 'Wellness Wednesday',
      tip: 'Schedule time for a health check or self-care activity',
      icon: Lightbulb
    },
    {
      day: 'Thursday',
      title: 'Movement Thursday',
      tip: 'Try a new form of physical activity',
      icon: Zap
    },
    {
      day: 'Friday',
      title: 'Reflection Friday',
      tip: 'Reflect on your health goals and progress this week',
      icon: RefreshCw
    },
    {
      day: 'Saturday',
      title: 'Social Saturday',
      tip: 'Connect with friends or family for mental well-being',
      icon: Heart
    },
    {
      day: 'Sunday',
      title: 'Rest Sunday',
      tip: 'Focus on relaxation and preparing for the week ahead',
      icon: Clock
    }
  ];

  const quickTips = [
    'Stand up and stretch every hour if you have a desk job',
    'Keep healthy snacks like nuts or fruits within easy reach',
    'Practice gratitude by writing down three things you are thankful for daily',
    'Limit screen time before bedtime to improve sleep quality',
    'Take the stairs instead of the elevator when possible',
    'Wash your hands frequently to prevent illness',
    'Eat slowly and mindfully to improve digestion',
    'Keep a water bottle with you to remind yourself to drink water',
    'Do a few minutes of stretching when you wake up',
    'Plan your meals ahead to make healthier food choices'
  ];

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % dailyTips.length);
  };

  const currentTip = dailyTips[currentTipIndex];
  const IconComponent = currentTip.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lightbulb className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Health Tips</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover daily health tips and practical advice to improve your well-being
          </p>
        </div>

        {/* Daily Tip of the Day */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Daily Health Tip</h2>
          <div className="max-w-4xl mx-auto">
            <div className={`${currentTip.bgColor} rounded-2xl p-8 border border-gray-200`}>
              <div className="flex items-start space-x-4">
                <div className={`p-3 ${currentTip.bgColor} rounded-full border-2 border-white shadow-sm`}>
                  <IconComponent className={`w-8 h-8 ${currentTip.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-block px-3 py-1 ${currentTip.color} bg-white rounded-full text-sm font-medium`}>
                      {currentTip.category}
                    </span>
                    <button
                      onClick={nextTip}
                      className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-300"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span className="text-sm">Next tip</span>
                    </button>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{currentTip.tip}</h3>
                  <p className="text-gray-700">{currentTip.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Health Schedule */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Weekly Health Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {weeklyTips.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary">{item.day}</p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.tip}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Health Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-primary text-sm font-medium">{index + 1}</span>
                  </div>
                  <p className="text-gray-700 flex-1">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Challenge */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Weekly Health Challenge
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            This week, try to incorporate at least three of these health tips into your daily routine. 
            Small changes can lead to big improvements in your overall well-being.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors duration-300">
              Accept Challenge
            </button>
            <button className="px-6 py-3 bg-white text-primary border border-primary font-medium rounded-lg hover:bg-primary/5 transition-colors duration-300">
              Track Progress
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            <strong>Remember:</strong> These tips are general health advice. For personalized health recommendations, 
            consult with a healthcare professional or use our AI health assistant.
          </p>
        </div>
      </div>
    </div>
  );
}