import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBediener } from '../bediener.model';
import { BedienerService } from '../service/bediener.service';

@Component({
  templateUrl: './bediener-delete-dialog.component.html',
})
export class BedienerDeleteDialogComponent {
  bediener?: IBediener;

  constructor(protected bedienerService: BedienerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bedienerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
