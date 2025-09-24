'use server';

import { TradingPairsResponse, TradingPairsParams } from './types';

/**
 * Server action to fetch trading pairs from the backend API
 */
export async function getTradingPairs(
  params: TradingPairsParams = {}
): Promise<TradingPairsResponse> {
  const backendUrl = process.env.BACKEND_API_URL;

  if (!backendUrl) {
    throw new Error('BACKEND_API_URL environment variable is not configured');
  }

  const searchParams = new URLSearchParams();

  if (params.page !== undefined) {
    searchParams.set('page', params.page.toString());
  }

  if (params.limit !== undefined) {
    searchParams.set('limit', params.limit.toString());
  }

  if (params.isVisible !== undefined) {
    searchParams.set('isVisible', params.isVisible.toString());
  }

  const url = `${backendUrl}/trading-pairs${
    searchParams.toString() ? `?${searchParams.toString()}` : ''
  }`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache control for better performance
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch trading pairs: ${response.status} ${response.statusText}`
      );
    }

    const data: TradingPairsResponse = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching trading pairs:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to fetch trading pairs: ${error.message}`
        : 'Failed to fetch trading pairs: Unknown error'
    );
  }
}
