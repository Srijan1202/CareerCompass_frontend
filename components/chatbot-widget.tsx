"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { MessageCircle, X, Minimize2 } from "lucide-react"
import ChatUI, { type ChatMessage } from "../components/chat-ui"

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [shouldBlink, setShouldBlink] = useState(true)

  useEffect(() => {
    // Initialize with welcome message when first opened
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: "welcome",
        content:
          "Hi! I'm your AI Career Mentor. I can help you with career advice, skill development, and answer questions about your professional journey. How can I assist you today?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  useEffect(() => {
    // Stop blinking after user interacts
    if (isOpen) {
      setShouldBlink(false)
    }
  }, [isOpen])

  const handleSendMessage = async (message: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])

    // Set loading state
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          // Optional: Add user context if available
          userContext: null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: data.message,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])
      } else {
        throw new Error("Failed to get response")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
    setShouldBlink(false)
  }

  const minimizeChat = () => {
    setIsMinimized(true)
  }

  const closeChat = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  return (
    <>
      {/* Chat Widget Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={toggleChat}
          className={`w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 ${
            shouldBlink ? "animate-pulse" : ""
          }`}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>

        {/* Blinking indicator */}
        {shouldBlink && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? "60px" : "500px",
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Card className="w-80 shadow-2xl border-0 bg-background/95 backdrop-blur-sm">
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Career Mentor</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={minimizeChat} className="w-8 h-8 p-0">
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={closeChat} className="w-8 h-8 p-0">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Chat Content */}
              <AnimatePresence>
                {!isMinimized && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "436px", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ChatUI
                      messages={messages}
                      onSendMessage={handleSendMessage}
                      isLoading={isLoading}
                      placeholder="Ask me about your career..."
                      className="h-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
