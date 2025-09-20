import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://user-service-53266248406.europe-west1.run.app/api/auth/login"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Forward the request to Spring Boot backend
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
