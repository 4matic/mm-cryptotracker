import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { DataProvider } from '@/entities/data-provider.entity';
import { DataProviderSlug } from '@/enums/data-provider.enum';
import {
  AbstractDataProvider,
  PriceData,
  PriceFetchRequest,
} from '../interfaces/abstract-data-provider.interface';
import { firstValueFrom } from 'rxjs';

/**
 * CoinMarketCap API response interfaces
 */
interface CoinMarketCapQuote {
  price: number;
  last_updated: string;
  market_cap?: number;
  volume_24h?: number;
  percent_change_1h?: number;
  percent_change_24h?: number;
  percent_change_7d?: number;
}

interface CoinMarketCapData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    [currency: string]: CoinMarketCapQuote;
  };
  last_updated: string;
}

interface CoinMarketCapResponse {
  status: {
    timestamp: string;
    error_code: number;
    error_message?: string;
    elapsed: number;
    credit_count: number;
  };
  data: {
    [symbol: string]: CoinMarketCapData[];
  };
}

/**
 * CoinMarketCap data provider implementation
 * Fetches cryptocurrency prices from CoinMarketCap Pro API
 */
@Injectable()
export class CoinmarketcapDataProvider extends AbstractDataProvider {
  private readonly logger = new Logger(CoinmarketcapDataProvider.name);

  constructor(
    dataProvider: DataProvider,
    private readonly httpService: HttpService
  ) {
    super(dataProvider);
  }

  /**
   * Fetches price data from CoinMarketCap API
   * @uses CoinMarketCap API
   * @url https://coinmarketcap.com/api/documentation/v1/#operation/getV2CryptocurrencyQuotesLatest
   */
  async fetchPrices(request: PriceFetchRequest): Promise<PriceData[]> {
    if (!this.isConfigured()) {
      throw new Error('CoinMarketCap provider is not properly configured');
    }

    const { symbols, convertTo = 'USD' } = request;
    const symbolsParam = symbols.join(',');

    try {
      const url = `${this.dataProvider.apiUrl}/v2/cryptocurrency/quotes/latest`;
      const params = {
        symbol: symbolsParam,
        convert: convertTo,
        aux: 'platform',
      };

      const headers = {
        'X-CMC_PRO_API_KEY': this.getApiKey(),
        Accept: 'application/json',
        'Accept-Encoding': 'deflate, gzip',
      };

      this.logger.debug(
        `Fetching prices for symbols: ${symbolsParam} from CoinMarketCap`
      );

      const response = await firstValueFrom(
        this.httpService.get<CoinMarketCapResponse>(url, {
          params,
          headers,
          timeout: 10000,
        })
      );

      if (response.data.status.error_code !== 0) {
        throw new Error(
          `CoinMarketCap API error: ${response.data.status.error_message}`
        );
      }

      return this.transformResponse(response.data, convertTo);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to fetch prices from CoinMarketCap: ${errorMessage}`,
        errorStack
      );
      throw new Error(`CoinMarketCap API request failed: ${errorMessage}`);
    }
  }

  /**
   * Validates if the provider is properly configured
   */
  isConfigured(): boolean {
    return (
      !!this.dataProvider.apiUrl &&
      !!this.dataProvider.apiConfig &&
      !!this.getApiKey()
    );
  }

  /**
   * Creates a new instance for the CoinMarketCap provider
   */
  static create(
    dataProvider: DataProvider,
    httpService: HttpService
  ): CoinmarketcapDataProvider {
    if (dataProvider.slug !== DataProviderSlug.Coinmarketcap) {
      throw new Error(
        `Invalid data provider slug. Expected: ${DataProviderSlug.Coinmarketcap}, got: ${dataProvider.slug}`
      );
    }
    return new CoinmarketcapDataProvider(dataProvider, httpService);
  }

  /**
   * Gets the API key from the provider configuration
   */
  private getApiKey(): string {
    return this.dataProvider.apiConfig?.apiKey as string;
  }

  /**
   * Transforms CoinMarketCap API response to internal PriceData format
   */
  private transformResponse(
    response: CoinMarketCapResponse,
    convertTo: string
  ): PriceData[] {
    const priceData: PriceData[] = [];

    Object.entries(response.data).forEach(([symbol, dataArray]) => {
      // CoinMarketCap returns an array of data for each symbol
      // We take the first item as it's the primary data
      const coinData = dataArray[0];
      if (!coinData) {
        this.logger.warn(`No data found for symbol: ${symbol}`);
        return;
      }

      const quote = coinData.quote[convertTo];
      if (!quote) {
        this.logger.warn(
          `No quote found for symbol: ${symbol} in currency: ${convertTo}`
        );
        return;
      }

      priceData.push({
        symbol: coinData.symbol,
        price: quote.price,
        lastUpdated: new Date(quote.last_updated),
        metadata: {
          coinmarketcapId: coinData.id,
          name: coinData.name,
          slug: coinData.slug,
          marketCap: quote.market_cap,
          volume24h: quote.volume_24h,
          percentChange1h: quote.percent_change_1h,
          percentChange24h: quote.percent_change_24h,
          percentChange7d: quote.percent_change_7d,
          currency: convertTo,
          apiTimestamp: response.status.timestamp,
          creditCount: response.status.credit_count,
        },
      });
    });

    this.logger.debug(
      `Successfully transformed ${priceData.length} price records from CoinMarketCap`
    );

    return priceData;
  }
}
