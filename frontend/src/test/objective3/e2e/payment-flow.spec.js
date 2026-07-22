import { test, expect } from '@playwright/test';

const MOCK_PATIENTS = [];
const MOCK_DOCTORS = [];

test.describe('Payment & Receipt E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock GET /api/patients — return empty so PaymentForm uses text inputs
    await page.route('**/api/patients', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_PATIENTS) });
    });

    // Mock GET /api/doctors — return empty so PaymentForm uses text inputs
    await page.route('**/api/doctors', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_DOCTORS) });
    });

    // Mock GET /api/payments — empty history on load
    await page.route('**/api/payments', async (route, request) => {
      if (request.method() === 'GET') {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
      } else if (request.method() === 'POST') {
        const postData = request.postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 42, ...postData }),
        });
      } else {
        await route.continue();
      }
    });

    // Mock legacy PATCH /api/payments/:id/confirm — fail so confirmPayment falls through
    await page.route(/\/api\/payments\/(\d+)\/confirm/, async (route) => {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'Not found' }) });
    });

    // Mock PATCH /api/payments/:id/status — update status to completed
    await page.route(/\/api\/payments\/(\d+)\/status/, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 42, status: 'completed', amount: 2500, method: 'cash', patient_name: 'Maria Santos', doctor_name: 'Dr. Jose Rizal' }),
      });
    });

    // Mock POST /api/receipts — generate receipt
    await page.route('**/api/receipts', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 7,
            receiptNumber: 'RCPT-2026-000042',
            receipt_number: 'RCPT-2026-000042',
            issuedDate: new Date().toISOString(),
            issued_date: new Date().toISOString(),
            business: { name: 'Acme Billing Co.', address: '123 Market Street, Springfield', taxId: 'TAX-000000' },
            payment: { id: 42, amount: 2500, formattedAmount: '$2,500.00', currency: 'USD', paymentDate: new Date().toISOString(), method: 'cash', status: 'completed' },
            items: [{ name: 'Payment Amount', quantity: 1, price: 2500 }],
            subtotal: 2500,
            tax: 300,
            total: 2800,
            footer: 'Thank you for your payment.',
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Navigate to app
    await page.goto('/');

    // Click the Payments & Receipts sidebar button
    await page.getByRole('button', { name: 'Payments & Receipts' }).click();
  });

  test('should display the Payments panel with empty state', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Payments' })).toBeVisible();
    await expect(page.getByText('No payments yet.')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add New Payment' })).toBeVisible();
  });

  test('should create a payment, confirm it, and display the receipt', async ({ page }) => {
    // Fill in the PaymentForm
    await page.getByLabel('Patient Name').fill('Maria Santos');
    await page.getByLabel('Doctor').fill('Dr. Jose Rizal');
    await page.getByLabel('Amount').fill('2500');
    await page.getByLabel('Payment Method').selectOption('cash');

    // Submit to create payment record
    await page.getByRole('button', { name: 'Create Payment Record' }).click();

    // Step 2: Confirm payment — verify Payment ID is shown
    await expect(page.getByText(/Payment ID:/)).toBeVisible();
    await expect(page.getByText('Amount: ₱2,500.00')).toBeVisible();

    // Confirm and generate receipt
    await page.getByRole('button', { name: 'Confirm & Generate Receipt' }).click();

    // Verify receipt view is displayed
    await expect(page.getByText('SightSync Clinic')).toBeVisible();
    await expect(page.getByText('RCPT-2026-000042')).toBeVisible();
    await expect(page.getByText('PAID')).toBeVisible();

    // Verify the "✓ Sent" style success message
    await expect(page.getByText('Payment confirmed & receipt generated')).toBeVisible();
  });

  test('should show payment in history table after confirmation', async ({ page }) => {
    // Fill form
    await page.getByLabel('Patient Name').fill('Maria Santos');
    await page.getByLabel('Doctor').fill('Dr. Jose Rizal');
    await page.getByLabel('Amount').fill('2500');
    await page.getByLabel('Payment Method').selectOption('cash');
    await page.getByRole('button', { name: 'Create Payment Record' }).click();

    // Confirm
    await page.getByRole('button', { name: 'Confirm & Generate Receipt' }).click();

    // Wait for receipt to appear
    await expect(page.getByText('RCPT-2026-000042')).toBeVisible();

    // Verify the Payment History table contains the new entry
    const historyTable = page.locator('text=Payment History').locator('..');
    await expect(historyTable).toContainText('RCPT-2026-000042');
    await expect(historyTable).toContainText('Maria Santos');
    await expect(historyTable).toContainText('Dr. Jose Rizal');
    await expect(historyTable).toContainText('completed');
  });
});

