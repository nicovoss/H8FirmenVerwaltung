import { element, by, ElementFinder } from 'protractor';

export class ArtikelComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-artikel div table .btn-danger'));
  title = element.all(by.css('jhi-artikel div h2#page-heading span')).first();
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

export class ArtikelUpdatePage {
  pageTitle = element(by.id('jhi-artikel-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));

  artikelTypSelect = element(by.id('field_artikelTyp'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async artikelTypSelectLastOption(): Promise<void> {
    await this.artikelTypSelect.all(by.tagName('option')).last().click();
  }

  async artikelTypSelectOption(option: string): Promise<void> {
    await this.artikelTypSelect.sendKeys(option);
  }

  getArtikelTypSelect(): ElementFinder {
    return this.artikelTypSelect;
  }

  async getArtikelTypSelectedOption(): Promise<string> {
    return await this.artikelTypSelect.element(by.css('option:checked')).getText();
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

export class ArtikelDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-artikel-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-artikel'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
