"use client"

import { Badge } from "@/components/ui/badge"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Eye, Filter } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ObjectViewer } from "@/components/object-viewer"

interface TaxiiObject {
  id: string
  type: string
  created: string
  modified: string
  [key: string]: any
}

export function ObjectsList({ apiRootUrl, collectionId }: { apiRootUrl: string; collectionId: string }) {
  const [objects, setObjects] = useState<TaxiiObject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedObject, setSelectedObject] = useState<TaxiiObject | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchObjects() {
      const serverData = sessionStorage.getItem("taxiiServer")
      if (!serverData) {
        router.push("/")
        return
      }

      try {
        const { credentials } = JSON.parse(serverData)

        const response = await fetch("/api/taxii/objects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            apiRootUrl,
            collectionId,
            credentials,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch objects")
        }

        const data = await response.json()
        setObjects(data.objects || [])
      } catch (error) {
        console.error("Error fetching objects:", error)
        toast({
          title: "Error",
          description: "Failed to fetch objects",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchObjects()
  }, [apiRootUrl, collectionId, router, toast])

  const filteredObjects = objects.filter((obj) => {
    if (!searchTerm) return true

    const searchLower = searchTerm.toLowerCase()
    return (
      obj.id.toLowerCase().includes(searchLower) ||
      obj.type.toLowerCase().includes(searchLower) ||
      (obj.name && obj.name.toLowerCase().includes(searchLower))
    )
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!objects.length) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>No objects available in this collection</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search objects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {filteredObjects.length === 0 ? (
              <p>No objects match your search</p>
            ) : (
              filteredObjects.map((obj) => (
                <div key={obj.id} className="p-4 border rounded-md hover:bg-muted/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{obj.name || obj.id}</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {obj.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">ID: {obj.id}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(obj.created).toLocaleString()}
                        {obj.modified && ` • Modified: ${new Date(obj.modified).toLocaleString()}`}
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedObject(obj)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Object Details</DialogTitle>
                          <DialogDescription>
                            {obj.type} - {obj.id}
                          </DialogDescription>
                        </DialogHeader>
                        <ObjectViewer object={obj} />
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

