"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Brain,
  TrendingUp,
  BookOpen,
  Users,
  Target,
  Zap,
  Globe,
  Shield,
  Award,
  ArrowRight,
  CheckCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function AboutPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-50 transition-colors duration-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/placeholder-logo.svg"
                  alt="Lumina Logo"
                  width={32}
                  height={32}
                />
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  Lumina
                </span>
              </Link>
              <div className="hidden md:flex space-x-8">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Sun className="h-5 w-5 text-gray-300" />
                )}
              </Button>
              <Link href="/student">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About{" "}
              <span className="text-blue-600 dark:text-blue-400">Lumina</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing learning through AI-powered content
              curation. Our mission is to make quality learning content
              accessible to everyone, everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                At Lumina, we believe that every learner deserves personalized
                content curation that adapts to their unique interests, pace,
                and learning style. Our AI-powered platform bridges knowledge
                gaps and empowers learners to discover their full potential.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We're committed to making quality learning content accessible to
                learners worldwide, using cutting-edge technology to create
                meaningful discovery experiences that drive real results.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/student">
                  <Button
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <Target className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Personalized Curation
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AI-driven content discovery that adapts to each learner's
                  needs
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <Zap className="h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Real-time Analytics
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Instant insights into learning progress and interests
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <Globe className="h-12 w-12 text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Global Access
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quality content available anywhere, anytime
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                <Shield className="h-12 w-12 text-orange-600 dark:text-orange-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Safe & Secure
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data and privacy are our top priority
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform creates a personalized content discovery
              experience that evolves with each learner's interests and needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                AI-Powered Discovery
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our advanced AI algorithms analyze your interests, learning
                patterns, and preferences to create a personalized content
                discovery profile.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Interest-based content matching
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Learning style identification
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Adaptive content recommendations
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Smart Content Curation
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Based on your profile, our system curates and organizes content,
                resources, and learning materials that match your interests and
                pace.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Personalized content feeds
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Topic-based collections
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time content updates
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Continuous Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                The system continuously learns from your interactions and
                adjusts content recommendations to maximize your learning
                discovery.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Progress tracking
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Adaptive recommendations
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Learning analytics
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Learners Worldwide</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">85%</div>
              <div className="text-blue-100">Content Discovery Improvement</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">60%</div>
              <div className="text-blue-100">Time Reduction</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-white mb-2">50+</div>
              <div className="text-blue-100">Countries Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We're a passionate team of technologists, educators, and
              innovators dedicated to transforming learning through intelligent
              content curation.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Award className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Content Experts
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our team includes experienced content curators and learning
                specialists who understand the challenges of modern education.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Brain className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                AI Specialists
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Leading machine learning engineers and data scientists who
                develop cutting-edge AI algorithms for content curation.
              </p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Product Designers
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                UX/UI experts who create intuitive, engaging discovery
                experiences that learners love to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Experience the Future of Content Discovery?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already transforming their
            learning with Lumina's AI-powered content curation platform.
          </p>
          <Link href="/student">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
