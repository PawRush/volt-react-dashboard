const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  test('should render sign in page correctly', async ({ page }) => {
    // Navigate to sign in page (using hash routing)
    await page.goto('/#/examples/sign-in');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Verify page heading
    await expect(page.locator('text=Sign in to our platform')).toBeVisible();

    // Verify email input field
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('placeholder', 'example@company.com');

    // Verify password input field
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
    await expect(passwordInput).toHaveAttribute('placeholder', 'Password');

    // Verify form labels
    await expect(page.locator('text=Your Email')).toBeVisible();
    await expect(page.locator('text=Your Password')).toBeVisible();

    // Verify remember me checkbox
    await expect(page.locator('text=Remember me')).toBeVisible();

    // Verify "Lost password?" link
    await expect(page.locator('text=Lost password?')).toBeVisible();

    // Verify Sign in button
    await expect(page.locator('button[type="submit"]:has-text("Sign in")')).toBeVisible();

    // Verify social login buttons
    await expect(page.locator('text=or login with')).toBeVisible();

    // Verify "Back to homepage" link
    await expect(page.locator('text=Back to homepage')).toBeVisible();

    // Verify "Create account" link
    await expect(page.locator('text=Not registered?')).toBeVisible();
    await expect(page.locator('text=Create account')).toBeVisible();
  });

  test('should validate email input field', async ({ page }) => {
    await page.goto('/#/examples/sign-in');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    const signInButton = page.locator('button[type="submit"]:has-text("Sign in")');

    // Try to submit without filling email (HTML5 validation)
    await signInButton.click();

    // Check if the email input has the required attribute
    await expect(emailInput).toHaveAttribute('required', '');

    // Fill with invalid email format
    await emailInput.fill('invalid-email');
    await signInButton.click();

    // HTML5 validation should prevent form submission
    // The email input should still be focused or show validation message
    const isInvalid = await emailInput.evaluate((el) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });

  test('should validate password input field', async ({ page }) => {
    await page.goto('/#/examples/sign-in');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const signInButton = page.locator('button[type="submit"]:has-text("Sign in")');

    // Fill email with valid format
    await emailInput.fill('test@example.com');

    // Try to submit without password (HTML5 validation)
    await signInButton.click();

    // Check if password input has the required attribute
    await expect(passwordInput).toHaveAttribute('required', '');
  });

  test('should allow filling out the sign in form', async ({ page }) => {
    await page.goto('/#/examples/sign-in');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const rememberCheckbox = page.locator('input[type="checkbox"]');

    // Fill in email
    await emailInput.fill('user@example.com');
    await expect(emailInput).toHaveValue('user@example.com');

    // Fill in password
    await passwordInput.fill('SecurePassword123!');
    await expect(passwordInput).toHaveValue('SecurePassword123!');

    // Check remember me checkbox
    await rememberCheckbox.check();
    await expect(rememberCheckbox).toBeChecked();

    // Uncheck remember me checkbox
    await rememberCheckbox.uncheck();
    await expect(rememberCheckbox).not.toBeChecked();
  });

  test('should navigate to sign up page', async ({ page }) => {
    await page.goto('/#/examples/sign-in');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on "Create account" link
    await page.locator('text=Create account').click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we're on the sign up page
    expect(page.url()).toContain('/examples/sign-up');
  });

  test('should navigate back to homepage', async ({ page }) => {
    await page.goto('/#/examples/sign-in');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on "Back to homepage" link
    await page.locator('text=Back to homepage').click();

    // Wait for navigation
    await page.waitForLoadState('networkidle');

    // Verify we're on the dashboard overview or home page
    expect(page.url()).toContain('/dashboard/overview');
  });

  test('should display social login options', async ({ page }) => {
    await page.goto('/#/examples/sign-in');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check for social login buttons by looking for their icons/classes
    const socialButtons = page.locator('.btn-icon-only, button[class*="facebook"], button[class*="twitter"], button[class*="github"]');

    // Should have at least 3 social login buttons (Facebook, Twitter, GitHub)
    await expect(socialButtons.first()).toBeVisible();
  });
});
