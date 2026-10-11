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
  readonly verificationCodeInput: Locator;
  readonly companyNameInput: Locator;
  readonly companyWebsiteInput: Locator;
  readonly companyInfo: Locator;
  readonly newFeature: Locator;
  readonly companyChannel: Locator;
  readonly appIntegration: Locator;
  readonly personalNameInput: Locator;
  readonly phoneInput: Locator;
  readonly startButton: Locator;





  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByRole('textbox',{name:'email'});
    this.termsCheckbox = page.locator('#terms-of-service');
    this.passwordInput = page.getByRole('textbox',{name:'password'});
    this.actionButton = page.getByRole('button',{name: 'Sign up', exact: true});
    //this.error = page.locator('[id^="error"]:visible').first();
    this.captcha = page.locator('[id*="captcha" i]:visible, img[alt*="captcha" i]').first();
    this.verificationCodeInput = page.getByRole('textbox', {name: '6-digit verification code'});
    this.loginPage = new LoginPage(page);
    this.companyNameInput = page.locator('input[name="companyName"]');
    this.companyWebsiteInput = page.getByRole('textbox', { name: 'https://' });
    this.companyInfo = page.locator("//span[text()='Retail and e-commerce']").first();
    this.newFeature = page.locator("//span[text()='A shared Inbox for my team']").first();
    this.companyChannel = page.getByText('WhatsApp', { exact: true });
    this.appIntegration = page.getByText('HubSpot', { exact: true });
    this.personalNameInput = page.locator('input[name="personalName"]');
    this.phoneInput = page.locator("input[type='tel']");
    this.startButton = page.locator("//span[text()='Get started']").first(); 
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
    await this.page.waitForTimeout(10000);
  }

  async submitVerificationCode(code: string): Promise<void> {
    await this.verificationCodeInput.fill(code);
  }

  async completeCompanyInfo(companyName: string, companyWebsite: string, personalName: string, phone: string): Promise<void> {
    await this.companyNameInput.waitFor({ state: 'visible', timeout: 90000 });
    await this.companyNameInput.fill(companyName);
    await this.companyWebsiteInput.fill(companyWebsite);
    await this.page.keyboard.press('Enter');
    await this.companyInfo.click();
    await this.newFeature.click();
    await this.companyChannel.click();
    await this.page.keyboard.press('Enter');
    await this.appIntegration.click();
    await this.page.keyboard.press('Enter');
    await this.personalNameInput.fill(personalName);
    await this.phoneInput.fill(phone);
    await this.startButton.click();
  }

  async waitForCaptcha(timeout = 15_000): Promise<'captcha' | null> {
  try {
    // Waits up to the timeout for the captcha element to appear in the DOM and be visible
    await this.captcha.waitFor({ state: 'visible', timeout });
    return 'captcha';
  } catch (error) {
    // Times out if no CAPTCHA appears within the given timeframe
    return null;
  }
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
