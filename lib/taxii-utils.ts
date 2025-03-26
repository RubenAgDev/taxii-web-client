// Default TAXII headers
export const taxiiHeaders = {
  Accept: "application/vnd.oasis.taxii+json;version=2.1",
  "Content-Type": "application/vnd.oasis.taxii+json;version=2.1",
}

// Create Basic Auth header
export function createAuthHeader(username: string, password: string): string {
  const credentials = `${username}:${password}`
  const encodedCredentials = Buffer.from(credentials).toString("base64")
  return `Basic ${encodedCredentials}`
}

// Helper to normalize URLs
export function normalizeUrl(url: string): string {
  return url.endsWith("/") ? url : `${url}/`
}

// Helper to extract API root path from full URL
export function extractApiRootPath(apiRootUrl: string): string {
  try {
    const url = new URL(apiRootUrl)
    return url.pathname
  } catch (error) {
    console.error("Error extracting API root path:", error)
    return ""
  }
}

// Helper to create a TAXII filter object
export function createTaxiiFilter(options: {
  addedAfter?: string
  limit?: number
  match?: Record<string, string>
  types?: string[]
}): Record<string, string> {
  const filter: Record<string, string> = {}

  if (options.addedAfter) {
    filter.added_after = options.addedAfter
  }

  if (options.limit) {
    filter.limit = options.limit.toString()
  }

  if (options.match) {
    Object.entries(options.match).forEach(([key, value]) => {
      filter[`match[${key}]`] = value
    })
  }

  if (options.types && options.types.length > 0) {
    filter.type = options.types.join(",")
  }

  return filter
}

