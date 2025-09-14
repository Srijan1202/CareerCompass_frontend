import { NextResponse } from "next/server"

const BACKEND_URL = "https://82ce67d3836c.ngrok-free.app/api/users/onboarding"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Forward the request to Spring Boot backend
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json({ error: errorText }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error: unknown) {
    console.error("Onboarding route error:", error)
    return NextResponse.json({ error: "Failed to process onboarding" }, { status: 500 })
  }
}
