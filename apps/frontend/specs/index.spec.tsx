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

describe('Page', () => {
  it('should render successfully', async () => {
    const { baseElement } = render(await Page());
    expect(baseElement).toBeTruthy();
  });

  it('should display "No trading pairs available at the moment."', async () => {
    render(await Page());
    const element = screen.getByText(
      'No trading pairs available at the moment.'
    );
    expect(element).toBeTruthy();
  });
});
