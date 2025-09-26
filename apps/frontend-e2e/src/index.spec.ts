import { test, expect } from '@playwright/test';

test('displays no trading pairs message', async ({ page }) => {
  await page.goto('/');

  // Expect the page to show the no trading pairs message
  await expect(
    page.getByText('No trading pairs available at the moment.')
  ).toBeVisible();
});
