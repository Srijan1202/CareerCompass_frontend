import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ message: "No authorization header" }, { status: 401 })
    }

    const backendResponse = await fetch(`${process.env.SPRING_BOOT_API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    })

    if (backendResponse.ok) {
      return NextResponse.json({ message: "Logged out successfully" })
    } else {
      const data = await backendResponse.json()
      return NextResponse.json({ message: data.message || "Logout failed" }, { status: backendResponse.status })
    }
  } catch (error) {
    console.error("Logout API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
