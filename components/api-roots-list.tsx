"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ChevronRight } from "lucide-react"

interface ServerData {
  url: string
  credentials?: {
    username: string
    password: string
  } | null
}

export function ApiRootsList() {
  const [apiRoots, setApiRoots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [serverData, setServerData] = useState<ServerData | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchApiRoots() {
      const serverDataStr = sessionStorage.getItem("taxiiServer")
      if (!serverDataStr) {
        router.push("/")
        return
      }

      try {
        const parsedServerData = JSON.parse(serverDataStr)
        setServerData(parsedServerData)

        const response = await fetch("/api/taxii/discover", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            serverUrl: parsedServerData.url,
            credentials: parsedServerData.credentials,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch API roots")
        }

        const data = await response.json()
        setApiRoots(data.api_roots || [])
      } catch (error) {
        console.error("Error fetching API roots:", error)
        toast({
          title: "Error",
          description: "Failed to fetch API roots",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiRoots()
  }, [router, toast])

  const handleApiRootClick = (apiRoot: string) => {
    // Store the selected API root in session storage
    sessionStorage.setItem("selectedApiRoot", apiRoot)

    // Extract the API root path from the full URL
    const apiRootPath = new URL(apiRoot).pathname

    // Navigate to the API root page
    router.push(`/api-root${apiRootPath}`)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Loading API Roots
          </CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!apiRoots.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Roots</CardTitle>
          <CardDescription>No API roots available</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Roots</CardTitle>
        <CardDescription>Available API roots on this TAXII server</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {apiRoots.map((apiRoot, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-between"
              onClick={() => handleApiRootClick(apiRoot)}
            >
              <span className="font-mono text-sm truncate">{apiRoot}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

