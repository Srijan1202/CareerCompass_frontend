import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful AI career mentor for CareerCompass. You specialize in:
            - Resume writing and optimization
            - Interview preparation and tips
            - Career guidance and planning
            - Skill development recommendations
            - Job search strategies
            - Professional networking advice
            - Career transitions and changes
            
            Always provide practical, actionable advice. Keep responses concise but helpful. 
            Focus on career-related topics and gently redirect if users ask about unrelated subjects.`,
          },
          {
            role: "user",
            content: message,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const botMessage = data.choices[0]?.message?.content || "I apologize, but I encountered an error. Please try again."

    return NextResponse.json({ message: botMessage })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to get response from AI mentor" }, { status: 500 })
  }
}
