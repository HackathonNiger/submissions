"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  MessageSquare,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Sun,
  Moon,
  Brain,
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ContactPage() {
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
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-blue-600 dark:text-blue-400"
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
              Get in{" "}
              <span className="text-blue-600 dark:text-blue-400">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions about Lumina? Want to learn more about our
              AI-powered content curation platform? We'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Send us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Tell us about your inquiry..."
                  ></textarea>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Email
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      hello@Lumina.com
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      support@Lumina.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Phone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      +234 801 234 5678
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Mon-Fri: 9AM-6PM WAT
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Location
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      24 Glover Rd, Ikoyi
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Lagos 106104, Nigeria
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Monday - Friday: 9:00 AM - 6:00 PM
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Saturday: 10:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developers Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the Developers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Lumina was created by passionate developers dedicated to
              transforming learning through innovative technology solutions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Lasisi Quadri */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Lasisi Quadri
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-semibold">
                    Lead Developer & Founder
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                A passionate full-stack developer with expertise in AI/ML,
                educational technology, and creating impactful digital
                solutions. Committed to making quality education accessible to
                everyone.
              </p>
              <div className="flex space-x-3">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-400"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Globe className="h-5 w-5" />
                </Link>
              </div>
            </div>

            {/* Lawal Adam */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    Lawal Adam
                  </h3>
                  <p className="text-green-600 dark:text-green-400 font-semibold">
                    Co-founder & Lead Data Engineer
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                A results-driven data engineer with a strong foundation in
                statistics, machine learning, and backend development. Adam
                brings hands-on experience from Microsoft ADC, AltSchool Africa,
                and multiple AI-for-social-impact projects.
              </p>
              <div className="flex space-x-3">
                <Link
                  href="https://www.linkedin.com/in/adamlawal669/"
                  target="_blank"
                  className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <Linkedin className="h-5 w-5" />
                </Link>
                <Link
                  href="https://github.com/adamlaw669"
                  target="_blank"
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                >
                  <Github className="h-5 w-5" />
                </Link>
                <Link
                  href="https://x.com/Adam__Lawal"
                  target="_blank"
                  className="text-gray-400 hover:text-blue-400 dark:hover:text-blue-400"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to common questions about Lumina and our platform.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How does the AI-powered content curation work?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our AI analyzes your interests, learning patterns, and
                preferences to create personalized content recommendations that
                adapt to your pace and style.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is Lumina free to use?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Yes! We offer a free forever plan with access to core features.
                Premium features are available for advanced users.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What types of content are available?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                We curate a wide range of content including articles, videos,
                courses, podcasts, and more across various subjects and
                interests.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                How can I get support?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                You can reach our support team via email, phone, or through the
                contact form above. We typically respond within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700 transition-colors duration-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already experiencing the future
            of content curation with Lumina's AI-powered platform.
          </p>
          <Link href="/student">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
            >
              Start Learning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
