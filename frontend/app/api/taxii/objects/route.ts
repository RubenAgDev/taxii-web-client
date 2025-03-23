import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { serverUrl, collectionId, params } = await request.json()

    // Call your Python backend to get objects
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/taxii/objects`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server_url: serverUrl,
        collection_id: collectionId,
        params,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching objects:", error)
    return NextResponse.json({ error: "Failed to fetch objects" }, { status: 500 })
  }
}

