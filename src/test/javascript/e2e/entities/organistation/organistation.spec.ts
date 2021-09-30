import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OrganistationComponentsPage, OrganistationDeleteDialog, OrganistationUpdatePage } from './organistation.page-object';

const expect = chai.expect;

describe('Organistation e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let organistationComponentsPage: OrganistationComponentsPage;
  let organistationUpdatePage: OrganistationUpdatePage;
  let organistationDeleteDialog: OrganistationDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Organistations', async () => {
    await navBarPage.goToEntity('organistation');
    organistationComponentsPage = new OrganistationComponentsPage();
    await browser.wait(ec.visibilityOf(organistationComponentsPage.title), 5000);
    expect(await organistationComponentsPage.getTitle()).to.eq('h8FirmenVerwaltungApp.organistation.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(organistationComponentsPage.entities), ec.visibilityOf(organistationComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Organistation page', async () => {
    await organistationComponentsPage.clickOnCreateButton();
    organistationUpdatePage = new OrganistationUpdatePage();
    expect(await organistationUpdatePage.getPageTitle()).to.eq('h8FirmenVerwaltungApp.organistation.home.createOrEditLabel');
    await organistationUpdatePage.cancel();
  });

  it('should create and save Organistations', async () => {
    const nbButtonsBeforeCreate = await organistationComponentsPage.countDeleteButtons();

    await organistationComponentsPage.clickOnCreateButton();

    await promise.all([organistationUpdatePage.setOrgaIdInput('5'), organistationUpdatePage.setNameInput('name')]);

    await organistationUpdatePage.save();
    expect(await organistationUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await organistationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Organistation', async () => {
    const nbButtonsBeforeDelete = await organistationComponentsPage.countDeleteButtons();
    await organistationComponentsPage.clickOnLastDeleteButton();

    organistationDeleteDialog = new OrganistationDeleteDialog();
    expect(await organistationDeleteDialog.getDialogTitle()).to.eq('h8FirmenVerwaltungApp.organistation.delete.question');
    await organistationDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(organistationComponentsPage.title), 5000);

    expect(await organistationComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
