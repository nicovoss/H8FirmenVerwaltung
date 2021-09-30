import { element, by, ElementFinder } from 'protractor';

export class PatnerComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-patner div table .btn-danger'));
  title = element.all(by.css('jhi-patner div h2#page-heading span')).first();
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

export class PatnerUpdatePage {
  pageTitle = element(by.id('jhi-patner-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  vnameInput = element(by.id('field_vname'));
  nameInput = element(by.id('field_name'));

  organistationSelect = element(by.id('field_organistation'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setVnameInput(vname: string): Promise<void> {
    await this.vnameInput.sendKeys(vname);
  }

  async getVnameInput(): Promise<string> {
    return await this.vnameInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async organistationSelectLastOption(): Promise<void> {
    await this.organistationSelect.all(by.tagName('option')).last().click();
  }

  async organistationSelectOption(option: string): Promise<void> {
    await this.organistationSelect.sendKeys(option);
  }

  getOrganistationSelect(): ElementFinder {
    return this.organistationSelect;
  }

  async getOrganistationSelectedOption(): Promise<string> {
    return await this.organistationSelect.element(by.css('option:checked')).getText();
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

export class PatnerDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-patner-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-patner'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
