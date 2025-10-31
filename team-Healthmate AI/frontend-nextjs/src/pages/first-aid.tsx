'use client';

import React from 'react';
import { Cross, Phone, AlertTriangle, Heart, User, Clock } from '@/components/icons';

export default function FirstAidPage() {
  const [selectedEmergency, setSelectedEmergency] = React.useState('general');

  const emergencyContacts = [
    { name: 'National Emergency', number: '199', description: 'General emergency services' },
    { name: 'Police Emergency', number: '199', description: 'Police emergency response' },
    { name: 'Fire Service', number: '199', description: 'Fire emergency response' },
    { name: 'Medical Emergency', number: '199', description: 'Medical emergency response' }
  ];

  const firstAidCategories = [
    { id: 'general', name: 'General First Aid', icon: Cross },
    { id: 'cardiac', name: 'Heart Emergency', icon: Heart },
    { id: 'breathing', name: 'Breathing Issues', icon: User },
    { id: 'trauma', name: 'Injuries & Trauma', icon: AlertTriangle }
  ];

  const firstAidGuides = {
    general: [
      {
        title: 'Basic First Aid Steps',
        priority: 'Always follow these steps first',
        steps: [
          'Ensure scene safety - Check for dangers before approaching',
          'Check responsiveness - Tap shoulders and shout "Are you okay?"',
          'Call for help - Call 199 or local emergency number',
          'Check breathing and pulse',
          'Begin appropriate first aid measures',
          'Monitor the person until help arrives'
        ]
      },
      {
        title: 'Cuts and Scrapes',
        priority: 'Common injury management',
        steps: [
          'Clean your hands thoroughly',
          'Stop the bleeding by applying direct pressure',
          'Clean the wound with clean water',
          'Apply an antiseptic if available',
          'Cover with a clean bandage',
          'Monitor for signs of infection'
        ]
      }
    ],
    cardiac: [
      {
        title: 'Heart Attack Response',
        priority: 'Call 199 immediately!',
        steps: [
          'Call emergency services immediately (199)',
          'Help the person sit down and rest',
          'Loosen tight clothing around neck and chest',
          'If prescribed, help them take their heart medication',
          'If they become unconscious, prepare for CPR',
          'Stay calm and reassure the person'
        ]
      },
      {
        title: 'CPR (Cardiopulmonary Resuscitation)',
        priority: 'Life-saving technique',
        steps: [
          'Place the person on a firm surface',
          'Kneel beside their chest',
          'Place heel of one hand on center of chest',
          'Push hard and fast at least 2 inches deep',
          'Compress at rate of 100-120 per minute',
          'Continue until emergency help arrives'
        ]
      }
    ],
    breathing: [
      {
        title: 'Choking Adult',
        priority: 'Act quickly - they cannot breathe',
        steps: [
          'Encourage coughing if they can still cough',
          'Stand behind the person',
          'Place arms around waist',
          'Make a fist with one hand above navel',
          'Grasp fist with other hand and thrust upward',
          'Repeat until object is expelled or person becomes unconscious'
        ]
      },
      {
        title: 'Asthma Attack',
        priority: 'Help them use their inhaler',
        steps: [
          'Help the person sit upright',
          'Stay calm and reassure them',
          'Help them use their rescue inhaler',
          'Wait 4 minutes, if no improvement use inhaler again',
          'If no improvement after second dose, call 199',
          'Continue to monitor breathing'
        ]
      }
    ],
    trauma: [
      {
        title: 'Severe Bleeding',
        priority: 'Control bleeding immediately',
        steps: [
          'Apply direct pressure to the wound',
          'Use a clean cloth or bandage if available',
          'Do not remove objects embedded in wound',
          'If blood soaks through, add more layers',
          'Elevate the injured area if possible',
          'Call 199 for severe bleeding'
        ]
      },
      {
        title: 'Fractures',
        priority: 'Do not move unless necessary',
        steps: [
          'Do not move the person if spinal injury is suspected',
          'Immobilize the injured area',
          'Support the area above and below the fracture',
          'Apply ice pack wrapped in cloth',
          'Do not try to straighten broken bones',
          'Get medical help immediately'
        ]
      }
    ]
  };

  const currentGuides = firstAidGuides[selectedEmergency as keyof typeof firstAidGuides];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Cross className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">First Aid Guide</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Essential first aid information for emergency situations
          </p>
        </div>

        {/* Emergency Alert */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-red-800">Emergency Situation?</h2>
              <p className="text-red-700">
                If this is a life-threatening emergency, call <strong>199</strong> immediately. 
                Do not rely solely on this guide for serious medical emergencies.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Phone className="w-6 h-6 text-green-600 mr-2" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-gray-900 mb-1">{contact.name}</h3>
                <p className="text-2xl font-bold text-green-600 mb-1">{contact.number}</p>
                <p className="text-sm text-gray-600">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-8 space-x-2">
          {firstAidCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedEmergency(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 mb-2 ${
                  selectedEmergency === category.id
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 border border-gray-200'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>

        {/* First Aid Guides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {currentGuides.map((guide, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Cross className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full inline-block">
                    {guide.priority}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {guide.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-sm font-medium">{stepIndex + 1}</span>
                    </div>
                    <p className="text-gray-700 flex-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Important Reminders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
            <h3 className="font-semibold text-yellow-800 mb-2">Time Matters</h3>
            <p className="text-sm text-yellow-700">
              In emergencies, quick action can save lives. Stay calm and act decisively.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <User className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-800 mb-2">Stay Safe</h3>
            <p className="text-sm text-blue-700">
              Always ensure your own safety before helping others. You cannot help if you become injured.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <Heart className="w-8 h-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold text-green-800 mb-2">Get Training</h3>
            <p className="text-sm text-green-700">
              Consider taking a certified first aid course to be better prepared for emergencies.
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Important Disclaimer</h3>
              <p className="text-sm text-red-700 mb-2">
                This first aid guide provides general information only and should not replace professional medical training or emergency services.
              </p>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Always call emergency services (199) for serious injuries or medical emergencies</li>
                <li>• This information is not a substitute for certified first aid training</li>
                <li>• When in doubt, seek professional medical help immediately</li>
                <li>• Consider taking a certified first aid course for proper training</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}