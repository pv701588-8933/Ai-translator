"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  theme: "light" | "dark" | "system"
  onThemeChange: (theme: "light" | "dark" | "system") => void
}

export default function Header({ theme, onThemeChange }: HeaderProps) {
  const [showThemeMenu, setShowThemeMenu] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-primary flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                TranslateFlow
              </h1>
              <p className="text-xs text-muted-foreground">Instant Translation</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className="p-2.5 rounded-lg hover:bg-muted/80 transition-all duration-200 text-muted-foreground hover:text-foreground hover:scale-105"
              title="Theme"
              aria-label="Toggle theme"
            >
              {theme === "dark" ||
              (theme === "system" &&
                typeof window !== "undefined" &&
                window.matchMedia("(prefers-color-scheme: dark)").matches) ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 animate-in fade-in duration-150">
                <button
                  onClick={() => {
                    onThemeChange("light")
                    setShowThemeMenu(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-muted/50 transition-all duration-150 dark:hover:bg-muted/30 dark:text-white font-medium ${theme === "light" ? "bg-muted/30 text-primary" : ""}`}
                >
                  <Sun className="w-4 h-4" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => {
                    onThemeChange("dark")
                    setShowThemeMenu(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-muted/50 transition-all duration-150 dark:hover:bg-muted/30 dark:text-white font-medium ${theme === "dark" ? "bg-muted/30 text-primary" : ""}`}
                >
                  <Moon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
                <button
                  onClick={() => {
                    onThemeChange("system")
                    setShowThemeMenu(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 hover:bg-muted/50 transition-all duration-150 dark:hover:bg-muted/30 dark:text-white font-medium ${theme === "system" ? "bg-muted/30 text-primary" : ""}`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>System</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
