import { TradingPairsSection } from '@/components/trading-pairs-section';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Info, TrendingUp, BarChart3, Shield } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-1/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10 pointer-events-none" />

      <Header />

      <main className="relative container mx-auto px-4 py-12">
        <div className="space-y-16">
          {/* Enhanced Hero Section */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Cryptocurrency Price Tracking
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent leading-tight">
                MM CryptoTracker
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
                Advanced cryptocurrency price monitoring with comprehensive
                market analysis and detailed historical insights
              </p>
            </div>

            {/* Feature highlights */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-chart-1" />
                Price Analysis
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-chart-2" />
                Reliable Data
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-chart-3" />
                Market Insights
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Link href="/methodology">
                <Button
                  variant="outline"
                  className="gap-2 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 hover:border-border transition-all duration-200 px-6 py-3 text-base cursor-pointer"
                >
                  <Info className="h-5 w-5" />
                  View Data Methodology
                </Button>
              </Link>
            </div>
          </div>

          {/* Trading Pairs Section */}
          <TradingPairsSection />
        </div>
      </main>
    </div>
  );
}
