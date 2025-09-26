'use server';

import { GraphQLClient } from 'graphql-request';
import { TradingPairsParams } from '@/lib/types';
import type { PaginatedTradingPairsModel } from '@mm-cryptotracker/shared-graphql';
import GetTradingPairsQuery from '@/graphql/GetTradingPairs.gql';
import GetTradingPairQuery, {
  GetTradingPairResponse,
  GetTradingPairVariables,
} from '@/graphql/GetTradingPair.gql';
import GetDataProvidersQuery, {
  GetDataProvidersResponse,
} from '@/graphql/GetDataProviders.gql';

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

/**
 * Server action to fetch a single trading pair by slug from the backend API
 */
export async function getTradingPair(
  slug: string
): Promise<GetTradingPairResponse['tradingPairBySlug']> {
  const graphqlUrl = process.env.BACKEND_GRAPHQL_URL;

  if (!graphqlUrl) {
    throw new Error(
      'BACKEND_GRAPHQL_URL environment variable is not configured'
    );
  }

  const client = new GraphQLClient(graphqlUrl);

  try {
    const variables: GetTradingPairVariables = { slug };

    const data = await client.request<GetTradingPairResponse>(
      GetTradingPairQuery,
      variables
    );

    return data.tradingPairBySlug;
  } catch (error) {
    console.error('Error fetching trading pair:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch trading pair: ${error.message}`
        : 'Failed to fetch trading pair: Unknown error'
    );
  }
}

/**
 * Server action to fetch data providers from the backend API
 */
export async function getDataProviders(): Promise<
  GetDataProvidersResponse['dataProviders']
> {
  const graphqlUrl = process.env.BACKEND_GRAPHQL_URL;

  if (!graphqlUrl) {
    throw new Error(
      'BACKEND_GRAPHQL_URL environment variable is not configured'
    );
  }

  const client = new GraphQLClient(graphqlUrl);

  try {
    const data = await client.request<GetDataProvidersResponse>(
      GetDataProvidersQuery
    );

    return data.dataProviders;
  } catch (error) {
    console.error('Error fetching data providers:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch data providers: ${error.message}`
        : 'Failed to fetch data providers: Unknown error'
    );
  }
}
