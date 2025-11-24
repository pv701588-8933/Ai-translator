"use client"

import { useEffect, useState } from "react"

interface FloatingLetter {
  id: string
  char: string
  size: number
  opacity: number
  rotation: number
  weight: "light" | "normal" | "medium"
  top: string
  left: string
}

export default function FloatingAlphabets() {
  const [letters, setLetters] = useState<FloatingLetter[]>([])

  useEffect(() => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const letterCount = Math.floor(Math.random() * (35 - 20 + 1)) + 20

    const newLetters: FloatingLetter[] = Array.from({ length: letterCount }).map((_, i) => {
      const randomChar = alphabet[Math.floor(Math.random() * alphabet.length)]
      const size = Math.floor(Math.random() * (140 - 24 + 1)) + 24
      const opacity = Math.random() * (0.12 - 0.05) + 0.05
      const rotation = Math.random() * (12 - -12) + -12
      const weights: ("light" | "normal" | "medium")[] = ["light", "normal", "medium"]
      const weight = weights[Math.floor(Math.random() * weights.length)]
      const top = Math.random() * 100 + "%"
      const left = Math.random() * 100 + "%"

      return {
        id: `letter-${i}`,
        char: randomChar,
        size,
        opacity,
        rotation,
        weight,
        top,
        left,
      }
    })

    setLetters(newLetters)
  }, [])

  const fontWeightMap = {
    light: 300,
    normal: 400,
    medium: 500,
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {letters.map((letter) => (
        <span
          key={letter.id}
          className="absolute select-none"
          style={{
            top: letter.top,
            left: letter.left,
            fontSize: `${letter.size}px`,
            fontWeight: fontWeightMap[letter.weight],
            opacity: letter.opacity,
            transform: `rotate(${letter.rotation}deg)`,
            color: "rgba(128, 90, 213, 1)",
            lineHeight: 1,
            pointerEvents: "none",
          }}
        >
          {letter.char}
        </span>
      ))}
    </div>
  )
}
