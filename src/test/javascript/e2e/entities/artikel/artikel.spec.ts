import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ArtikelComponentsPage, ArtikelDeleteDialog, ArtikelUpdatePage } from './artikel.page-object';

const expect = chai.expect;

describe('Artikel e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let artikelComponentsPage: ArtikelComponentsPage;
  let artikelUpdatePage: ArtikelUpdatePage;
  let artikelDeleteDialog: ArtikelDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Artikels', async () => {
    await navBarPage.goToEntity('artikel');
    artikelComponentsPage = new ArtikelComponentsPage();
    await browser.wait(ec.visibilityOf(artikelComponentsPage.title), 5000);
    expect(await artikelComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.artikel.home.title');
    await browser.wait(ec.or(ec.visibilityOf(artikelComponentsPage.entities), ec.visibilityOf(artikelComponentsPage.noResult)), 1000);
  });

  it('should load create Artikel page', async () => {
    await artikelComponentsPage.clickOnCreateButton();
    artikelUpdatePage = new ArtikelUpdatePage();
    expect(await artikelUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.artikel.home.createOrEditLabel');
    await artikelUpdatePage.cancel();
  });

  it('should create and save Artikels', async () => {
    const nbButtonsBeforeCreate = await artikelComponentsPage.countDeleteButtons();

    await artikelComponentsPage.clickOnCreateButton();

    await promise.all([artikelUpdatePage.setNameInput('name'), artikelUpdatePage.artikelTypSelectLastOption()]);

    await artikelUpdatePage.save();
    expect(await artikelUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await artikelComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Artikel', async () => {
    const nbButtonsBeforeDelete = await artikelComponentsPage.countDeleteButtons();
    await artikelComponentsPage.clickOnLastDeleteButton();

    artikelDeleteDialog = new ArtikelDeleteDialog();
    expect(await artikelDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.artikel.delete.question');
    await artikelDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(artikelComponentsPage.title), 5000);

    expect(await artikelComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
