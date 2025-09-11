import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ message: "No authorization header" }, { status: 401 })
    }

    const backendResponse = await fetch(`${process.env.SPRING_BOOT_API_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    })

    const data = await backendResponse.json()

    if (backendResponse.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json({ message: data.message || "Authentication failed" }, { status: backendResponse.status })
    }
  } catch (error) {
    console.error("Auth check API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
