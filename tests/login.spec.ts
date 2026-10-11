import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loadCases, resolveValue, LoginCase } from '../utils/test-data';

const cases = loadCases<LoginCase>('login-cases.json');

for (const c of cases) {
  test(`login: ${c.name}`, async ({ page }) => {
    const email = resolveValue(c.email);
    const password = resolveValue(c.password);
    test.skip(c.email.startsWith('$') && !email, `Set ${c.email.slice(1)} to run this case`);

    const login = new LoginPage(page);
    await login.open();
    await login.submitIdentifier(email);

    
    if (await login.isPasswordStepVisible()) {
      if (c.expected === 'success') {
      await login.submitPassword(password);
      await expect(page).toHaveURL(/^https:\/\/app\.sleekflow\.io\/en\/onboarding\/shared-inbox-checklist/, { timeout: 30_000 });
      return;
    }
      const outcome = await login.waitForErrorOrCaptcha();
      if (outcome === 'captcha') {
        test.info().annotations.push({ type: 'warning', description: 'Auth0 CAPTCHA challenge shown to this IP; error-code assertion skipped' });
        return;
      }

      if (c.errorCode) {
        await expect(login.error).toHaveAttribute('data-error-code', c.errorCode);
      }
    }

    const outcome = await login.waitForErrorOrCaptcha();
    if (outcome === 'captcha') {
      test.info().annotations.push({ type: 'warning', description: 'Auth0 CAPTCHA challenge shown to this IP; error-code assertion skipped' });
      return;
    }

    if (c.errorCode) {
      await expect(login.error).toHaveAttribute('data-error-code', c.errorCode);
    }
      
    
  });
}
