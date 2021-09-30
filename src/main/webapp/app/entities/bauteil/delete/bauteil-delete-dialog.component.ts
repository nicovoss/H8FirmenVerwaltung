import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IBauteil } from '../bauteil.model';
import { BauteilService } from '../service/bauteil.service';

@Component({
  templateUrl: './bauteil-delete-dialog.component.html',
})
export class BauteilDeleteDialogComponent {
  bauteil?: IBauteil;

  constructor(protected bauteilService: BauteilService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.bauteilService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
