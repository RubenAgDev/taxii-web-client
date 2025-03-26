"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ServerInfoData {
  title: string
  description?: string
  contact?: string
  default?: string
  api_roots?: string[]
  version?: string
}

export function ServerInfo() {
  const [serverInfo, setServerInfo] = useState<ServerInfoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchServerInfo() {
      const serverData = sessionStorage.getItem("taxiiServer")
      if (!serverData) {
        router.push("/")
        return
      }

      try {
        const { url, credentials } = JSON.parse(serverData)

        const response = await fetch("/api/taxii/discover", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serverUrl: url,
            credentials,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch server information")
        }

        const data = await response.json()
        setServerInfo(data)
      } catch (error) {
        console.error("Error fetching server info:", error)
        toast({
          title: "Error",
          description: "Failed to fetch server information",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServerInfo()
  }, [router, toast])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading Server Information
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!serverInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Server Information</CardTitle>
          <CardDescription>No server information available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Information</CardTitle>
        <CardDescription>Details about the connected TAXII server</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Title</h3>
            <p>{serverInfo.title || "Untitled Server"}</p>
          </div>

          {serverInfo.description && (
            <div>
              <h3 className="font-medium">Description</h3>
              <p>{serverInfo.description}</p>
            </div>
          )}

          {serverInfo.contact && (
            <div>
              <h3 className="font-medium">Contact</h3>
              <p>{serverInfo.contact}</p>
            </div>
          )}

          {serverInfo.version && (
            <div>
              <h3 className="font-medium">Version</h3>
              <Badge variant="outline">{serverInfo.version}</Badge>
            </div>
          )}

          {serverInfo.default && (
            <div>
              <h3 className="font-medium">Default API Root</h3>
              <p className="font-mono text-sm">{serverInfo.default}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

