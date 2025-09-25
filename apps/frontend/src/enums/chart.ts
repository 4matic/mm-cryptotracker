export enum ChartTimeframe {
  ONE_DAY = '1D',
  SEVEN_DAYS = '7D',
  ONE_MONTH = '1M',
  THREE_MONTHS = '3M',
  ONE_YEAR = '1Y',
}

export interface TimeframeConfig {
  label: ChartTimeframe;
  days: number;
}

export const TIMEFRAME_CONFIGS: Record<ChartTimeframe, TimeframeConfig> = {
  [ChartTimeframe.ONE_DAY]: { label: ChartTimeframe.ONE_DAY, days: 1 },
  [ChartTimeframe.SEVEN_DAYS]: { label: ChartTimeframe.SEVEN_DAYS, days: 7 },
  [ChartTimeframe.ONE_MONTH]: { label: ChartTimeframe.ONE_MONTH, days: 30 },
  [ChartTimeframe.THREE_MONTHS]: {
    label: ChartTimeframe.THREE_MONTHS,
    days: 90,
  },
  [ChartTimeframe.ONE_YEAR]: { label: ChartTimeframe.ONE_YEAR, days: 365 },
};
