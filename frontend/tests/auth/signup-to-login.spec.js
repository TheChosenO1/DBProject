const { test, expect } = require('@playwright/test');

test.describe('Signup to Login Navigation', () => {
  test('should navigate from signup to login page when clicking the link', async ({ page }) => {
    // Start at signup page
    await page.goto('http://localhost:5173/signup');
    
    // Verify we're on signup page by checking the title
    const signupTitle = await page.locator('.auth-title');
    await expect(signupTitle).toHaveText('Welcome to ChateâuNYC!');
    
    // Find and click the "Sign in" link
    const signInLink = await page.locator('.auth-link a');
    await expect(signInLink).toHaveText('Sign in by clicking here');
    await expect(signInLink).toHaveCSS('text-decoration', 'underline');
    await expect(signInLink).toHaveCSS('color', 'rgb(168, 166, 167)'); // #A8A6A7
    await expect(signInLink).toHaveCSS('font-family', /Nunito/);
    await expect(signInLink).toHaveCSS('font-size', '24px');
    
    // Click the link
    await signInLink.click();
    
    // Verify we're redirected to login page
    await expect(page).toHaveURL('http://localhost:5173/login');
    
    // Verify login page title
    const loginTitle = await page.locator('.auth-title');
    await expect(loginTitle).toHaveText('Welcome Back!');
  });

  test('should maintain styling on link hover', async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
    
    // Check hover state styling
    const signInLink = await page.locator('.auth-link a');
    await signInLink.hover();
    await expect(signInLink).toHaveCSS('opacity', '0.8');
  });

  test('should have correct parent element styling', async ({ page }) => {
    await page.goto('http://localhost:5173/signup');
    
    // Check parent element (.auth-link) styling
    const authLink = await page.locator('.auth-link');
    await expect(authLink).toHaveCSS('text-align', 'center');
    await expect(authLink).toHaveCSS('font-family', /Nunito/);
    await expect(authLink).toHaveCSS('font-size', '24px');
    await expect(authLink).toHaveCSS('font-weight', '700');
    await expect(authLink).toHaveCSS('color', 'rgb(168, 166, 167)'); // #A8A6A7
  });
}); 