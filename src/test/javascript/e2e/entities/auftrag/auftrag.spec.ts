import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AuftragComponentsPage, AuftragDeleteDialog, AuftragUpdatePage } from './auftrag.page-object';

const expect = chai.expect;

describe('Auftrag e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let auftragComponentsPage: AuftragComponentsPage;
  let auftragUpdatePage: AuftragUpdatePage;
  let auftragDeleteDialog: AuftragDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Auftrags', async () => {
    await navBarPage.goToEntity('auftrag');
    auftragComponentsPage = new AuftragComponentsPage();
    await browser.wait(ec.visibilityOf(auftragComponentsPage.title), 5000);
    expect(await auftragComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.auftrag.home.title');
    await browser.wait(ec.or(ec.visibilityOf(auftragComponentsPage.entities), ec.visibilityOf(auftragComponentsPage.noResult)), 1000);
  });

  it('should load create Auftrag page', async () => {
    await auftragComponentsPage.clickOnCreateButton();
    auftragUpdatePage = new AuftragUpdatePage();
    expect(await auftragUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.auftrag.home.createOrEditLabel');
    await auftragUpdatePage.cancel();
  });

  it('should create and save Auftrags', async () => {
    const nbButtonsBeforeCreate = await auftragComponentsPage.countDeleteButtons();

    await auftragComponentsPage.clickOnCreateButton();

    await promise.all([
      auftragUpdatePage.setErfasstAmInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      auftragUpdatePage.setFaelligAmInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      auftragUpdatePage.getBezahlInput().click(),
      auftragUpdatePage.setBezahltAmInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      auftragUpdatePage.setAbgeschlossenAmInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      auftragUpdatePage.setKommentarInput('kommentar'),
      auftragUpdatePage.statusSelectLastOption(),
      auftragUpdatePage.kundeSelectLastOption(),
      auftragUpdatePage.bedienerSelectLastOption(),
    ]);

    await auftragUpdatePage.save();
    expect(await auftragUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await auftragComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Auftrag', async () => {
    const nbButtonsBeforeDelete = await auftragComponentsPage.countDeleteButtons();
    await auftragComponentsPage.clickOnLastDeleteButton();

    auftragDeleteDialog = new AuftragDeleteDialog();
    expect(await auftragDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.auftrag.delete.question');
    await auftragDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(auftragComponentsPage.title), 5000);

    expect(await auftragComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
