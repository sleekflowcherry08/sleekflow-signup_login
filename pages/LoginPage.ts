import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly identifierInput: Locator;
  readonly passwordInput: Locator;
  readonly actionButton: Locator;
  readonly signupLink: Locator;
  readonly error: Locator;
  readonly captcha: Locator;

  constructor(page: Page) {
    this.page = page;
    this.identifierInput = page.getByRole('textbox',{name:'username'});
    this.passwordInput = page.getByRole('textbox',{name:'password'});
    this.actionButton = page.getByRole('button',{name: 'Continue', exact: true});
    this.signupLink = page.locator('a[href*="/u/signup/identifier"]');
    this.error = page.locator('[id^="error-element"]:visible').first();
    this.captcha = page.locator('[id*="captcha" i]:visible, img[alt*="captcha" i]').first();
  }

  async open(): Promise<void> {
    await this.page.goto('https://sleekflow.io/en', { waitUntil: 'commit' });
    await this.page.locator('a[href*="screen_hint=login"]:visible').first().click({ timeout: 60_000 });
    await this.page.waitForURL(/sso\.sleekflow\.io\/u\/login\/identifier/, { timeout: 75_000 });
  }

  async submitIdentifier(email: string): Promise<void> {
    await this.identifierInput.fill(email);
    await this.actionButton.click();
  }

  async submitPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.actionButton.click();
  }

  async isPasswordStepVisible(timeout = 5_000): Promise<boolean> {
    return this.passwordInput
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);
  }

  async waitForErrorOrCaptcha(timeout = 15_000): Promise<'error' | 'captcha'> {
    const showedError = await this.error
      .waitFor({ state: 'visible', timeout })
      .then(() => true)
      .catch(() => false);

    if (showedError && (await this.error.getAttribute('data-error-code')) !== 'invalid-captcha') {
      return 'error';
    }

    await this.captcha.waitFor({ state: 'visible', timeout: 15_000 });
    return 'captcha';
  }
}
