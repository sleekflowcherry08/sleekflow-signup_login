import { test, expect } from '@playwright/test';
import { SignupPage } from '../pages/SignupPage';
import { loadCases, resolveValue, SignupCase } from '../utils/test-data';
import { getLatestOtpCode } from '../utils/gmail';

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

    const outcome = await signup.waitForCaptcha()
     if (outcome === 'captcha') {
      test.info().annotations.push({ type: 'warning', description: 'Auth0 CAPTCHA challenge shown to this IP; error-code assertion skipped' });
      return;
    }

    await page.waitForURL(/\/u\/signup\/password/);
    await signup.submitPassword(password);

    if (c.expected === 'error') {
      await expect(signup.error(c.errorId!)).toBeVisible();
      await expect(page).toHaveURL(/\/u\/signup\/password/);
      return;
    }

    const code = await getLatestOtpCode();
    await signup.submitVerificationCode(code);
    await expect(page).toHaveURL(/\/register-company/);
    await signup.completeCompanyInfo(c.companyName, c.companyWebsite, c.personalName, c.phone)
    await expect(page).toHaveURL(/\/onboarding\/shared-inbox-checklist/);


  });
}
