"use client"

import type React from "react"

import { Mic, Upload, X, Volume2 } from "lucide-react"
import { useState, useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface TextAreaProps {
  placeholder: string
  value: string
  onChange: (text: string) => void
  isReadOnly: boolean
  maxLength?: number
}

export default function TextArea({ placeholder, value, onChange, isReadOnly, maxLength = 5000 }: TextAreaProps) {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)
  const [isListening, setIsListening] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const charCount = value.length

  const handleClear = () => {
    onChange("")
  }

  const handleMicClick = async () => {
    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        })
        return
      }

      const recognition = new SpeechRecognition()
      setIsListening(true)

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            onChange(value + (value ? " " : "") + transcript)
          } else {
            interimTranscript += transcript
          }
        }
      }

      recognition.onerror = (event: any) => {
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        })
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start speech recognition.",
        variant: "destructive",
      })
      setIsListening(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    try {
      if (file.type === "text/plain") {
        const text = await file.text()
        const remainingSpace = maxLength - value.length
        const textToAdd = text.slice(0, remainingSpace)
        onChange(value + (value ? " " : "") + textToAdd)
        toast({
          title: "Success",
          description: "Text file uploaded successfully.",
        })
      } else if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer()

        // Simple PDF text extraction simulation
        // In production, you'd use PDF.js library
        const uint8Array = new Uint8Array(arrayBuffer)
        let text = ""

        for (let i = 0; i < uint8Array.length; i++) {
          const byte = uint8Array[i]
          if (byte >= 32 && byte <= 126) {
            text += String.fromCharCode(byte)
          }
        }

        const cleanedText = text
          .replace(/[^\w\s.,!?-]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
        const remainingSpace = maxLength - value.length
        const textToAdd = cleanedText.slice(0, remainingSpace)

        onChange(value + (value ? " " : "") + textToAdd)
        toast({
          title: "Success",
          description: "PDF file uploaded successfully.",
        })
      } else {
        toast({
          title: "Error",
          description: "Only .txt and .pdf files are supported.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the file.",
        variant: "destructive",
      })
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleListen = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(value)
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in your browser.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="File upload"
      />

      <div className="relative flex-1">
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={isReadOnly}
          maxLength={maxLength}
          className="w-full h-full p-4 sm:p-6 rounded-2xl bg-white dark:bg-[#1e1e28] border-2 border-[#d4b3f8] dark:border-[#7a4dff] text-[#2a2a2a] dark:text-white placeholder-[#6e6e6e] dark:placeholder-[#c6c6c6] focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary/50 focus:border-primary dark:focus:border-[#7a4dff] resize-none transition-all leading-relaxed font-medium hover:border-opacity-60 dark:hover:border-opacity-100 dark:hover:shadow-md"
          style={{
            color: isReadOnly ? "inherit" : undefined,
          }}
        />

        {isReadOnly && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: "inset 0 0 6px rgba(122, 77, 255, 0.2)",
            }}
          />
        )}

        <div className="absolute top-4 right-4 flex gap-1.5">
          {isReadOnly ? (
            <button
              onMouseEnter={() => setHoveredIcon("listen")}
              onMouseLeave={() => setHoveredIcon(null)}
              onClick={handleListen}
              className="p-2.5 rounded-lg bg-white/60 dark:bg-[#2d2d3d] hover:bg-primary/15 dark:hover:bg-primary/20 transition-all duration-200 text-[#6e6e6e] dark:text-[#c6c6c6] hover:text-primary dark:hover:text-[#b560ff] hover:scale-105"
              title="Listen"
              aria-label="Play text-to-speech"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                onMouseEnter={() => setHoveredIcon("mic")}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={handleMicClick}
                className={`p-2.5 rounded-lg transition-all duration-200 ${
                  isListening
                    ? "bg-primary/20 dark:bg-primary/30 text-primary dark:text-[#b560ff] shadow-lg scale-105"
                    : "bg-white/60 dark:bg-[#2d2d3d] text-[#6e6e6e] dark:text-[#c6c6c6] hover:text-primary dark:hover:text-[#b560ff] hover:bg-primary/15 dark:hover:bg-primary/20 hover:scale-105"
                }`}
                title={isListening ? "Listening..." : "Voice input"}
                aria-label="Mic input"
              >
                <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
              </button>
              <button
                onMouseEnter={() => setHoveredIcon("upload")}
                onMouseLeave={() => setHoveredIcon(null)}
                onClick={() => fileInputRef.current?.click()}
                className="p-2.5 rounded-lg bg-white/60 dark:bg-[#2d2d3d] hover:bg-primary/15 dark:hover:bg-primary/20 transition-all duration-200 text-[#6e6e6e] dark:text-[#c6c6c6] hover:text-primary dark:hover:text-[#b560ff] hover:scale-105"
                title="Upload file"
                aria-label="Upload text file"
              >
                <Upload className="w-4 h-4" />
              </button>
              {value && (
                <button
                  onMouseEnter={() => setHoveredIcon("clear")}
                  onMouseLeave={() => setHoveredIcon(null)}
                  onClick={handleClear}
                  className="p-2.5 rounded-lg bg-white/60 dark:bg-[#2d2d3d] hover:bg-primary/15 dark:hover:bg-primary/20 transition-all duration-200 text-[#6e6e6e] dark:text-[#c6c6c6] hover:text-primary dark:hover:text-[#b560ff] hover:scale-105"
                  title="Clear"
                  aria-label="Clear text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {!isReadOnly && (
        <div className="text-xs text-[#6e6e6e] dark:text-[#c6c6c6] text-right font-medium">
          {charCount.toLocaleString()} / {maxLength.toLocaleString()} characters
        </div>
      )}
    </div>
  )
}
