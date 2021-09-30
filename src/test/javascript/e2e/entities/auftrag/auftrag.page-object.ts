import { element, by, ElementFinder } from 'protractor';

export class AuftragComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-auftrag div table .btn-danger'));
  title = element.all(by.css('jhi-auftrag div h2#page-heading span')).first();
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

export class AuftragUpdatePage {
  pageTitle = element(by.id('jhi-auftrag-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  erfasstAmInput = element(by.id('field_erfasstAm'));
  faelligAmInput = element(by.id('field_faelligAm'));
  bezahlInput = element(by.id('field_bezahl'));
  bezahltAmInput = element(by.id('field_bezahltAm'));
  abgeschlossenAmInput = element(by.id('field_abgeschlossenAm'));
  kommentarInput = element(by.id('field_kommentar'));

  statusSelect = element(by.id('field_status'));
  kundeSelect = element(by.id('field_kunde'));
  bedienerSelect = element(by.id('field_bediener'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setErfasstAmInput(erfasstAm: string): Promise<void> {
    await this.erfasstAmInput.sendKeys(erfasstAm);
  }

  async getErfasstAmInput(): Promise<string> {
    return await this.erfasstAmInput.getAttribute('value');
  }

  async setFaelligAmInput(faelligAm: string): Promise<void> {
    await this.faelligAmInput.sendKeys(faelligAm);
  }

  async getFaelligAmInput(): Promise<string> {
    return await this.faelligAmInput.getAttribute('value');
  }

  getBezahlInput(): ElementFinder {
    return this.bezahlInput;
  }

  async setBezahltAmInput(bezahltAm: string): Promise<void> {
    await this.bezahltAmInput.sendKeys(bezahltAm);
  }

  async getBezahltAmInput(): Promise<string> {
    return await this.bezahltAmInput.getAttribute('value');
  }

  async setAbgeschlossenAmInput(abgeschlossenAm: string): Promise<void> {
    await this.abgeschlossenAmInput.sendKeys(abgeschlossenAm);
  }

  async getAbgeschlossenAmInput(): Promise<string> {
    return await this.abgeschlossenAmInput.getAttribute('value');
  }

  async setKommentarInput(kommentar: string): Promise<void> {
    await this.kommentarInput.sendKeys(kommentar);
  }

  async getKommentarInput(): Promise<string> {
    return await this.kommentarInput.getAttribute('value');
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

  async bedienerSelectLastOption(): Promise<void> {
    await this.bedienerSelect.all(by.tagName('option')).last().click();
  }

  async bedienerSelectOption(option: string): Promise<void> {
    await this.bedienerSelect.sendKeys(option);
  }

  getBedienerSelect(): ElementFinder {
    return this.bedienerSelect;
  }

  async getBedienerSelectedOption(): Promise<string> {
    return await this.bedienerSelect.element(by.css('option:checked')).getText();
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

export class AuftragDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-auftrag-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-auftrag'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
