import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EnsureRequestContext } from '@mikro-orm/core';
import { TradingPair } from '@/entities/trading-pair.entity';
import { PriceHistory } from '@/entities/price-history.entity';
import { Asset } from '@/entities/asset.entity';
import { DataProvider } from '@/entities/data-provider.entity';
import { TradingPairRepository, PriceHistoryRepository } from '@/repositories';

interface PricePath {
  pairs: TradingPair[];
  prices: PriceHistory[];
  totalMultiplier: number;
  confidence: number;
  hops: number;
}

interface SyntheticDataProvider {
  id: number;
  name: string;
  isActive: boolean;
}

type PriceGraph = Map<number, { pair: TradingPair; price: PriceHistory }[]>;

/**
 * Service for calculating indirect prices using available trading pairs and price histories
 */
@Injectable()
export class PriceCalculationService {
  private readonly logger = new Logger(PriceCalculationService.name);

  /** Maximum number of trading pair hops allowed in indirect price calculation paths */
  private readonly MAX_HOPS = 3;

  /** Confidence multiplier applied for each hop in the path (0.8 = 20% confidence reduction per hop) */
  private readonly CONFIDENCE_DECAY = 0.8;

  /** Time window in hours for considering price data as recent and valid for calculations */
  private readonly TIME_DECAY_HOURS = 24;

  constructor(
    @InjectRepository(TradingPair)
    private readonly tradingPairRepository: TradingPairRepository,
    @InjectRepository(PriceHistory)
    private readonly priceHistoryRepository: PriceHistoryRepository
  ) {}

  /**
   * Calculates price for a trading pair using indirect paths when direct price is not available
   */
  @EnsureRequestContext((self: PriceCalculationService) =>
    self.tradingPairRepository.getEntityManager()
  )
  async calculateIndirectPrice(
    targetTradingPair: TradingPair
  ): Promise<PriceHistory | null> {
    const startTime = Date.now();
    const baseAsset = targetTradingPair.baseAsset;
    const quoteAsset = targetTradingPair.quoteAsset;

    this.logger.log(
      `Starting indirect price calculation for ${baseAsset.symbol}/${quoteAsset.symbol} (ID: ${targetTradingPair.id})`
    );
    this.logger.debug(
      `Base asset: ${baseAsset.symbol} (ID: ${baseAsset.id}), Quote asset: ${quoteAsset.symbol} (ID: ${quoteAsset.id})`
    );

    try {
      // Find all possible paths from base to quote asset
      this.logger.debug('Building price graph...');
      const { graph, assets } = await this.buildPriceGraph();

      this.logger.debug('Finding possible price calculation paths...');
      const paths = this.findPricePathsBFS(
        baseAsset,
        quoteAsset,
        graph,
        assets
      );

      this.logger.debug(`Found ${paths.length} possible paths`);

      if (paths.length === 0) {
        this.logger.warn(
          `No calculation paths found for ${baseAsset.symbol}/${quoteAsset.symbol}`
        );
        return null;
      }

      // Log path details for debugging
      paths.forEach((path, index) => {
        this.logger.debug(
          `Path ${index + 1}: ${
            path.hops
          } hops, confidence: ${path.confidence.toFixed(4)}, multiplier: ${
            path.totalMultiplier
          }`
        );
      });

      // Select the best path based on confidence score
      const bestPath = this.selectBestPath(paths);

      if (!bestPath || bestPath.totalMultiplier <= 0) {
        this.logger.warn(
          `No valid path found for ${baseAsset.symbol}/${
            quoteAsset.symbol
          }. Best path multiplier: ${bestPath?.totalMultiplier || 'null'}`
        );
        return null;
      }

      this.logger.log(
        `Selected best path with ${
          bestPath.hops
        } hops, confidence: ${bestPath.confidence.toFixed(4)}, price: ${
          bestPath.totalMultiplier
        }`
      );

      // Create a synthetic PriceHistory entry
      const result = this.createSyntheticPriceHistory(
        targetTradingPair,
        bestPath.totalMultiplier.toString(),
        bestPath.confidence
      );

      const executionTime = Date.now() - startTime;
      this.logger.log(
        `Successfully calculated indirect price for ${baseAsset.symbol}/${quoteAsset.symbol}: ${bestPath.totalMultiplier} (execution time: ${executionTime}ms)`
      );

      return result;
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(
        `Error calculating indirect price for ${baseAsset.symbol}/${quoteAsset.symbol} (execution time: ${executionTime}ms)`,
        error instanceof Error ? error.stack : String(error)
      );
      throw error;
    }
  }

