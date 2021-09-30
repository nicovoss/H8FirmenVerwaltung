import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BedienerComponentsPage, BedienerDeleteDialog, BedienerUpdatePage } from './bediener.page-object';

const expect = chai.expect;

describe('Bediener e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bedienerComponentsPage: BedienerComponentsPage;
  let bedienerUpdatePage: BedienerUpdatePage;
  let bedienerDeleteDialog: BedienerDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Bedieners', async () => {
    await navBarPage.goToEntity('bediener');
    bedienerComponentsPage = new BedienerComponentsPage();
    await browser.wait(ec.visibilityOf(bedienerComponentsPage.title), 5000);
    expect(await bedienerComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.bediener.home.title');
    await browser.wait(ec.or(ec.visibilityOf(bedienerComponentsPage.entities), ec.visibilityOf(bedienerComponentsPage.noResult)), 1000);
  });

  it('should load create Bediener page', async () => {
    await bedienerComponentsPage.clickOnCreateButton();
    bedienerUpdatePage = new BedienerUpdatePage();
    expect(await bedienerUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.bediener.home.createOrEditLabel');
    await bedienerUpdatePage.cancel();
  });

  it('should create and save Bedieners', async () => {
    const nbButtonsBeforeCreate = await bedienerComponentsPage.countDeleteButtons();

    await bedienerComponentsPage.clickOnCreateButton();

    await promise.all([bedienerUpdatePage.setVnameInput('vname'), bedienerUpdatePage.setNameInput('name')]);

    await bedienerUpdatePage.save();
    expect(await bedienerUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bedienerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Bediener', async () => {
    const nbButtonsBeforeDelete = await bedienerComponentsPage.countDeleteButtons();
    await bedienerComponentsPage.clickOnLastDeleteButton();

    bedienerDeleteDialog = new BedienerDeleteDialog();
    expect(await bedienerDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.bediener.delete.question');
    await bedienerDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bedienerComponentsPage.title), 5000);

    expect(await bedienerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
