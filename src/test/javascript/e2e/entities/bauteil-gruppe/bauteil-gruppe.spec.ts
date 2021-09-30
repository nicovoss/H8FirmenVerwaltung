import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BauteilGruppeComponentsPage, BauteilGruppeDeleteDialog, BauteilGruppeUpdatePage } from './bauteil-gruppe.page-object';

const expect = chai.expect;

describe('BauteilGruppe e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bauteilGruppeComponentsPage: BauteilGruppeComponentsPage;
  let bauteilGruppeUpdatePage: BauteilGruppeUpdatePage;
  let bauteilGruppeDeleteDialog: BauteilGruppeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BauteilGruppes', async () => {
    await navBarPage.goToEntity('bauteil-gruppe');
    bauteilGruppeComponentsPage = new BauteilGruppeComponentsPage();
    await browser.wait(ec.visibilityOf(bauteilGruppeComponentsPage.title), 5000);
    expect(await bauteilGruppeComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.bauteilGruppe.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(bauteilGruppeComponentsPage.entities), ec.visibilityOf(bauteilGruppeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create BauteilGruppe page', async () => {
    await bauteilGruppeComponentsPage.clickOnCreateButton();
    bauteilGruppeUpdatePage = new BauteilGruppeUpdatePage();
    expect(await bauteilGruppeUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.bauteilGruppe.home.createOrEditLabel');
    await bauteilGruppeUpdatePage.cancel();
  });

  it('should create and save BauteilGruppes', async () => {
    const nbButtonsBeforeCreate = await bauteilGruppeComponentsPage.countDeleteButtons();

    await bauteilGruppeComponentsPage.clickOnCreateButton();

    await promise.all([bauteilGruppeUpdatePage.setNameInput('name'), bauteilGruppeUpdatePage.artikelTypSelectLastOption()]);

    await bauteilGruppeUpdatePage.save();
    expect(await bauteilGruppeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bauteilGruppeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last BauteilGruppe', async () => {
    const nbButtonsBeforeDelete = await bauteilGruppeComponentsPage.countDeleteButtons();
    await bauteilGruppeComponentsPage.clickOnLastDeleteButton();

    bauteilGruppeDeleteDialog = new BauteilGruppeDeleteDialog();
    expect(await bauteilGruppeDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.bauteilGruppe.delete.question');
    await bauteilGruppeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bauteilGruppeComponentsPage.title), 5000);

    expect(await bauteilGruppeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
