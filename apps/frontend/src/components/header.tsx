import { TrendingUp } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">MM CryptoTracker</h1>
              <p className="text-sm text-muted-foreground">Cryptocurrency Price Monitor</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
