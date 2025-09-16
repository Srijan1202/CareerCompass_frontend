import { NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ONBOARDING_URL as string

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate required fields minimally
    if (!body.id || !body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Only extract the required fields and ensure testScores have rank
    const studentData = {
      id: body.id,
      name: body.name,
      email: body.email,
      phone: body.phone || "",
      dob: body.dob || "",
      location: body.location || "",
      currentEducation: body.currentEducation || {},
      testScores: (body.testScores || []).map((test: any) => ({
        testName: test.testName || "",
        score: test.score != null ? test.score : null,
        rank: test.rank || "",
      })),
    }

    // Forward to Spring Boot backend
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })

    if (!res.ok) {
      const errorText = await res.text()
      return NextResponse.json(
        { success: false, error: errorText },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json({ success: true, backendResponse: data })
  } catch (error: any) {
    console.error("Onboarding route error:", error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
