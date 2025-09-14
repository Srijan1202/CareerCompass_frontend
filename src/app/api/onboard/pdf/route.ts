import { type NextRequest, NextResponse } from "next/server"

const BACKEND_URL = "https://82ce67d3836c.ngrok-free.app/api/users/pdf-upload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 })
    }

    // Create FormData for Spring Boot backend
    const backendFormData = new FormData()
    backendFormData.append("file", file)
    if (userId) {
      backendFormData.append("userId", userId)
    }

    // Forward the PDF to Spring Boot backend
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      body: backendFormData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      return NextResponse.json({ error: "Failed to process PDF" }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("PDF upload error:", error)
    return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
  }
}
