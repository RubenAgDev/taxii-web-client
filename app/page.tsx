import { Suspense } from "react"
import ConnectForm from "@/components/connect-form"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <header className="bg-primary p-4 text-primary-foreground">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">TAXII 2.0 Client</h1>
          <p className="text-sm opacity-80">Connect to TAXII servers and explore threat intelligence data</p>
        </div>
      </header>

      <div className="container mx-auto flex-1 p-4 md:p-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ConnectForm />
        </Suspense>
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

