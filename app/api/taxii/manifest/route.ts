import { type NextRequest, NextResponse } from "next/server"
import { taxiiHeaders, createAuthHeader } from "@/lib/taxii-utils"

export async function POST(request: NextRequest) {
  try {
    const { apiRootUrl, collectionId, credentials, filters } = await request.json()

    if (!apiRootUrl || !collectionId) {
      return NextResponse.json({ message: "API Root URL and Collection ID are required" }, { status: 400 })
    }

    // Create the manifest URL
    const manifestUrl = new URL(`collections/${collectionId}/manifest/`, apiRootUrl).toString()

    // Set up headers
    const headers = new Headers(taxiiHeaders)

    // Add authentication if provided
    if (credentials) {
      const authHeader = createAuthHeader(credentials.username, credentials.password)
      headers.set("Authorization", authHeader)
    }

    // Add query parameters if filters are provided
    let url = manifestUrl
    if (filters) {
      const urlObj = new URL(manifestUrl)

      // Add each filter as a query parameter
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          urlObj.searchParams.append(key, String(value))
        }
      })

      url = urlObj.toString()
    }

    // Make the request to the TAXII server
    const response = await fetch(url, {
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
    console.error("Error in manifest endpoint:", error)

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}

