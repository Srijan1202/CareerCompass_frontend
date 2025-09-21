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
  const [totalQuestions] = useState(10)

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

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
    await fetchFirstQuestion()
  }

  const fetchFirstQuestion = async () => {
    if (!user) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/proxy") // Call proxy route
      if (response.ok) {
        const data = await response.json()
        const questionMessage: ChatMessage = {
          id: `question-${Date.now()}`,
          content: data.question,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, questionMessage])
        setCurrentQuestion({ id: "first", question: data.question, type: "text" })
        setProgress(10)
      }
    } catch (err) {
      console.error("Error fetching first question:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    if (!testCompleted) {
      await submitAnswer(message)
    }
  }

  const submitAnswer = async (answer: string) => {
    if (!currentQuestion) return
    setIsLoading(true)
    try {
      const response = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.question && data.question.trim().length > 0) {
          const questionMessage: ChatMessage = {
            id: `question-${Date.now()}`,
            content: data.question,
            sender: "bot",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, questionMessage])
          setCurrentQuestion({ id: `q-${Date.now()}`, question: data.question, type: "text" })
          setProgress((prev) => Math.min(prev + 10, 100))
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
      }
    } catch (err) {
      console.error("Error submitting answer:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
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

          {testCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 text-center"
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">What's Next?</h3>
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
