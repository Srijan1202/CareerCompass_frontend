"use client"

import { motion } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import {
  Brain,
  FileText,
  TrendingUp,
  Upload,
  Cpu,
  Target,
  Rocket,
  Github,
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import Navbar from "../components/navbar"
import ChatbotWidget from "../components/chatbot-widget"

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const features = [
    {
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      title: "AI Resume Builder",
      description: "Generate ATS-friendly resumes tailored to your skills and experience with advanced AI technology.",
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-600" />,
      title: "Personalized Career Guidance",
      description: "Get AI-driven roadmaps, resources, and recommendations based on your unique career goals.",
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-indigo-600" />,
      title: "Progress Dashboard",
      description: "Visualize your coding journey, track skill development, and monitor your career growth over time.",
    },
  ]

  const steps = [
    {
      icon: <Upload className="h-6 w-6" />,
      title: "Input Data",
      description: "Upload your academic records and coding projects",
    },
    {
      icon: <Cpu className="h-6 w-6" />,
      title: "AI Processing",
      description: "Our AI analyzes your background and skills",
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Resume & Guidance",
      description: "Receive personalized resume and career roadmap",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "Career Growth",
      description: "Follow your path to professional success",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white pt-16">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, 20, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        </div>

        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance text-white"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                CareerCompass – Your AI Career Navigator
              </motion.h1>
              <motion.p
                className="text-xl md:text-2xl mb-8 text-white/90 text-pretty"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Turn your academic journey and coding progress into an AI-powered resume and personalized career
                roadmap.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/signup">
                  <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-700 bg-white/10 backdrop-blur-sm"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Chat with AI Mentor
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="w-full max-w-md aspect-square bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                <div className="text-center">
                  <Brain className="h-24 w-24 mx-auto mb-4 text-white/80" />
                  <p className="text-lg font-medium text-white/90">AI-Powered Career Intelligence</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Powerful Features for Your Career Success
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Leverage cutting-edge AI technology to accelerate your career growth and land your dream job.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      className="mb-6 flex justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-pretty">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">How CareerCompass Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Four simple steps to transform your career trajectory with AI-powered insights.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <motion.div
                className="flex justify-between items-center mb-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {steps.map((step, index) => (
                  <motion.div key={index} className="flex flex-col items-center text-center flex-1" variants={fadeInUp}>
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mb-4 shadow-lg">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty max-w-32">{step.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Connection Line */}
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform -translate-y-20"></div>
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden space-y-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground text-pretty">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-4xl mx-auto border"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to shape your career with AI?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto text-pretty">
              Join thousands of students and professionals who are already using CareerCompass to accelerate their
              career growth.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/chat">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold px-8 bg-transparent"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Try AI Mentor
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative">
        {/* Gradient Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>

        <div className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4 text-foreground">CareerCompass</h3>
              <p className="text-muted-foreground mb-6">
                Built for hackathon • Powered by AI • Designed for your success
              </p>
              <div className="flex justify-center gap-6">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground cursor-pointer">
                  <Github className="h-4 w-4 mr-2" />
                  View on GitHub
                </Button>
              </div>
          
            </motion.div>
          </div>
        </div>
      </footer>
      <ChatbotWidget />
    </div>
  )
}
