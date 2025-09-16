"use client"

import { useState, useEffect } from "react"
import { Mic, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface MicrophoneSelectorProps {
  isOpen: boolean
  onClose: () => void
}

export function MicrophoneSelector({ isOpen, onClose }: MicrophoneSelectorProps) {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string>("")
  const [currentDevice, setCurrentDevice] = useState<MediaDeviceInfo | null>(null)

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permissions first
        await navigator.mediaDevices.getUserMedia({ audio: true })

        // Get all audio input devices
        const allDevices = await navigator.mediaDevices.enumerateDevices()
        const audioInputs = allDevices.filter((device) => device.kind === "audioinput")
        setDevices(audioInputs)

        // Set default device
        const defaultDevice = audioInputs.find((device) => device.deviceId === "default") || audioInputs[0]
        if (defaultDevice) {
          setSelectedDevice(defaultDevice.deviceId)
          setCurrentDevice(defaultDevice)
        }
      } catch (error) {
        console.error("Error getting audio devices:", error)
      }
    }

    if (isOpen) {
      getDevices()
    }
  }, [isOpen])

  const handleDeviceSelect = async (device: MediaDeviceInfo) => {
    try {
      setSelectedDevice(device.deviceId)
      setCurrentDevice(device)

      // Here you would typically update the actual audio input
      // This depends on your audio library implementation
      console.log("Selected device:", device.label || device.deviceId)

      onClose()
    } catch (error) {
      console.error("Error selecting device:", error)
    }
  }

  const formatDeviceName = (device: MediaDeviceInfo) => {
    if (!device.label) return "Unknown Device"

    // Clean up the device name
    let name = device.label

    // Convert to uppercase for primary devices
    if (name.toLowerCase().includes("default") || name.toLowerCase().includes("communication")) {
      name = name.toUpperCase()
    }

    return name
  }

  const isDeviceAvailable = (device: MediaDeviceInfo) => {
    // A device is considered available if it has a label and is not a duplicate
    return device.label && device.deviceId !== "default" && device.deviceId !== "communications"
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 min-w-96 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">MICROPHONE</h3>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="space-y-3">
            {/* Current Selection Display */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-3">
                <Mic className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {currentDevice ? currentDevice.label || "Default Microphone" : "Default - Microphone"}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>

            {/* Device List */}
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {devices.length > 0 ? (
                devices.map((device) => {
                  const isSelected = device.deviceId === selectedDevice
                  const isAvailable = isDeviceAvailable(device)

                  return (
                    <motion.div
                      key={device.deviceId}
                      whileHover={isAvailable ? { backgroundColor: "rgba(0, 0, 0, 0.02)" } : {}}
                      onClick={() => isAvailable && handleDeviceSelect(device)}
                      className={`p-3 rounded-lg transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-blue-50 border border-blue-200"
                          : isAvailable
                            ? "hover:bg-gray-50"
                            : "cursor-not-allowed"
                      }`}
                    >
                      <div className={`text-sm font-medium ${isAvailable ? "text-gray-900" : "text-gray-400"}`}>
                        {formatDeviceName(device)}
                      </div>
                      {isSelected && <div className="text-xs text-blue-600 mt-1">Currently selected</div>}
                    </motion.div>
                  )
                })
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">Loading microphones...</div>
              )}
            </div>

            {/* Permissions note */}
            <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
              💡 If you don&apost see your microphone, please check your browser permissions and refresh the page.
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
