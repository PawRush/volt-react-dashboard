const { test, expect } = require('@playwright/test');

test.describe('Dashboard Overview Page', () => {
  test('should load dashboard with all widgets and components', async ({ page }) => {
    // Navigate to dashboard overview (using hash routing)
    await page.goto('/#/dashboard/overview');

    // Wait for preloader to disappear and page to be fully loaded
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Verify page title or main heading
    await expect(page.locator('body')).toBeVisible();

    // Check for New Task button
    await expect(page.locator('button:has-text("New Task")')).toBeVisible();

    // Check for Share and Export buttons
    await expect(page.locator('button:has-text("Share")')).toBeVisible();
    await expect(page.locator('button:has-text("Export")')).toBeVisible();

    // Verify Sales Value widget is present
    await expect(page.locator('text=Sales Value')).toBeVisible();

    // Verify Counter widgets are present
    await expect(page.locator('text=Customers')).toBeVisible();
    await expect(page.locator('text=Revenue')).toBeVisible();

    // Verify Traffic Share chart widget
    await expect(page.locator('text=Traffic Share')).toBeVisible();

    // Verify Page Visits Table is present
    await expect(page.locator('text=Page name')).toBeVisible();

    // Verify Team Members Widget
    await expect(page.locator('text=Team members')).toBeVisible();

    // Verify Progress Track Widget
    await expect(page.locator('text=Progress track')).toBeVisible();

    // Verify Total Orders chart
    await expect(page.locator('text=Total orders')).toBeVisible();

    // Verify Ranking Widget
    await expect(page.locator('text=Ranking')).toBeVisible();

    // Verify Acquisition Widget
    await expect(page.locator('text=Acquisition')).toBeVisible();
  });

  test('should display correct statistics on dashboard', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check for specific data values
    await expect(page.locator('text=10,567')).toBeVisible(); // Sales Value
    await expect(page.locator('text=345k')).toBeVisible(); // Customers
    await expect(page.locator('text=$43,594')).toBeVisible(); // Revenue

    // Verify percentage indicators are present
    await expect(page.locator('text=18.2%')).toBeVisible();
    await expect(page.locator('text=28.4%')).toBeVisible();
  });

  test('should have interactive dropdown menus', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on New Task dropdown
    await page.locator('button:has-text("New Task")').click();

    // Verify dropdown menu items
    await expect(page.locator('text=Upload Files')).toBeVisible();
    await expect(page.locator('text=Preview Security')).toBeVisible();
    await expect(page.locator('text=Upgrade to Pro')).toBeVisible();

    // Close dropdown by clicking elsewhere
    await page.locator('body').click({ position: { x: 0, y: 0 } });
  });

  test('should display table data correctly', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check that table headers are visible
    await expect(page.locator('text=Page name')).toBeVisible();
    await expect(page.locator('text=Page Views')).toBeVisible();
    await expect(page.locator('text=Page Value')).toBeVisible();

    // Verify at least one table row exists
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows.first()).toBeVisible();
  });

  test('should have working sidebar navigation', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check that sidebar is present
    const sidebar = page.locator('.sidebar, nav.sidebar, [class*="sidebar"]');
    await expect(sidebar).toBeVisible();

    // Verify key navigation items exist
    await expect(page.locator('text=Overview').or(page.locator('text=Dashboard'))).toBeVisible();
  });
});
