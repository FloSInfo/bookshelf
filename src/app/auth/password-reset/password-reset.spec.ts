//Généré par chatGPT pour voir
describe('AccountDeletionComponent', () => {
  let browser;
  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:4200/auth/deleteAccount'); // Replace with the URL of your Angular app's delete account page
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should display user email', async () => {
    await page.waitForLoadState('networkidle');
    const userMail = await page.textContent('.container .row .col p');
    expect(userMail).toContain('user email'); // Replace with the expected user email value
  });

  it('should disable delete account button when form is invalid', async () => {
    await page.waitForLoadState('networkidle');
    const isButtonDisabled = await page.getAttribute('.container .row .col button', 'disabled');
    expect(isButtonDisabled).toBeTruthy();
  });

  it('should enable delete account button when form is valid', async () => {
    await page.waitForLoadState('networkidle');
    await page.fill('#password', 'password123'); // Fill in the password field with a valid password
    const isButtonDisabled = await page.getAttribute('.container .row .col button', 'disabled');
    expect(isButtonDisabled).toBeFalsy();
  });

  it('should submit form when delete account button is clicked', async () => {
    await page.waitForLoadState('networkidle');
    const onSubmitSpy = await page.spyOnEvent('submit', 'form');
    await page.fill('#password', 'password123'); // Fill in the password field with a valid password
    await page.click('.container .row .col button');
    await onSubmitSpy.promise;
    expect(onSubmitSpy).toHaveBeenCalled();
  });
});