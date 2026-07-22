
// tests/appointment-flow.spec.js
import { test, expect } from '@playwright/test';

const mockPatients = [
    { id: '12', name: 'John Doe' },
    { id: '15', name: 'Jane Smith' },
    { id: '1071', name: 'Robert Johnson' },
];

const mockDoctors = [
    { id: '3', name: 'Alice Williams' },
    { id: '5', name: 'Gregory House' },
    { id: '711', name: 'Meredith Grey' },
];

const mockAppointments = [
    {
        id: 101,
        patient_id: '12',
        doctor_id: '5',
        appointment_date: '2026-08-15',
        appointment_time: '10:30',
        appointment_type: 'Consultation',
        reason: 'Annual Checkup',
        status: 'Scheduled',
    },
    {
        id: 102,
        patient_id: '15',
        doctor_id: '3',
        appointment_date: '2026-08-16',
        appointment_time: '14:00',
        appointment_type: 'Follow-up',
        reason: 'Lab Results Review',
        status: 'Pending',
    },
];

test.describe('Appointment Manager Flow', () => {
    test.beforeEach(async ({ page }) => {
        // 1. Intercept network requests before navigating
        await page.route('**/patients', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockPatients),
            });
        });

        await page.route('**/doctors', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockDoctors),
            });
        });

        await page.route('**/appointments', async (route) => {
            if (route.request().method() === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockAppointments),
                });
            } else {
                await route.continue();
            }
        });

        // 2. Load root app
        await page.goto('/');

        // 3. Switch to the Appointment Schedules tab via your AppLayout sidebar
        await page.getByRole('button', { name: 'Appointment Schedules' }).click();
    });

    test('should render appointments tab and display fetched appointments', async ({ page }) => {
        // Verify component heading inside the workspace area
        await expect(page.getByRole('heading', { name: 'Medical Appointments' })).toBeVisible();

        // Check table rows (displays patient & doctor names or IDs depending on state)
        await expect(page.getByText('John Doe')).toBeVisible();
        await expect(page.getByText('Dr. Gregory House')).toBeVisible();
        await expect(page.getByText('Consultation')).toBeVisible();
        await expect(page.getByText('Annual Checkup')).toBeVisible();
        await expect(page.getByText('Scheduled')).toBeVisible();
    });

    test('should open and close the creation modal', async ({ page }) => {
        await page.getByRole('button', { name: '+ New Appointment' }).click();

        const modalHeading = page.getByRole('heading', { name: 'New Appointment' });
        await expect(modalHeading).toBeVisible();

        // Close via modal '✕' button
        await page.getByRole('button', { name: '✕' }).click();
        await expect(modalHeading).not.toBeVisible();
    });

    test('should create a new appointment using select dropdowns and refresh table list', async ({ page }) => {
        const newAppointment = {
            id: 103,
            patient_id: '1071',
            doctor_id: '711',
            appointment_date: '2026-09-01',
            appointment_time: '11:00',
            appointment_type: 'Consultation',
            reason: 'Fever and Flu symptoms',
            status: 'Scheduled',
        };

        // Override route for POST creation + subsequent GET refresh call
        await page.route('**/appointments', async (route) => {
            const method = route.request().method();

            if (method === 'POST') {
                const postData = route.request().postDataJSON();
                expect(postData.patient_id).toBe('1071');
                expect(postData.doctor_id).toBe('711');

                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify({ ...postData, id: 103 }),
                });
            } else if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([...mockAppointments, newAppointment]),
                });
            }
        });

        // Fill form inside modal
        await page.getByRole('button', { name: '+ New Appointment' }).click();

        // Select Patient and Doctor from dropdown options
        await page.locator('select[name="patient_id"]').selectOption('1071');
        await page.locator('select[name="doctor_id"]').selectOption('711');
        await page.locator('select[name="appointment_type"]').selectOption('Consultation');
        await page.locator('input[name="appointment_date"]').fill('2026-09-01');
        await page.locator('input[name="appointment_time"]').fill('11:00');
        await page.locator('select[name="status"]').selectOption('Scheduled');
        await page.locator('textarea[name="reason"]').fill('Fever and Flu symptoms');

        await page.locator('button[type="submit"]').click();

        await expect(page.getByRole('heading', { name: 'New Appointment' })).not.toBeVisible();
        await expect(page.getByText('Fever and Flu symptoms')).toBeVisible();
    });

    test('should pre-fill modal dropdowns and update existing appointment', async ({ page }) => {
        await page.route('**/appointments/101', async (route) => {
            if (route.request().method() === 'PUT') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ success: true }),
                });
            }
        });

        // Target edit button on specific row
        const targetRow = page.locator('tr').filter({ hasText: '#101' });
        await targetRow.getByRole('button', { name: 'Edit' }).click();

        // Verify form pre-population for select inputs
        await expect(page.getByRole('heading', { name: 'Edit Appointment #101' })).toBeVisible();
        await expect(page.locator('select[name="patient_id"]')).toHaveValue('12');
        await expect(page.locator('select[name="doctor_id"]')).toHaveValue('5');

        // Make edits
        await page.locator('select[name="status"]').selectOption('Completed');
        await page.locator('textarea[name="reason"]').fill('Annual Checkup - All clear');

        await page.locator('button[type="submit"]').click();
        await expect(page.getByRole('heading', { name: 'Edit Appointment #101' })).not.toBeVisible();
    });

    test('should handle appointment deletion after accepting native browser confirm', async ({ page }) => {
        await page.route('**/appointments/101', async (route) => {
            if (route.request().method() === 'DELETE') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ message: 'Deleted successfully' }),
                });
            }
        });

        await page.route('**/appointments', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([mockAppointments[1]]),
            });
        });

        // Confirm browser confirmation alert window
        page.once('dialog', async (dialog) => {
            expect(dialog.message()).toBe('Are you sure you want to delete this appointment?');
            await dialog.accept();
        });

        const targetRow = page.locator('tr').filter({ hasText: '#101' });
        await targetRow.getByRole('button', { name: 'Delete' }).click();

        await expect(page.getByText('John Doe')).not.toBeVisible();
    });

    test('should render error alert banner on fetch failure', async ({ page }) => {
        // Fail GET endpoint
        await page.route('**/appointments', async (route) => {
            await route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({ message: 'Failed to load appointments from server' }),
            });
        });

        // Re-click tab to trigger fresh state fetch
        await page.getByRole('button', { name: 'Dashboard Overview' }).click();
        await page.getByRole('button', { name: 'Appointment Schedules' }).click();

        const errorBanner = page.locator('div[name="error-alert"]', { hasText: 'Failed to load appointments from server' });
        await expect(errorBanner).toBeVisible();

        // Close alert banner
        await errorBanner.getByRole('button', { name: '✕' }).click();
        await expect(errorBanner).not.toBeVisible();
    });
});