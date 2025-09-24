export interface TradingPair {
  id: number;
  symbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  isActive: boolean;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TradingPairsResponse {
  pairs: TradingPair[];
  total: number;
  page: number;
  limit: number;
}

export interface TradingPairsParams {
  page?: number;
  limit?: number;
  isVisible?: boolean;
}
