const { test, expect } = require('@playwright/test');

test.describe('Dashboard Navigation', () => {
  test('should navigate from Overview to Transactions page', async ({ page }) => {
    // Start at dashboard overview
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on Transactions link in sidebar
    await page.locator('text=Transactions').first().click();
    await page.waitForLoadState('networkidle');

    // Verify we're on the transactions page
    expect(page.url()).toContain('/transactions');

    // Verify page loaded correctly
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate from Overview to Settings page', async ({ page }) => {
    // Start at dashboard overview
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on Settings link in sidebar
    await page.locator('text=Settings').first().click();
    await page.waitForLoadState('networkidle');

    // Verify we're on the settings page
    expect(page.url()).toContain('/settings');

    // Verify settings page elements are visible
    await expect(page.locator('text=General information').or(page.locator('text=Profile'))).toBeVisible();
  });

  test('should navigate to Bootstrap Tables', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Expand Tables collapsible menu if it exists
    const tablesAccordion = page.locator('text=Tables').first();
    await tablesAccordion.click();

    // Wait for accordion to expand
    await page.waitForTimeout(500);

    // Click on Bootstrap Table
    await page.locator('text=Bootstrap Table').click();
    await page.waitForLoadState('networkidle');

    // Verify we're on the bootstrap tables page
    expect(page.url()).toContain('/tables/bootstrap-tables');
  });

  test('should expand and collapse navigation sections', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on Page Examples accordion
    const pageExamplesAccordion = page.locator('text=Page Examples').first();
    await pageExamplesAccordion.click();

    // Wait for accordion to expand
    await page.waitForTimeout(500);

    // Verify submenu items are visible
    await expect(page.locator('text=Sign In').first()).toBeVisible();
    await expect(page.locator('text=Sign Up').first()).toBeVisible();
    await expect(page.locator('text=Forgot password')).toBeVisible();

    // Click again to collapse
    await pageExamplesAccordion.click();
    await page.waitForTimeout(500);

    // Check Components accordion
    const componentsAccordion = page.locator('text=Components').first();
    await componentsAccordion.click();
    await page.waitForTimeout(500);

    // Verify component submenu items
    await expect(page.locator('text=Accordion').first()).toBeVisible();
    await expect(page.locator('text=Alerts').first()).toBeVisible();
    await expect(page.locator('text=Buttons').first()).toBeVisible();
  });

  test('should navigate to different component pages', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Expand Components menu
    await page.locator('text=Components').first().click();
    await page.waitForTimeout(500);

    // Navigate to Buttons page
    await page.locator('text=Buttons').first().click();
    await page.waitForLoadState('networkidle');

    // Verify URL
    expect(page.url()).toContain('/components/buttons');

    // Go back to overview
    await page.locator('text=Overview').first().click();
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/dashboard/overview');
  });

  test('should maintain active state on current page', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Check that Overview nav item has active class
    const overviewNavItem = page.locator('nav a[href*="overview"]').first();
    const overviewParent = page.locator('.nav-item:has(a[href*="overview"])').first();

    // Either the link or its parent should have the active class
    const hasActiveClass = await overviewNavItem.evaluate((el) =>
      el.classList.contains('active') || el.closest('.nav-item')?.classList.contains('active')
    );

    expect(hasActiveClass).toBe(true);
  });

  test('should navigate to documentation pages', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Expand Getting Started menu
    await page.locator('text=Getting Started').first().click();
    await page.waitForTimeout(500);

    // Verify documentation links are visible
    await expect(page.locator('text=Quick Start').first()).toBeVisible();
    await expect(page.locator('text=Folder Structure')).toBeVisible();

    // Navigate to Quick Start
    await page.locator('text=Quick Start').first().click();
    await page.waitForLoadState('networkidle');

    // Verify we're on the quick start page
    expect(page.url()).toContain('/documentation/quick-start');
  });

  test('should allow navigation back to home/overview from any page', async ({ page }) => {
    // Start on settings page
    await page.goto('/#/settings');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Click on Overview to go back
    await page.locator('text=Overview').first().click();
    await page.waitForLoadState('networkidle');

    // Verify we're back on dashboard overview
    expect(page.url()).toContain('/dashboard/overview');

    // Verify overview page content
    await expect(page.locator('text=Sales Value')).toBeVisible();
  });

  test('should handle breadcrumb or back navigation', async ({ page }) => {
    await page.goto('/#/dashboard/overview');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Navigate to a different page
    await page.locator('text=Settings').first().click();
    await page.waitForLoadState('networkidle');

    // Use browser back button
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Should be back at overview
    expect(page.url()).toContain('/dashboard/overview');
  });
});
