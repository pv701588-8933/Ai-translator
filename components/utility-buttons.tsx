"use client"

import { useState } from "react"
import { Copy, Volume2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UtilityButtonsProps {
  text: string
}

export default function UtilityButtons({ text }: UtilityButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Translation copied to clipboard.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy text.",
        variant: "destructive",
      })
    }
  }

  const handleSpeak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
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
    <div className="mt-6 flex gap-3 flex-wrap">
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy
          </>
        )}
      </button>
      <button
        onClick={handleSpeak}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white dark:bg-[#2d2d3d] text-[#2a2a2a] dark:text-[#c6c6c6] hover:bg-white/80 dark:hover:bg-[#3a3a4a] border border-white/40 dark:border-[#7a4dff] transition-all duration-200 font-semibold text-sm hover:shadow-lg hover:scale-105"
        aria-label="Play text-to-speech"
      >
        <Volume2 className="w-4 h-4" />
        Listen
      </button>
    </div>
  )
}
