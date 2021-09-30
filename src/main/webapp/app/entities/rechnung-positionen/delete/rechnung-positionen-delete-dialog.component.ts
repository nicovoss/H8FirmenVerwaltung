import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRechnungPositionen } from '../rechnung-positionen.model';
import { RechnungPositionenService } from '../service/rechnung-positionen.service';

@Component({
  templateUrl: './rechnung-positionen-delete-dialog.component.html',
})
export class RechnungPositionenDeleteDialogComponent {
  rechnungPositionen?: IRechnungPositionen;

  constructor(protected rechnungPositionenService: RechnungPositionenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.rechnungPositionenService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
