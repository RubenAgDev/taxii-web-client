"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ChevronRight, Lock, Unlock } from "lucide-react"

interface Collection {
  id: string
  title: string
  description?: string
  can_read: boolean
  can_write: boolean
  media_types: string[]
}

export function CollectionsList({ apiRootUrl }: { apiRootUrl: string }) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCollections() {
      const serverData = sessionStorage.getItem("taxiiServer")
      if (!serverData) {
        router.push("/")
        return
      }

      try {
        const { credentials } = JSON.parse(serverData)

        const response = await fetch("/api/taxii/collections", {
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
          throw new Error("Failed to fetch collections")
        }

        const data = await response.json()
        setCollections(data.collections || [])
      } catch (error) {
        console.error("Error fetching collections:", error)
        toast({
          title: "Error",
          description: "Failed to fetch collections",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCollections()
  }, [apiRootUrl, router, toast])

  const handleCollectionClick = (collection: Collection) => {
    // Store the selected collection in session storage
    sessionStorage.setItem("selectedCollection", JSON.stringify(collection))

    // Navigate to the collection page
    router.push(`/collection/${collection.id}`)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!collections.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No collections available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          {collections.map((collection) => (
            <Button
              key={collection.id}
              variant="outline"
              className="w-full justify-between p-4 h-auto"
              onClick={() => handleCollectionClick(collection)}
            >
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{collection.title}</span>
                  {collection.can_read ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Unlock className="h-3 w-3 mr-1" />
                      Read
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <Lock className="h-3 w-3 mr-1" />
                      No Read
                    </Badge>
                  )}
                  {collection.can_write && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      Write
                    </Badge>
                  )}
                </div>
                {collection.description && (
                  <span className="text-sm text-muted-foreground mt-1">{collection.description}</span>
                )}
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

