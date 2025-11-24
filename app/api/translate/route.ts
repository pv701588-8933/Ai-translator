import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text, source_lang, target_lang } = await request.json()

    if (!text || !source_lang || !target_lang) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Using MyMemory Translation API (free, no key required)
    // You can replace this with DeepL, Google Translate, or another API
    const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${source_lang}|${target_lang}`

    const response = await fetch(apiUrl)
    const data = await response.json()

    if (data.responseStatus !== 200) {
      return NextResponse.json({ error: "Translation service error" }, { status: 500 })
    }

    return NextResponse.json({
      translated_text: data.responseData.translatedText,
    })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
