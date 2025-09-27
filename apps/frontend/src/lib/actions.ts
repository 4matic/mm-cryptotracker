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
 * Creates and configures a GraphQL client instance
 */
function createGraphQLClient(): GraphQLClient {
  const graphqlUrl = process.env.BACKEND_GRAPHQL_URL;

  if (!graphqlUrl) {
    console.error(
      'GraphQL client creation failed: BACKEND_GRAPHQL_URL environment variable is not configured'
    );
    throw new Error(
      'BACKEND_GRAPHQL_URL environment variable is not configured'
    );
  }

  console.log('Creating GraphQL client with URL:', graphqlUrl);
  return new GraphQLClient(graphqlUrl);
}

/**
 * Server action to fetch trading pairs from the backend API
 */
export async function getTradingPairs(
  params: TradingPairsParams = {}
): Promise<PaginatedTradingPairsModel> {
  console.log('getTradingPairs called with params:', params);

  const client = createGraphQLClient();

  try {
    const { page = 1, limit = 20, isVisible } = params;
    const variables = { page, limit, isVisible };

    console.log('Executing getTradingPairs query with variables:', variables);

    const data = await client.request<{
      tradingPairsWithPagination: PaginatedTradingPairsModel;
    }>(GetTradingPairsQuery, variables);

    console.log('Successfully fetched trading pairs:', {
      total: data.tradingPairsWithPagination.total,
      page: data.tradingPairsWithPagination.page,
      pairsCount: data.tradingPairsWithPagination.pairs?.length || 0,
    });

    return data.tradingPairsWithPagination;
  } catch (error) {
    console.error('Error fetching trading pairs:', {
      params,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
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
  console.log('getTradingPair called with slug:', slug);

  const client = createGraphQLClient();

  try {
    const variables: GetTradingPairVariables = { slug };

    console.log('Executing getTradingPair query with variables:', variables);

    const data = await client.request<GetTradingPairResponse>(
      GetTradingPairQuery,
      variables
    );

    console.log('Successfully fetched trading pair:', {
      slug: data.tradingPairBySlug?.slug,
      symbol: data.tradingPairBySlug?.symbol,
      hasLatestPrice: !!data.tradingPairBySlug?.latestPrice,
      hasCalculatedPrice: !!data.tradingPairBySlug?.calculatedPrice,
    });

    return data.tradingPairBySlug;
  } catch (error) {
    console.error('Error fetching trading pair:', {
      slug,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
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
  console.log('getDataProviders called');

  const client = createGraphQLClient();

  try {
    console.log('Executing getDataProviders query');

    const data = await client.request<GetDataProvidersResponse>(
      GetDataProvidersQuery
    );

    console.log('Successfully fetched data providers:', {
      count: data.dataProviders?.length || 0,
      providers: data.dataProviders?.map((p) => p.name) || [],
    });

    return data.dataProviders;
  } catch (error) {
    console.error('Error fetching data providers:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error(
      error instanceof Error
        ? `Failed to fetch data providers: ${error.message}`
        : 'Failed to fetch data providers: Unknown error'
    );
  }
}
