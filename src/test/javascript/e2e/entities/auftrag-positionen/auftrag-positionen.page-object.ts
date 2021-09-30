import { element, by, ElementFinder } from 'protractor';

export class AuftragPositionenComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-auftrag-positionen div table .btn-danger'));
  title = element.all(by.css('jhi-auftrag-positionen div h2#page-heading span')).first();
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

export class AuftragPositionenUpdatePage {
  pageTitle = element(by.id('jhi-auftrag-positionen-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  mengeInput = element(by.id('field_menge'));

  auftragSelect = element(by.id('field_auftrag'));
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

  async setMengeInput(menge: string): Promise<void> {
    await this.mengeInput.sendKeys(menge);
  }

  async getMengeInput(): Promise<string> {
    return await this.mengeInput.getAttribute('value');
  }

  async auftragSelectLastOption(): Promise<void> {
    await this.auftragSelect.all(by.tagName('option')).last().click();
  }

  async auftragSelectOption(option: string): Promise<void> {
    await this.auftragSelect.sendKeys(option);
  }

  getAuftragSelect(): ElementFinder {
    return this.auftragSelect;
  }

  async getAuftragSelectedOption(): Promise<string> {
    return await this.auftragSelect.element(by.css('option:checked')).getText();
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

export class AuftragPositionenDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-auftragPositionen-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-auftragPositionen'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
