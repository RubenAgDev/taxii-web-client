import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { serverUrl, collectionId, objectId } = await request.json()

    // Call your Python backend to get a specific object
    const response = await fetch(`${process.env.PYTHON_BACKEND_URL}/taxii/object`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        server_url: serverUrl,
        collection_id: collectionId,
        object_id: objectId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching object:", error)
    return NextResponse.json({ error: "Failed to fetch object" }, { status: 500 })
  }
}

