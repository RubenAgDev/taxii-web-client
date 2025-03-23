import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { serverUrl } = await request.json()

    // Call your Python backend to get collections
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/taxii/collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ server_url: serverUrl }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}

