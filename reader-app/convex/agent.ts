"use node"

import { action } from "./_generated/server"
import { v } from "convex/values"

// Using OpenRouter API (free models available)
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

export const askClaude = action({
  args: {
    question: v.string(),
    pageContent: v.string(),
    pageNumber: v.number(),
    bookTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const { question, pageContent, pageNumber, bookTitle } = args

    const systemPrompt = `You are a helpful reading assistant for "${bookTitle}".
The user is currently on page ${pageNumber}.

Current page content:
---
${pageContent}
---

Help the user understand this content. Be concise and helpful. Reference specific parts of the text when relevant.
If the question isn't about this page, politely mention you only have context for the current page.`

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://reader-app.vercel.app",
        "X-Title": "Reader App"
      },
      body: JSON.stringify({
        model: "z-ai/glm-4.5-air:free", // Free - good for reading comprehension
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenRouter error:", error)
      throw new Error("Failed to get AI response")
    }

    const data = await response.json()
    const assistantMessage = data.choices?.[0]?.message?.content
      || "Sorry, I could not generate a response."

    // Save the assistant's response to the database
    await ctx.runMutation("chat:sendMessage" as any, {
      content: assistantMessage,
      role: "assistant" as const,
      pageNumber,
    })

    return assistantMessage
  },
})
