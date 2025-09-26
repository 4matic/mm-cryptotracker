import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, Database, Calculator, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DataProviderProps {
  pair: string;
  calculation: string;
}

export function DataProvider({ pair, calculation }: DataProviderProps) {
  return (
    <Card className="surface-elevated border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Data Provider & Methodology
          </CardTitle>
          <Link href="/methodology">
            <Button variant="outline" size="sm" className="cursor-pointer">
              View Full Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calculator className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-semibold">Price Calculation for {pair}</h4>
              <p className="text-sm text-muted-foreground text-pretty">
                {calculation}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> Cryptocurrency prices are highly
            volatile and can change rapidly. This data is provided for
            informational purposes only and should not be considered as
            financial advice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
