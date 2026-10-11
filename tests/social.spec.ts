import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignupPage } from '../pages/SignupPage';

test('login: Google button redirects to Google', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  const [request] = await Promise.all([
    page.waitForRequest((r) => r.url().includes('accounts.google.com')),
    page.getByRole('button', { name: /Google/i }).click(),
  ]);
  expect(request.url()).toContain('accounts.google.com');
});

test('login: Apple button redirects to Apple', async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  const [request] = await Promise.all([
    page.waitForRequest((r) => r.url().includes('appleid.apple.com')),
    page.getByRole('button', { name: /Apple/i }).click(),
  ]);
  expect(request.url()).toContain('appleid.apple.com');
});

test('signup: email + Google + Apple options are shown', async ({ page }) => {
  const signup = new SignupPage(page);
  await signup.open();
  await expect(signup.emailInput).toBeVisible();
  await expect(page.getByRole('button', { name: /Google/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Apple/i })).toBeVisible();
});
