import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ServerInfoType } from "@/lib/types"

interface ServerInfoProps {
  info: ServerInfoType
}

export function ServerInfo({ info }: ServerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Server Information</CardTitle>
        <CardDescription>Details about the connected TAXII server</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
            <p>{info.title}</p>
          </div>
          {info.description && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p>{info.description}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
            <p>{info.version}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
            <p>{info.contact || "Not specified"}</p>
          </div>
          {info.api_roots && info.api_roots.length > 0 && (
            <div className="col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">API Roots</h3>
              <ul className="list-disc list-inside mt-1">
                {info.api_roots.map((root, index) => (
                  <li key={index} className="text-sm">
                    {root}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

