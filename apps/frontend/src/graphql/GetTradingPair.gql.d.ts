import { DocumentNode } from 'graphql';
import type { TradingPairModel } from '@mm-cryptotracker/shared-graphql';

// GraphQL Query Variables
export interface GetTradingPairVariables {
  slug: string;
}

// GraphQL Query Response
export interface GetTradingPairResponse {
  tradingPairBySlug: TradingPairModel | null;
}

// GraphQL Document
declare const GetTradingPairDocument: DocumentNode;
export default GetTradingPairDocument;
