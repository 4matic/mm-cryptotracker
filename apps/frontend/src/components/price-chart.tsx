'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useState, useMemo } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';
import { ChartTimeframe, TIMEFRAME_CONFIGS } from '@/enums/chart';

// Seeded random number generator for consistent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// Mock historical data with seeded randomness for consistent hydration
const generateMockData = (days: number, basePrice: number, pair: string) => {
  const data = [];
  // Use pair name as seed for consistent randomness
  const seed = pair
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Use a fixed reference date to ensure consistency between server and client
  const referenceDate = new Date('2024-01-01T00:00:00Z');
  const now = new Date(referenceDate.getTime() + days * 24 * 60 * 60 * 1000);

  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const randomSeed = seed + i;
    const randomChange = (seededRandom(randomSeed) - 0.5) * 0.2; // ±10% random change
    const price = basePrice * (1 + randomChange * (i / days));

    const volumeSeed = seed + i + 1000;
    const volume = Math.floor(seededRandom(volumeSeed) * 1000000) + 500000;

    data.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(4)),
      volume: volume,
      timestamp: date.getTime(),
    });
  }

  return data.sort((a, b) => a.timestamp - b.timestamp);
};

interface PriceChartProps {
  pair: string;
  disabled?: boolean;
  availableTimeframes?: ChartTimeframe[];
}

export function PriceChart({
  pair,
  disabled = false,
  availableTimeframes = [
    ChartTimeframe.ONE_DAY,
    ChartTimeframe.SEVEN_DAYS,
    ChartTimeframe.ONE_MONTH,
    ChartTimeframe.THREE_MONTHS,
    ChartTimeframe.ONE_YEAR,
  ],
}: PriceChartProps) {
  const timeframeConfigs = availableTimeframes.map(
    (tf) => TIMEFRAME_CONFIGS[tf]
  );
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    timeframeConfigs[2]?.days || 30 // Default to 1M if available, otherwise first available
  );

  // Generate mock data based on pair with memoization to prevent hydration issues
  const basePrice = pair === 'TON/USDT' ? 5.42 : 0.1845;
  const data = useMemo(
    () => generateMockData(selectedTimeframe, basePrice, pair),
    [selectedTimeframe, basePrice, pair]
  );

  const currentPrice = data[data.length - 1]?.price || basePrice;
  const previousPrice = data[0]?.price || basePrice;
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  const isPositive = priceChange >= 0;

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: { volume: number } }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-lg font-bold font-mono">
            ${payload[0].value.toFixed(4)}
          </p>
          <p className="text-sm text-muted-foreground">
            Volume: ${payload[0].payload.volume.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="surface-elevated border-border/50 relative">
      {disabled && (
        <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/30 rounded-lg flex items-center justify-center">
          <div className="bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-6 shadow-lg max-w-sm mx-4 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Data Unavailable</h3>
            <p className="text-muted-foreground text-sm">
              Historical chart data is temporarily unavailable. Please try again
              later.
            </p>
          </div>
        </div>
      )}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              {pair} Price Chart
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono">
                ${currentPrice.toFixed(4)}
              </span>
              <span
                className={`text-sm font-medium ${
                  isPositive ? 'crypto-green' : 'crypto-red'
                }`}
              >
                {isPositive ? '+' : ''}
                {priceChange.toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="flex gap-1">
            {timeframeConfigs.map((timeframe) => (
              <Button
                key={timeframe.label}
                variant={
                  selectedTimeframe === timeframe.days ? 'default' : 'ghost'
                }
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe.days)}
                className="text-xs cursor-pointer"
                disabled={disabled}
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return selectedTimeframe <= 7
                    ? date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    : date.toLocaleDateString('en-US', {
                        month: 'short',
                        year: '2-digit',
                      });
                }}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${value.toFixed(4)}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-muted-foreground">Period High</span>
            <div className="font-mono font-semibold crypto-green">
              ${Math.max(...data.map((d) => d.price)).toFixed(4)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Period Low</span>
            <div className="font-mono font-semibold crypto-red">
              ${Math.min(...data.map((d) => d.price)).toFixed(4)}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Avg Volume</span>
            <div className="font-mono font-semibold">
              $
              {Math.floor(
                data.reduce((sum, d) => sum + d.volume, 0) / data.length
              ).toLocaleString()}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground">Volatility</span>
            <div className="font-mono font-semibold">
              {Math.abs(priceChange).toFixed(2)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
