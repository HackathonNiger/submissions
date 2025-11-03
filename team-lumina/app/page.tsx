"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import the router
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Users,
  Loader2,
  ChevronRight,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { OnboardingFlow } from "../components/onboarding-flow";
import type { UserProfile } from "../types/user-profile";
import { useData } from "../context/DataContext";
import type { StudentData } from "../types/learning-data";
import { StudentDashboard } from "../components/student-dashboard";

export default function HomePage() {
  const router = useRouter(); // Initialize the router
  const { studentData, updateStudentData, resetStudentData } = useData();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // This effect runs only once on the client after the component mounts.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Handler for when onboarding is completed
  const handleOnboardingComplete = (profile: UserProfile) => {
    const initialData: StudentData = {
      profile,
      contentLibrary: [],
      quizHistory: [],
      completedModules: [],
      stats: { streakDays: 0, totalPoints: 0 },
    };
    updateStudentData(initialData);
    setShowOnboarding(false);
    router.push("/student"); // Redirect to the student dashboard
  };

  // Handler to reset profile and re-start onboarding
  const handleResetProfile = () => {
    resetStudentData();
    setShowOnboarding(true);
  };

  // Handler to start onboarding when user clicks "Get Started"
  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  // Render a loading state until the component has mounted on the client
  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // If a student profile already exists, show the dashboard directly
  if (studentData) {
    return <StudentDashboard />;
  }

  // Render onboarding flow if user chooses to start
  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Render main landing page if no profile and not onboarding
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Navigation */}
 {/* Navigation */}
<nav className="fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-50 transition-colors duration-200">
  <div className="container mx-auto px-4 py-4">
    <div className="flex items-center justify-between">
      {/* Left side (Logo + Links) */}
      <div className="flex items-center space-x-8">
        <Link href="/" className="flex items-center space-x-2">
          {/* <Image
            src="/placeholder-logo.svg"
            alt="Lumina Logo"
            width={34}
            height={34}
          /> */}
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Lumina
          </span>
        </Link>
        <div className="hidden md:flex space-x-8">
          <Link
            href="/"
            className="text-sm font-medium text-blue-600 dark:text-blue-400"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
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

      {/* ✅ Right side (Get Started + Theme Toggle beside each other) */}
      <div className="flex items-center space-x-12 relative">
        <Button
          onClick={handleStartOnboarding}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
        >
          Get Started
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
        {/* 👇 Move Header inside the same flex container */}
        <div className="relative top-0 right-0">
          <Header />
        </div>
      </div>
    </div>
  </div>
</nav>

<Header />
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8">
              <Star className="h-4 w-4 mr-2" />
              #1 AI Tutor for WAEC Success
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Smarter WAEC Prep
              <span className="text-blue-600 dark:text-blue-400">
                {" "}
                Starts Here
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Lumina is your personal AI tutor for WAEC success. Get
              step-by-step explanations, personalized quizzes, and progress
              tracking to ace your exams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={handleStartOnboarding}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              >
                Start Learning Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-4 text-lg border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Free forever plan
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Lumina?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI-powered platform delivers personalized content that adapts
              to each learner's unique needs and goals for WAEC.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Past Question Explainer
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get detailed, step-by-step solutions for past WAEC questions to
                build deep understanding.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time analytics track your progress and identify weak areas
                for focused improvement.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Personalized Quizzes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice with quizzes tailored to your learning needs, ensuring
                you're always challenged.
              </p>
            </div>
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                24/7 AI Tutor
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your friendly AI tutor is always available to answer questions
                and provide support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Ace Your WAEC Exams?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already transforming their
            studies with Lumina. Start your personalized learning journey
            today.
          </p>
          <Button
            size="lg"
            onClick={handleStartOnboarding}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image
                  src="/placeholder-logo.svg"
                  alt="Lumina Logo"
                  width={24}
                  height={24}
                />
                <h3 className="text-2xl font-bold text-blue-400">Lumina</h3>
              </div>
              <p className="text-gray-400">
                Your personal AI tutor for WAEC success.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/student" className="hover:text-white">
                    Student Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/teacher" className="hover:text-white">
                    Teacher Portal
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Features
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Mail className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <Phone className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <MapPin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Lumina. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
