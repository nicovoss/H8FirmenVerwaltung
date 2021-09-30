import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RohstoffComponentsPage, RohstoffDeleteDialog, RohstoffUpdatePage } from './rohstoff.page-object';

const expect = chai.expect;

describe('Rohstoff e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let rohstoffComponentsPage: RohstoffComponentsPage;
  let rohstoffUpdatePage: RohstoffUpdatePage;
  let rohstoffDeleteDialog: RohstoffDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Rohstoffs', async () => {
    await navBarPage.goToEntity('rohstoff');
    rohstoffComponentsPage = new RohstoffComponentsPage();
    await browser.wait(ec.visibilityOf(rohstoffComponentsPage.title), 5000);
    expect(await rohstoffComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.rohstoff.home.title');
    await browser.wait(ec.or(ec.visibilityOf(rohstoffComponentsPage.entities), ec.visibilityOf(rohstoffComponentsPage.noResult)), 1000);
  });

  it('should load create Rohstoff page', async () => {
    await rohstoffComponentsPage.clickOnCreateButton();
    rohstoffUpdatePage = new RohstoffUpdatePage();
    expect(await rohstoffUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.rohstoff.home.createOrEditLabel');
    await rohstoffUpdatePage.cancel();
  });

  it('should create and save Rohstoffs', async () => {
    const nbButtonsBeforeCreate = await rohstoffComponentsPage.countDeleteButtons();

    await rohstoffComponentsPage.clickOnCreateButton();

    await promise.all([rohstoffUpdatePage.setNameInput('name'), rohstoffUpdatePage.setPreisInput('5')]);

    await rohstoffUpdatePage.save();
    expect(await rohstoffUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await rohstoffComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Rohstoff', async () => {
    const nbButtonsBeforeDelete = await rohstoffComponentsPage.countDeleteButtons();
    await rohstoffComponentsPage.clickOnLastDeleteButton();

    rohstoffDeleteDialog = new RohstoffDeleteDialog();
    expect(await rohstoffDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.rohstoff.delete.question');
    await rohstoffDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(rohstoffComponentsPage.title), 5000);

    expect(await rohstoffComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
