import { Badge } from '@/components/ui/badge';
import { TrendingUp, Clock, Zap, CheckCircle2 } from 'lucide-react';
import { getDataProviders } from '@/lib/actions';
import type { DataProviderModel } from '@mm-cryptotracker/shared-graphql';

export async function DataProvidersSection() {
  let dataProviders: DataProviderModel[] = [];

  try {
    dataProviders = await getDataProviders();
  } catch (error) {
    console.error('Failed to fetch data providers:', error);
    // Component will continue to render without the data providers section
  }

  return (
    <>
      {dataProviders.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
            <span className="font-semibold text-foreground">
              External Data Providers
            </span>
            <Badge
              variant="secondary"
              className="bg-primary/20 text-primary border-primary/30"
            >
              <TrendingUp className="h-3 w-3 mr-1" />
              Third-party
            </Badge>
          </div>
          <div className="space-y-4 ml-2">
            {dataProviders.map((provider) => (
              <div
                key={provider.name}
                className="group/provider p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="font-medium text-foreground">
                    {provider.name}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-green-500 ml-auto" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {provider.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        className={`${
          dataProviders.length > 0 ? 'border-t border-border/30 pt-6' : ''
        } space-y-3`}
      >
        <div className="flex items-center justify-between p-3 rounded-lg bg-accent/30">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-semibold">Data Collection</span>
          </div>
          <Badge variant="outline" className="bg-background/50">
            <Zap className="h-3 w-3 mr-1" />
            Scheduled
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed px-1">
          Price data is fetched from external providers at regular intervals.
          These providers aggregate market data from multiple exchanges on their
          end before delivering it to our system.
        </p>
      </div>
    </>
  );
}
