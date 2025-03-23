"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CollectionsView } from "@/components/collections-view"
import { ObjectsView } from "@/components/objects-view"
import { ServerInfo } from "@/components/server-info"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchServerInfo, fetchCollections } from "@/lib/api"
import type { ServerInfoType, CollectionType } from "@/lib/types"

export function TaxiiDashboard() {
  const [serverUrl, setServerUrl] = useState("")
  const [serverInfo, setServerInfo] = useState<ServerInfoType | null>(null)
  const [collections, setCollections] = useState<CollectionType[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const connectToServer = async () => {
    if (!serverUrl) {
      setError("Please enter a TAXII server URL")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const info = await fetchServerInfo(serverUrl)
      setServerInfo(info)

      const collectionsData = await fetchCollections(serverUrl)
      setCollections(collectionsData)

      if (collectionsData.length > 0) {
        setSelectedCollection(collectionsData[0].id)
      }
    } catch (err) {
      setError("Failed to connect to TAXII server. Please check the URL and try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connect to TAXII Server</CardTitle>
          <CardDescription>Enter the URL of your TAXII 2.x server to retrieve threat intelligence data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="https://taxii.example.com/taxii2/"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={connectToServer} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {serverInfo && (
        <>
          <ServerInfo info={serverInfo} />

          <Tabs defaultValue="collections" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="collections">Collections</TabsTrigger>
              <TabsTrigger value="objects" disabled={!selectedCollection}>
                Objects
              </TabsTrigger>
            </TabsList>
            <TabsContent value="collections">
              <CollectionsView
                collections={collections}
                selectedCollection={selectedCollection}
                onSelectCollection={setSelectedCollection}
              />
            </TabsContent>
            <TabsContent value="objects">
              {selectedCollection && <ObjectsView serverUrl={serverUrl} collectionId={selectedCollection} />}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

