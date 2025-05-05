"use client"

import { useEffect, useRef } from "react"

interface QRCodeGeneratorProps {
  value: string
  size?: number
}

export function QRCodeGenerator({ value, size = 200 }: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Simulation d'un QR Code simple avec canvas
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    // Fond blanc
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, size, size)

    // Bordure
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, size, 20)
    ctx.fillRect(0, 0, 20, size)
    ctx.fillRect(size - 20, 0, 20, size)
    ctx.fillRect(0, size - 20, size, 20)

    // Pattern QR Code simulé
    const cellSize = size / 25
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
        }
      }
    }

    // Coins de positionnement
    const cornerSize = cellSize * 7

    // Coin supérieur gauche
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, 0, cornerSize, cornerSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(cellSize, cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect(2 * cellSize, 2 * cellSize, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize)

    // Coin supérieur droit
    ctx.fillStyle = "#000000"
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(size - cornerSize + cellSize, cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect(size - cornerSize + 2 * cellSize, 2 * cellSize, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize)

    // Coin inférieur gauche
    ctx.fillStyle = "#000000"
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(cellSize, size - cornerSize + cellSize, cornerSize - 2 * cellSize, cornerSize - 2 * cellSize)
    ctx.fillStyle = "#000000"
    ctx.fillRect(2 * cellSize, size - cornerSize + 2 * cellSize, cornerSize - 4 * cellSize, cornerSize - 4 * cellSize)
  }, [value, size])

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="border border-gray-300 rounded-lg shadow-md" />
      <p className="text-xs text-gray-500 text-center max-w-xs break-all">{value}</p>
    </div>
  )
}
