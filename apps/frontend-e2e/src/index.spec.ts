import { test, expect } from '@playwright/test';

test('displays "Unable to load trading pairs" message', async ({ page }) => {
  await page.goto('/');

  // Expect the page to show the no trading pairs message
  await expect(page.getByText('Unable to load trading pairs')).toBeVisible();
});
