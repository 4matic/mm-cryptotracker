import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';

// Mock the getTradingPairs function
jest.mock('../src/lib/actions', () => ({
  getTradingPairs: jest.fn().mockResolvedValue({
    pairs: [],
    total: 0,
    page: 1,
    limit: 20,
  }),
}));

// Mock the TradingPairsSection component since it's a server component
jest.mock('../src/components/trading-pairs-section', () => ({
  TradingPairsSection: function MockTradingPairsSection() {
    return (
      <div data-testid="trading-pairs-section">
        <div className="max-w-md mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center space-y-3">
            <p className="text-destructive font-medium">
              Unable to load trading pairs
            </p>
            <p className="text-muted-foreground text-sm">
              Mock error for testing
            </p>
          </div>
        </div>
      </div>
    );
  },
}));

describe('Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(await Page());
    expect(baseElement).toBeTruthy();
  });

  it('should display the page content including TradingPairsSection', async () => {
    render(await Page());

    // Check that the mocked TradingPairsSection is rendered
    expect(screen.getByTestId('trading-pairs-section')).toBeTruthy();
    expect(screen.getByText('Unable to load trading pairs')).toBeTruthy();
  });

  it('should render header and navigation elements', async () => {
    render(await Page());

    // Check for key UI elements
    expect(screen.getByText('View Data Methodology')).toBeTruthy();
    expect(screen.getByText('Price Analysis')).toBeTruthy();
    expect(screen.getByText('Reliable Data')).toBeTruthy();
    expect(screen.getByText('Market Insights')).toBeTruthy();
  });
});