  /**
   * Builds an in-memory graph of all active trading pairs with recent prices.
   */
  private async buildPriceGraph(): Promise<{
    graph: PriceGraph;
    assets: Map<number, Asset>;
  }> {
    const allActivePairs = await this.tradingPairRepository.find(
      { isActive: true },
      { populate: ['baseAsset', 'quoteAsset'] }
    );

    const cutoffTime = new Date(
      Date.now() - this.TIME_DECAY_HOURS * 60 * 60 * 1000
    );

    const recentPrices = await this.priceHistoryRepository.find({
      tradingPair: { $in: allActivePairs.map((p) => p.id) },
      timestamp: { $gte: cutoffTime },
    });

    const latestPrices = new Map<number, PriceHistory>();
    for (const price of recentPrices) {
      const pairId = price.tradingPair.id;
      const existingPrice = latestPrices.get(pairId);
      if (!existingPrice || price.timestamp > existingPrice.timestamp) {
        latestPrices.set(pairId, price);
      }
    }

    const graph: PriceGraph = new Map();
    const assets = new Map<number, Asset>();

    for (const pair of allActivePairs) {
      const price = latestPrices.get(pair.id);
      if (price) {
        if (!assets.has(pair.baseAsset.id)) {
          assets.set(pair.baseAsset.id, pair.baseAsset);
        }
        if (!assets.has(pair.quoteAsset.id)) {
          assets.set(pair.quoteAsset.id, pair.quoteAsset);
        }

        const edge = { pair, price };

        if (!graph.has(pair.baseAsset.id)) {
          graph.set(pair.baseAsset.id, []);
        }
        const baseAssetEdges = graph.get(pair.baseAsset.id);
        if (baseAssetEdges) {
          baseAssetEdges.push(edge);
        }

        if (!graph.has(pair.quoteAsset.id)) {
          graph.set(pair.quoteAsset.id, []);
        }
        const quoteAssetEdges = graph.get(pair.quoteAsset.id);
        if (quoteAssetEdges) {
          quoteAssetEdges.push(edge);
        }
      }
    }

    return { graph, assets };
  }

  /**
   * Finds all possible price calculation paths between two assets using BFS on a pre-built graph.
   */
  private findPricePathsBFS(
    fromAsset: Asset,
    toAsset: Asset,
    graph: PriceGraph,
    assets: Map<number, Asset>
  ): PricePath[] {
    const allPaths: PricePath[] = [];
    const queue: {
      assetId: number;
      path: { pair: TradingPair; price: PriceHistory }[];
      visited: Set<number>;
    }[] = [
      {
        assetId: fromAsset.id,
        path: [],
        visited: new Set([fromAsset.id]),
      },
    ];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) {
        continue;
      }
      const { assetId, path, visited } = current;

      if (path.length >= this.MAX_HOPS) {
        continue;
      }

      const edges = graph.get(assetId) || [];

