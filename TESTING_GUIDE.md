# Testing Guide for Volt React Dashboard

## Overview

This repository now includes a comprehensive Playwright end-to-end (E2E) test suite covering the main features of the Volt React Dashboard application.

## What Was Installed

1. **Dependencies**: All npm dependencies installed with `--legacy-peer-deps` flag due to peer dependency conflicts
2. **Playwright**: @playwright/test package installed as dev dependency
3. **Chromium Browser**: Playwright Chromium browser binary installed for testing

## Test Suite Structure

The test suite consists of 5 comprehensive test files with 42+ test cases:

### 1. Dashboard Overview Tests (`tests/dashboard-overview.spec.js`)
- ✓ Dashboard loads with all widgets and components
- ✓ Displays correct statistics (Sales Value, Customers, Revenue)
- ✓ Interactive dropdown menus work
- ✓ Table data displays correctly
- ✓ Sidebar navigation is functional

### 2. Authentication Tests (`tests/authentication.spec.js`)
- ✓ Sign-in page renders correctly with all form elements
- ✓ Email input validation (HTML5)
- ✓ Password input validation (required field)
- ✓ Form fields accept input correctly
- ✓ Navigation to sign-up page works
- ✓ "Back to homepage" link functions
- ✓ Social login buttons display

### 3. Navigation Tests (`tests/navigation.spec.js`)
- ✓ Navigate between Overview, Transactions, Settings
- ✓ Bootstrap Tables navigation
- ✓ Expand/collapse navigation sections (accordions)
- ✓ Component pages navigation (Buttons, Alerts, etc.)
- ✓ Active state maintained on current page
- ✓ Documentation pages accessible
- ✓ Browser back button works
- ✓ Deep linking supported

### 4. Settings Page Tests (`tests/settings.spec.js`)
- ✓ Settings page loads with all sections
- ✓ General information form fields display
- ✓ Form accepts user input (First Name, Last Name, Email, etc.)
- ✓ Required field validation
- ✓ Dropdown menus functional ("New", "Reports")
- ✓ Profile photo widget displays
- ✓ Date picker for birthday field works
- ✓ Gender dropdown with options
- ✓ Form state maintained across field changes

### 5. Responsive Design & Charts Tests (`tests/responsive-and-charts.spec.js`)
- ✓ Desktop layout (1920x1080)
- ✓ Tablet layout (768x1024)
- ✓ Mobile layout (375x667)
- ✓ Charts render on all viewports
- ✓ Mobile navigation (hamburger menu)
- ✓ Widgets stack vertically on mobile
- ✓ Traffic Share circle chart renders
- ✓ Bar Chart for total orders renders
- ✓ Chart legends and labels display
- ✓ Responsive breakpoints tested (6 common breakpoints)
- ✓ Performance: Charts don't block rendering

## Configuration

The test suite is configured in `playwright.config.js`:

```javascript
- Base URL: http://localhost:3000
- Test timeout: 60 seconds
- Action timeout: 10 seconds
- Projects: Chromium (desktop) and Mobile (iPhone 12)
- Web Server: Auto-starts dev server before tests
- Reporter: HTML report with screenshots on failure
- Traces: Captured on first retry for debugging
```

## Important Notes

