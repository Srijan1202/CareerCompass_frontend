import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    const backendResponse = await fetch(`${process.env.SPRING_BOOT_API_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ message: data.message || "Registration failed" }, { status: backendResponse.status })
    }
  } catch (error) {
    console.error("Registration API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
