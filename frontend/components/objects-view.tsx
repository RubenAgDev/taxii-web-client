"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { AlertCircle, RefreshCw, Search, Filter } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { ObjectType } from "@/lib/types"
import { fetchObjects } from "@/lib/api"
import { formatDate } from "@/lib/utils"
import { ObjectDetails } from "@/components/object-details"

interface ObjectsViewProps {
  serverUrl: string
  collectionId: string
}

export function ObjectsView({ serverUrl, collectionId }: ObjectsViewProps) {
  const [objects, setObjects] = useState<ObjectType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [selectedObject, setSelectedObject] = useState<ObjectType | null>(null)

  const pageSize = 10

  useEffect(() => {
    loadObjects()
  }, [collectionId])

  const loadObjects = async () => {
    setLoading(true)
    setError(null)

    try {
      const objectsData = await fetchObjects(serverUrl, collectionId)
      setObjects(objectsData)
      setPage(1)
    } catch (err) {
      setError("Failed to load objects from the collection")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Get unique object types for filtering
  const objectTypes = ["all", ...new Set(objects.map((obj) => obj.type))]

  // Filter and paginate objects
  const filteredObjects = objects.filter(
    (obj) =>
      (searchTerm === "" ||
        obj.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obj.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (typeFilter === "all" || obj.type === typeFilter),
  )

  const paginatedObjects = filteredObjects.slice((page - 1) * pageSize, page * pageSize)
  const totalPages = Math.ceil(filteredObjects.length / pageSize)

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>STIX Objects</CardTitle>
              <CardDescription>Browse objects in the selected collection</CardDescription>
            </div>
            <Button onClick={loadObjects} variant="outline" disabled={loading}>
              {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search objects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {objectTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : paginatedObjects.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedObjects.map((obj) => (
                    <TableRow key={obj.id}>
                      <TableCell className="font-mono text-xs">{obj.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{obj.type}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(obj.created)}</TableCell>
                      <TableCell>{formatDate(obj.modified)}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedObject(obj)}>
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Object Details</DialogTitle>
                              <DialogDescription>Detailed information about the selected STIX object</DialogDescription>
                            </DialogHeader>
                            {selectedObject && <ObjectDetails object={selectedObject} />}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink onClick={() => setPage(p)} isActive={page === p}>
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              {searchTerm || typeFilter !== "all"
                ? "No objects match your search criteria"
                : "No objects available in this collection"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

