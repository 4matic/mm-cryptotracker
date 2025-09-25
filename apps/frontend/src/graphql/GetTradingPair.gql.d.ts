import { DocumentNode } from 'graphql';

// Types based on backend models from libs/shared/graphql/src/models
export interface Asset {
  symbol: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

export interface PriceHistory {
  price: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface TradingPair {
  id: string;
  symbol: string;
  slug: string;
  baseAsset: Asset;
  quoteAsset: Asset;
  calculatedPrice?: PriceHistory;
}

// GraphQL Query Variables
export interface GetTradingPairVariables {
  slug: string;
}

// GraphQL Query Response
export interface GetTradingPairResponse {
  tradingPairBySlug: TradingPair | null;
}

// GraphQL Document
declare const GetTradingPairDocument: DocumentNode;
export default GetTradingPairDocument;