### Hash Routing
This application uses **HashRouter**, so all URLs include a hash (#). Tests navigate to URLs like:
- `/#/dashboard/overview`
- `/#/examples/sign-in`
- `/#/settings`

### Preloader
The application has a 1-second preloader delay. Tests include `await page.waitForTimeout(1500)` after navigation to ensure the preloader disappears before assertions.

## How to Run Tests

### 1. Prerequisites

Ensure dependencies are installed:
```bash
npm install --legacy-peer-deps
```

Ensure Playwright browsers are installed:
```bash
npx playwright install
```

### 2. Running Tests

**Run all tests:**
```bash
npm run test:e2e
```

**Run tests with UI mode (recommended for development):**
```bash
npm run test:e2e:ui
```

**Run tests in headed mode (see browser):**
```bash
npm run test:e2e:headed
```

**Run specific test file:**
```bash
npx playwright test tests/dashboard-overview.spec.js
```

**Run tests for specific project:**
```bash
npx playwright test --project=chromium
npx playwright test --project=mobile
```

**Run single test:**
```bash
npx playwright test tests/authentication.spec.js:4
```

### 3. View Test Results

**View HTML report:**
```bash
npm run test:e2e:report
```

**Debug failed tests:**
```bash
npx playwright test --debug
```

## Test Coverage Summary

| Feature Area | Tests | Key Assertions |
|--------------|-------|----------------|
| Dashboard Overview | 5 | Widgets, statistics, dropdowns, tables, sidebar |
| Authentication | 7 | Form rendering, validation, navigation, social login |
| Navigation | 9 | Page transitions, accordions, active states |
| Settings | 9 | Forms, dropdowns, date picker, validation |
| Responsive & Charts | 12 | 3 viewports, charts, mobile nav, breakpoints |
| **Total** | **42** | **Comprehensive E2E coverage** |

## Known Issues & Workarounds

### 1. Peer Dependency Warnings
The project has peer dependency conflicts (chartist versions). Resolved by using `--legacy-peer-deps` flag.

### 2. Security Vulnerabilities
The project has 196 security vulnerabilities (inherited from dependencies). These are from older package versions and can be addressed separately.

### 3. Web Server Stability
In some environments, the auto-start web server may exit early. If this happens:

**Option A: Start server manually**
```bash
# Terminal 1: Start dev server
npm start

# Terminal 2: Run tests (will reuse existing server)
npm run test:e2e
```

**Option B: Update playwright.config.js**
Set `reuseExistingServer: true` to always use an existing server.

## Troubleshooting

### Tests Timeout
- Increase timeout in `playwright.config.js`:
  ```javascript
  timeout: 90000, // 90 seconds
  ```

### Tests Fail with "Element not found"
- The preloader might still be visible. Increase wait time:
  ```javascript
  await page.waitForTimeout(2000); // Instead of 1500
  ```

### Can't Connect to Server
- Verify server is running: `curl http://localhost:3000`
- Check port 3000 isn't in use: `lsof -i :3000`
- Start server manually and run tests separately

### Screenshots Show Wrong Page
- Application uses hash routing. Ensure URLs include `/#/` prefix
- Example: `await page.goto('/#/dashboard/overview')`

## Best Practices

1. **Wait for Preloader**: Always wait 1500ms after navigation
2. **Use Flexible Selectors**: Tests use multiple selector strategies (text, role, class)
3. **Explicit Waits**: Use `waitForLoadState('networkidle')` for dynamic content
4. **Viewport Testing**: Test at multiple breakpoints for responsive design
5. **Error Screenshots**: Automatically captured on failure in `test-results/`

## Continuous Integration

To run tests in CI/CD:

```bash
# Set CI environment variable
export CI=true

# Run tests with CI-optimized settings
npm run test:e2e
```

CI configuration automatically:
- Sets retries to 2
- Uses 1 worker for stability
- Requires explicit test passes (forbidOnly)

## Extending the Tests

### Adding New Tests

1. Create new spec file in `tests/` directory
2. Follow naming convention: `feature-name.spec.js`
3. Use existing tests as templates
4. Remember hash routing and preloader delays

Example:
```javascript
const { test, expect } = require('@playwright/test');

test.describe('New Feature', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/#/your-page');
    await page.waitForTimeout(1500);
    await page.waitForLoadState('networkidle');

    // Your assertions here
    await expect(page.locator('text=Expected')).toBeVisible();
  });
});
```

### Testing New Components

For new components added to the application:
1. Add tests in appropriate spec file or create new one
2. Update README in `tests/` directory
3. Run tests to verify they pass
4. Commit tests with component changes

## Resources

- **Playwright Documentation**: https://playwright.dev
- **Test Results**: `playwright-report/` directory
- **Test Screenshots**: `test-results/` directory
- **Configuration**: `playwright.config.js`
- **Detailed Test Docs**: `tests/README.md`

## Summary

This test suite provides comprehensive coverage of the Volt React Dashboard application, testing:
- ✓ All major pages (Dashboard, Sign-in, Settings, Transactions)
- ✓ Form interactions and validation
- ✓ Navigation and routing
- ✓ Responsive design (Desktop, Tablet, Mobile)
- ✓ Chart rendering and interactions
- ✓ UI components (Dropdowns, Tables, Widgets)

The tests are ready to run and can be integrated into your development workflow for continuous testing and quality assurance.
