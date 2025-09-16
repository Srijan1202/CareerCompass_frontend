"use client"

import useCombinedTranscriptions from "../hooks/useCombinedTranscriptions"
import { motion, AnimatePresence } from "framer-motion"
import { User, Bot } from "lucide-react"
import * as React from "react"

export default function TranscriptionView() {
  const combinedTranscriptions = useCombinedTranscriptions()
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new transcription is added
  React.useEffect(() => {
    if (containerRef.current) {
      const scrollElement = containerRef.current
      // Use requestAnimationFrame for smooth scrolling
      requestAnimationFrame(() => {
        scrollElement.scrollTop = scrollElement.scrollHeight
      })
    }
  }, [combinedTranscriptions])

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      

      {/* Transcription Container - Fixed Height with Forced Scrolling */}
      <div
        className="flex-1 bg-gradient-to-br from-white via-slate-50/50 to-white rounded-2xl shadow-xl border border-slate-200/50 backdrop-blur-sm overflow-hidden"
        style={{ height: "calc(100% - 100px)", minHeight: "400px" }}
      >
        {/* Scrollable content with explicit height and overflow */}
        <div
          ref={containerRef}
          className="h-full overflow-y-scroll px-6 py-6 custom-scrollbar"
          style={{
            scrollBehavior: "smooth",
            overflowY: "scroll", // Force scrollbar
            height: "100%",
          }}
        >
          <div className="space-y-4 min-h-full">
            <AnimatePresence initial={false}>
              {combinedTranscriptions.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center min-h-[300px]"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                      <Bot className="w-8 h-8 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-700 mb-1">Ready to Listen</h3>
                      <p className="text-slate-500 font-medium text-sm">Start speaking to see the conversation here</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {combinedTranscriptions.map((segment, index) => (
                    <motion.div
                      key={segment.id}
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`flex ${segment.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`flex items-start gap-3 max-w-[85%] ${
                          segment.role === "assistant" ? "flex-row" : "flex-row-reverse"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                            segment.role === "assistant"
                              ? "bg-gradient-to-br from-slate-600 to-slate-700 text-white"
                              : "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                          }`}
                        >
                          {segment.role === "assistant" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`relative px-4 py-3 rounded-2xl shadow-sm backdrop-blur-sm border ${
                            segment.role === "assistant"
                              ? "bg-white/95 text-slate-900 border-slate-200/60 rounded-tl-lg"
                              : "bg-gradient-to-br from-slate-600 to-slate-700 text-white border-slate-500/30 rounded-tr-lg"
                          }`}
                        >
                          {/* Message Content */}
                          <div className="font-medium leading-relaxed text-sm">{segment.text}</div>

                          {/* Timestamp */}
                          <div
                            className={`text-xs mt-2 font-medium ${
                              segment.role === "assistant" ? "text-slate-500" : "text-slate-300"
                            }`}
                          >
                            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>

                          {/* Message tail */}
                          <div
                            className={`absolute top-3 w-2 h-2 transform rotate-45 ${
                              segment.role === "assistant"
                                ? "bg-white/95 border-l border-t border-slate-200/60 -left-1"
                                : "bg-gradient-to-br from-slate-600 to-slate-700 border-r border-b border-slate-500/30 -right-1"
                            }`}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {/* Spacer to ensure proper scrolling */}
                  <div className="h-4" />
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Professional Custom Scrollbar - Always Visible */
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(148, 163, 184, 0.15);
          border-radius: 6px;
          margin: 8px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(148, 163, 184, 0.5) 0%, rgba(148, 163, 184, 0.7) 100%);
          border-radius: 6px;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          background-clip: content-box;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(148, 163, 184, 0.7) 0%, rgba(148, 163, 184, 0.9) 100%);
          transform: scaleX(1.3);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, rgba(71, 85, 105, 0.8) 0%, rgba(71, 85, 105, 1) 100%);
        }
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.6) rgba(148, 163, 184, 0.15);
        }
      `}</style>
    </div>
  )
}
