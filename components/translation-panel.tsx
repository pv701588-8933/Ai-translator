"use client"

import LanguageSelector from "./language-selector"
import TextArea from "./text-area"
import UtilityButtons from "./utility-buttons"
import { ArrowRightLeft } from "lucide-react"

interface TranslationPanelProps {
  sourceLanguage: string
  targetLanguage: string
  sourceText: string
  translatedText: string
  isLoading: boolean
  onSourceLanguageChange: (lang: string) => void
  onTargetLanguageChange: (lang: string) => void
  onSourceTextChange: (text: string) => void
  onSwapLanguages: () => void
}

export default function TranslationPanel({
  sourceLanguage,
  targetLanguage,
  sourceText,
  translatedText,
  isLoading,
  onSourceLanguageChange,
  onTargetLanguageChange,
  onSourceTextChange,
  onSwapLanguages,
}: TranslationPanelProps) {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-background via-background to-muted/30 py-8 sm:py-12 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-3xl shadow-lg border border-border/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
          {/* Language Selector Header */}
          <div className="card-top border-b border-border/40 bg-gradient-to-r from-muted/40 to-muted/20 px-6 sm:px-8 py-6 lg:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <LanguageSelector label="From" value={sourceLanguage} onChange={onSourceLanguageChange} />

              <button
                onClick={onSwapLanguages}
                className="p-3 hover:bg-primary/15 rounded-full transition-all duration-300 group hover:scale-105"
                aria-label="Swap languages"
                title="Swap languages"
              >
                <ArrowRightLeft className="w-5 h-5 text-primary group-hover:text-primary/90 transition-colors group-hover:scale-110" />
              </button>

              <LanguageSelector label="To" value={targetLanguage} onChange={onTargetLanguageChange} />
            </div>
          </div>

          {/* Text Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
            {/* Source Text Area */}
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <TextArea
                placeholder="Enter text to translate..."
                value={sourceText}
                onChange={onSourceTextChange}
                isReadOnly={false}
                maxLength={5000}
              />
            </div>

            {/* Target Text Area */}
            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              {isLoading ? (
                <div className="flex flex-col gap-4 h-full">
                  {/* Shimmer effect */}
                  <div className="flex-1 rounded-xl bg-muted animate-pulse relative overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <TextArea
                    placeholder="Translation will appear here..."
                    value={translatedText}
                    onChange={() => {}}
                    isReadOnly={true}
                  />
                  {translatedText && <UtilityButtons text={translatedText} />}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
