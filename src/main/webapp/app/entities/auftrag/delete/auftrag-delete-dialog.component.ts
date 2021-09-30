import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAuftrag } from '../auftrag.model';
import { AuftragService } from '../service/auftrag.service';

@Component({
  templateUrl: './auftrag-delete-dialog.component.html',
})
export class AuftragDeleteDialogComponent {
  auftrag?: IAuftrag;

  constructor(protected auftragService: AuftragService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.auftragService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
