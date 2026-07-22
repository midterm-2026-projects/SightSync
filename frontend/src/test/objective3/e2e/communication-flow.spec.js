import { test, expect } from '@playwright/test';

test.describe('Communication Logs E2E Flow', () => {
  test.beforeEach(async ({ page }) => {
    // CommunicationLogs uses sample data internally — no API mocking needed
    await page.goto('/');

    // Click the Communication sidebar button
    await page.getByRole('button', { name: 'Communication' }).click();
  });

  test('should display the Communication Logs panel with sample messages', async ({ page }) => {
    // Verify the heading
    await expect(page.getByRole('heading', { name: 'Communication Logs' })).toBeVisible();

    // Verify sample messages are displayed (from SAMPLE_LOGS)
    await expect(page.getByText('Q4 Performance Update')).toBeVisible();
    await expect(page.getByText('Inventory Restock Notice')).toBeVisible();
    await expect(page.getByText('New Telemedicine Partnership')).toBeVisible();
    await expect(page.getByText('Updated Clinic Hours for Holidays')).toBeVisible();
    await expect(page.getByText('IT System Upgrade Reminder')).toBeVisible();

    // Verify message count indicator
    await expect(page.getByText('5 messages recorded')).toBeVisible();
  });

  test('should open the compose panel and display form fields', async ({ page }) => {
    // Click "+ New Message" button
    await page.getByRole('button', { name: '+ New Message' }).click();

    // Compose panel should be visible
    await expect(page.getByTestId('compose-panel')).toBeVisible();
    await expect(page.getByText('New Stakeholder Update')).toBeVisible();

    // Verify form fields exist
    await expect(page.getByTestId('input-subject')).toBeVisible();
    await expect(page.getByTestId('input-recipients')).toBeVisible();
    await expect(page.getByTestId('input-content')).toBeVisible();
    await expect(page.getByTestId('btn-send')).toBeVisible();
  });

  test('should show validation errors when sending empty message', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Message' }).click();

    // Click send without filling anything
    await page.getByTestId('btn-send').click();

    // Verify validation errors appear
    await expect(page.getByTestId('error-subject')).toHaveText('Subject is required.');
    await expect(page.getByTestId('error-recipients')).toHaveText('At least one recipient is required.');
    await expect(page.getByTestId('error-content')).toHaveText('Message content is required.');
  });

  test('should compose and send a new message, then display it in the log', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Message' }).click();

    // Fill in compose form
    await page.getByTestId('input-subject').fill('Test E2E Message');
    await page.getByTestId('input-recipients').fill('all-staff, management');
    await page.getByTestId('input-content').fill('This is an end-to-end test message for communication logs.');

    // Send the message
    await page.getByTestId('btn-send').click();

    // Verify "✓ Sent" feedback button text
    await expect(page.getByTestId('btn-send')).toHaveText('✓ Sent');

    // The new message should appear at the top of the log list
    await expect(page.getByText('Test E2E Message')).toBeVisible();

    // Verify the message count increased
    await expect(page.getByText('6 messages recorded')).toBeVisible();
  });

  test('should cancel compose and hide the panel', async ({ page }) => {
    await page.getByRole('button', { name: '+ New Message' }).click();
    await expect(page.getByTestId('compose-panel')).toBeVisible();

    // Click Cancel (the same button toggles)
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Compose panel should be hidden
    await expect(page.getByTestId('compose-panel')).not.toBeVisible();
  });
});

