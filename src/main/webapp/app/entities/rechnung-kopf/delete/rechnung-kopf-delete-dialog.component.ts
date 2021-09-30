import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRechnungKopf } from '../rechnung-kopf.model';
import { RechnungKopfService } from '../service/rechnung-kopf.service';

@Component({
  templateUrl: './rechnung-kopf-delete-dialog.component.html',
})
export class RechnungKopfDeleteDialogComponent {
  rechnungKopf?: IRechnungKopf;

  constructor(protected rechnungKopfService: RechnungKopfService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rechnungKopfService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
