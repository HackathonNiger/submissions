import { Heart, Shield, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../lib/utils";
import { FaHandHoldingHeart, FaHeartbeat } from "react-icons/fa";
import { GiHeartPlus, GiHeartShield } from "react-icons/gi";
import { LuBrainCircuit } from "react-icons/lu";
import { RiMentalHealthFill } from "react-icons/ri";

import vitaband from "../assets/images/vitaband.png";

const LandingPage = () => {
  const features = [
    {
      icon: GiHeartPlus,
      title: "Holistic Health View",
      description: "Continuous, real-time tracking of both physical vitals and mental health indicators.",
    },
    {
      icon: LuBrainCircuit,
      title: "Predictive AI Insights",
      description: "Leverage smart algorithms for early warning alerts and best-practice care recommendations.",
    },
    {
      icon: RiMentalHealthFill,
      title: "Integrated Mental Support",
      description: "An empathetic chatbot provides immediate mental health first-aid based on vital sign changes.",
    },
    {
      icon: GiHeartShield,
      title: "Secure & Compliant Data",
      description: "Enterprise-grade encryption ensures your sensitive patient data remains private and protected.",
    },
    {
      icon: FaHandHoldingHeart,
      title: "Seamless Connected Care",
      description: "Effortless communication and data sharing between patients, caregivers, and providers.",
    },
    {
      icon: Clock,
      title: "24/7 Remote Access",
      description: "Access critical health information and connect with your care team anytime, anywhere.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 z-20 w-full py-8 px-36 backdrop-blur-xs">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center space-x-2">
            <FaHeartbeat className="w-8 h-8 text-red-400" />
            <span className="text-2xl font-bold text-foreground">vitaLink</span>
          </div>
          <div className="flex space-x-4">
            <Button className="text-black shadow-none bg-gray-50 hover:bg-gray-200 hover:text-black" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button className="hover:text-white" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative flex h-[50rem] w-full items-center justify-center bg-white dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <section className="z-20 pt-24 pb-16">
          <div className="container flex items-center justify-center mx-auto px-34">
            <div className="flex items-center justify-center gap-12">
              <motion.div
                className="flex flex-col items-center justify-center w-[60%] space-y-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold leading-tight text-center lg:text-6xl text-foreground">
                    Innovative AI Health and Mental Assistant
                    <span className="block text-transparent bg-gradient-primary bg-clip-text">Management</span>
                  </h1>
                  <p className="text-xl leading-relaxed text-center text-muted-foreground">
                    Connect patients and healthcare providers through our secure, comprehensive platform. Monitor vitals, share insights, and deliver
                    better care together. Experience our innovative AI Health Assistant features and see how we're transforming healthcare.
                  </p>
                </div>

                <motion.div
                  className="flex flex-col gap-4 sm:flex-row"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <Button size="lg" className="px-8 text-lg h-14" asChild>
                    <Link to="/signup?type=patient">Join as Patient</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="px-8 text-lg h-14" asChild>
                    <Link to="/signup?type=doctor">Join as Doctor</Link>
                  </Button>
                </motion.div>

                <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Trusted by 1000+ Doctors</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section className="relative py-16">
        <div className="container mx-auto px-36">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl text-foreground">Why Choose HealthCare Connect?</h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Built for modern healthcare with security, accessibility, and user experience at the forefront
            </p>
          </div>

          <motion.div
            className="grid items-center justify-center w-full gap-8 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.6 }}
              >
                <Card className="transition-all duration-300 border-2 rounded-md shadow-none bg-gray-50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">{feature.title}</h3>
                    <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16" id="setup">
        <div className="container grid grid-cols-2 gap-5 px-36">
          <div className="flex flex-col">
            <p className="text-gray-500 uppercase">// Setup</p>

            <div className="flex flex-col gap-6 py-5">
              <h2 className="text-5xl font-bold uppercase">Sign up and create your account</h2>
              <p className="text-2xl">During signup select you preferred hospital to register under</p>
              <p></p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-10">
            <div className="px-5 py-2 border-black/70 rounded-sm border-[3px]">
              <p className="text-lg">Price:</p>
              <p className="text-2xl font-extrabold">$199.99 USD</p>
            </div>
            <div className="flex flex-col items-center gap-5">
              <p className="text-xl font-bold">Introducing the VitaBand</p>
              <img src={vitaband} alt="vitaBand" className="w-[18rem]" />
              <ul className="text-gray-500 list-disc">
                <li className="marker:text-black market:text-3xl">Continuous Health Monitoring</li>
                <li className="marker:text-black market:text-3xl">Seamless time Vital Integration</li>
              </ul>
              <motion.button className="py-4 text-white bg-black rounded-none">Learn more about VitaBand</motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="py-16 bg-gradient-primary"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container px-4 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Ready to Transform Healthcare?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
            Join thousands of healthcare professionals and patients already using our platform
          </p>
          <Button size="lg" variant="secondary" className="px-8 text-lg h-14" asChild>
            <Link to="/signup">Start Your Journey</Link>
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <div className="relative flex h-[30rem] w-full items-center justify-center bg-white dark:bg-black">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
        <footer className="z-20 w-full h-full py-12 px-36 bg-[#ffffff6a]">
          <div className="container grid grid-cols-2 px-4 mx-auto">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <FaHeartbeat className="w-8 h-8 text-red-400" />
                  <span className="text-2xl font-bold text-foreground">vitaLink</span>
                </div>
                <p className="font-normal text-gray-500">The best Health AI Assistant</p>
                <p className="font-normal text-gray-500 uppercase">
                  &copy; 2025 VitaLink Health AI. <br /> All Rights Reserved.
                </p>
              </div>
              <p className="text-background/70">© 2024 HealthCare Connect. All rights reserved.</p>
            </div>

            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                <p className="pb-3 uppercase text-black/50">Product</p>
                <a href="#" className="pb-2 font-medium text-black uppercase">
                  features
                </a>
                <a href="#setup" className="pb-2 font-medium text-black uppercase">
                  setup
                </a>
                <a href="#" className="pb-2 font-medium text-black uppercase">
                  usecase
                </a>
              </div>

              <div className="flex flex-col">
                <p className="pb-3 uppercase text-black/50">Links</p>
                <a href="#" className="pb-2 font-medium text-black uppercase">
                  Contact us
                </a>
                <a href="#" className="pb-2 font-medium text-black uppercase">
                  Developer
                </a>
                <a href="#" className="pb-2 font-medium text-black uppercase">
                  api
                </a>
                <a href="#" className="pb-2 font-medium text-black uppercase">
                  policy
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
