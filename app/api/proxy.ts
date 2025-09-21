// app/api/proxy/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://exam-aptitude-api.onrender.com/ai/start/ai/start"
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Server responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
