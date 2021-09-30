import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuftragPositionen } from '../auftrag-positionen.model';
import { AuftragPositionenService } from '../service/auftrag-positionen.service';

@Component({
  templateUrl: './auftrag-positionen-delete-dialog.component.html',
})
export class AuftragPositionenDeleteDialogComponent {
  auftragPositionen?: IAuftragPositionen;

  constructor(protected auftragPositionenService: AuftragPositionenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.auftragPositionenService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
