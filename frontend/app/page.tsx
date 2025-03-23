import { Suspense } from "react"
import { TaxiiDashboard } from "@/components/taxii-dashboard"
import { LoadingDashboard } from "@/components/loading-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-primary">TAXII Intelligence Dashboard</h1>
        <Suspense fallback={<LoadingDashboard />}>
          <TaxiiDashboard />
        </Suspense>
      </div>
    </main>
  )
}

