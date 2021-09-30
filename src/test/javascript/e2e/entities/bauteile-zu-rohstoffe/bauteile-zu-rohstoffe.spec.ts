import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  BauteileZuRohstoffeComponentsPage,
  BauteileZuRohstoffeDeleteDialog,
  BauteileZuRohstoffeUpdatePage,
} from './bauteile-zu-rohstoffe.page-object';

const expect = chai.expect;

describe('BauteileZuRohstoffe e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bauteileZuRohstoffeComponentsPage: BauteileZuRohstoffeComponentsPage;
  let bauteileZuRohstoffeUpdatePage: BauteileZuRohstoffeUpdatePage;
  let bauteileZuRohstoffeDeleteDialog: BauteileZuRohstoffeDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load BauteileZuRohstoffes', async () => {
    await navBarPage.goToEntity('bauteile-zu-rohstoffe');
    bauteileZuRohstoffeComponentsPage = new BauteileZuRohstoffeComponentsPage();
    await browser.wait(ec.visibilityOf(bauteileZuRohstoffeComponentsPage.title), 5000);
    expect(await bauteileZuRohstoffeComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.bauteileZuRohstoffe.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(bauteileZuRohstoffeComponentsPage.entities), ec.visibilityOf(bauteileZuRohstoffeComponentsPage.noResult)),
      1000
    );
  });

  it('should load create BauteileZuRohstoffe page', async () => {
    await bauteileZuRohstoffeComponentsPage.clickOnCreateButton();
    bauteileZuRohstoffeUpdatePage = new BauteileZuRohstoffeUpdatePage();
    expect(await bauteileZuRohstoffeUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.bauteileZuRohstoffe.home.createOrEditLabel');
    await bauteileZuRohstoffeUpdatePage.cancel();
  });

  it('should create and save BauteileZuRohstoffes', async () => {
    const nbButtonsBeforeCreate = await bauteileZuRohstoffeComponentsPage.countDeleteButtons();

    await bauteileZuRohstoffeComponentsPage.clickOnCreateButton();

    await promise.all([
      bauteileZuRohstoffeUpdatePage.setMengeInput('5'),
      bauteileZuRohstoffeUpdatePage.bauteilSelectLastOption(),
      bauteileZuRohstoffeUpdatePage.rohstoffSelectLastOption(),
    ]);

    await bauteileZuRohstoffeUpdatePage.save();
    expect(await bauteileZuRohstoffeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bauteileZuRohstoffeComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last BauteileZuRohstoffe', async () => {
    const nbButtonsBeforeDelete = await bauteileZuRohstoffeComponentsPage.countDeleteButtons();
    await bauteileZuRohstoffeComponentsPage.clickOnLastDeleteButton();

    bauteileZuRohstoffeDeleteDialog = new BauteileZuRohstoffeDeleteDialog();
    expect(await bauteileZuRohstoffeDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.bauteileZuRohstoffe.delete.question');
    await bauteileZuRohstoffeDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bauteileZuRohstoffeComponentsPage.title), 5000);

    expect(await bauteileZuRohstoffeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
