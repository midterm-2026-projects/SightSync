import { test, expect } from '@playwright/test';

test.describe('Patient Registration and Directory E2E Flow', () => {

    test('should register a new patient and verify they appear in the list', async ({ page }) => {
        const uniquePhone = `0917${Math.floor(1000000 + Math.random() * 9000000)}`;

        await page.goto('/');
        await page.click('button:has-text("Patient Registration")');

        await page.fill('input[name="firstName"]', 'Juan');
        await page.fill('input[name="lastName"]', 'Dela Cruz');
        await page.fill('input[name="birthDate"]', '2000-01-01');
        await page.selectOption('select[name="sex"]', 'Male');
        await page.selectOption('select[name="status"]', 'Active');
        await page.fill('input[name="contactNumber"]', uniquePhone);
        await page.fill('input[name="email"]', `john.doe.${Date.now()}@example.com`);
        await page.fill('textarea[name="address"]', '123 Main Street, Manila');

        await page.click('button[type="submit"]');
        await expect(page.locator('.text-green-700')).toContainText('Patient registered successfully');

        await page.click('button:has-text("Patient Management")');
        await page.fill('input[aria-label="Search patients"]', 'Juan Dela Cruz');

        // Filter row by uniquely generated phone number
        const patientRow = page.locator('tr').filter({ hasText: uniquePhone });
        await expect(patientRow).toBeVisible();
        await patientRow.click();

        const profileSection = page.locator('section', { hasText: 'Patient Profile' });
        await expect(profileSection).toContainText('Juan');
        await expect(profileSection).toContainText('Dela Cruz');

        await page.click('button:has-text("Edit Profile")')
        await page.fill('textarea[name="address"]', '123 Main Street, Makati');
        await page.click('button:has-text("Save Changes")')
    });
});