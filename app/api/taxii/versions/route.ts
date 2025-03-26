import { type NextRequest, NextResponse } from "next/server"
import { taxiiHeaders, createAuthHeader } from "@/lib/taxii-utils"

export async function POST(request: NextRequest) {
  try {
    const { apiRootUrl, collectionId, objectId, credentials } = await request.json()

    if (!apiRootUrl || !collectionId || !objectId) {
      return NextResponse.json({ message: "API Root URL, Collection ID, and Object ID are required" }, { status: 400 })
    }

    // Create the versions URL
    const versionsUrl = new URL(`collections/${collectionId}/objects/${objectId}/versions/`, apiRootUrl).toString()

    // Set up headers
    const headers = new Headers(taxiiHeaders)

    // Add authentication if provided
    if (credentials) {
      const authHeader = createAuthHeader(credentials.username, credentials.password)
      headers.set("Authorization", authHeader)
    }

    // Make the request to the TAXII server
    const response = await fetch(versionsUrl, {
      method: "GET",
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("TAXII server error:", errorText)

      return NextResponse.json(
        { message: `TAXII server returned an error: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in versions endpoint:", error)

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
    0
  }
  \
    )
}
}

