"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ObjectType } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ObjectDetailsProps {
  object: ObjectType
}

export function ObjectDetails({ object }: ObjectDetailsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="json">JSON</TabsTrigger>
        <TabsTrigger value="relationships">Relationships</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
                  <p className="font-mono text-sm">{object.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
                  <Badge variant="outline">{object.type}</Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                  <p>{formatDate(object.created)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Modified</h3>
                  <p>{formatDate(object.modified)}</p>
                </div>
              </div>

              <div className="space-y-2">
                {object.name && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                    <p>{object.name}</p>
                  </div>
                )}
                {object.description && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p className="text-sm">{object.description}</p>
                  </div>
                )}
                {object.pattern && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Pattern</h3>
                    <p className="font-mono text-xs overflow-x-auto">{object.pattern}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Render type-specific properties based on object type */}
            {object.type === "indicator" && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Indicator Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {object.valid_from && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Valid From</h4>
                      <p>{formatDate(object.valid_from)}</p>
                    </div>
                  )}
                  {object.valid_until && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Valid Until</h4>
                      <p>{formatDate(object.valid_until)}</p>
                    </div>
                  )}
                  {object.indicator_types && (
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Indicator Types</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {object.indicator_types.map((type, index) => (
                          <Badge key={index} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {object.type === "malware" && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="text-sm font-medium mb-2">Malware Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {object.is_family && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Is Family</h4>
                      <p>{object.is_family ? "Yes" : "No"}</p>
                    </div>
                  )}
                  {object.malware_types && (
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground">Malware Types</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {object.malware_types.map((type, index) => (
                          <Badge key={index} variant="secondary">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="json">
        <Card>
          <CardContent className="pt-6">
            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">{JSON.stringify(object, null, 2)}</pre>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="relationships">
        <Card>
          <CardContent className="pt-6">
            {object.object_refs ? (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Related Objects</h3>
                <ul className="space-y-2">
                  {object.object_refs.map((ref, index) => (
                    <li key={index} className="bg-muted p-2 rounded-md">
                      <span className="font-mono text-xs">{ref}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-muted-foreground">No relationships found for this object.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

