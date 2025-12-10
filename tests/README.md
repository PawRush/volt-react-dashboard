# Playwright Test Suite for Volt React Dashboard

This directory contains end-to-end (E2E) tests for the Volt React Dashboard application using Playwright.

## Test Overview

The test suite includes comprehensive coverage of the following areas:

### 1. Dashboard Overview Tests (`dashboard-overview.spec.js`)
- **Dashboard widget loading**: Verifies all widgets load correctly (Sales Value, Customers, Revenue, Traffic Share, etc.)
- **Statistics display**: Validates correct data values and percentage indicators
- **Interactive elements**: Tests dropdown menus (New Task dropdown)
- **Table rendering**: Checks Page Visits Table data display
- **Sidebar navigation**: Ensures sidebar is present and functional

### 2. Authentication Tests (`authentication.spec.js`)
- **Sign-in page rendering**: Validates all form elements are present
- **Form validation**: Tests HTML5 validation for email and password fields
- **Form interaction**: Tests filling out and submitting the sign-in form
- **Navigation links**: Tests "Create account" and "Back to homepage" links
- **Social login options**: Verifies social login buttons are displayed
- **Remember me functionality**: Tests checkbox interaction

### 3. Navigation Tests (`navigation.spec.js`)
- **Page transitions**: Tests navigation between Overview, Transactions, Settings
- **Sidebar navigation**: Tests all sidebar links and sections
- **Collapsible menus**: Tests expanding/collapsing accordion sections (Tables, Components, Documentation)
- **Active state**: Verifies current page highlighting
- **Browser navigation**: Tests back button functionality
- **Deep linking**: Validates direct URL access to different pages

### 4. Settings Page Tests (`settings.spec.js`)
- **Page structure**: Validates settings page loads with all sections
- **Form fields**: Tests all general information form fields (First Name, Last Name, Email, etc.)
- **Form validation**: Checks required field validation
- **Form interaction**: Tests filling out and maintaining form state
- **Dropdown menus**: Tests "New" and "Reports" dropdown functionality
- **Date picker**: Tests birthday field date picker interaction
- **Profile widgets**: Verifies profile photo widget display

### 5. Responsive Design & Charts Tests (`responsive-and-charts.spec.js`)
- **Desktop layout**: Tests layout at 1920x1080 resolution
- **Tablet layout**: Tests layout at 768x1024 resolution
- **Mobile layout**: Tests layout at 375x667 resolution
- **Chart rendering**: Validates Traffic Share and Total Orders charts
- **Mobile navigation**: Tests hamburger menu and mobile sidebar
- **Responsive breakpoints**: Tests layout at 6 common breakpoints
- **Chart interactions**: Ensures charts remain functional during page interactions
- **Performance**: Validates charts don't block page rendering

## Test Configuration

The test suite is configured in `playwright.config.js` with the following settings:

- **Base URL**: http://localhost:3000
- **Projects**:
  - Chromium (Desktop Chrome)
  - Mobile (iPhone 12)
- **Web Server**: Automatically starts the dev server before tests
- **Reporters**: HTML report (view with `npm run test:e2e:report`)
- **Retry**: 2 retries in CI, 0 locally
- **Trace**: Captured on first retry for debugging

## Running the Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Test Commands

Run all tests in headless mode:
```bash
npm run test:e2e
```

Run tests with UI mode (interactive):
```bash
npm run test:e2e:ui
```

Run tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

View test report:
```bash
npm run test:e2e:report
```

Run specific test file:
```bash
npx playwright test tests/dashboard-overview.spec.js
```

Run tests for specific project:
```bash
npx playwright test --project=chromium
npx playwright test --project=mobile
```

Run tests in debug mode:
```bash
npx playwright test --debug
```

## Test Structure

Each test file follows this structure:

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test('should do something specific', async ({ page }) => {
    // Navigate to page
    await page.goto('/path');

    // Perform actions
    await page.click('button');

    // Assert expectations
    await expect(page.locator('text=Expected')).toBeVisible();
  });
});
```

## Best Practices

1. **Wait for network idle**: Use `await page.waitForLoadState('networkidle')` after navigation
2. **Explicit waits**: Add timeouts for charts and dynamic content
3. **Flexible selectors**: Use multiple selector strategies (text, role, test-id)
4. **Viewport testing**: Test at multiple breakpoints for responsive design
5. **Error handling**: Tests include fallbacks for conditional elements
6. **Clean state**: Each test is independent and doesn't rely on previous test state

## Debugging Failed Tests

1. **View HTML Report**:
   ```bash
   npm run test:e2e:report
   ```

2. **Run with UI Mode**:
   ```bash
   npm run test:e2e:ui
   ```

3. **Run in Debug Mode**:
   ```bash
   npx playwright test --debug tests/specific-test.spec.js
   ```

4. **View Traces**: When tests fail, traces are automatically captured and can be viewed in the HTML report

## CI/CD Integration

To run tests in CI/CD:

```bash
# Set CI environment variable
export CI=true

# Run tests
npm run test:e2e
```

The configuration automatically:
- Sets retries to 2
- Uses 1 worker for stability
- Disables server reuse

## Test Coverage Summary

| Feature | Test Count | Coverage |
|---------|------------|----------|
| Dashboard Overview | 5 tests | Widgets, tables, dropdowns, navigation |
| Authentication | 7 tests | Form validation, navigation, social login |
| Navigation | 9 tests | Sidebar, routing, active states |
| Settings | 9 tests | Forms, validation, dropdowns, date picker |
| Responsive & Charts | 12 tests | 3 viewports, charts, performance |
| **Total** | **42 tests** | **Comprehensive E2E coverage** |

## Future Enhancements

Potential areas for additional test coverage:

1. **Component Library Tests**: Test individual components (Buttons, Modals, Alerts, etc.)
2. **Accessibility Tests**: Add tests for ARIA labels, keyboard navigation, screen reader support
3. **Visual Regression Tests**: Add screenshot comparison tests
4. **API Mocking**: Mock backend API calls for testing error states
5. **Performance Tests**: Add Lighthouse audits and performance metrics
6. **Cross-browser Tests**: Add Firefox and WebKit projects
7. **Data-driven Tests**: Parameterize tests with different data sets

## Maintenance

When updating the application:

1. **New Features**: Add corresponding tests in appropriate spec file
2. **Breaking Changes**: Update selectors and expectations in affected tests
3. **Refactoring**: Keep tests in sync with component changes
4. **Deprecations**: Remove tests for removed features

## Support

For issues or questions about the test suite:

1. Check the [Playwright Documentation](https://playwright.dev)
2. Review test failures in the HTML report
3. Run tests in UI mode for interactive debugging
4. Check console output for detailed error messages

---

**Note**: These tests are designed to work with the Volt React Dashboard application. If you've made significant changes to the application structure, you may need to update the test selectors and expectations accordingly.
