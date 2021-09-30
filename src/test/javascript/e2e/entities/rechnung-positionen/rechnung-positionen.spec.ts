import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  RechnungPositionenComponentsPage,
  RechnungPositionenDeleteDialog,
  RechnungPositionenUpdatePage,
} from './rechnung-positionen.page-object';

const expect = chai.expect;

describe('RechnungPositionen e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let rechnungPositionenComponentsPage: RechnungPositionenComponentsPage;
  let rechnungPositionenUpdatePage: RechnungPositionenUpdatePage;
  let rechnungPositionenDeleteDialog: RechnungPositionenDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load RechnungPositionens', async () => {
    await navBarPage.goToEntity('rechnung-positionen');
    rechnungPositionenComponentsPage = new RechnungPositionenComponentsPage();
    await browser.wait(ec.visibilityOf(rechnungPositionenComponentsPage.title), 5000);
    expect(await rechnungPositionenComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.rechnungPositionen.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(rechnungPositionenComponentsPage.entities), ec.visibilityOf(rechnungPositionenComponentsPage.noResult)),
      1000
    );
  });

  it('should load create RechnungPositionen page', async () => {
    await rechnungPositionenComponentsPage.clickOnCreateButton();
    rechnungPositionenUpdatePage = new RechnungPositionenUpdatePage();
    expect(await rechnungPositionenUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.rechnungPositionen.home.createOrEditLabel');
    await rechnungPositionenUpdatePage.cancel();
  });

  it('should create and save RechnungPositionens', async () => {
    const nbButtonsBeforeCreate = await rechnungPositionenComponentsPage.countDeleteButtons();

    await rechnungPositionenComponentsPage.clickOnCreateButton();

    await promise.all([
      rechnungPositionenUpdatePage.setArtikelNameInput('artikelName'),
      rechnungPositionenUpdatePage.setArtikelBeschreibungInput('artikelBeschreibung'),
      rechnungPositionenUpdatePage.setArtikelPreisInput('5'),
      rechnungPositionenUpdatePage.setMengeInput('5'),
      rechnungPositionenUpdatePage.rechnungskopfSelectLastOption(),
      rechnungPositionenUpdatePage.artikelSelectLastOption(),
    ]);

    await rechnungPositionenUpdatePage.save();
    expect(await rechnungPositionenUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await rechnungPositionenComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last RechnungPositionen', async () => {
    const nbButtonsBeforeDelete = await rechnungPositionenComponentsPage.countDeleteButtons();
    await rechnungPositionenComponentsPage.clickOnLastDeleteButton();

    rechnungPositionenDeleteDialog = new RechnungPositionenDeleteDialog();
    expect(await rechnungPositionenDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.rechnungPositionen.delete.question');
    await rechnungPositionenDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(rechnungPositionenComponentsPage.title), 5000);

    expect(await rechnungPositionenComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
