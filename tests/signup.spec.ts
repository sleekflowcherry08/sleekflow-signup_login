import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { loadCases, resolveValue, SignupCase } from '../utils/test-data';

const cases = loadCases<SignupCase>('signup-cases.json');

for (const c of cases) {
  test(`signup: ${c.name}`, async ({ page }) => {
    const email = resolveValue(c.email);
    const password = c.password ? resolveValue(c.password) : '';
    test.skip(c.email.startsWith('$') && !email, `Set ${c.email.slice(1)} to run this case`);

    const signup = new SignupPage(page);
    await signup.open();
    await signup.submitEmail(email, c.acceptTerms);

    if (c.expected === 'blocked') {
      await expect(page).toHaveURL(/\/u\/signup\/identifier/);
      await expect(page.locator('#password')).toHaveCount(0);
      return;
    }

    await page.waitForURL(/\/u\/signup\/password/);
    await signup.submitPassword(password);

    if (c.expected === 'error') {
      await expect(signup.error(c.errorId!)).toBeVisible();
      await expect(page).toHaveURL(/\/u\/signup\/password/);
      return;
    }

    await expect(page).not.toHaveURL(/\/u\/signup\/password/, { timeout: 30_000 });
  });
}
