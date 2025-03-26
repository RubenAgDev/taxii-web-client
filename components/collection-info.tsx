"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface Collection {
  id: string
  title: string
  description?: string
  can_read: boolean
  can_write: boolean
  media_types: string[]
}

export function CollectionInfo({ collection }: { collection: Collection }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">ID</h3>
            <p className="font-mono text-sm">{collection.id}</p>
          </div>

          <div>
            <h3 className="font-medium">Title</h3>
            <p>{collection.title}</p>
          </div>

          {collection.description && (
            <div>
              <h3 className="font-medium">Description</h3>
              <p>{collection.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium">Permissions</h3>
            <div className="flex gap-4 mt-1">
              <div className="flex items-center">
                <span className="mr-2">Read:</span>
                {collection.can_read ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-2">Write:</span>
                {collection.can_write ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <X className="h-4 w-4 text-red-600" />
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Supported Media Types</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {collection.media_types.map((mediaType, index) => (
                <Badge key={index} variant="outline">
                  {mediaType}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

