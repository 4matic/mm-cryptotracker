'use server';

import { GraphQLClient } from 'graphql-request';
import { TradingPairsParams } from '@/lib/types';
import type { PaginatedTradingPairsModel } from '@mm-cryptotracker/shared-graphql';
import GetTradingPairsQuery from '@/graphql/GetTradingPairs.gql';

/**
 * Server action to fetch trading pairs from the backend API
 */
export async function getTradingPairs(
  params: TradingPairsParams = {}
): Promise<PaginatedTradingPairsModel> {
  const graphqlUrl = process.env.BACKEND_GRAPHQL_URL;

  if (!graphqlUrl) {
    throw new Error(
      'BACKEND_GRAPHQL_URL environment variable is not configured'
    );
  }

  const client = new GraphQLClient(graphqlUrl);

  try {
    const { page = 1, limit = 20, isVisible } = params;
    const variables = { page, limit, isVisible };

    const data = await client.request<{
      tradingPairsWithPagination: PaginatedTradingPairsModel;
    }>(GetTradingPairsQuery, variables);

    return data.tradingPairsWithPagination;
  } catch (error) {
    console.error('Error fetching trading pairs:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch trading pairs: ${error.message}`
        : 'Failed to fetch trading pairs: Unknown error'
    );
  }
}
