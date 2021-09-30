import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPatner } from '../patner.model';
import { PatnerService } from '../service/patner.service';

@Component({
  templateUrl: './patner-delete-dialog.component.html',
})
export class PatnerDeleteDialogComponent {
  patner?: IPatner;

  constructor(protected patnerService: PatnerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.patnerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
