import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IOrganistation } from '../organistation.model';
import { OrganistationService } from '../service/organistation.service';

@Component({
  templateUrl: './organistation-delete-dialog.component.html',
})
export class OrganistationDeleteDialogComponent {
  organistation?: IOrganistation;

  constructor(protected organistationService: OrganistationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.organistationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
