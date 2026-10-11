import { Page, Locator } from '@playwright/test';
import { LoginPage } from './LoginPage';

export class SignupPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly termsCheckbox: Locator;
  readonly passwordInput: Locator;
  readonly actionButton: Locator;
  readonly loginPage: LoginPage;
  //readonly error: Locator;
  readonly captcha: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox',{name:'email'});
    this.termsCheckbox = page.locator('#terms-of-service');
    this.passwordInput = page.getByRole('textbox',{name:'password'});
    this.actionButton = page.getByRole('button',{name: 'Sign up', exact: true});
    //this.error = page.locator('[id^="error"]:visible').first();
    this.captcha = page.locator('[id*="captcha" i]:visible, img[alt*="captcha" i]').first();
    this.loginPage = new LoginPage(page);
  }

  async open(): Promise<void> {
    await this.loginPage.open();
    await this.loginPage.signupLink.click();
    await this.page.waitForURL(/sso\.sleekflow\.io\/u\/signup\/identifier/);
  }

  async submitEmail(email: string, acceptTerms: boolean): Promise<void> {
    await this.emailInput.fill(email);
    if (acceptTerms) {
      
      await this.termsCheckbox.evaluate((el) => (el as HTMLInputElement).click());
    }
    await this.actionButton.click();
  }

  async submitPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
    await this.actionButton.click();
  }

  error(id: string): Locator {
    return this.page.locator(`#${id}`);
  }

//   async waitForErrorOrCaptcha(timeout = 15_000): Promise<'error' | 'captcha'> {
//     const showedError = await this.error
//       .waitFor({ state: 'visible', timeout })
//       .then(() => true)
//       .catch(() => false);

//     if (showedError && (await this.error.getAttribute('data-error-code')) !== 'invalid-captcha') {
//       return 'error';
//     }

//     await this.captcha.waitFor({ state: 'visible', timeout: 15_000 });
//     return 'captcha';
//   }
}
