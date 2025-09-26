import { test, expect } from '@playwright/test';

test('displays "No cryptocurrency pairs available" message', async ({
  page,
}) => {
  await page.goto('/');

  // Expect the page to show the no trading pairs message
  await expect(
    page.getByText('No cryptocurrency pairs available')
  ).toBeVisible();
});
