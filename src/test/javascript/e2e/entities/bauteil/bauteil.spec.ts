import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BauteilComponentsPage, BauteilDeleteDialog, BauteilUpdatePage } from './bauteil.page-object';

const expect = chai.expect;

describe('Bauteil e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bauteilComponentsPage: BauteilComponentsPage;
  let bauteilUpdatePage: BauteilUpdatePage;
  let bauteilDeleteDialog: BauteilDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Bauteils', async () => {
    await navBarPage.goToEntity('bauteil');
    bauteilComponentsPage = new BauteilComponentsPage();
    await browser.wait(ec.visibilityOf(bauteilComponentsPage.title), 5000);
    expect(await bauteilComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.bauteil.home.title');
    await browser.wait(ec.or(ec.visibilityOf(bauteilComponentsPage.entities), ec.visibilityOf(bauteilComponentsPage.noResult)), 1000);
  });

  it('should load create Bauteil page', async () => {
    await bauteilComponentsPage.clickOnCreateButton();
    bauteilUpdatePage = new BauteilUpdatePage();
    expect(await bauteilUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.bauteil.home.createOrEditLabel');
    await bauteilUpdatePage.cancel();
  });

  it('should create and save Bauteils', async () => {
    const nbButtonsBeforeCreate = await bauteilComponentsPage.countDeleteButtons();

    await bauteilComponentsPage.clickOnCreateButton();

    await promise.all([bauteilUpdatePage.setNameInput('name'), bauteilUpdatePage.bauteilgruppeSelectLastOption()]);

    await bauteilUpdatePage.save();
    expect(await bauteilUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bauteilComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Bauteil', async () => {
    const nbButtonsBeforeDelete = await bauteilComponentsPage.countDeleteButtons();
    await bauteilComponentsPage.clickOnLastDeleteButton();

    bauteilDeleteDialog = new BauteilDeleteDialog();
    expect(await bauteilDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.bauteil.delete.question');
    await bauteilDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bauteilComponentsPage.title), 5000);

    expect(await bauteilComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
