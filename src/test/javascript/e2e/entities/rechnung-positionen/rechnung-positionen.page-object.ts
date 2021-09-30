import { element, by, ElementFinder } from 'protractor';

export class RechnungPositionenComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-rechnung-positionen div table .btn-danger'));
  title = element.all(by.css('jhi-rechnung-positionen div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class RechnungPositionenUpdatePage {
  pageTitle = element(by.id('jhi-rechnung-positionen-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  artikelNameInput = element(by.id('field_artikelName'));
  artikelBeschreibungInput = element(by.id('field_artikelBeschreibung'));
  artikelPreisInput = element(by.id('field_artikelPreis'));
  mengeInput = element(by.id('field_menge'));

  rechnungskopfSelect = element(by.id('field_rechnungskopf'));
  artikelSelect = element(by.id('field_artikel'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setArtikelNameInput(artikelName: string): Promise<void> {
    await this.artikelNameInput.sendKeys(artikelName);
  }

  async getArtikelNameInput(): Promise<string> {
    return await this.artikelNameInput.getAttribute('value');
  }

  async setArtikelBeschreibungInput(artikelBeschreibung: string): Promise<void> {
    await this.artikelBeschreibungInput.sendKeys(artikelBeschreibung);
  }

  async getArtikelBeschreibungInput(): Promise<string> {
    return await this.artikelBeschreibungInput.getAttribute('value');
  }

  async setArtikelPreisInput(artikelPreis: string): Promise<void> {
    await this.artikelPreisInput.sendKeys(artikelPreis);
  }

  async getArtikelPreisInput(): Promise<string> {
    return await this.artikelPreisInput.getAttribute('value');
  }

  async setMengeInput(menge: string): Promise<void> {
    await this.mengeInput.sendKeys(menge);
  }

  async getMengeInput(): Promise<string> {
    return await this.mengeInput.getAttribute('value');
  }

  async rechnungskopfSelectLastOption(): Promise<void> {
    await this.rechnungskopfSelect.all(by.tagName('option')).last().click();
  }

  async rechnungskopfSelectOption(option: string): Promise<void> {
    await this.rechnungskopfSelect.sendKeys(option);
  }

  getRechnungskopfSelect(): ElementFinder {
    return this.rechnungskopfSelect;
  }

  async getRechnungskopfSelectedOption(): Promise<string> {
    return await this.rechnungskopfSelect.element(by.css('option:checked')).getText();
  }

  async artikelSelectLastOption(): Promise<void> {
    await this.artikelSelect.all(by.tagName('option')).last().click();
  }

  async artikelSelectOption(option: string): Promise<void> {
    await this.artikelSelect.sendKeys(option);
  }

  getArtikelSelect(): ElementFinder {
    return this.artikelSelect;
  }

  async getArtikelSelectedOption(): Promise<string> {
    return await this.artikelSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class RechnungPositionenDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-rechnungPositionen-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-rechnungPositionen'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
