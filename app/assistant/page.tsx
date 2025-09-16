"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import TranscriptionView from "../../components/TranscriptionView"
import { DisconnectButton, RoomAudioRenderer, RoomContext, useVoiceAssistant } from "@livekit/components-react"
import { AnimatePresence, motion } from "framer-motion"
import { Room, RoomEvent } from "livekit-client"
import type { ConnectionDetails } from "../api/connection-details/route"
import { Mic, Settings, ChevronDown, Volume2, Wifi, Circle, Loader2, Mail, MessageSquare } from "lucide-react"
import { AudioVisualizerWithFallback } from "../../components/AudioVisualizer"
import { MicrophoneSelector } from "../../components/MicrophoneSelector"


export default function AssistantPage() {
  const [room] = useState(() => new Room())
  const [showMicDropdown, setShowMicDropdown] = useState(false)
  const [isEmailAuthenticated, setIsEmailAuthenticated] = useState(false)
  const [legacyEmailToken, setLegacyEmailToken] = useState<string | null>(null)
  const [authResolved, setAuthResolved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingService, setLoadingService] = useState<string | null>(null)
  const router = useRouter()

  // Unified auth resolution: accept either new auth-provider auth or legacy local email auth token
  

  const onConnectButtonClicked = useCallback(async () => {
    const url = new URL(
      process.env.NEXT_PUBLIC_CONN_DETAILS_ENDPOINT ?? "/api/connection-details",
      window.location.origin,
    )
    const response = await fetch(url.toString())
    const connectionDetailsData: ConnectionDetails = await response.json()
    await room.connect(connectionDetailsData.serverUrl, connectionDetailsData.participantToken)
    await room.localParticipant.setMicrophoneEnabled(true)
  }, [room])

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure)
    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure)
    }
  }, [room])

 

  return (
    <div className="min-h-screen relative">
      {/* Online Status - Top Right */}
      <div className="absolute top-6 right-8 z-10">
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700">Online</span>
        </div>
      </div>

      <div className="p-8 pt-20">
        <div className="max-w-7xl mx-auto">
         
            <RoomContext.Provider value={room}>
              <AssistantInterface
                onConnectButtonClicked={onConnectButtonClicked}
                showMicDropdown={showMicDropdown}
                setShowMicDropdown={setShowMicDropdown}
              />
            </RoomContext.Provider>
        
        </div>
      </div>
    </div>
  )
}


function AssistantInterface({
  onConnectButtonClicked,
  showMicDropdown,
  setShowMicDropdown,
}: {
  onConnectButtonClicked: () => void
  showMicDropdown: boolean
  setShowMicDropdown: (show: boolean) => void
}) {
  const { state: agentState } = useVoiceAssistant()
  const isConnected = agentState !== "disconnected"

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      <AnimatePresence mode="wait">
        {!isConnected ? (
          <motion.div
            key="disconnected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <VoiceInterface
              onConnect={onConnectButtonClicked}
              agentState={agentState}
              showMicDropdown={showMicDropdown}
              setShowMicDropdown={setShowMicDropdown}
              fullWidth={true}
            />
          </motion.div>
        ) : (
          <motion.div
            key="connected"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full"
          >
            {/* Main Assistant Panel */}
            <div className="lg:col-span-2">
              <VoiceInterface
                onConnect={onConnectButtonClicked}
                agentState={agentState}
                showMicDropdown={showMicDropdown}
                setShowMicDropdown={setShowMicDropdown}
                fullWidth={false}
              />
            </div>

            {/* Transcription Panel */}
            <div className="lg:col-span-1 ml-24 min-w-[400px]">
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-[600px]"
              >
                <div className="flex items-center gap-3 mb-6">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Conversation</h3>
                </div>
                <div className="h-[500px] overflow-hidden rounded-xl p-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 shadow-[0_8px_32px_0_rgba(60,60,120,0.12)] relative">
                  {/* Soft inner shadow for blend-in effect */}
                  <div className="absolute inset-0 pointer-events-none rounded-xl shadow-inner" style={{ boxShadow: "inset 0 8px 32px 0 rgba(60,60,120,0.10)" }} />
                  {/* Subtle overlay for depth */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/60 via-transparent to-blue-50/40 pointer-events-none" />
                  <div className="relative z-10 h-full">
                  <TranscriptionView />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <RoomAudioRenderer />
    </div>
  )
}

function VoiceInterface({
  onConnect,
  agentState,
  showMicDropdown,
  setShowMicDropdown,
  fullWidth,
}: {
  onConnect: () => void
  agentState: string
  showMicDropdown: boolean
  setShowMicDropdown: (show: boolean) => void
  fullWidth: boolean
}) {
  const [audioLevel, setAudioLevel] = useState(0)
  const [frequencyData, setFrequencyData] = useState<Uint8Array>(new Uint8Array(128))

  // Simulate audio visualization based on agent state
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (agentState === "listening" || agentState === "speaking") {
      interval = setInterval(() => {
        const level = Math.random() * 0.8 + 0.2
        setAudioLevel(level)

        const simFreq = new Uint8Array(128)
        for (let i = 0; i < 128; i++) {
          const freq = i / 128
          const voiceEmphasis = Math.exp(-freq * 4)
          simFreq[i] = Math.floor(level * 255 * voiceEmphasis * (0.5 + Math.random() * 0.5))
        }
        setFrequencyData(simFreq)
      }, 100)
    } else {
      setAudioLevel(0)
      setFrequencyData(new Uint8Array(128))
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [agentState])

  const handleVisualizerClick = () => {
    if (agentState === "disconnected") {
      onConnect()
    }
  }

  return (
    <div
      className={`${fullWidth ? "h-[600px]" : "h-[600px]"} w-full flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-2xl`}
    >
      {/* Status Indicator */}
      {agentState !== "disconnected" && <StatusIndicator agentState={agentState} />}

      {/* Gentle background ambient animation for light theme */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4  w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.03) 50%, transparent 100%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.03) 50%, transparent 100%)",
          }}
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-md mx-auto text-center">
        {/* Main audio visualization - 3D Sphere */}
        <div className="relative w-96 h-96 flex items-center justify-center">
          <AudioVisualizerWithFallback
            audioLevel={audioLevel}
            isRecording={agentState === "listening"}
            isPlaying={agentState === "speaking"}
            isProcessing={agentState === "thinking"}
            frequencyData={frequencyData}
            className="w-full h-full"
            onClick={handleVisualizerClick}
          />
        </div>

        {/* Status text */}
        <div className="space-y-2 h-16 flex flex-col justify-center">
          <p className="text-xl font-semibold text-gray-800">{getStatusText(agentState, audioLevel)}</p>
          <p className="text-sm text-gray-600 font-medium">{getSubtitleText(agentState)}</p>
        </div>

        {/* Control Panel - Only show when connected with proper spacing */}
        {agentState !== "disconnected" && (
          <div className="mt-6 pb-4">
            <ControlPanel showMicDropdown={showMicDropdown} setShowMicDropdown={setShowMicDropdown} />
          </div>
        )}
      </div>
    </div>
  )
}

