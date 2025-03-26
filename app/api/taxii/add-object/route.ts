import { type NextRequest, NextResponse } from "next/server"
import { taxiiHeaders, createAuthHeader } from "@/lib/taxii-utils"

export async function POST(request: NextRequest) {
  try {
    const { apiRootUrl, collectionId, object, credentials } = await request.json()

    if (!apiRootUrl || !collectionId || !object) {
      return NextResponse.json(
        { message: "API Root URL, Collection ID, and Object data are required" },
        { status: 400 },
      )
    }

    // Create the objects URL for adding a new object
    const objectsUrl = new URL(`collections/${collectionId}/objects/`, apiRootUrl).toString()

    // Set up headers
    const headers = new Headers(taxiiHeaders)
    headers.set("Content-Type", "application/vnd.oasis.stix+json;version=2.1")

    // Add authentication if provided
    if (credentials) {
      const authHeader = createAuthHeader(credentials.username, credentials.password)
      headers.set("Authorization", authHeader)
    }

    // Prepare the request body
    const requestBody = {
      objects: Array.isArray(object) ? object : [object],
    }

    // Make the request to the TAXII server
    const response = await fetch(objectsUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
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
    console.error("Error in add object endpoint:", error)

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}

