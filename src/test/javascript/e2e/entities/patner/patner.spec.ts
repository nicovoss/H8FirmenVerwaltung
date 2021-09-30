import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PatnerComponentsPage, PatnerDeleteDialog, PatnerUpdatePage } from './patner.page-object';

const expect = chai.expect;

describe('Patner e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let patnerComponentsPage: PatnerComponentsPage;
  let patnerUpdatePage: PatnerUpdatePage;
  let patnerDeleteDialog: PatnerDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Patners', async () => {
    await navBarPage.goToEntity('patner');
    patnerComponentsPage = new PatnerComponentsPage();
    await browser.wait(ec.visibilityOf(patnerComponentsPage.title), 5000);
    expect(await patnerComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.patner.home.title');
    await browser.wait(ec.or(ec.visibilityOf(patnerComponentsPage.entities), ec.visibilityOf(patnerComponentsPage.noResult)), 1000);
  });

  it('should load create Patner page', async () => {
    await patnerComponentsPage.clickOnCreateButton();
    patnerUpdatePage = new PatnerUpdatePage();
    expect(await patnerUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.patner.home.createOrEditLabel');
    await patnerUpdatePage.cancel();
  });

  it('should create and save Patners', async () => {
    const nbButtonsBeforeCreate = await patnerComponentsPage.countDeleteButtons();

    await patnerComponentsPage.clickOnCreateButton();

    await promise.all([
      patnerUpdatePage.setVnameInput('vname'),
      patnerUpdatePage.setNameInput('name'),
      patnerUpdatePage.organistationSelectLastOption(),
    ]);

    await patnerUpdatePage.save();
    expect(await patnerUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await patnerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Patner', async () => {
    const nbButtonsBeforeDelete = await patnerComponentsPage.countDeleteButtons();
    await patnerComponentsPage.clickOnLastDeleteButton();

    patnerDeleteDialog = new PatnerDeleteDialog();
    expect(await patnerDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.patner.delete.question');
    await patnerDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(patnerComponentsPage.title), 5000);

    expect(await patnerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
