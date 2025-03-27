"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { CollectionsList } from "@/components/collections-list"
import { ApiRootInfo } from "@/components/api-root-info"

export default function ApiRootPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [apiRootUrl, setApiRootUrl] = useState<string | null>(null)

  useEffect(() => {
    const selectedApiRoot = sessionStorage.getItem("selectedApiRoot")
    if (!selectedApiRoot) {
      router.push("/")
      return
    }

    try {
      setApiRootUrl(selectedApiRoot)
      setIsLoading(false)
    } catch (error) {
      console.error("Error processing API root URL:", error)
      toast({
        title: "Error",
        description: "Failed to process API root URL",
        variant: "destructive",
      })
      router.push("/dashboard")
    }
  }, [router, toast])

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

  return (
    <main className="min-h-screen flex flex-col">
      <DashboardHeader />

      <div className="container mx-auto flex-1 p-4 md:p-8">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Root</CardTitle>
            <CardDescription className="font-mono text-sm truncate">{apiRootUrl}</CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4">
            <ApiRootInfo apiRootUrl={apiRootUrl!} />
          </TabsContent>

          <TabsContent value="collections" className="mt-4">
            <CollectionsList apiRootUrl={apiRootUrl!} />
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

