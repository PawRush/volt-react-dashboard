const { test, expect } = require('@playwright/test');

test.describe('Dashboard Overview Page', () => {
  test('should load dashboard with key widgets and components', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check for New Task button
    await expect(page.locator('button:has-text("New Task")')).toBeVisible();

    // Check for Share and Export buttons
    await expect(page.locator('button:has-text("Share")')).toBeVisible();
    await expect(page.locator('button:has-text("Export")')).toBeVisible();

    // Verify Sales Value widget is present
    await expect(page.getByRole('heading', { name: 'Sales Value' }).first()).toBeVisible();

    // Verify Traffic Share chart widget
    await expect(page.locator('h5:has-text("Traffic Share")').first()).toBeVisible();
  });

  test('should have interactive dropdown menus', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on New Task dropdown
    await page.locator('button:has-text("New Task")').click();

    // Verify dropdown menu items
    await expect(page.locator('text=Upload Files').first()).toBeVisible();
    await expect(page.locator('text=Preview Security').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upgrade to Pro' })).toBeVisible();

    // Close dropdown by clicking elsewhere
    await page.locator('body').click({ position: { x: 0, y: 0 } });
  });

  test('should display table data correctly', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check that table headers are visible
    await expect(page.locator('text=Page name').first()).toBeVisible();
    await expect(page.locator('text=Page Views').first()).toBeVisible();
    await expect(page.locator('text=Page Value').first()).toBeVisible();

    // Verify at least one table row exists
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows.first()).toBeVisible();
  });

  test('should have working sidebar navigation', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check that sidebar is present - use a more specific selector
    const sidebar = page.locator('nav.navbar-vertical, .sidebar.d-md-block').first();
    await expect(sidebar).toBeVisible();

    // Verify key navigation items exist
    await expect(page.getByRole('link', { name: 'Overview' })).toBeVisible();
  });
});
