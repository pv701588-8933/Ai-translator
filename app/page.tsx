"use client"

import { useState, useCallback, useEffect } from "react"
import Header from "@/components/header"
import TranslationPanel from "@/components/translation-panel"
import FloatingAlphabets from "@/components/floating-alphabets"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const { toast } = useToast()
  const [sourceLanguage, setSourceLanguage] = useState("en")
  const [targetLanguage, setTargetLanguage] = useState("es")
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system")
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light")
    }

    setSystemTheme(mediaQuery.matches ? "dark" : "light")
    mediaQuery.addEventListener("change", handleChange)

    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    const effectiveTheme = theme === "system" ? systemTheme : theme
    const root = document.documentElement

    if (effectiveTheme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme, systemTheme])

  const mockTranslate = (text: string, _sourceLang: string, _targetLang: string) => {
    const translations: { [key: string]: string } = {
      hello: "hola",
      goodbye: "adiós",
      "thank you": "gracias",
      yes: "sí",
      no: "no",
      water: "agua",
      food: "comida",
      help: "ayuda",
      please: "por favor",
      "good morning": "buenos días",
    }

    const lowerText = text.toLowerCase()
    if (translations[lowerText]) {
      return translations[lowerText]
    }

    return `[Translated: ${text}]`
  }

  const translateText = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        setTranslatedText("")
        return
      }

      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const result = mockTranslate(text, sourceLanguage, targetLanguage)
        setTranslatedText(result)
      } catch (error) {
        toast({
          title: "Translation Error",
          description: "Failed to translate text. Please try again.",
          variant: "destructive",
        })
        console.error("Translation error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [sourceLanguage, targetLanguage, toast],
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      translateText(sourceText)
    }, 400)

    return () => clearTimeout(timer)
  }, [sourceText, translateText])

  const handleSwapLanguages = () => {
    setSourceLanguage(targetLanguage)
    setTargetLanguage(sourceLanguage)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="dark:hidden">
        <FloatingAlphabets />
      </div>
      <Header theme={theme} onThemeChange={setTheme} />
      <TranslationPanel
        sourceLanguage={sourceLanguage}
        targetLanguage={targetLanguage}
        sourceText={sourceText}
        translatedText={translatedText}
        isLoading={isLoading}
        onSourceLanguageChange={setSourceLanguage}
        onTargetLanguageChange={setTargetLanguage}
        onSourceTextChange={setSourceText}
        onSwapLanguages={handleSwapLanguages}
      />
    </main>
  )
}
