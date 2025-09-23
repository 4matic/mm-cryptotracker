import { PriceTable } from "@/components/price-table"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-balance">MM CryptoTracker</h1>
            <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Track cryptocurrency prices with detailed analysis and historical data
            </p>

            <div className="flex justify-center">
              <Link href="/methodology">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Info className="h-4 w-4" />
                  View Data Methodology
                </Button>
              </Link>
            </div>
          </div>

          <PriceTable />
        </div>
      </main>
    </div>
  )
}
