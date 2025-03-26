"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TaxiiObject {
  id: string
  type: string
  [key: string]: any
}

export function ObjectViewer({ object }: { object: TaxiiObject }) {
  const [activeTab, setActiveTab] = useState("formatted")

  const formatJson = (obj: any) => {
    return JSON.stringify(obj, null, 2)
  }

  const renderProperties = (obj: any, level = 0) => {
    return Object.entries(obj).map(([key, value]) => {
      // Skip rendering certain properties in the formatted view
      if (activeTab === "formatted" && ["type", "id", "spec_version"].includes(key)) {
        return null
      }

      const isObject = value !== null && typeof value === "object"

      return (
        <div key={key} style={{ marginLeft: `${level * 16}px` }} className="mb-2">
          <div className="font-medium text-sm">{key}:</div>
          {isObject ? (
            <div className="mt-1">{renderProperties(value, level + 1)}</div>
          ) : (
            <div className="text-sm break-words">
              {typeof value === "string" && value.startsWith("http") ? (
                <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {value}
                </a>
              ) : (
                String(value)
              )}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="formatted">Formatted</TabsTrigger>
        <TabsTrigger value="raw">Raw JSON</TabsTrigger>
      </TabsList>

      <TabsContent value="formatted" className="mt-4">
        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">{object.name || object.type}</h3>
              <div className="text-sm text-muted-foreground">
                Type: {object.type} • ID: {object.id}
              </div>
              {object.description && <p className="mt-2">{object.description}</p>}
            </div>

            <div className="space-y-2">{renderProperties(object)}</div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="raw" className="mt-4">
        <ScrollArea className="h-[400px] rounded-md border">
          <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{formatJson(object)}</pre>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  )
}

