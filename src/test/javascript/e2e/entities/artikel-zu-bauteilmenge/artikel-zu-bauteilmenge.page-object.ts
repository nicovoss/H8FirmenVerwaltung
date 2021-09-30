import { element, by, ElementFinder } from 'protractor';

export class ArtikelZuBauteilmengeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-artikel-zu-bauteilmenge div table .btn-danger'));
  title = element.all(by.css('jhi-artikel-zu-bauteilmenge div h2#page-heading span')).first();
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

export class ArtikelZuBauteilmengeUpdatePage {
  pageTitle = element(by.id('jhi-artikel-zu-bauteilmenge-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  mengeInput = element(by.id('field_menge'));

  bauteilSelect = element(by.id('field_bauteil'));
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

  async bauteilSelectLastOption(): Promise<void> {
    await this.bauteilSelect.all(by.tagName('option')).last().click();
  }

  async bauteilSelectOption(option: string): Promise<void> {
    await this.bauteilSelect.sendKeys(option);
  }

  getBauteilSelect(): ElementFinder {
    return this.bauteilSelect;
  }

  async getBauteilSelectedOption(): Promise<string> {
    return await this.bauteilSelect.element(by.css('option:checked')).getText();
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

export class ArtikelZuBauteilmengeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-artikelZuBauteilmenge-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-artikelZuBauteilmenge'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
