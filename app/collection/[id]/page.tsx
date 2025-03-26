"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { CollectionInfo } from "@/components/collection-info"
import { ObjectsList } from "@/components/objects-list"

interface Collection {
  id: string
  title: string
  description?: string
  can_read: boolean
  can_write: boolean
  media_types: string[]
}

export default function CollectionPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [collection, setCollection] = useState<Collection | null>(null)
  const [apiRootUrl, setApiRootUrl] = useState<string | null>(null)

  const collectionId = params.id as string

  useEffect(() => {
    const serverData = sessionStorage.getItem("taxiiServer")
    const collectionData = sessionStorage.getItem("selectedCollection")

    if (!serverData) {
      router.push("/")
      return
    }

    if (!collectionData) {
      toast({
        title: "Error",
        description: "Collection information not found",
        variant: "destructive",
      })
      router.push("/dashboard")
      return
    }

    try {
      const { url } = JSON.parse(serverData)
      const parsedCollection = JSON.parse(collectionData)

      setCollection(parsedCollection)
      setApiRootUrl(url)
      setIsLoading(false)
    } catch (error) {
      console.error("Error processing collection data:", error)
      toast({
        title: "Error",
        description: "Failed to process collection data",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [collectionId, router, toast])

  if (isLoading) {
    return (
      <main className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="container mx-auto flex-1 p-4 md:p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </main>
    )
  }

  if (!collection) {
    return (
      <main className="min-h-screen flex flex-col">
        <DashboardHeader />
        <div className="container mx-auto flex-1 p-4 md:p-8">
          <Card>
            <CardHeader>
              <CardTitle>Collection Not Found</CardTitle>
              <CardDescription>The requested collection could not be found</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col">
      <DashboardHeader />

      <div className="container mx-auto flex-1 p-4 md:p-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{collection.title}</CardTitle>
            {collection.description && <CardDescription>{collection.description}</CardDescription>}
          </CardHeader>
        </Card>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="objects" disabled={!collection.can_read}>
              Objects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <CollectionInfo collection={collection} />
          </TabsContent>

          <TabsContent value="objects" className="mt-4">
            {collection.can_read ? (
              <ObjectsList apiRootUrl={apiRootUrl!} collectionId={collection.id} />
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p>You do not have read access to this collection</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>TAXII 2.0 Client for Next.js</p>
        </div>
      </footer>
    </main>
  )
}

