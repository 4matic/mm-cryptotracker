'use server';

import { GraphQLClient } from 'graphql-request';
import { TradingPairsParams } from '@/lib/types';
import type { PaginatedTradingPairsModel } from '@mm-cryptotracker/shared-graphql';
import { GetTradingPairs as GetTradingPairsQuery } from '@/graphql/GetTradingPairs.gql';

/**
 * Server action to fetch trading pairs from the backend API
 */
export async function getTradingPairs(
  params: TradingPairsParams = {}
): Promise<PaginatedTradingPairsModel> {
  const backendUrl = process.env.BACKEND_GRAPHQL_URL;

  if (!backendUrl) {
    throw new Error(
      'BACKEND_GRAPHQL_URL environment variable is not configured'
    );
  }

  const graphqlEndpoint = `${backendUrl}/graphql`;
  const client = new GraphQLClient(graphqlEndpoint);

  try {
    const { page = 1, limit = 20, isVisible } = params;
    const variables = { page, limit, isVisible };

    const data: { tradingPairsWithPagination: PaginatedTradingPairsModel } =
      await client.request(GetTradingPairsQuery, variables);

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
