import { test, expect } from '@playwright/test';

test.describe('Solve Flow', () => {
    test('should navigate to solve page and run code', async ({ page }) => {
        // Navigate to home page
        await page.goto('http://localhost:3000');

        // Wait for content (checking header)
        await expect(page.getByText('AlgoDaily.init()')).toBeVisible();

        // Navigate to a problem (Using link text)
        // Note: We might need to ensure a problem is visible. 
        // Since we're in a real browser, we can click the "Daily Duo" or "Extra Credit" links.
        // Let's rely on the first "Solve" or "View" link we find, or hard navigate.
        await page.goto('http://localhost:3000/solve/two-sum');

        // Check we are on the solve page
        await expect(page.getByText('Two Sum')).toBeVisible();
        await expect(page.getByText('README.md')).toBeVisible();

        // Check Editor is present (Monaco is canvas/lines, hard to select, but we can verify container)
        // We'll click the Run button to verify it attempts execution
        const runButton = page.getByRole('button', { name: 'RUN_CODE' });
        await expect(runButton).toBeVisible();

        // Click Run (Default starter code usually returns empty, so tests fail, but verify UI reacts)
        await runButton.click();

        // Should switch to console tab and show results
        await expect(page.getByText('CONSOLE_OUTPUT')).toHaveClass(/border-accent-primary/); // Active tab check via class logic approximation or just text visibility
        await expect(page.getByText('Test Case 1')).toBeVisible(); // Should show fail/pass
    });
});
