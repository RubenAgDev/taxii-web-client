"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface ApiRootInfoData {
  title: string
  description?: string
  versions: string[]
  max_content_length: number
}

export function ApiRootInfo({ apiRootUrl }: { apiRootUrl: string }) {
  const [apiRootInfo, setApiRootInfo] = useState<ApiRootInfoData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchApiRootInfo() {
      const serverData = sessionStorage.getItem("taxiiServer")
      if (!serverData) {
        router.push("/")
        return
      }

      try {
        const { credentials } = JSON.parse(serverData)

        const response = await fetch("/api/taxii/api-root", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiRootUrl,
            credentials,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch API root information")
        }

        const data = await response.json()
        setApiRootInfo(data)
      } catch (error) {
        console.error("Error fetching API root info:", error)
        toast({
          title: "Error",
          description: "Failed to fetch API root information",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiRootInfo()
  }, [apiRootUrl, router, toast])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!apiRootInfo) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No API root information available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Title</h3>
            <p>{apiRootInfo.title || "Untitled API Root"}</p>
          </div>

          {apiRootInfo.description && (
            <div>
              <h3 className="font-medium">Description</h3>
              <p>{apiRootInfo.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium">Supported Versions</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {apiRootInfo.versions.map((version, index) => (
                <span key={index} className="px-2 py-1 bg-muted rounded text-xs">
                  {version}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium">Max Content Length</h3>
            <p>{apiRootInfo.max_content_length.toLocaleString()} bytes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

