"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import type { CollectionType } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface CollectionsViewProps {
  collections: CollectionType[]
  selectedCollection: string | null
  onSelectCollection: (id: string) => void
}

export function CollectionsView({ collections, selectedCollection, onSelectCollection }: CollectionsViewProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCollections = collections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>TAXII Collections</CardTitle>
        <CardDescription>Browse available collections from the TAXII server</CardDescription>
        <Input
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </CardHeader>
      <CardContent>
        {filteredCollections.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Can Read</TableHead>
                <TableHead>Can Write</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.map((collection) => (
                <TableRow
                  key={collection.id}
                  className={selectedCollection === collection.id ? "bg-muted/50" : ""}
                  onClick={() => onSelectCollection(collection.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell className="font-medium">{collection.title}</TableCell>
                  <TableCell>{collection.description || "No description"}</TableCell>
                  <TableCell>
                    {collection.can_read ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>}
                  </TableCell>
                  <TableCell>
                    {collection.can_write ? <Badge variant="default">Yes</Badge> : <Badge variant="outline">No</Badge>}
                  </TableCell>
                  <TableCell>{formatDate(collection.added)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-4">
            {searchTerm ? "No collections match your search" : "No collections available"}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

