import { DocumentNode } from 'graphql';
import type { PaginatedTradingPairsModel } from '@mm-cryptotracker/shared-graphql';

// GraphQL Query Variables
export interface GetTradingPairsVariables {
  page: number;
  limit: number;
  isVisible: boolean;
}

// GraphQL Query Response
export interface GetTradingPairsResponse {
  tradingPairsWithPagination: PaginatedTradingPairsModel | null;
}

// GraphQL Document
declare const GetTradingPairDocument: DocumentNode;
export default GetTradingPairDocument;
