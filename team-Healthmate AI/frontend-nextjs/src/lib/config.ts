// HealthMate AI Configuration for Next.js

// Environment detection helper
const isClient = typeof window !== 'undefined';

// Detect if we're in local development environment
const isLocalDevelopment = process.env.NODE_ENV === 'development' && 
  (isClient && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

// Check if local backend is intended to be used (for development override)
const USE_LOCAL_BACKEND = process.env.NEXT_PUBLIC_USE_LOCAL_BACKEND === 'true' || false;

export const config = {
  // API Configuration - Use local backend only in development or when explicitly requested
  apiBaseUrl: (isLocalDevelopment || USE_LOCAL_BACKEND)
    ? 'http://127.0.0.1:5000'
    : 'https://healthmate-ai-vxcl.onrender.com',
  
  triageApiUrl: 'https://triagecall.vercel.app',
  
  // Frontend Configuration
  frontendUrl: isLocalDevelopment
    ? 'http://localhost:3000'
    : 'https://cjid-hackathon-healthmate-ai.vercel.app',
  
  // App Configuration
  appVersion: '2.0',
  supportedLanguages: ['en', 'ig', 'yo', 'ha', 'pcm'],
  defaultLanguage: 'en',
  
  // Feature Flags
  features: {
    multiLanguage: true,
    voiceInput: false,
    darkMode: false,
    analytics: false
  }
};

export type Config = typeof config;