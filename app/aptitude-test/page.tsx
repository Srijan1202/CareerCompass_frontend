"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Progress } from "../../components/ui/progress"
import { Brain, ArrowLeft, CheckCircle } from "lucide-react"
import Link from "next/link"
import ChatUI, { type ChatMessage } from "../../components/chat-ui"
import { useAuth } from "../../contexts/auth-context"
import { useRouter } from "next/navigation"
import Navbar from "../../components/navbar"


interface AptitudeQuestion {
  id: string
  question: string
  type: "multiple_choice" | "text" | "rating"
  options?: string[]
}

export default function AptitudeTestPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<AptitudeQuestion | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [totalQuestions] = useState(10) // Assuming 10 questions total

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    // Initialize with welcome message and first question
    initializeTest()
  }, [user, router])

  const initializeTest = async () => {
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      content:
        "Welcome to the CareerCompass Aptitude Test! I'll ask you a series of questions to better understand your skills, interests, and career preferences. Let's begin!",
      sender: "bot",
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])
    await fetchNextQuestion()
  }

  const fetchNextQuestion = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Mock API call to Spring Boot backend
      // In real implementation: `/api/users/${user.id}/mentor_sessions/message`
      const response = await fetch(`/api/aptitude-test/next-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          currentProgress: progress,
        }),
      })

      if (response.ok) {
        const questionData = await response.json()

        if (questionData.completed) {
          setTestCompleted(true)
          const completionMessage: ChatMessage = {
            id: `completion-${Date.now()}`,
            content:
              "Congratulations! You've completed the aptitude test. Based on your responses, I'll now generate your personalized career recommendations and learning path.",
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, completionMessage])
        } else {
          setCurrentQuestion(questionData.question)
          const questionMessage: ChatMessage = {
            id: `question-${questionData.question.id}`,
            content: questionData.question.question,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, questionMessage])
        }
      }
    } catch (error) {
      console.error("Error fetching question:", error)
      // Fallback to mock questions
      const mockQuestions = [
        "What type of work environment do you prefer? (Remote, Office, Hybrid, or Flexible)",
        "Which of these subjects interests you most? (Mathematics, Science, Arts, Business, Technology)",
        "How do you prefer to solve problems? (Analytical approach, Creative thinking, Collaborative discussion, or Independent research)",
        "What motivates you most in your career? (Financial success, Work-life balance, Making an impact, or Personal growth)",
        "Which programming languages or technologies are you most interested in learning?",
      ]

      const currentIndex = messages.filter((m) => m.sender === "bot").length - 1
      if (currentIndex < mockQuestions.length) {
        const questionMessage: ChatMessage = {
          id: `mock-question-${currentIndex}`,
          content: mockQuestions[currentIndex],
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, questionMessage])
        setProgress(((currentIndex + 1) / totalQuestions) * 100)
      } else {
        setTestCompleted(true)
        const completionMessage: ChatMessage = {
          id: `completion-${Date.now()}`,
          content:
            "Thank you for completing the aptitude test! Your responses will help us create a personalized career roadmap for you.",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, completionMessage])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Submit answer and get next question
    if (!testCompleted) {
      await submitAnswer(message)
      setTimeout(() => {
        fetchNextQuestion()
      }, 1000) // Small delay for better UX
    }
  }

  const submitAnswer = async (answer: string) => {
    if (!user || !currentQuestion) return

    try {
      // Submit answer to backend
      await fetch(`/api/aptitude-test/submit-answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          questionId: currentQuestion.id,
          answer: answer,
        }),
      })
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Brain className="w-6 h-6 text-blue-600" />
                <h1 className="text-xl font-semibold">Aptitude Test</h1>
              </div>
            </div>
            {testCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {!testCompleted && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Card className="h-[600px] shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Career Aptitude Assessment
                </CardTitle>
                <p className="text-muted-foreground">
                  Answer questions honestly to receive personalized career recommendations
                </p>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-120px)]">
                <ChatUI
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                  placeholder={testCompleted ? "Test completed!" : "Type your answer..."}
                  className="h-full"
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Completion Actions */}
          {testCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-center"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Whats Next?</h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      View Your Dashboard
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button variant="outline">Chat with AI Mentor</Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
