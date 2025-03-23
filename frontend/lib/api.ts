import type { ServerInfoType, CollectionType, ObjectType } from "./types"

// Function to fetch server information
export async function fetchServerInfo(serverUrl: string): Promise<ServerInfoType> {
  const response = await fetch("/api/taxii/server-info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serverUrl }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch server info: ${response.statusText}`)
  }

  return response.json()
}

// Function to fetch collections
export async function fetchCollections(serverUrl: string): Promise<CollectionType[]> {
  const response = await fetch("/api/taxii/collections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ serverUrl }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch collections: ${response.statusText}`)
  }

  return response.json()
}

// Function to fetch objects from a collection
export async function fetchObjects(
  serverUrl: string,
  collectionId: string,
  params?: {
    added_after?: string
    limit?: number
    next?: string
    types?: string[]
  },
): Promise<ObjectType[]> {
  const response = await fetch("/api/taxii/objects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serverUrl,
      collectionId,
      params,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch objects: ${response.statusText}`)
  }

  return response.json()
}

// Function to fetch a single object
export async function fetchObject(serverUrl: string, collectionId: string, objectId: string): Promise<ObjectType> {
  const response = await fetch("/api/taxii/object", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serverUrl,
      collectionId,
      objectId,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch object: ${response.statusText}`)
  }

  return response.json()
}

