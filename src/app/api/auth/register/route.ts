import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://82ce67d3836c.ngrok-free.app/api/auth/register"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
    }

    // Forward the request to Spring Boot backend
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      await response.text()
      return NextResponse.json({ message: "Registration failed" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Registration failed" }, { status: 500 })
  }
}
