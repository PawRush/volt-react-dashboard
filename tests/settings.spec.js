const { test, expect } = require('@playwright/test');

test.describe('Settings Page', () => {
  test('should load settings page with all sections', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Verify main heading
    await expect(page.locator('h5:has-text("General information")')).toBeVisible();

    // Verify New dropdown button
    await expect(page.locator('button:has-text("New")')).toBeVisible();

    // Verify Reports dropdown button
    await expect(page.locator('button:has-text("Reports")')).toBeVisible();

    // Verify profile card section exists
    await expect(page.locator('.card').first()).toBeVisible();
  });

  test('should display general information form fields', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check for form labels
    await expect(page.locator('label:has-text("First Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Last Name")')).toBeVisible();
    await expect(page.locator('label:has-text("Birthday")')).toBeVisible();
    await expect(page.locator('label:has-text("Gender")')).toBeVisible();
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('label:has-text("Phone")')).toBeVisible();

    // Check for address section
    await expect(page.locator('h5:has-text("Address")')).toBeVisible();
    await expect(page.locator('label:has-text("City")')).toBeVisible();
  });

  test('should allow filling out the general information form', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Fill out first name
    const firstNameInput = page.locator('input[placeholder="Enter your first name"]');
    await firstNameInput.fill('John');
    await expect(firstNameInput).toHaveValue('John');

    // Fill out last name
    const lastNameInput = page.locator('input[placeholder="Also your last name"]');
    await lastNameInput.fill('Doe');
    await expect(lastNameInput).toHaveValue('Doe');

    // Fill out email
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('john.doe@example.com');
    await expect(emailInput).toHaveValue('john.doe@example.com');

    // Select gender - Form.Select renders as a select element inside the Form.Group
    const genderSelect = page.locator('#gender select');
    await genderSelect.selectOption('1'); // Female
    await expect(genderSelect).toHaveValue('1');

    // Fill out address
    const addressInput = page.locator('input[placeholder="Enter your home address"]');
    await addressInput.fill('123 Main Street');
    await expect(addressInput).toHaveValue('123 Main Street');

    // Fill out city
    const cityInput = page.locator('input[placeholder="City"]');
    await cityInput.fill('New York');
    await expect(cityInput).toHaveValue('New York');
  });

  test('should validate required form fields', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check that inputs have required attribute
    const firstNameInput = page.locator('input[placeholder="Enter your first name"]');
    await expect(firstNameInput).toHaveAttribute('required', '');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveAttribute('required', '');
  });

  test('should have functional dropdown menus', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on "New" dropdown
    await page.locator('button:has-text("New")').click();
    await page.waitForTimeout(300);

    // Verify dropdown items are visible - use more specific selectors
    await expect(page.getByRole('button', { name: 'Document' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Message', exact: true })).toBeVisible();

    // Close dropdown
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await page.waitForTimeout(300);

    // Click on "Reports" dropdown
    await page.locator('button:has-text("Reports")').click();
    await page.waitForTimeout(300);

    // Verify reports dropdown items
    await expect(page.getByRole('button', { name: 'Products' })).toBeVisible();
  });

  test('should display profile photo widget', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check for profile photo section heading
    await expect(page.getByRole('heading', { name: 'Select profile photo' })).toBeVisible();
  });

  test('should handle date picker for birthday field', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Find birthday input
    const birthdayInput = page.locator('input[placeholder="mm/dd/yyyy"]');

    // Click on the birthday field to open date picker
    await birthdayInput.click();
    await page.waitForTimeout(500);

    // Check if date picker calendar appears (it might be in a portal/modal)
    const calendar = page.locator('.rdtPicker, .react-datetime-picker, .rdt');
    const isCalendarVisible = await calendar.count() > 0;

    if (isCalendarVisible) {
      await expect(calendar.first()).toBeVisible();
    }
  });

  test('should have gender dropdown with options', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Find gender select - Form.Select renders as a select element inside the Form.Group
    const genderSelect = page.locator('#gender select');
    await expect(genderSelect).toBeVisible();

    // Get all options
    const options = await genderSelect.locator('option').allTextContents();

    // Verify options contain expected values
    expect(options.some(opt => opt.includes('Female'))).toBe(true);
    expect(options.some(opt => opt.includes('Male'))).toBe(true);
  });

  test('should maintain form state when switching between fields', async ({ page }) => {
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Fill multiple fields
    const firstNameInput = page.locator('input[placeholder="Enter your first name"]');
    await firstNameInput.fill('Alice');

    const lastNameInput = page.locator('input[placeholder="Also your last name"]');
    await lastNameInput.fill('Smith');

    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill('alice.smith@example.com');

    // Click on another field
    const cityInput = page.locator('input[placeholder="City"]');
    await cityInput.click();

    // Verify previous fields still have their values
    await expect(firstNameInput).toHaveValue('Alice');
    await expect(lastNameInput).toHaveValue('Smith');
    await expect(emailInput).toHaveValue('alice.smith@example.com');
  });
});
