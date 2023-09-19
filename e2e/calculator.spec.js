import { test, expect } from '@playwright/test';

const testValues = {
  validValue: '1000',
  invalidValue: '-1000',
};

test.describe('Calculator Page', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:5173/');
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should have the correct title', async () => {
    const pageTitle = await page.title();
    expect(pageTitle).toMatch(/Calculator/);
  });

  test('should successfully set the input value', async () => {
    const inputField = page.locator('[placeholder="Enter amount"]');
    await inputField.fill(testValues.validValue);
    const inputValue = await inputField.inputValue();
    expect(inputValue).toBe(testValues.validValue);
  });

  test('should display error message for negative value', async () => {
    const inputField = page.locator('[placeholder="Enter amount"]');
    await inputField.fill(testValues.invalidValue);
    const error = page.locator('text=Please enter a non-negative number.');
    expect(error).toBeVisible();
  });
});

test.describe('Simulate API calls', () => {
  let page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should mock currency data without making a real API call', async () => {
    await page.route(
      'https://api.coinbase.com/v2/exchange-rates?currency=USD',
      async (route) => {
        const mockData = {
          data: {
            rates: { BTC: 0.0000376986127853, ETH: 0.0006142072273764 },
          },
        };
        await route.fulfill({ body: JSON.stringify(mockData) });
      }
    );

    await page.goto('http://localhost:5173/');

    const inputField = page.locator('[placeholder="Enter amount"]');
    await inputField.fill(testValues.validValue);

    const btcInputValue = await page.locator('#btc-amount').inputValue();
    const ethInputValue = await page.locator('#eth-amount').inputValue();

    expect(btcInputValue).toBe('0.02638903');
    expect(ethInputValue).toBe('0.18426217');
  });

  test('should handle API fetch failure gracefully', async () => {
    await page.route(
      'https://api.coinbase.com/v2/exchange-rates?currency=USD',
      async (route) => {
        await route.fulfill({
          status: 500,
          body: 'Internal Server Error',
        });
      }
    );

    await page.goto('http://localhost:5173/');
    const errorMessage = await page.locator('.error-message').innerText();
    expect(errorMessage).toContain(
      'An error occurred while fetching exchange rates'
    );
  });
});
