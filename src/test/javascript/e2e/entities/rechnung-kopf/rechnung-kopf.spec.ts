import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RechnungKopfComponentsPage, RechnungKopfDeleteDialog, RechnungKopfUpdatePage } from './rechnung-kopf.page-object';

const expect = chai.expect;

describe('RechnungKopf e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let rechnungKopfComponentsPage: RechnungKopfComponentsPage;
  let rechnungKopfUpdatePage: RechnungKopfUpdatePage;
  let rechnungKopfDeleteDialog: RechnungKopfDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load RechnungKopfs', async () => {
    await navBarPage.goToEntity('rechnung-kopf');
    rechnungKopfComponentsPage = new RechnungKopfComponentsPage();
    await browser.wait(ec.visibilityOf(rechnungKopfComponentsPage.title), 5000);
    expect(await rechnungKopfComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.rechnungKopf.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(rechnungKopfComponentsPage.entities), ec.visibilityOf(rechnungKopfComponentsPage.noResult)),
      1000
    );
  });

  it('should load create RechnungKopf page', async () => {
    await rechnungKopfComponentsPage.clickOnCreateButton();
    rechnungKopfUpdatePage = new RechnungKopfUpdatePage();
    expect(await rechnungKopfUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.rechnungKopf.home.createOrEditLabel');
    await rechnungKopfUpdatePage.cancel();
  });

  it('should create and save RechnungKopfs', async () => {
    const nbButtonsBeforeCreate = await rechnungKopfComponentsPage.countDeleteButtons();

    await rechnungKopfComponentsPage.clickOnCreateButton();

    await promise.all([
      rechnungKopfUpdatePage.auftragSelectLastOption(),
      rechnungKopfUpdatePage.bedinerSelectLastOption(),
      rechnungKopfUpdatePage.kundeSelectLastOption(),
      rechnungKopfUpdatePage.statusSelectLastOption(),
    ]);

    await rechnungKopfUpdatePage.save();
    expect(await rechnungKopfUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await rechnungKopfComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last RechnungKopf', async () => {
    const nbButtonsBeforeDelete = await rechnungKopfComponentsPage.countDeleteButtons();
    await rechnungKopfComponentsPage.clickOnLastDeleteButton();

    rechnungKopfDeleteDialog = new RechnungKopfDeleteDialog();
    expect(await rechnungKopfDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.rechnungKopf.delete.question');
    await rechnungKopfDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(rechnungKopfComponentsPage.title), 5000);

    expect(await rechnungKopfComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
