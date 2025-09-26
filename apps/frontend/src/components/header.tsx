import { TrendingUp } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-gradient-to-br from-primary/20 to-chart-1/20 rounded-xl border border-primary/20">
              <TrendingUp className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-chart-1/10 rounded-xl blur-sm" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                MM CryptoTracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Advanced Price Monitoring
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
