import { Suspense } from "react"
import { ServerInfo } from "@/components/server-info"
import { ApiRootsList } from "@/components/api-roots-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { Toaster } from "@/components/ui/toaster"

export default function DashboardPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <DashboardHeader />

      <div className="container mx-auto flex-1 p-4 md:p-8">
        <div className="grid gap-6">
          <Suspense fallback={<div>Loading server info...</div>}>
            <ServerInfo />
          </Suspense>

          <Suspense fallback={<div>Loading API roots...</div>}>
            <ApiRootsList />
          </Suspense>
        </div>
      </div>

      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>TAXII 2.0 Client for Next.js</p>
        </div>
      </footer>

      <Toaster />
    </main>
  )
}

