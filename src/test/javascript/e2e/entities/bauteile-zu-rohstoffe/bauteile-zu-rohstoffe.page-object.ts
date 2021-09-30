import { element, by, ElementFinder } from 'protractor';

export class BauteileZuRohstoffeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-bauteile-zu-rohstoffe div table .btn-danger'));
  title = element.all(by.css('jhi-bauteile-zu-rohstoffe div h2#page-heading span')).first();
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

export class BauteileZuRohstoffeUpdatePage {
  pageTitle = element(by.id('jhi-bauteile-zu-rohstoffe-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  mengeInput = element(by.id('field_menge'));

  bauteilSelect = element(by.id('field_bauteil'));
  rohstoffSelect = element(by.id('field_rohstoff'));

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

  async rohstoffSelectLastOption(): Promise<void> {
    await this.rohstoffSelect.all(by.tagName('option')).last().click();
  }

  async rohstoffSelectOption(option: string): Promise<void> {
    await this.rohstoffSelect.sendKeys(option);
  }

  getRohstoffSelect(): ElementFinder {
    return this.rohstoffSelect;
  }

  async getRohstoffSelectedOption(): Promise<string> {
    return await this.rohstoffSelect.element(by.css('option:checked')).getText();
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

export class BauteileZuRohstoffeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-bauteileZuRohstoffe-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-bauteileZuRohstoffe'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
