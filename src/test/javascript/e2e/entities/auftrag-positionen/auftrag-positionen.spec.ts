import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  AuftragPositionenComponentsPage,
  AuftragPositionenDeleteDialog,
  AuftragPositionenUpdatePage,
} from './auftrag-positionen.page-object';

const expect = chai.expect;

describe('AuftragPositionen e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let auftragPositionenComponentsPage: AuftragPositionenComponentsPage;
  let auftragPositionenUpdatePage: AuftragPositionenUpdatePage;
  let auftragPositionenDeleteDialog: AuftragPositionenDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load AuftragPositionens', async () => {
    await navBarPage.goToEntity('auftrag-positionen');
    auftragPositionenComponentsPage = new AuftragPositionenComponentsPage();
    await browser.wait(ec.visibilityOf(auftragPositionenComponentsPage.title), 5000);
    expect(await auftragPositionenComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.auftragPositionen.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(auftragPositionenComponentsPage.entities), ec.visibilityOf(auftragPositionenComponentsPage.noResult)),
      1000
    );
  });

  it('should load create AuftragPositionen page', async () => {
    await auftragPositionenComponentsPage.clickOnCreateButton();
    auftragPositionenUpdatePage = new AuftragPositionenUpdatePage();
    expect(await auftragPositionenUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.auftragPositionen.home.createOrEditLabel');
    await auftragPositionenUpdatePage.cancel();
  });

  it('should create and save AuftragPositionens', async () => {
    const nbButtonsBeforeCreate = await auftragPositionenComponentsPage.countDeleteButtons();

    await auftragPositionenComponentsPage.clickOnCreateButton();

    await promise.all([
      auftragPositionenUpdatePage.setMengeInput('5'),
      auftragPositionenUpdatePage.auftragSelectLastOption(),
      auftragPositionenUpdatePage.artikelSelectLastOption(),
    ]);

    await auftragPositionenUpdatePage.save();
    expect(await auftragPositionenUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await auftragPositionenComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last AuftragPositionen', async () => {
    const nbButtonsBeforeDelete = await auftragPositionenComponentsPage.countDeleteButtons();
    await auftragPositionenComponentsPage.clickOnLastDeleteButton();

    auftragPositionenDeleteDialog = new AuftragPositionenDeleteDialog();
    expect(await auftragPositionenDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.auftragPositionen.delete.question');
    await auftragPositionenDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(auftragPositionenComponentsPage.title), 5000);

    expect(await auftragPositionenComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
