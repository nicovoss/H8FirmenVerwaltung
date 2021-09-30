import { element, by, ElementFinder } from 'protractor';

export class RechnungKopfComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-rechnung-kopf div table .btn-danger'));
  title = element.all(by.css('jhi-rechnung-kopf div h2#page-heading span')).first();
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

export class RechnungKopfUpdatePage {
  pageTitle = element(by.id('jhi-rechnung-kopf-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));

  auftragSelect = element(by.id('field_auftrag'));
  bedinerSelect = element(by.id('field_bediner'));
  kundeSelect = element(by.id('field_kunde'));
  statusSelect = element(by.id('field_status'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
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

  async bedinerSelectLastOption(): Promise<void> {
    await this.bedinerSelect.all(by.tagName('option')).last().click();
  }

  async bedinerSelectOption(option: string): Promise<void> {
    await this.bedinerSelect.sendKeys(option);
  }

  getBedinerSelect(): ElementFinder {
    return this.bedinerSelect;
  }

  async getBedinerSelectedOption(): Promise<string> {
    return await this.bedinerSelect.element(by.css('option:checked')).getText();
  }

  async kundeSelectLastOption(): Promise<void> {
    await this.kundeSelect.all(by.tagName('option')).last().click();
  }

  async kundeSelectOption(option: string): Promise<void> {
    await this.kundeSelect.sendKeys(option);
  }

  getKundeSelect(): ElementFinder {
    return this.kundeSelect;
  }

  async getKundeSelectedOption(): Promise<string> {
    return await this.kundeSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }

  async statusSelectOption(option: string): Promise<void> {
    await this.statusSelect.sendKeys(option);
  }

  getStatusSelect(): ElementFinder {
    return this.statusSelect;
  }

  async getStatusSelectedOption(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
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

export class RechnungKopfDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-rechnungKopf-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-rechnungKopf'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
