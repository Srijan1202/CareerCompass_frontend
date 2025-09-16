"use client"

import { useEffect, useRef } from "react"

interface AudioVisualizerWithFallbackProps {
  audioLevel: number
  isRecording: boolean
  isPlaying: boolean
  isProcessing: boolean
  frequencyData: Uint8Array
  className?: string
  onClick?: () => void
}

interface Point3D {
  x: number
  y: number
  z: number
  originalX: number
  originalY: number
  originalZ: number
}

export function AudioVisualizerWithFallback({
  audioLevel,
  isRecording,
  isPlaying,
  isProcessing,
  frequencyData,
  className = "",
  onClick,
}: AudioVisualizerWithFallbackProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const pointsRef = useRef<Point3D[]>([])
  const rotationRef = useRef({ x: 0, y: 0, z: 0 })

  // Initialize sphere points
  useEffect(() => {
    const points: Point3D[] = []
    const numPoints = 800 // More points for denser sphere
    const radius = 100

    // Generate points on sphere surface using spherical coordinates
    for (let i = 0; i < numPoints; i++) {
      // Fibonacci sphere distribution for even point distribution
      const theta = Math.acos(1 - (2 * (i + 0.5)) / numPoints)
      const phi = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5)

      const x = radius * Math.sin(theta) * Math.cos(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(theta)

      points.push({
        x,
        y,
        z,
        originalX: x,
        originalY: y,
        originalZ: z,
      })
    }

    pointsRef.current = points
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update rotation - ultra smooth
      if (isProcessing) {
        rotationRef.current.y += 0.008
        rotationRef.current.x += 0.003
      } else if (isRecording || isPlaying) {
        rotationRef.current.y += 0.005
        rotationRef.current.x += 0.002
      } else {
        rotationRef.current.y += 0.002
        rotationRef.current.x += 0.001
      }

      // Ultra smooth pulsing effects
      const time = Date.now() * 0.001
      const pulseY = Math.sin(time * 0.6) * 0.08 // Even gentler
      const pulseZ = Math.cos(time * 0.4) * 0.06 // Even gentler

      const points = pointsRef.current
      const projectedPoints: Array<{
        x: number
        y: number
        z: number
        size: number
        opacity: number
        color: string
        glow: number
      }> = []

      // Project 3D points to 2D and calculate properties
      points.forEach((point, index) => {
        // Apply rotation
        const cosY = Math.cos(rotationRef.current.y)
        const sinY = Math.sin(rotationRef.current.y)
        const cosX = Math.cos(rotationRef.current.x)
        const sinX = Math.sin(rotationRef.current.x)

        // Rotate around Y axis
        let x = point.originalX * cosY - point.originalZ * sinY
        let z = point.originalX * sinY + point.originalZ * cosY
        let y = point.originalY

        // Rotate around X axis
        const newY = y * cosX - z * sinX
        z = y * sinX + z * cosX
        y = newY

        // Apply ultra smooth pulsing effects
        y += y * pulseY
        z += z * pulseZ

        // Ultra smooth audio responsiveness - even simpler than processing
        let audioOffset = 0
        if (isRecording) {
          // Ultra smooth listening - slower, gentler wave
          audioOffset = Math.sin(time * 0.003 + index * 0.06) * (6 + audioLevel * 3)
        } else if (isPlaying) {
          // Ultra smooth speaking - slightly faster but still very gentle
          audioOffset = Math.sin(time * 0.004 + index * 0.08) * (7 + audioLevel * 3.5)
        } else if (isProcessing) {
          // Original smooth processing movement
          audioOffset = Math.sin(time * 0.005 + index * 0.1) * 8
        } else {
          // Ultra subtle movement for idle
          audioOffset = Math.sin(time * 0.001 + index * 0.03) * 2
        }

        // Apply audio offset radially
        const distance = Math.sqrt(x * x + y * y + z * z)
        if (distance > 0) {
          const factor = (distance + audioOffset) / distance
          x *= factor
          y *= factor
          z *= factor
        }

        // 3D to 2D projection (perspective projection)
        const perspective = 300
        const scale = perspective / (perspective + z)
        const projectedX = centerX + x * scale
        const projectedY = centerY + y * scale

        // Calculate dot properties based on depth and state - keep dots thin
        const dotSize = 0.6 * scale // Consistently thin dots
        let opacity = Math.max(0.1, scale * 0.8)
        let color = "rgba(55, 65, 81, 0.7)" // Default dark gray for light mode
        let glow = 0

        // Apply state-specific effects with ultra smooth transitions
        if (isRecording) {
          color = "rgba(71, 85, 105, 0.8)" // Calm blue-gray

          // Ultra smooth pulsing opacity
          const smoothPulse = 0.5 + Math.sin(time * 0.8 + index * 0.015) * 0.15
          opacity = Math.max(0.3, Math.min(1, smoothPulse + audioLevel * 0.15))

          // Ultra smooth glow effect
          glow = 0.8 + Math.sin(time * 0.6 + index * 0.02) * 0.4 + audioLevel * 0.8
        } else if (isPlaying) {
          color = "rgba(124, 58, 237, 0.9)" // Darker purple for light mode

          // Ultra smooth pulsing for speaking
          const smoothPulse = 0.6 + Math.sin(time * 1.0 + index * 0.02) * 0.15
          opacity = Math.max(0.4, Math.min(1, smoothPulse + audioLevel * 0.2))

          // Ultra smooth glow for speaking
          glow = 1.0 + Math.sin(time * 0.8 + index * 0.025) * 0.5 + audioLevel * 1.2
        } else if (isProcessing) {
          color = "rgba(37, 99, 235, 0.8)" // Darker blue for light mode
          opacity = Math.max(0.4, opacity)
          glow = Math.sin(time * 2 + index * 0.1) * 0.5
        }

        // Only render points that are in front and within canvas bounds
        if (
          z > -perspective &&
          projectedX >= -10 &&
          projectedX <= canvas.width + 10 &&
          projectedY >= -10 &&
          projectedY <= canvas.height + 10
        ) {
          projectedPoints.push({
            x: projectedX,
            y: projectedY,
            z,
            size: dotSize,
            opacity,
            color,
            glow,
          })
        }
      })

      // Sort points by depth (z-coordinate) for proper rendering order
      projectedPoints.sort((a, b) => a.z - b.z)

      // Render points with glow effect
      projectedPoints.forEach((point) => {
        // Add glow effect if needed
        if (point.glow > 0) {
          ctx.shadowColor = point.color
          ctx.shadowBlur = point.glow
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2)
        ctx.fillStyle = point.color
        ctx.globalAlpha = point.opacity
        ctx.fill()
      })

      // Reset shadow and global alpha
      ctx.shadowBlur = 0
      ctx.globalAlpha = 1

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [audioLevel, isRecording, isPlaying, isProcessing, frequencyData])

  return (
    <div className={`relative ${className}`} onClick={onClick}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-full cursor-pointer"
        style={{ background: "transparent" }}
      />
    </div>
  )
}
