import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_START_URL + "/ai/start",
      { headers: { "Content-Type": "application/json" } }
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
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      process.env.NEXT_PUBLIC_BACKEND_APPTITUDE_URL + "/ai/question?ans=" + encodeURIComponent(body.answer),
      { method: "GET" } // Keep GET since backend expects GET with query param
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Server responded with ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.text();
    return NextResponse.json({ question: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
