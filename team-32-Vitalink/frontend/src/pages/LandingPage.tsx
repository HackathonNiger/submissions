import { Heart, Shield, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../lib/utils";
import { FaHeartbeat } from "react-icons/fa";

const LandingPage = () => {
  const features = [
    {
      icon: Heart,
      title: "Comprehensive Care",
      description:
        "Complete health monitoring and management for patients and doctors",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Healthcare-grade security ensuring your medical data stays protected",
    },
    {
      icon: Users,
      title: "Connected Care",
      description:
        "Seamless communication between patients and healthcare providers",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description:
        "Access your health information and connect with care teams anytime",
    },
  ];

  return (
    <div className="min-h-screen px-4 bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 z-20 w-full px-24 py-8 backdrop-blur-xs">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          <div className="flex items-center space-x-2">
            {/* <Heart className="w-8 h-8 text-primary" /> */}
            <FaHeartbeat className="w-8 h-8 text-red-400" />

            <span className="text-2xl font-bold text-foreground">vitaLink</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
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
        <section className="z-20 px-16 pt-24 pb-16 bg-gradient-hero">
          <div className="container flex items-center justify-center px-4 mx-auto">
            <div className="flex items-center justify-center gap-12">
              <motion.div
                className="flex flex-col items-center justify-center w-[60%] space-y-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold leading-tight text-center lg:text-6xl text-foreground">
                    Modern Healthcare
                    <span className="block text-transparent bg-gradient-primary bg-clip-text">
                      Management
                    </span>
                  </h1>
                  <p className="text-xl leading-relaxed text-center text-muted-foreground">
                    Connect patients and healthcare providers through our
                    secure, comprehensive platform. Monitor vitals, share
                    insights, and deliver better care together.
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
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-8 text-lg h-14"
                    asChild
                  >
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
      <section className="py-16 bg-card">
        <div className="container px-4 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl text-foreground">
              Why Choose HealthCare Connect?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
              Built for modern healthcare with security, accessibility, and user
              experience at the forefront
            </p>
          </div>

          <motion.div
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.2 },
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
                <Card className="transition-all duration-300 border-0 shadow-soft hover:shadow-medium bg-gradient-card">
                  <CardContent className="p-8 text-center">
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-primary/10">
                      <feature.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="mb-3 text-xl font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
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
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Ready to Transform Healthcare?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-white/90">
            Join thousands of healthcare professionals and patients already
            using our platform
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="px-8 text-lg h-14"
            asChild
          >
            <Link to="/signup">Start Your Journey</Link>
          </Button>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 bg-foreground text-background">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center mb-4 space-x-2 md:mb-0">
              <Heart className="w-6 h-6" />
              <span className="text-xl font-semibold">HealthCare Connect</span>
            </div>
            <p className="text-background/70">
              © 2024 HealthCare Connect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
