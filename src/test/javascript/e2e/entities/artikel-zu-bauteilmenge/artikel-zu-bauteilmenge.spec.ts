import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ArtikelZuBauteilmengeComponentsPage,
  ArtikelZuBauteilmengeDeleteDialog,
  ArtikelZuBauteilmengeUpdatePage,
} from './artikel-zu-bauteilmenge.page-object';

const expect = chai.expect;

describe('ArtikelZuBauteilmenge e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let artikelZuBauteilmengeComponentsPage: ArtikelZuBauteilmengeComponentsPage;
  let artikelZuBauteilmengeUpdatePage: ArtikelZuBauteilmengeUpdatePage;
  let artikelZuBauteilmengeDeleteDialog: ArtikelZuBauteilmengeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ArtikelZuBauteilmenges', async () => {
    await navBarPage.goToEntity('artikel-zu-bauteilmenge');
    artikelZuBauteilmengeComponentsPage = new ArtikelZuBauteilmengeComponentsPage();
    await browser.wait(ec.visibilityOf(artikelZuBauteilmengeComponentsPage.title), 5000);
    expect(await artikelZuBauteilmengeComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.artikelZuBauteilmenge.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(artikelZuBauteilmengeComponentsPage.entities), ec.visibilityOf(artikelZuBauteilmengeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create ArtikelZuBauteilmenge page', async () => {
    await artikelZuBauteilmengeComponentsPage.clickOnCreateButton();
    artikelZuBauteilmengeUpdatePage = new ArtikelZuBauteilmengeUpdatePage();
    expect(await artikelZuBauteilmengeUpdatePage.getPageTitle()).to.eq(
      'h8FirmenVerwaltungApp.artikelZuBauteilmenge.home.createOrEditLabel'
    );
    await artikelZuBauteilmengeUpdatePage.cancel();
  });

  it('should create and save ArtikelZuBauteilmenges', async () => {
    const nbButtonsBeforeCreate = await artikelZuBauteilmengeComponentsPage.countDeleteButtons();

    await artikelZuBauteilmengeComponentsPage.clickOnCreateButton();

    await promise.all([
      artikelZuBauteilmengeUpdatePage.setMengeInput('5'),
      artikelZuBauteilmengeUpdatePage.bauteilSelectLastOption(),
      artikelZuBauteilmengeUpdatePage.artikelSelectLastOption(),
    ]);

    await artikelZuBauteilmengeUpdatePage.save();
    expect(await artikelZuBauteilmengeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await artikelZuBauteilmengeComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last ArtikelZuBauteilmenge', async () => {
    const nbButtonsBeforeDelete = await artikelZuBauteilmengeComponentsPage.countDeleteButtons();
    await artikelZuBauteilmengeComponentsPage.clickOnLastDeleteButton();

    artikelZuBauteilmengeDeleteDialog = new ArtikelZuBauteilmengeDeleteDialog();
    expect(await artikelZuBauteilmengeDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.artikelZuBauteilmenge.delete.question');
    await artikelZuBauteilmengeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(artikelZuBauteilmengeComponentsPage.title), 5000);

    expect(await artikelZuBauteilmengeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