function StatusIndicator({ agentState }: { agentState: string }) {
  const getStatusConfig = () => {
    switch (agentState) {
      case "connecting":
        return {
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: Wifi,
          text: "Connecting...",
        }
      case "listening":
        return {
          color: "text-slate-600",
          bg: "bg-slate-50",
          border: "border-slate-200",
          icon: Mic,
          text: "Listening",
        }
      case "thinking":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: Circle,
          text: "Processing...",
        }
      case "speaking":
        return {
          color: "text-purple-600",
          bg: "bg-purple-50",
          border: "border-purple-200",
          icon: Volume2,
          text: "Speaking",
        }
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: Circle,
          text: "Ready",
        }
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`absolute top-4 right-4 z-50 ${config.bg} ${config.border} ${config.color} px-4 py-2 rounded-xl border shadow-sm`}
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-medium">{config.text}</span>
        {agentState === "listening" && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            className="w-2 h-2 bg-slate-500 rounded-full"
          />
        )}
      </div>
    </motion.div>
  )
}

function ControlPanel({
  showMicDropdown,
  setShowMicDropdown,
}: {
  showMicDropdown: boolean
  setShowMicDropdown: (show: boolean) => void
}) {
  const { state: agentState } = useVoiceAssistant()

  return (
    <div className="flex items-center justify-center gap-4 relative">
      <AnimatePresence>
        {agentState !== "disconnected" && agentState !== "connecting" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center gap-4"
          >
            {/* Microphone Settings */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowMicDropdown(!showMicDropdown)}
                className="bg-white/80 backdrop-blur-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-white transition-all flex items-center gap-2 shadow-sm"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showMicDropdown ? "rotate-180" : ""}`} />
              </motion.button>

              <MicrophoneSelector isOpen={showMicDropdown} onClose={() => setShowMicDropdown(false)} />
            </div>
            {/* Disconnect Button */}
            <DisconnectButton>
              <span className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all shadow-sm inline-flex items-center gap-2">
                Disconnect
              </span>
            </DisconnectButton>
          </motion.div>
        )}
      </AnimatePresence>
      {showMicDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowMicDropdown(false)} />}
    </div>
  )
}

function getStatusText(agentState: string, audioLevel: number) {
  switch (agentState) {
    case "listening":
      return audioLevel > 0 ? "Listening... Keep speaking" : "Listening... Speak a bit louder"
    case "thinking":
      return "Processing your voice..."
    case "speaking":
      return "Playing response..."
    case "connecting":
      return "Connecting to DONNA..."
    case "disconnected":
      return "Tap to start speaking"
    default:
      return "Ready to listen"
  }
}

function getSubtitleText(agentState: string) {
  switch (agentState) {
    case "listening":
      return "Speak naturally"
    case "thinking":
      return "Please wait a moment"
    case "speaking":
      return "Audio response playing"
    case "connecting":
      return "Establishing connection"
    case "disconnected":
      return "Tap the visualizer to begin"
    default:
      return "Start speaking to begin"
  }
}

function onDeviceFailure(error: Error) {
  console.error(error)
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the page",
  )
}
