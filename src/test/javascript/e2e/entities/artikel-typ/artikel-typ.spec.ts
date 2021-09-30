import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ArtikelTypComponentsPage, ArtikelTypDeleteDialog, ArtikelTypUpdatePage } from './artikel-typ.page-object';

const expect = chai.expect;

describe('ArtikelTyp e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let artikelTypComponentsPage: ArtikelTypComponentsPage;
  let artikelTypUpdatePage: ArtikelTypUpdatePage;
  let artikelTypDeleteDialog: ArtikelTypDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ArtikelTyps', async () => {
    await navBarPage.goToEntity('artikel-typ');
    artikelTypComponentsPage = new ArtikelTypComponentsPage();
    await browser.wait(ec.visibilityOf(artikelTypComponentsPage.title), 5000);
    expect(await artikelTypComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.artikelTyp.home.title');
    await browser.wait(ec.or(ec.visibilityOf(artikelTypComponentsPage.entities), ec.visibilityOf(artikelTypComponentsPage.noResult)), 1000);
  });

  it('should load create ArtikelTyp page', async () => {
    await artikelTypComponentsPage.clickOnCreateButton();
    artikelTypUpdatePage = new ArtikelTypUpdatePage();
    expect(await artikelTypUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.artikelTyp.home.createOrEditLabel');
    await artikelTypUpdatePage.cancel();
  });

  it('should create and save ArtikelTyps', async () => {
    const nbButtonsBeforeCreate = await artikelTypComponentsPage.countDeleteButtons();

    await artikelTypComponentsPage.clickOnCreateButton();

    await promise.all([artikelTypUpdatePage.setNameInput('name')]);

    await artikelTypUpdatePage.save();
    expect(await artikelTypUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await artikelTypComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ArtikelTyp', async () => {
    const nbButtonsBeforeDelete = await artikelTypComponentsPage.countDeleteButtons();
    await artikelTypComponentsPage.clickOnLastDeleteButton();

    artikelTypDeleteDialog = new ArtikelTypDeleteDialog();
    expect(await artikelTypDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.artikelTyp.delete.question');
    await artikelTypDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(artikelTypComponentsPage.title), 5000);

    expect(await artikelTypComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
