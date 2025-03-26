"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { LogOut } from "lucide-react"

export function DashboardHeader() {
  const router = useRouter()
  const [serverTitle, setServerTitle] = useState("TAXII Server")

  useEffect(() => {
    const serverData = sessionStorage.getItem("taxiiServer")
    if (!serverData) {
      router.push("/")
      return
    }

    try {
      const parsed = JSON.parse(serverData)
      setServerTitle(parsed.title || "TAXII Server")
    } catch (e) {
      console.error("Failed to parse server data", e)
    }
  }, [router])

  const handleDisconnect = () => {
    sessionStorage.removeItem("taxiiServer")
    router.push("/")
  }

  return (
    <header className="bg-primary p-4 text-primary-foreground">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">TAXII 2.0 Client</h1>
          <p className="text-sm opacity-80">Connected to: {serverTitle}</p>
        </div>
        <Button variant="outline" onClick={handleDisconnect}>
          <LogOut className="h-4 w-4 mr-2" />
          Disconnect
        </Button>
      </div>
    </header>
  )
}

