"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  serverUrl: z.string().url({ message: "Please enter a valid URL" }),
  username: z.string().optional(),
  password: z.string().optional(),
  useAuth: z.boolean().default(false),
})

type FormValues = z.infer<typeof formSchema>

export default function ConnectForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverUrl: "",
      username: "",
      password: "",
      useAuth: false,
    },
  })

  const useAuth = form.watch("useAuth")

  async function onSubmit(data: FormValues) {
    setIsLoading(true)

    try {
      const credentials = data.useAuth ? { username: data.username, password: data.password } : undefined

      const response = await fetch("/api/taxii/discover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serverUrl: data.serverUrl,
          credentials,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to connect to TAXII server")
      }

      const serverInfo = await response.json()

      // Store connection info in session storage
      sessionStorage.setItem(
        "taxiiServer",
        JSON.stringify({
          url: data.serverUrl,
          credentials: data.useAuth ? { username: data.username, password: data.password } : null,
          title: serverInfo.title || "TAXII Server",
        }),
      )

      toast({
        title: "Connected successfully",
        description: `Connected to ${serverInfo.title || "TAXII Server"}`,
      })

      // Navigate to the dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Connection error:", error)
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect to TAXII server",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect to TAXII Server</CardTitle>
        <CardDescription>Enter the URL and optional credentials for your TAXII 2.0 server</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="serverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Server URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/taxii2/" {...field} />
                  </FormControl>
                  <FormDescription>The base URL of the TAXII 2.0 server</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="useAuth"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Use Authentication</FormLabel>
                    <FormDescription>Enable if the TAXII server requires authentication</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {useAuth && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