      for (const edge of edges) {
        const currentAsset = assets.get(assetId);
        if (!currentAsset) continue;

        const otherAsset = this.getOtherAsset(edge.pair, currentAsset);
        if (visited.has(otherAsset.id)) {
          continue;
        }

        const newPath = [...path, edge];

        if (otherAsset.id === toAsset.id) {
          const pairs = newPath.map((p) => p.pair);
          const prices = newPath.map((p) => p.price);
          const totalMultiplier = this.calculateTotalMultiplier(
            prices,
            pairs,
            fromAsset
          );

          if (totalMultiplier > 0) {
            let pathConfidence = 1;
            for (let i = 0; i < prices.length; i++) {
              pathConfidence *= this.calculateConfidence(prices[i], i);
            }

            allPaths.push({
              pairs,
              prices,
              totalMultiplier,
              confidence: pathConfidence,
              hops: newPath.length,
            });
          }
        } else {
          const newVisited = new Set(visited);
          newVisited.add(otherAsset.id);
          queue.push({
            assetId: otherAsset.id,
            path: newPath,
            visited: newVisited,
          });
        }
      }
    }
    return allPaths;
  }

  /**
   * Calculates the total multiplier for a path of trading pairs
   */
  private calculateTotalMultiplier(
    prices: PriceHistory[],
    pairs: TradingPair[],
    fromAsset: Asset
  ): number {
    if (prices.length === 0 || pairs.length === 0) {
      this.logger.debug('Empty prices or pairs array, returning 0 multiplier');
      return 0;
    }

    this.logger.debug(
      `Calculating total multiplier for path starting from ${fromAsset.symbol} with ${pairs.length} pairs`
    );

    let multiplier = 1;
    let currentAsset = fromAsset;

    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const price = prices[i];
      const priceValue = parseFloat(price.price);

      if (priceValue <= 0) {
        this.logger.debug(
          `Invalid price value ${priceValue} for pair ${pair.baseAsset.symbol}/${pair.quoteAsset.symbol}, returning 0 multiplier`
        );
        return 0;
      }

      // Determine the direction of conversion
      if (pair.baseAsset.id === currentAsset.id) {
        // Converting from base to quote
        multiplier *= priceValue;
        this.logger.debug(
          `Step ${i + 1}: Converting ${currentAsset.symbol} to ${
            pair.quoteAsset.symbol
          } at rate ${priceValue} (multiplier: ${multiplier})`
        );
        currentAsset = pair.quoteAsset;
      } else if (pair.quoteAsset.id === currentAsset.id) {
        // Converting from quote to base
        const rate = 1 / priceValue;
        multiplier *= rate;
        this.logger.debug(
          `Step ${i + 1}: Converting ${currentAsset.symbol} to ${
            pair.baseAsset.symbol
          } at rate ${rate} (1/${priceValue}) (multiplier: ${multiplier})`
        );
        currentAsset = pair.baseAsset;
      } else {
        this.logger.debug(
          `Invalid path: current asset ${currentAsset.symbol} not found in pair ${pair.baseAsset.symbol}/${pair.quoteAsset.symbol}`
        );
        return 0;
      }
    }

    this.logger.debug(
      `Final multiplier calculated: ${multiplier} (from ${fromAsset.symbol} to ${currentAsset.symbol})`
    );

    return multiplier;
  }

  /**
   * Calculates confidence score based on price freshness and path length
   */
  private calculateConfidence(price: PriceHistory, hops: number): number {
    const ageHours =
      (Date.now() - price.timestamp.getTime()) / (1000 * 60 * 60);
    const timeDecay = Math.exp(-ageHours / this.TIME_DECAY_HOURS);
    const hopDecay = Math.pow(this.CONFIDENCE_DECAY, hops);
    const confidence = timeDecay * hopDecay;

    this.logger.debug(
      `Confidence calculation: age=${ageHours.toFixed(
        2
      )}h, timeDecay=${timeDecay.toFixed(4)}, hopDecay=${hopDecay.toFixed(
        4
      )} (${hops} hops), final=${confidence.toFixed(4)}`
    );

    return confidence;
  }

  /**
   * Selects the best path based on confidence score
   */
  private selectBestPath(paths: PricePath[]): PricePath | null {
    if (paths.length === 0) {
      this.logger.debug('No paths available for selection');
      return null;
    }

    this.logger.debug(`Selecting best path from ${paths.length} candidates`);

    // Log all paths for comparison
    paths.forEach((path, index) => {
      this.logger.debug(
        `Path ${index + 1}: confidence=${path.confidence.toFixed(4)}, hops=${
          path.hops
        }, multiplier=${path.totalMultiplier}`
      );
    });

    // Sort by confidence (highest first), then by fewest hops
    const sortedPaths = paths.sort((a, b) => {
      if (Math.abs(a.confidence - b.confidence) < 0.001) {
        return a.hops - b.hops;
      }
      return b.confidence - a.confidence;
    });

    const bestPath = sortedPaths[0];
    this.logger.debug(
      `Selected best path: confidence=${bestPath.confidence.toFixed(4)}, hops=${
        bestPath.hops
      }, multiplier=${bestPath.totalMultiplier}`
    );

    return bestPath;
  }

  /**
   * Gets the other asset in a trading pair
   */
  private getOtherAsset(pair: TradingPair, asset: Asset): Asset {
    return pair.baseAsset.id === asset.id ? pair.quoteAsset : pair.baseAsset;
  }

  /**
   * Creates a synthetic PriceHistory entry for calculated prices
   */
  private createSyntheticPriceHistory(
    tradingPair: TradingPair,
    calculatedPrice: string,
    confidence: number
  ): PriceHistory {
    this.logger.debug(
      `Creating synthetic price history for ${tradingPair.baseAsset.symbol}/${
        tradingPair.quoteAsset.symbol
      }: ${calculatedPrice} (confidence: ${confidence.toFixed(4)})`
    );

    try {
      // Create a synthetic price history entry without persisting to database
      const syntheticDataProvider: SyntheticDataProvider = {
        id: -1,
        name: 'Calculated',
        isActive: true,
      };

      // Type assertion needed for synthetic data provider
      const syntheticPrice = new PriceHistory(
        tradingPair,
        syntheticDataProvider as unknown as DataProvider,
        new Date(),
        calculatedPrice
      );

      // Add metadata to indicate this is a calculated price
      syntheticPrice.metadata = {
        confidence: confidence,
        calculatedAt: new Date().toISOString(),
      };

      this.logger.debug(
        `Successfully created synthetic price history with metadata: ${JSON.stringify(
          syntheticPrice.metadata
        )}`
      );

      return syntheticPrice;
    } catch (error) {
      this.logger.error(
        `Error creating synthetic price history for ${tradingPair.baseAsset.symbol}/${tradingPair.quoteAsset.symbol}`,
        error instanceof Error ? error.stack : String(error)
      );
      throw error;
    }
  }
}
