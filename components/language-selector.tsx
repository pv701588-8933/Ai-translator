"use client"

import { ChevronDown } from "lucide-react"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "zh", name: "Chinese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
]

interface LanguageSelectorProps {
  label: string
  value: string
  onChange: (lang: string) => void
}

export default function LanguageSelector({ label, value, onChange }: LanguageSelectorProps) {
  const currentLanguage = languages.find((l) => l.code === value)

  return (
    <div className="flex flex-col gap-2">
      <label className="section-label text-sm font-semibold text-muted-foreground uppercase tracking-widest text-opacity-75">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full sm:w-48 px-4 py-3 rounded-xl bg-white dark:bg-[#1e1e28] border-2 border-white/40 dark:border-[#7a4dff] text-[#2a2a2a] dark:text-white placeholder-[#6e6e6e] dark:placeholder-[#c6c6c6] font-semibold appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:focus:ring-primary/50 hover:border-opacity-60 dark:hover:border-opacity-100 focus:border-primary dark:focus:border-[#7a4dff] dark:hover:shadow-lg"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#6e6e6e] dark:text-[#c6c6c6]" />
      </div>
    </div>
  )
}
